import * as THREE from "three";

export type LandziePart = "spikes" | "frame" | "handle";

/** Photo-based visual reconstruction; proportions are illustrative, not CAD measurements. */
export function createLandzieTool(onBrandingReady?: () => void) {
  const tool = new THREE.Group();
  const parts: Record<LandziePart, THREE.Group> = {
    spikes: new THREE.Group(),
    frame: new THREE.Group(),
    handle: new THREE.Group(),
  };
  Object.entries(parts).forEach(([name, group]) => {
    group.name = name;
    tool.add(group);
  });

  const green = new THREE.MeshPhysicalMaterial({
    color: "#003f20", metalness: .35, roughness: .27,
    clearcoat: .85, clearcoatRoughness: .2,
  });
  const steel = new THREE.MeshStandardMaterial({ color: "#9da396", metalness: .83, roughness: .38 });
  const hardware = new THREE.MeshStandardMaterial({ color: "#bfc4c4", metalness: .88, roughness: .27 });
  const rubber = new THREE.MeshStandardMaterial({ color: "#262a25", roughness: .94 });

  const add = (group: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const cylinderBetween = (group: THREE.Group, a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material, segments = 24) => {
    const direction = b.clone().sub(a);
    const mesh = add(group, new THREE.CylinderGeometry(radius, radius, direction.length(), segments), material);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return mesh;
  };

  // One bent, flat-section steel frame: rounded shoulders, open below the roller.
  const frameShape = new THREE.Shape();
  frameShape.moveTo(-2.27, .16);
  frameShape.lineTo(-2.27, .5);
  frameShape.bezierCurveTo(-2.27, .86, -2.07, 1.02, -1.73, 1.02);
  frameShape.lineTo(1.73, 1.02);
  frameShape.bezierCurveTo(2.07, 1.02, 2.27, .86, 2.27, .5);
  frameShape.lineTo(2.27, .16);
  frameShape.lineTo(2.10, .16);
  frameShape.lineTo(2.10, .5);
  frameShape.bezierCurveTo(2.10, .73, 1.98, .83, 1.73, .83);
  frameShape.lineTo(-1.73, .83);
  frameShape.bezierCurveTo(-1.98, .83, -2.10, .73, -2.10, .5);
  frameShape.lineTo(-2.10, .16);
  frameShape.closePath();
  const frameGeometry = new THREE.ExtrudeGeometry(frameShape, {
    depth: .14, bevelEnabled: true, bevelThickness: .015, bevelSize: .012, bevelSegments: 3, steps: 1, curveSegments: 16,
  });
  frameGeometry.translate(0, 0, -.07);
  add(parts.frame, frameGeometry, green);

  const axleStart = new THREE.Vector3(-2.28, .34, 0);
  const axleEnd = new THREE.Vector3(2.28, .34, 0);
  cylinderBetween(parts.spikes, axleStart, axleEnd, .062, green);

  // The real head has fine, stamped star discs, not spikes attached to a drum.
  const star = new THREE.Shape();
  const teeth = 10;
  for (let point = 0; point < teeth * 2; point++) {
    const angle = point * Math.PI / teeth;
    const radius = point % 2 === 0 ? .33 : .15;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (point === 0) star.moveTo(x, y); else star.lineTo(x, y);
  }
  star.closePath();
  const bore = new THREE.Path();
  bore.absarc(0, 0, .064, 0, Math.PI * 2, true);
  star.holes.push(bore);
  const starGeometry = new THREE.ExtrudeGeometry(star, {
    depth: .014, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 1, steps: 1, curveSegments: 12,
  });
  starGeometry.translate(0, 0, -.007);
  starGeometry.rotateY(Math.PI / 2);
  const discs = new THREE.InstancedMesh(starGeometry, steel, 43);
  const dummy = new THREE.Object3D();
  for (let index = 0; index < 43; index++) {
    dummy.position.set(-2.03 + index * 4.06 / 42, .34, 0);
    dummy.rotation.set((index % 4) * Math.PI / 20, 0, 0);
    dummy.updateMatrix();
    discs.setMatrixAt(index, dummy.matrix);
  }
  discs.castShadow = true;
  discs.receiveShadow = true;
  parts.spikes.add(discs);

  for (const side of [-1, 1]) {
    const washer = add(parts.frame, new THREE.CylinderGeometry(.12, .12, .035, 24), hardware);
    washer.rotation.z = Math.PI / 2;
    washer.position.set(side * 2.29, .34, 0);
    const nut = add(parts.frame, new THREE.CylinderGeometry(.085, .085, .1, 6), hardware);
    nut.rotation.z = Math.PI / 2;
    nut.position.set(side * 2.34, .34, 0);
    cylinderBetween(parts.frame, new THREE.Vector3(side * 2.39, .34, 0), new THREE.Vector3(side * 2.47, .34, 0), .039, hardware, 16);
    const foot = add(parts.frame, new THREE.BoxGeometry(.2, .033, .185), rubber);
    foot.position.set(side * 2.18, .145, 0);
  }

  // Straight green shaft and black cylindrical grip visible in the full product photo.
  const handleBase = new THREE.Vector3(0, .97, 0);
  const handleEnd = new THREE.Vector3(0, 10.4, -1.10);
  const handleDirection = handleEnd.clone().sub(handleBase);
  const alongHandle = (ratio: number) => handleBase.clone().addScaledVector(handleDirection, ratio);
  cylinderBetween(parts.handle, handleBase, alongHandle(.935), .068, green);
  for (const ratio of [.07, .32, .56, .79]) {
    cylinderBetween(parts.handle, alongHandle(ratio - .005), alongHandle(ratio + .008), .078, green);
    const pin = add(parts.handle, new THREE.SphereGeometry(.016, 12, 8), hardware);
    pin.position.copy(alongHandle(ratio)).add(new THREE.Vector3(.072, 0, 0));
  }
  cylinderBetween(parts.handle, alongHandle(.935), handleEnd, .091, rubber);
  const gripAxis = handleDirection.clone().normalize();
  const gripGeometry = new THREE.TorusGeometry(.0915, .0035, 5, 24);
  for (let index = 0; index < 22; index++) {
    const ring = add(parts.handle, gripGeometry, rubber);
    ring.position.copy(alongHandle(.943 + index * .00235));
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), gripAxis);
  }

  // Use the real mark from the official product photograph, not a substitute font.
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 160;
  const label = new THREE.CanvasTexture(labelCanvas);
  label.colorSpace = THREE.SRGBColorSpace;
  const branding = new THREE.Mesh(new THREE.PlaneGeometry(.78, .2392), new THREE.MeshBasicMaterial({ map: label, transparent: true, depthWrite: false, toneMapped: false }));
  branding.position.set(0, .925, .088);
  parts.frame.add(branding);
  const logoPhoto = new Image();
  logoPhoto.onload = () => {
    const context = labelCanvas.getContext("2d");
    if (!context) return;
    context.translate(256, 102.4);
    context.rotate(15 * Math.PI / 180);
    context.scale(.65 * 512 / 150, .65 * 512 / 150);
    context.drawImage(logoPhoto, -804, -653, 1400, 1400);
    // Preserve the photographed white mark as a transparent decal on the green frame.
    const pixels = context.getImageData(0, 0, 512, 160);
    for (let index = 0; index < pixels.data.length; index += 4) {
      const low = Math.min(pixels.data[index], pixels.data[index + 1], pixels.data[index + 2]);
      const high = Math.max(pixels.data[index], pixels.data[index + 1], pixels.data[index + 2]);
      pixels.data[index + 3] = high - low < 45 ? Math.max(0, Math.min(255, (low - 145) * 3)) : 0;
      pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = 255;
    }
    context.putImageData(pixels, 0, 0);
    label.needsUpdate = true;
    onBrandingReady?.();
  };
  logoPhoto.src = "/images/location/landzie-overseeder-detail.webp";

  return {
    tool,
    disposeBranding() { logoPhoto.onload = null; logoPhoto.src = ""; },
    parts,
    anchors: {
      spikes: new THREE.Vector3(-.9, .43, .24),
      frame: new THREE.Vector3(1.74, .89, .08),
      handle: alongHandle(.91),
    } satisfies Record<LandziePart, THREE.Vector3>,
    highlight(part: LandziePart) {
      steel.emissive.set(part === "spikes" ? "#1f2d22" : "#000000");
      steel.emissiveIntensity = .16;
      green.emissive.set(part === "frame" || part === "handle" ? "#063b1f" : "#000000");
      green.emissiveIntensity = .12;
    },
  };
}
