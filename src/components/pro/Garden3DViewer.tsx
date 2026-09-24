'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import styles from './StudioShowcase.module.css'

export type GardenId = 'cour' | 'lineaire' | 'patio'
type CameraView = 'perspective' | 'plan' | 'angle'

type GardenPlan = { width: number; depth: number; left: (z: number) => number; right: (z: number) => number; stones: number; pathSide: 'right' | 'back' }
const plans: Record<GardenId, GardenPlan> = {
  cour: { width: 12, depth: 16, left: () => -4.15, right: () => 3.2, stones: 10, pathSide: 'right' },
  lineaire: { width: 12, depth: 16, left: z => -3.7 + .28 * Math.sin(z * .5), right: z => 3.65 - 1.9 * Math.exp(-((z + .45) ** 2) / 9), stones: 11, pathSide: 'right' },
  patio: { width: 12, depth: 12, left: z => -4.25 * Math.sqrt(Math.max(.02, 1 - (z / 3.6) ** 2)), right: z => 4.25 * Math.sqrt(Math.max(.02, 1 - (z / 3.6) ** 2)), stones: 8, pathSide: 'back' },
}
const material = (color: string, roughness = 1) => new THREE.MeshStandardMaterial({ color, roughness, side: THREE.DoubleSide })
function random(seed: number) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 } }

