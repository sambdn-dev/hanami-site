'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type MowerSceneProps = {
  rotating: boolean
  action: { kind: 'reset' | 'in' | 'out'; sequence: number }
  onError: () => void
}

type Command = (kind: MowerSceneProps['action']['kind']) => void

function makeMower() {
  const group = new THREE.Group()
  const materials = {
    silver: new THREE.MeshStandardMaterial({ color: '#a9afad', metalness: .35, roughness: .37 }),
    silverLight: new THREE.MeshStandardMaterial({ color: '#d2d7d4', metalness: .24, roughness: .35 }),
    black: new THREE.MeshStandardMaterial({ color: '#232827', metalness: .2, roughness: .48 }),
    graphite: new THREE.MeshStandardMaterial({ color: '#3c4140', metalness: .3, roughness: .4 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#171c19', roughness: .94 }),
    green: new THREE.MeshStandardMaterial({ color: '#82ca28', metalness: .08, roughness: .4 }),
    fabric: new THREE.MeshStandardMaterial({ color: '#292e2a', roughness: .98 }),
    light: new THREE.MeshStandardMaterial({ color: '#f7fff5', emissive: '#e7fff0', emissiveIntensity: .5, roughness: .2 }),
  }
  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number], parent = group) {
    const object = new THREE.Mesh(geometry, material)
    object.position.set(...position)
    object.castShadow = true
    object.receiveShadow = true
    parent.add(object)
    return object
  }
  function block(width: number, height: number, depth: number, bevel: number, material: THREE.Material, position: [number, number, number]) {
    const shape = new THREE.Shape()
    const x = width / 2, z = depth / 2, b = Math.min(bevel, x / 3, z / 3)
    shape.moveTo(-x + b, -z)
    shape.lineTo(x - b, -z); shape.lineTo(x, -z + b); shape.lineTo(x, z - b)
    shape.lineTo(x - b, z); shape.lineTo(-x + b, z); shape.lineTo(-x, z - b); shape.lineTo(-x, -z + b); shape.closePath()
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelSize: b * .4, bevelThickness: Math.min(height * .18, .022), bevelSegments: 2, steps: 1 })
    geometry.rotateX(-Math.PI / 2)
    geometry.translate(0, -height / 2, 0)
    return mesh(geometry, material, position)
  }
  function tube(from: [number, number, number], to: [number, number, number], radius: number, material: THREE.Material, parent = group) {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to)
    const object = mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 10), material, [0, 0, 0], parent)
    object.position.copy(a).add(b).multiplyScalar(.5)
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
    return object
  }
  function line(points: [number, number, number][], radius: number, material: THREE.Material) {
    for (let index = 1; index < points.length; index++) tube(points[index - 1], points[index], radius, material)
    for (const point of points.slice(1, -1)) mesh(new THREE.SphereGeometry(radius, 10, 8), material, point)
  }
  function logoTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 256
    const context = canvas.getContext('2d')!
    context.fillStyle = '#282d29'; context.fillRect(0, 0, 512, 256)
    context.strokeStyle = '#353b35'; context.lineWidth = 1
    for (let i = 0; i < 512; i += 5) { context.beginPath(); context.moveTo(i, 0); context.lineTo(i, 256); context.stroke() }
    for (let i = 0; i < 256; i += 5) { context.beginPath(); context.moveTo(0, i); context.lineTo(512, i); context.stroke() }
    context.fillStyle = '#88cd2e'; context.fillRect(52, 74, 54, 35); context.fillRect(52, 125, 54, 35)
    context.fillStyle = '#fff'; context.font = 'italic 900 114px Arial'; context.fillText('EGO', 111, 160)
    context.font = 'bold 18px Arial'; context.fillText('POWER+', 237, 192)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }

  // Silver composite deck, with the twin front ridges visible on the reference photos.
  block(.93, .12, 1.16, .11, materials.black, [0, .22, .06])
  block(.94, .12, 1.12, .11, materials.silver, [0, .31, .07])
  block(.88, .035, 1.1, .09, materials.green, [0, .285, .03])
  block(.93, .045, 1.1, .1, materials.silver, [0, .335, .05])
  for (const side of [-1, 1]) {
    const ridge = block(.23, .115, .55, .045, materials.silverLight, [side * .29, .4, .36])
    ridge.rotation.x = -.07
    block(.11, .06, .63, .028, materials.silver, [side * .405, .41, -.15])
    block(.17, .13, .27, .035, materials.silverLight, [side * .34, .39, -.42])
  }
  block(.24, .045, .33, .02, materials.graphite, [0, .391, .46])
  block(.62, .19, .48, .065, materials.black, [0, .49, -.13])
  block(.45, .15, .32, .052, materials.graphite, [0, .63, -.075])
  block(.31, .024, .22, .025, materials.black, [0, .728, -.1])
  block(.15, .025, .037, .009, materials.green, [0, .745, -.065])
  // Battery cover, louvers and the twin front LED headlights.
  for (let i = 0; i < 6; i++) block(.3, .008, .012, .002, materials.black, [0, .66, -.27 + i * .024])
  for (const side of [-1, 1]) {
    const lamp = block(.15, .039, .027, .005, materials.light, [side * .215, .53, .12])
    lamp.rotation.z = side * .15
    block(.018, .018, .018, .003, materials.green, [side * .255, .565, .12])
  }

  // Four independently modelled treaded wheels, black hubs and green rim accents.
  for (const side of [-1, 1]) for (const rear of [false, true]) {
    const wheel = new THREE.Group()
    const radius = rear ? .209 : .186
    wheel.position.set(side * .512, radius + .035, rear ? -.48 : .45)
    group.add(wheel)
    const tyre = mesh(new THREE.CylinderGeometry(radius, radius, .116, 40, 1), materials.rubber, [0, 0, 0], wheel)
    tyre.rotation.z = Math.PI / 2
    const treadBlocks = new THREE.InstancedMesh(new THREE.BoxGeometry(.049, .024, .052), materials.graphite, 56)
    treadBlocks.castShadow = true
    wheel.add(treadBlocks)
    const treadTransform = new THREE.Object3D()
    let treadIndex = 0
    for (let i = 0; i < 28; i++) for (const row of [-1, 1]) {
      const angle = i / 28 * Math.PI * 2 + row * .045
      treadTransform.position.set(row * .029, Math.cos(angle) * radius, Math.sin(angle) * radius)
      treadTransform.rotation.set(angle, 0, row * .17)
      treadTransform.updateMatrix()
      treadBlocks.setMatrixAt(treadIndex++, treadTransform.matrix)
    }
    for (const outward of [-1, 1]) {
      const hub = mesh(new THREE.CylinderGeometry(radius * .75, radius * .75, .012, 32), materials.black, [outward * .064, 0, 0], wheel)
      hub.rotation.z = Math.PI / 2
      const rim = mesh(new THREE.TorusGeometry(radius * .82, .009, 8, 40), materials.green, [outward * .072, 0, 0], wheel)
      rim.rotation.y = Math.PI / 2
      for (let i = 0; i < 7; i++) {
        const angle = i / 7 * Math.PI * 2
        tube([outward * .073, Math.cos(angle) * radius * .23, Math.sin(angle) * radius * .23], [outward * .072, Math.cos(angle + .25) * radius * .68, Math.sin(angle + .25) * radius * .68], .022, materials.graphite, wheel)
      }
      const center = mesh(new THREE.CylinderGeometry(radius * .24, radius * .24, .02, 20), materials.silver, [outward * .08, 0, 0], wheel)
      center.rotation.z = Math.PI / 2
    }
  }

  // Rear collecting bag; the reference photo shows a fabric black bag and logo on each side.
  const bag = block(.67, .47, .62, .07, materials.fabric, [0, .54, -.85])
  bag.rotation.x = -.055
  block(.68, .065, .61, .028, materials.black, [0, .792, -.855])
  const texture = logoTexture()
  const bagLabel = new THREE.MeshStandardMaterial({ map: texture, roughness: .95 })
  mesh(new THREE.PlaneGeometry(.19, .079), bagLabel, [0, .61, .155])
  for (const side of [-1, 1]) {
    const label = mesh(new THREE.PlaneGeometry(.53, .27), bagLabel, [side * .375, .57, -.83])
    label.rotation.y = side * Math.PI / 2
  }
  // Long aluminium folding rails and the curved grip with its green safety bail.
  for (const side of [-1, 1]) {
    line([[side * .35, .46, -.39], [side * .37, .79, -.75], [side * .37, 1.2, -1.12], [side * .35, 1.5, -1.39]], .024, materials.silver)
    const hinge = mesh(new THREE.CylinderGeometry(.074, .074, .075, 24), materials.black, [side * .375, .48, -.43])
    hinge.rotation.z = Math.PI / 2
    const pin = mesh(new THREE.CylinderGeometry(.042, .042, .081, 20), materials.graphite, [side * .395, .48, -.43])
    pin.rotation.z = Math.PI / 2
    line([[side * .4, .82, -.77], [side * .43, .83, -.84]], .035, materials.green)
    line([[side * .35, 1.47, -1.39], [side * .33, 1.63, -1.49], [side * .27, 1.68, -1.5]], .031, materials.black)
  }
  line([[-.27, 1.68, -1.5], [.27, 1.68, -1.5]], .034, materials.black)
  line([[-.3, 1.49, -1.44], [-.25, 1.57, -1.48], [.25, 1.57, -1.48], [.3, 1.49, -1.44]], .015, materials.green)
  block(.43, .06, .1, .015, materials.black, [0, 1.46, -1.34])
  block(.12, .018, .065, .012, materials.green, [0, 1.502, -1.33])
  block(.42, .045, .1, .01, materials.graphite, [0, 1.075, -1.005])
  tube([-.27, .67, -.46], [-.3, 1.44, -1.3], .006, materials.black)
  block(.17, .016, .07, .012, materials.green, [0, 1.685, -1.49])
  group.position.z = .35
  return group
}

