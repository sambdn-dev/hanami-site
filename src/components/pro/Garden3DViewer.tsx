'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import styles from './StudioShowcase.module.css'

export type GardenId = 'cour' | 'lineaire' | 'patio'
type CameraView = 'perspective' | 'plan' | 'angle'

const dimensions: Record<GardenId, { width: number; depth: number }> = {
  cour: { width: 12, depth: 16 },
  lineaire: { width: 8, depth: 18 },
  patio: { width: 12, depth: 12 },
}

function buildGarden(scene: THREE.Scene, id: GardenId) {
  const { width, depth } = dimensions[id]
  const mat = (color: string, roughness = 1) => new THREE.MeshStandardMaterial({ color, roughness })
  const turf = mat('#477c32')
  const gravel = mat('#c4bbae')
  const stone = mat('#d8d7cf')
  const soil = mat('#493e34')
  const dark = mat('#262f2b')
  const timber = mat('#8a684a')
  const corten = mat('#8f542f')
  const wall = mat('#d6cdbd')
  const green = [mat('#557843'), mat('#6d8153'), mat('#3f6543'), mat('#7d895f')]

  function box(x: number, z: number, w: number, d: number, h: number, material: THREE.Material, y = h / 2) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
    return mesh
  }
  function shrub(x: number, z: number, radius = .4, color = 0) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), green[color % green.length])
    mesh.position.set(x, radius * .75 + .15, z)
    mesh.scale.y = .7
    mesh.castShadow = true
    scene.add(mesh)
  }
  function flowers(x: number, z: number, tint = '#aa8ca8') {
    const stem = mat('#66825d')
    const bloom = mat(tint)
    for (let n = 0; n < 5; n++) {
      const dx = Math.sin(n * 3.7) * .23
      const dz = Math.cos(n * 4.3) * .2
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(.014, .025, .55 + n * .045, 5), stem)
      stalk.position.set(x + dx, .4, z + dz)
      scene.add(stalk)
      const head = new THREE.Mesh(new THREE.SphereGeometry(.06, 6, 5), bloom)
      head.position.set(x + dx, .72 + n * .045, z + dz)
      scene.add(head)
    }
  }
  function tree(x: number, z: number, height = 3.5, birch = false) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.075, .13, height * .58, 8), mat(birch ? '#dedbd0' : '#665844'))
    trunk.position.set(x, height * .29, z)
    trunk.castShadow = true
    scene.add(trunk)
    for (let n = 0; n < 3; n++) {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.75 - n * .08, 1), green[(n + (birch ? 1 : 0)) % green.length])
      crown.position.set(x + (n - 1) * .27, height * (.62 + n * .13), z + (n % 2 ? .2 : -.15))
      crown.castShadow = true
      scene.add(crown)
    }
  }

  // All three scenes share the same coordinate convention as the photographs:
  // terrace nearest the camera, garden boundary at the far end.
  box(0, 0, width + .5, depth + .5, .12, mat('#988f7c'), -.12)
  box(0, depth / 2 - .88, width, 1.75, .1, stone, .015)
  box(0, -depth / 2 + .12, width, .2, 1.6, id === 'cour' ? dark : id === 'lineaire' ? timber : wall, .8)
  box(-width / 2 + .1, 0, .18, depth, 1.1, id === 'patio' ? wall : dark, .55)
  box(width / 2 - .1, 0, .18, depth, 1.1, id === 'patio' ? wall : dark, .55)

  const back = -depth / 2 + 1.15
  const front = depth / 2 - 1.9
  const lawnDepth = front - back
  const lawnZ = (front + back) / 2
  if (id === 'cour') {
    box(-.12, lawnZ, 6.7, lawnDepth, .09, turf, .04)
    box(-3.56, lawnZ, .05, lawnDepth, .11, dark, .08)
    box(3.31, lawnZ, .05, lawnDepth, .11, dark, .08)
    box(-4.58, lawnZ, 1.95, lawnDepth, .055, gravel, .01)
    box(4.61, lawnZ, 2.25, lawnDepth, .055, soil, .01)
    for (let n = 0; n < 5; n++) box(-4.58, front - 1.2 - n * (lawnDepth - 2.4) / 4, 1.38, 1.35, .09, stone, .09)
    for (let n = 0; n < 12; n++) {
      const z = back + .4 + n * (lawnDepth - .8) / 11
      shrub(4.2 + (n % 2) * .65, z, n % 3 === 0 ? .52 : .35, n)
      if (n % 2 === 0) flowers(4.9, z + .22, n % 4 ? '#b0a0b7' : '#e3dfc9')
    }
    box(0, -depth / 2 + .47, width - .3, .65, .65, green[2], .32)
    for (const x of [-2.7, 0, 2.7]) tree(x, -depth / 2 + .8, 3.55, true)
  } else if (id === 'lineaire') {
    box(.07, lawnZ, 4.15, lawnDepth, .09, turf, .04)
    box(-2.04, lawnZ, .05, lawnDepth, .11, dark, .08)
    box(2.2, lawnZ, .05, lawnDepth, .11, dark, .08)
    box(3.12, lawnZ, 1.65, lawnDepth, .055, gravel, .01)
    for (let n = 0; n < 6; n++) box(3.12, front - 1 - n * (lawnDepth - 2) / 5, 1.15, 1.4, .085, stone, .09)
    for (let bed = 0; bed < 2; bed++) {
      const z = lawnZ + (bed ? -lawnDepth * .26 : lawnDepth * .26)
      box(-3.05, z, 1.65, lawnDepth * .42, .42, corten, .2)
      box(-3.05, z, 1.49, lawnDepth * .42 - .15, .03, soil, .43)
      for (let n = 0; n < 7; n++) { shrub(-3.45 + (n % 2) * .65, z - lawnDepth * .18 + n * lawnDepth * .06, .33, n); if (n % 2) flowers(-2.86, z - lawnDepth * .18 + n * lawnDepth * .06) }
    }
    tree(0, -depth / 2 + 1.2, 3.2)
  } else {
    box(.0, lawnZ, 6.3, lawnDepth, .09, turf, .04)
    box(-3.18, lawnZ, .05, lawnDepth, .11, dark, .08)
    box(3.18, lawnZ, .05, lawnDepth, .11, dark, .08)
    box(-4.28, lawnZ, 2.1, lawnDepth, .055, gravel, .01)
    box(4.44, lawnZ, 2.2, lawnDepth, .055, soil, .01)
    for (let n = 0; n < 4; n++) box(-4.37 + n * .15, front - .85 - n * (lawnDepth - 1.7) / 3, 1.35, 1.35, .085, stone, .09)
    for (let n = 0; n < 11; n++) {
      const z = back + .25 + n * (lawnDepth - .5) / 10
      shrub(3.8 + (n % 3) * .4, z, .36 + (n % 3) * .07, n)
      if (n % 2 === 0) flowers(4.8, z, '#a984af')
    }
    tree(4.4, -depth / 2 + 1.3, 3.8)
    // Timber pergola at the far left, aligned with the stone route.
    const pz = -depth / 2 + 1.55
    for (const x of [-5.2, -3.25]) for (const z of [pz - .7, pz + .7]) box(x, z, .12, .12, 2.45, dark, 1.22)
    for (let n = 0; n < 5; n++) box(-4.22, pz - .75 + n * .37, 2.1, .1, .1, timber, 2.48)
  }
}

