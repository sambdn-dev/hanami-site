"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createLandzieTool, type LandziePart } from "@/lib/landzie-tool-model";
import styles from "./LandzieTool3D.module.css";

export type LandzieTool3DProps = {
  selectedPart?: LandziePart;
  onSelectPart?: (part: LandziePart) => void;
  onUnavailable?: () => void;
};

type ViewerActions = {
  zoom: (direction: number) => void;
  reset: () => void;
  select: (part: LandziePart) => void;
  pause: (paused: boolean) => void;
};

const PARTS: { part: LandziePart; number: string; label: string }[] = [
  { part: "spikes", number: "01", label: "Les disques étoilés" },
  { part: "frame", number: "02", label: "Le châssis arrondi" },
  { part: "handle", number: "03", label: "Le manche et sa poignée" },
];

export default function LandzieTool3D({ selectedPart, onSelectPart, onUnavailable }: LandzieTool3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<Partial<Record<LandziePart, HTMLButtonElement>>>({});
  const actionsRef = useRef<ViewerActions | null>(null);
  const callbacksRef = useRef({ onUnavailable });
  const [unavailable, setUnavailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [internalPart, setInternalPart] = useState<LandziePart>("spikes");
  const activePart = selectedPart ?? internalPart;

  useEffect(() => { callbacksRef.current = { onUnavailable }; }, [onUnavailable]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      queueMicrotask(() => { setUnavailable(true); callbacksRef.current.onUnavailable?.(); });
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0xf1f2e9, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.17;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.className = styles.canvas;
    canvas.setAttribute("aria-label", "Vue 3D illustrative du Landzie Overseeding Tool. Utilisez les flèches pour le faire tourner.");
    canvas.setAttribute("role", "img");
    canvas.tabIndex = 0;
    stage.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .05, 100);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentTarget = pmrem.fromScene(environment, .045);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = .85;
    environment.dispose();
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight("#fffaf0", "#8e9c84", 2.2));
    const keyLight = new THREE.DirectionalLight("#ffffff", 3.7);
    keyLight.position.set(-3, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 11;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.normalBias = .03;
    keyLight.shadow.bias = -.0001;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight("#e2eddb", 2.1);
    rimLight.position.set(4, 5, -4);
    scene.add(rimLight);

    const model = createLandzieTool();
    scene.add(model.tool);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: .1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -.005;
    scene.add(ground);

    let disposed = false;
    let inView = false;
    let locallyPaused = false;
    let motionReduced = false;
    let dragging = false;
    let frame = 0;
    let previousTime = 0;
    let rotationPhase = 0;
    let yaw = -.18;
    let pitch = 0;
    let zoom = 1;
    let focus: LandziePart = "spikes";
    let targetY = .68;
    let targetDistance = 9;
    let desiredY = .68;
    let desiredDistance = 9;
    let needsRender = true;
    const projection = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3(.38, .24, .91).normalize();

    const render = (time: number) => {
      frame = 0;
      if (disposed || !inView || document.hidden) return;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
      previousTime = time;
      const autoMotion = !locallyPaused && !motionReduced && !dragging;
      if (autoMotion) rotationPhase += delta * .14;
      const easing = motionReduced ? 1 : 1 - Math.exp(-delta * 7);
      targetY = THREE.MathUtils.lerp(targetY, desiredY, easing || 1);
      targetDistance = THREE.MathUtils.lerp(targetDistance, desiredDistance, easing || 1);
      model.tool.rotation.y = yaw + (autoMotion ? Math.sin(rotationPhase) * .14 : 0);
      model.tool.rotation.x = pitch;
      const ratio = stage.clientWidth / Math.max(stage.clientHeight, 1);
      // Inspect the head at a consistent width; the whole-tool view instead fits its height.
      const framingRatio = focus === "handle" ? Math.min(Math.max(ratio, .7), 1.05) : Math.max(ratio, .7);
      const distance = targetDistance * zoom / framingRatio;
      const targetX = focus === "handle" ? 0 : .35;
      camera.position.copy(cameraDirection).multiplyScalar(distance).add(new THREE.Vector3(targetX, targetY, 0));
      camera.lookAt(targetX, targetY, 0);
      camera.updateMatrixWorld();
      model.tool.updateMatrixWorld();
      renderer.render(scene, camera);
      PARTS.forEach(({ part }) => {
        const button = hotspotRefs.current[part];
        if (!button) return;
        projection.copy(model.anchors[part]);
        model.tool.localToWorld(projection);
        projection.project(camera);
        const x = (projection.x + 1) / 2 * stage.clientWidth;
        const y = (1 - projection.y) / 2 * stage.clientHeight;
        const visible = projection.z < 1 && x > 24 && x < stage.clientWidth - 24 && y > 40 && y < stage.clientHeight - 24;
        button.style.visibility = visible ? "visible" : "hidden";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
      });
      needsRender = false;
      const settling = Math.abs(targetY - desiredY) > .001 || Math.abs(targetDistance - desiredDistance) > .001;
      if (autoMotion || settling) frame = requestAnimationFrame(render);
    };
    const schedule = () => {
      needsRender = true;
      if (!frame && inView && !document.hidden && !disposed) frame = requestAnimationFrame(render);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
    const select = (part: LandziePart) => {
      focus = part;
      desiredY = part === "handle" ? 5.15 : part === "frame" ? .8 : .68;
      desiredDistance = part === "handle" ? 19 : part === "frame" ? 9.2 : 9;
      zoom = 1;
      model.highlight(part);
      schedule();
    };
    actionsRef.current = {
      zoom: direction => { zoom = THREE.MathUtils.clamp(zoom + direction * .13, .64, 1.55); schedule(); },
      reset: () => { yaw = -.18; pitch = 0; rotationPhase = 0; select(focus); },
      select,
      pause: value => {
        // Preserve the current angle when switching from auto rotation to a still view.
        if (value && !locallyPaused && !motionReduced) yaw += Math.sin(rotationPhase) * .14;
        rotationPhase = 0;
        locallyPaused = value;
        schedule();
      },
    };

    const resize = () => {
      const width = Math.max(stage.clientWidth, 1);
      const height = Math.max(stage.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      schedule();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule(); else stop();
    }, { threshold: .05 });
    intersection.observe(stage);
    const visibility = () => { if (document.hidden) stop(); else if (needsRender || !locallyPaused) schedule(); };
    document.addEventListener("visibilitychange", visibility);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChange = () => {
      motionReduced = motionQuery.matches;
      setReducedMotion(motionReduced);
      schedule();
    };
    queueMicrotask(motionChange);
    motionQuery.addEventListener("change", motionChange);

    let pointer: { id: number; x: number; y: number; startX: number; startY: number; touch: boolean } | null = null;
    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || pointer) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, touch: event.pointerType === "touch" };
      if (!pointer.touch) {
        dragging = true;
        canvas.setPointerCapture(event.pointerId);
      }
    };
    const pointerMove = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (!dragging && pointer.touch) {
        const horizontal = Math.abs(event.clientX - pointer.startX);
        const vertical = Math.abs(event.clientY - pointer.startY);
        if (horizontal < 8 || horizontal < vertical * 1.3) return;
        dragging = true;
        canvas.setPointerCapture(event.pointerId);
      }
      if (!dragging) return;
      yaw += (event.clientX - pointer.x) * .006;
      if (!pointer.touch) pitch = THREE.MathUtils.clamp(pitch + (event.clientY - pointer.y) * .0015, -.10, .14);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      schedule();
    };
    const pointerEnd = (event: PointerEvent) => {
      if (pointer?.id !== event.pointerId) return;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      pointer = null;
      dragging = false;
      schedule();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "+", "-", "="].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") actionsRef.current?.reset();
      else if (["+", "="].includes(event.key)) actionsRef.current?.zoom(-1);
      else if (event.key === "-") actionsRef.current?.zoom(1);
      else if (event.key === "ArrowLeft") yaw -= .13;
      else if (event.key === "ArrowRight") yaw += .13;
      else pitch = THREE.MathUtils.clamp(pitch + (event.key === "ArrowUp" ? -.03 : .03), -.10, .14);
      schedule();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      disposed = true;
      stop();
      setUnavailable(true);
      callbacksRef.current.onUnavailable?.();
    };
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerEnd);
    canvas.addEventListener("pointercancel", pointerEnd);
    canvas.addEventListener("keydown", keyDown);
    canvas.addEventListener("webglcontextlost", contextLost);

    return () => {
      disposed = true;
      stop();
      actionsRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      motionQuery.removeEventListener("change", motionChange);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerEnd);
      canvas.removeEventListener("pointercancel", pointerEnd);
      canvas.removeEventListener("keydown", keyDown);
      canvas.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      scene.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
        objectMaterials.forEach(material => {
          materials.add(material);
          Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); });
        });
        if (object instanceof THREE.InstancedMesh) object.dispose();
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
      environmentTarget.dispose();
      keyLight.shadow.map?.dispose();
      keyLight.shadow.mapPass?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  useEffect(() => { actionsRef.current?.select(activePart); }, [activePart]);
  useEffect(() => { actionsRef.current?.pause(paused); }, [paused]);

  if (unavailable) return <div className={styles.viewer}><p className={styles.fallback} role="status">La vue 3D n’est pas disponible sur cet appareil. Les photographies de l’outil restent visibles dans cette section.</p></div>;

  return (
    <div className={styles.viewer}>
      <div className={styles.stage} ref={stageRef}>
        <span className={styles.badge}>Landzie · vue illustrative</span>
        {PARTS.map(({ part, number, label }) => (
          <button key={part} type="button" className={styles.hotspot} style={{ visibility: "hidden" }} ref={element => { if (element) hotspotRefs.current[part] = element; else delete hotspotRefs.current[part]; }} aria-label={`Explorer : ${label}`} aria-pressed={activePart === part} onClick={() => { setInternalPart(part); onSelectPart?.(part); }}><span>{number}</span></button>
        ))}
      </div>
      <div className={styles.controls}>
        <p className={styles.hint}>Glissez pour tourner.<br />Ou utilisez les flèches du clavier.</p>
        <div className={styles.buttons} role="group" aria-label="Contrôles de la vue 3D">
          <button type="button" aria-label="Rapprocher l’outil" onClick={() => actionsRef.current?.zoom(-1)}><Plus size={16} aria-hidden="true" /></button>
          <button type="button" aria-label="Éloigner l’outil" onClick={() => actionsRef.current?.zoom(1)}><Minus size={16} aria-hidden="true" /></button>
          <button type="button" aria-label="Réinitialiser la vue" onClick={() => actionsRef.current?.reset()}><RotateCcw size={15} aria-hidden="true" /></button>
          <button type="button" aria-label={paused ? "Reprendre la rotation douce" : "Mettre la rotation en pause"} aria-pressed={paused} disabled={reducedMotion} onClick={() => setPaused(value => !value)}>{paused || reducedMotion ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>
        </div>
      </div>
    </div>
  );
}