export default function EquipmentMowerScene({ rotating, action, onError }: MowerSceneProps) {
  const host = useRef<HTMLDivElement>(null)
  const rotationEnabled = useRef(rotating)
  const failure = useRef(onError)
  const command = useRef<Command | null>(null)
  useEffect(() => { rotationEnabled.current = rotating; failure.current = onError }, [rotating, onError])
  useEffect(() => { command.current?.(action.kind) }, [action])

  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch { failure.current(); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    const canvas = renderer.domElement
    canvas.setAttribute('aria-label', 'Étude 3D illustrative de la tondeuse EGO LM2135E-SP ; glissez horizontalement pour tourner la vue')
    canvas.setAttribute('role', 'img')
    element.appendChild(canvas)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, .05, 30)
    const model = makeMower()
    scene.add(model)
    scene.add(new THREE.HemisphereLight('#fffef4', '#717d61', 2.1))
    const key = new THREE.DirectionalLight('#fffef1', 4)
    key.position.set(3, 5, 3)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.left = -2.5; key.shadow.camera.right = 2.5
    key.shadow.camera.top = 2.5; key.shadow.camera.bottom = -2.5
    key.shadow.normalBias = .025
    key.shadow.bias = -.0001
    scene.add(key)
    const rim = new THREE.DirectionalLight('#dbe9ec', 2)
    rim.position.set(-3, 2, -2); scene.add(rim)
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.29, .035, 80), new THREE.MeshStandardMaterial({ color: '#d3dccc', roughness: .95 }))
    platform.position.y = .012; platform.receiveShadow = true; scene.add(platform)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .14 }))
    floor.rotation.x = -Math.PI / 2; floor.position.y = -.01; floor.receiveShadow = true; scene.add(floor)
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.17, .003, 4, 100), new THREE.MeshBasicMaterial({ color: '#aab99b', transparent: true, opacity: .65 }))
    orbit.rotation.x = Math.PI / 2; orbit.position.y = .033; scene.add(orbit)

    let azimuth = .72, elevation = .42, distance = 4.7, defaultDistance = 4.7
    let visible = false, dragging = false, pointerX = 0, pointerY = 0
    let frame = 0, last = 0, dirty = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    function placeCamera() {
      const target = new THREE.Vector3(0, .65, -.18)
      camera.position.set(Math.sin(azimuth) * Math.cos(elevation) * distance, target.y + Math.sin(elevation) * distance, target.z + Math.cos(azimuth) * Math.cos(elevation) * distance)
      camera.lookAt(target)
    }
    function draw() { placeCamera(); renderer.render(scene, camera); dirty = false }
    command.current = kind => {
      if (kind === 'reset') { azimuth = .72; elevation = .42; distance = defaultDistance }
      if (kind === 'in') distance = Math.max(2.6, distance - .35)
      if (kind === 'out') distance = Math.min(5.4, distance + .35)
      dirty = true
      if (visible) draw()
    }
    const resize = new ResizeObserver(() => {
      const width = element.clientWidth, height = element.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height; camera.updateProjectionMatrix()
      defaultDistance = camera.aspect < 1.2 ? 5.1 : 4.7
      distance = defaultDistance
      dirty = true; draw()
    })
    resize.observe(element)
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      last = 0
      if (visible) { dirty = true; draw() }
    }, { threshold: .05 })
    intersection.observe(element)
    function tick(time: number) {
      frame = requestAnimationFrame(tick)
      if (!visible || document.hidden) { last = 0; return }
      const delta = last ? Math.min((time - last) / 1000, .05) : 0
      last = time
      if (rotationEnabled.current && !reducedMotion.matches && !dragging) { azimuth += delta * .12; dirty = true }
      if (dirty) draw()
    }
    function down(event: PointerEvent) {
      if (!event.isPrimary) return
      dragging = true; pointerX = event.clientX; pointerY = event.clientY
      canvas.setPointerCapture(event.pointerId)
    }
    function move(event: PointerEvent) {
      if (!dragging) return
      azimuth -= (event.clientX - pointerX) * .009
      elevation = Math.max(.1, Math.min(.95, elevation + (event.clientY - pointerY) * .004))
      pointerX = event.clientX; pointerY = event.clientY; dirty = true
    }
    function up() { dragging = false }
    function lost() { failure.current() }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)
    canvas.addEventListener('lostpointercapture', up)
    canvas.addEventListener('webglcontextlost', lost)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect()
      command.current = null
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up)
      canvas.removeEventListener('lostpointercapture', up); canvas.removeEventListener('webglcontextlost', lost)
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>()
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry)
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
            materials.add(material)
            if ('map' in material && material.map instanceof THREE.Texture) textures.add(material.map)
          }
        }
      })
      geometries.forEach(geometry => geometry.dispose()); textures.forEach(texture => texture.dispose()); materials.forEach(material => material.dispose())
      key.shadow.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove()
    }
  }, [])

  return <div ref={host} />
}