export default function Garden3DViewer({ garden }: { garden: GardenId }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<(view: CameraView) => void>(() => {})
  const [activeView, setActiveView] = useState<CameraView>('perspective')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }) }
    catch {
      mount.textContent = 'La vue 3D n’est pas disponible sur cet appareil.'
      mount.classList.add(styles.canvasFallback)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor('#e9e9df')
    mount.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#e9e9df')
    const { width, depth } = dimensions[garden]
    const camera = new THREE.PerspectiveCamera(39, mount.clientWidth / mount.clientHeight, .1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enableDamping = true
    controls.dampingFactor = .08
    controls.enablePan = false
    controls.minPolarAngle = .16
    controls.maxPolarAngle = Math.PI * .48
    controls.minDistance = 10
    controls.maxDistance = 37
    const hemi = new THREE.HemisphereLight('#ffffff', '#89936e', 2.2)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#fff7e6', 2.2)
    sun.position.set(-8, 16, 8)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -20
    sun.shadow.camera.right = 20
    sun.shadow.camera.top = 20
    sun.shadow.camera.bottom = -20
    scene.add(sun)
    buildGarden(scene, garden)
    const setView = (view: CameraView) => {
      const distance = Math.max(width, depth) * 1.43
      if (view === 'plan') camera.position.set(.01, distance, 2.5)
      else if (view === 'angle') camera.position.set(width * .95, distance * .48, depth * .75)
      else camera.position.set(0, distance * .43, depth * 1.15)
      controls.update()
    }
    viewRef.current = setView
    setView('perspective')
    const resize = new ResizeObserver(() => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    resize.observe(mount)
    let frame = 0
    const animate = () => { frame = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera) }
    animate()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      controls.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [garden])

  return (
    <div className={styles.viewer}>
      <div ref={mountRef} className={styles.canvas} aria-label="Modèle 3D interactif du même jardin que la photographie" role="img" />
      <div className={styles.cameraControls} aria-label="Angles de caméra">
        {([['perspective', 'Perspective'], ['plan', 'Vue de dessus'], ['angle', 'Angle latéral']] as const).map(([value, label]) => <button key={value} type="button" className={activeView === value ? styles.cameraActive : ''} onClick={() => { setActiveView(value); viewRef.current(value) }}>{label}</button>)}
      </div>
      <span className={styles.dragHint}>Glissez pour tourner · Pincez pour zoomer</span>
    </div>
  )
}