function addGarden(scene: THREE.Scene, id: GardenId, night: boolean) {
  const p = plans[id], rand = random(id === 'cour' ? 11 : id === 'lineaire' ? 29 : 47)
  const front = p.depth / 2 - 2.05, back = -p.depth / 2 + 1.5
  const add = (mesh: THREE.Mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh); return mesh }
  const box = (x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material) => {
    const mesh = add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat))
    mesh.position.set(x, y, z)
    return mesh
  }
  const dirt = material('#574f40'), gravel = material(id === 'cour' ? '#54585a' : id === 'lineaire' ? '#c7ad83' : '#d9ccb0'), plaster = material('#d8d1c1')
  const bronze = material('#373b32'), timber = material('#755d43'), corten = material('#854d32')
  const edging = material('#333c31'), stone = material(id === 'patio' ? '#373b39' : '#eee9db', .86)
  const foliage = ['#496b38', '#5e7742', '#74854b', '#3d603d', '#81915a'].map(c => material(c))
  const blooms = ['#e8dfc6', '#f7f0dd', '#9a83a4', '#bca6ba'].map(c => material(c))
  const grasses = [material('#9b9870'), material('#b3a87a'), material('#78885f')]
  const trunkMat = material(id === 'cour' ? '#d9d6cc' : '#6b5c48')
  const concreteTexture = new THREE.TextureLoader().load('/images/studio/3d/stone/color.jpg')
  concreteTexture.colorSpace = THREE.SRGBColorSpace
  concreteTexture.wrapS = concreteTexture.wrapT = THREE.RepeatWrapping
  concreteTexture.repeat.set(.44, .44)
  stone.map = concreteTexture
  stone.needsUpdate = true
  const grassTexture = new THREE.TextureLoader().load('/images/studio/3d/grass/color.jpg')
  grassTexture.colorSpace = THREE.SRGBColorSpace
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(.23, .23)
  const grassNormal = new THREE.TextureLoader().load('/images/studio/3d/grass/normal.jpg')
  grassNormal.wrapS = grassNormal.wrapT = THREE.RepeatWrapping
  grassNormal.repeat.set(.23, .23)
  const lawnMat = new THREE.MeshStandardMaterial({ color: '#bad6a2', map: grassTexture, normalMap: grassNormal, normalScale: new THREE.Vector2(.24, .24), roughness: 1, side: THREE.DoubleSide })

  // A low floating base keeps the garden readable when the camera moves.
  box(0, -.17, 0, p.width + .36, .3, p.depth + .36, material('#b5aa91'))
  box(0, -.008, 0, p.width, .025, p.depth, gravel)
  box(0, .055, p.depth / 2 - .73, p.width, .12, 1.45, stone)
  box(0, .71, -p.depth / 2 + .1, p.width, 1.42, .2, id === 'lineaire' ? timber : id === 'patio' ? plaster : foliage[3])
  // Side boundaries stop below the planting canopy so they never obscure the garden.
  box(-p.width / 2 + .08, .38, 0, .16, .76, p.depth, id === 'patio' ? plaster : bronze)
  box(p.width / 2 - .08, .38, 0, .16, .76, p.depth, id === 'patio' ? plaster : bronze)
  if (id === 'lineaire') for (let i = 0; i < 19; i++) box(-p.width / 2 + .12 + i * .62, .79, -p.depth / 2 + .23, .5, 1.55, .07, timber)

  const lawnShape = new THREE.Shape()
  const pts: THREE.Vector2[] = []
  if (id === 'patio') lawnShape.absellipse(0, 0, 4.25, 3.6, 0, Math.PI * 2, false, 0)
  else {
    lawnShape.moveTo(p.left(front), -front)
    if (id === 'cour') lawnShape.lineTo(p.right(front), -front)
    else lawnShape.quadraticCurveTo(0, -(front + .17), p.right(front), -front)
    for (let i = 1; i <= 32; i++) { const z = front + (back - front) * i / 32; lawnShape.lineTo(p.right(z), -z) }
    if (id === 'cour') lawnShape.lineTo(p.left(back), -back)
    else lawnShape.quadraticCurveTo(0, -(back - .3), p.left(back), -back)
    for (let i = 31; i >= 0; i--) { const z = front + (back - front) * i / 32; lawnShape.lineTo(p.left(z), -z) }
  }
  lawnShape.closePath()
  const lawnGeo = new THREE.ShapeGeometry(lawnShape, 28)
  lawnGeo.rotateX(-Math.PI / 2)
  const lawn = add(new THREE.Mesh(lawnGeo, lawnMat))
  lawn.position.y = .027
  for (const point of lawnShape.getPoints(8)) pts.push(new THREE.Vector2(point.x, -point.y))
  const edgeCurve = new THREE.CatmullRomCurve3(pts.map(v => new THREE.Vector3(v.x, .047, v.y)), true, 'centripetal')
  add(new THREE.Mesh(new THREE.TubeGeometry(edgeCurve, pts.length * 2, .025, 4, true), edging)).castShadow = false

  // Loose beds flank the grass, following its outline rather than straight boxes.
  function bed(side: 'left' | 'right', path = false) {
    const shape = new THREE.Shape()
    const outer = side === 'left' ? -p.width / 2 + .25 : p.width / 2 - .25
    const inset = (z: number) => (side === 'left' ? p.left(z) - .08 : p.right(z) + .08)
    const near = front + .14, far = back - .3
    shape.moveTo(outer, -near)
    shape.lineTo(outer, -far)
    for (let i = 0; i <= 28; i++) { const z = far + (near - far) * i / 28; shape.lineTo(inset(z), -z) }
    shape.closePath()
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), path ? gravel : dirt)
    mesh.geometry.rotateX(-Math.PI / 2)
    mesh.position.y = .019
    mesh.receiveShadow = true
    scene.add(mesh)
  }
  bed('left')
  bed('right', p.pathSide === 'right')
  if (id === 'patio') box(0, .014, -p.depth / 2 + 1.7, p.width - .7, .03, 1.6, gravel)
  const stoneGeo = new THREE.CylinderGeometry(1, 1, .075, id === 'patio' ? 24 : 7)
  for (let i = 0; i < p.stones; i++) {
    if (id === 'cour') {
      const z = front - .45 + (back - front + .9) * i / (p.stones - 1)
      box(p.right(z) + .96, .085, z, 1.45, .08, .36, stone)
    } else if (id === 'patio') {
      const x = -3.1 + 6.2 * i / (p.stones - 1)
      const rock = add(new THREE.Mesh(stoneGeo.clone(), stone))
      rock.position.set(x, .09, -p.depth / 2 + 1.7 + Math.sin(i * .45) * .18)
      rock.scale.set(.28, 1, .28)
    } else {
      const z = front - .55 + (back - front + 1.15) * i / (p.stones - 1)
      const x = p.right(z) + .85 + Math.sin(i * 1.8) * .15
      const rock = add(new THREE.Mesh(stoneGeo.clone(), stone))
      rock.position.set(x, .09, z)
      rock.scale.set(.58 + rand() * .15, 1, .42 + rand() * .15)
      rock.rotation.y = (rand() - .5) * .6
    }
  }

  // Botanical volume: many small varied leaf masses, never a row of identical balls.
  const leafGeo = new THREE.SphereGeometry(1, 7, 5)
  const bladeGeo = new THREE.ConeGeometry(1, 1, 5)
  const matrices: THREE.Matrix4[][] = foliage.map(() => [])
  const bloomsMatrices: THREE.Matrix4[][] = blooms.map(() => [])
  const grassMatrices: THREE.Matrix4[][] = grasses.map(() => [])
  const dummy = new THREE.Object3D()
  const place = (target: THREE.Matrix4[][], palette: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
    dummy.position.set(x, y, z); dummy.rotation.set((rand() - .5) * .14, rand() * Math.PI * 2, (rand() - .5) * .14)
    dummy.scale.set(sx, sy, sz); dummy.updateMatrix(); target[palette % target.length].push(dummy.matrix.clone())
  }
  function shrub(x: number, z: number, size: number, flower = false) {
    const tint = Math.floor(rand() * foliage.length)
    for (let n = 0; n < 5; n++) {
      const angle = n * 2.4 + rand(), dx = Math.cos(angle) * size * .27, dz = Math.sin(angle) * size * .26
      const r = size * (.34 + rand() * .24)
      place(matrices, tint + n % 2, x + dx, r * .85 + .13, z + dz, r, r * (.7 + rand() * .4), r)
    }
    if (flower) for (let n = 0; n < 3; n++) {
      const dx = (rand() - .5) * size * .6, dz = (rand() - .5) * size * .6
      place(bloomsMatrices, Math.floor(rand() * blooms.length), x + dx, size * .72 + .16, z + dz, .11, .1, .11)
    }
  }
  function tuft(x: number, z: number, size: number) {
    for (let n = 0; n < 7; n++) {
      const a = n * .9 + rand() * .2, r = rand() * .15
      place(grassMatrices, n, x + Math.cos(a) * r, size * .5 + .05, z + Math.sin(a) * r, .035, size * (.7 + rand() * .6), .035)
    }
  }
  for (let i = 0; i < 150; i++) {
    const z = back + rand() * (front - back)
    const side = i % 2 ? 'left' : 'right'
    const edge = side === 'left' ? p.left(z) : p.right(z)
    let x: number
    if (side === p.pathSide) x = p.width / 2 - .35 - rand() * .67
    else x = side === 'left' ? -p.width / 2 + .3 + rand() * Math.max(.15, edge + p.width / 2 - .65) : p.width / 2 - .3 - rand() * Math.max(.15, p.width / 2 - edge - .65)
    if (i % 3 === 0) tuft(x, z, .47 + rand() * .45)
    else shrub(x, z, .46 + rand() * .58, i % 2 === 0 || i % 7 === 0)
  }
  for (let i = 0; i < 38; i++) {
    const x = (rand() - .5) * (p.width - 1.2), z = -p.depth / 2 + .42 + rand() * .62
    shrub(x, z, .5 + rand() * .55, i % 2 === 0)
  }
  for (let i = 0; i < foliage.length; i++) {
    const mesh = new THREE.InstancedMesh(leafGeo, foliage[i], matrices[i].length)
    matrices[i].forEach((m, n) => mesh.setMatrixAt(n, m))
    mesh.instanceMatrix.needsUpdate = true; mesh.receiveShadow = true; scene.add(mesh)
  }
  for (let i = 0; i < blooms.length; i++) {
    const mesh = new THREE.InstancedMesh(leafGeo, blooms[i], bloomsMatrices[i].length)
    bloomsMatrices[i].forEach((m, n) => mesh.setMatrixAt(n, m))
    mesh.instanceMatrix.needsUpdate = true; scene.add(mesh)
  }
  for (let i = 0; i < grasses.length; i++) {
    const mesh = new THREE.InstancedMesh(bladeGeo, grasses[i], grassMatrices[i].length)
    grassMatrices[i].forEach((m, n) => mesh.setMatrixAt(n, m))
    mesh.instanceMatrix.needsUpdate = true; scene.add(mesh)
  }

  const branchMat = trunkMat
  function tree(x: number, z: number, height: number, spread: number, birch = false) {
    const base = new THREE.Vector3(x, 0, z)
    const trunk = add(new THREE.Mesh(new THREE.CylinderGeometry(.075, .15, height * .65, 10), branchMat))
    trunk.position.copy(base).add(new THREE.Vector3(0, height * .325, 0))
    for (let n = 0; n < 7; n++) {
      const a = n * 2.4, end = new THREE.Vector3(x + Math.cos(a) * spread * .61, height * (.71 + rand() * .13), z + Math.sin(a) * spread * .55)
      const start = new THREE.Vector3(x, height * (.4 + rand() * .13), z)
      const direction = end.clone().sub(start), branch = add(new THREE.Mesh(new THREE.CylinderGeometry(.02, .055, direction.length(), 6), branchMat))
      branch.position.copy(start).add(end).multiplyScalar(.5); branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
    }
    for (let n = 0; n < 44; n++) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * spread
      const cx = x + Math.cos(a) * r, cz = z + Math.sin(a) * r * .7
      const cy = height * (.72 + rand() * .25) - r * .15
      const blob = add(new THREE.Mesh(new THREE.SphereGeometry(.2 + rand() * .23, 6, 5), foliage[(n + (birch ? 1 : 0)) % foliage.length]))
      blob.position.set(cx, cy, cz); blob.scale.y = .65 + rand() * .35; blob.castShadow = false
    }
  }
  if (id === 'cour') {
    for (const x of [-2.85, 0, 2.85]) tree(x, -p.depth / 2 + .86, 3.7, .85, true)
    tree(p.width / 2 - .72, front - .25, 2.55, .78)
  } else if (id === 'lineaire') {
    // Corten beds and an olive with a timber seat anchor the long view.
    for (const z of [-2.6, 2.6]) {
      box(-p.width / 2 + .8, .24, z, 1.35, .46, 3.1, corten)
      box(-p.width / 2 + .8, .49, z, 1.2, .05, 2.96, dirt)
      for (let n = 0; n < 8; n++) shrub(-p.width / 2 + .5 + rand() * .6, z - 1.2 + n * .34, .42 + rand() * .22, n % 2 === 0)
    }
    tree(0, -p.depth / 2 + 1.35, 3.1, 1.15)
    box(.1, .35, -p.depth / 2 + .8, 1.9, .13, .58, timber)
    for (const x of [-.7, .9]) box(x, .18, -p.depth / 2 + .8, .11, .35, .47, timber)
  } else {
    tree(p.width / 2 - 1.45, -p.depth / 2 + 2, 3.7, 1.25)
    const x = -p.width / 2 + 1.48, z = -p.depth / 2 + 1.4
    for (const dx of [-1.15, 1.15]) for (const dz of [-.72, .72]) box(x + dx, 1.15, z + dz, .11, 2.3, .11, timber)
    for (let n = 0; n < 8; n++) box(x - 1.3 + n * .37, 2.36, z, .085, .11, 1.85, timber)
    box(x, 2.27, z - .72, 2.5, .12, .14, timber)
    box(x, 2.27, z + .72, 2.5, .12, .14, timber)
    box(x, .45, z, 1.25, .09, .7, timber)
  }
  if (night) {
    const lampPositions = id === 'patio'
      ? Array.from({ length: 5 }, (_, i) => [-3 + i * 1.5, -p.depth / 2 + 1.6] as const)
      : Array.from({ length: 6 }, (_, i) => { const z = front - i * (front - back) / 5; return [p.right(z) + .95, z] as const })
    lampPositions.push(id === 'patio' ? [-p.width / 2 + 1.15, -p.depth / 2 + 2.3] : [0, -p.depth / 2 + 1.1])
    for (const [x, z] of lampPositions) {
      const lamp = new THREE.PointLight('#ffd09a', 2.6, 4.6, 2)
      lamp.position.set(x, .42, z)
      scene.add(lamp)
      const source = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe2aa' }))
      source.position.set(x, .16, z)
      scene.add(source)
    }
    if (id === 'patio') {
      const pendant = new THREE.PointLight('#ffce8b', 8, 6, 2)
      pendant.position.set(-p.width / 2 + 1.48, 2.05, -p.depth / 2 + 1.4)
      scene.add(pendant)
    }
  }
  return [concreteTexture, grassTexture, grassNormal]
}

export default function Garden3DViewer({ garden, lightMode }: { garden: GardenId; lightMode: 'jour' | 'nuit' }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<(view: CameraView) => void>(() => {})
  const [activeView, setActiveView] = useState<CameraView>('perspective')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }) }
    catch { mount.textContent = 'La maquette 3D n’est pas disponible sur cet appareil.'; mount.classList.add(styles.canvasFallback); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    const night = lightMode === 'nuit'
    renderer.toneMappingExposure = night ? 1.7 : 1.28
    mount.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(night ? '#253349' : '#e7e5d9')
    scene.fog = new THREE.Fog(night ? '#253349' : '#e7e5d9', 27, 66)
    const { width, depth } = plans[garden]
    const camera = new THREE.PerspectiveCamera(39, mount.clientWidth / mount.clientHeight, .1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, .45, 0)
    controls.enableDamping = true
    controls.dampingFactor = .075
    controls.enablePan = false
    controls.minPolarAngle = .16
    controls.maxPolarAngle = Math.PI * .49
    controls.minDistance = 9
    controls.maxDistance = 38
    scene.add(new THREE.HemisphereLight(night ? '#8ca3c6' : '#fff8e9', '#354836', night ? .62 : 1.55))
    const sun = new THREE.DirectionalLight(night ? '#b7c6e3' : '#ffe8bc', night ? .48 : 2.8)
    sun.position.set(-8, 15, 8)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -19; sun.shadow.camera.right = 19
    sun.shadow.camera.top = 19; sun.shadow.camera.bottom = -19
    sun.shadow.bias = -.0003
    scene.add(sun)
    const textures = addGarden(scene, garden, night)
    const setView = (view: CameraView) => {
      const distance = Math.max(width, depth)
      if (view === 'plan') camera.position.set(.01, distance * 1.2, 1.5)
      else if (view === 'angle') camera.position.set(width * .94, distance * .49, depth * .59)
      else camera.position.set(0, distance * .48, depth * .81)
      controls.update()
    }
    viewRef.current = setView
    setView('perspective')
    const resize = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight
      if (!w || !h) return
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h)
    })
    resize.observe(mount)
    let frame = 0, visible = true
    const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false }, { rootMargin: '150px' })
    observer.observe(mount)
    const animate = () => { frame = requestAnimationFrame(animate); if (visible && !document.hidden) { controls.update(); renderer.render(scene, camera) } }
    animate()
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); controls.dispose()
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
      scene.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); for (const mat of (Array.isArray(object.material) ? object.material : [object.material])) materials.add(mat); if (object instanceof THREE.InstancedMesh) object.dispose() } })
      geometries.forEach(geo => geo.dispose()); materials.forEach(mat => mat.dispose()); textures.forEach(t => t.dispose())
      renderer.dispose(); mount.removeChild(renderer.domElement)
    }
  }, [garden, lightMode])

  return <div className={styles.viewer}>
    <div ref={mountRef} className={styles.canvas} aria-label="Maquette 3D interactive du projet de jardin" role="img" />
    <div className={styles.cameraControls} aria-label="Angles de caméra">
      {([['perspective', 'Perspective'], ['plan', 'Vue de dessus'], ['angle', 'Angle latéral']] as const).map(([value, label]) => <button key={value} type="button" className={activeView === value ? styles.cameraActive : ''} onClick={() => { setActiveView(value); viewRef.current(value) }}>{label}</button>)}
    </div>
    <span className={styles.dragHint}>Glissez pour tourner · Pincez pour zoomer</span>
  </div>
}
