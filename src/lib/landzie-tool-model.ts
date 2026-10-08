import * as THREE from 'three'

/** Photo-based close-up of the cutting discs, not a complete tool or CAD model. */
export function createLandzieTool() {
  const tool = new THREE.Group()
  tool.name = 'Landzie — détail des disques étoilés'
  const green = new THREE.MeshPhysicalMaterial({
    color: '#003f20', metalness: .3, roughness: .32,
    clearcoat: .7, clearcoatRoughness: .25,
  })
  const steel = new THREE.MeshStandardMaterial({ color: '#a0a49b', metalness: .83, roughness: .32 })
  // Short section of the roller only: no frame or handle.
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(.062, .062, 1.3, 32), green)
  axle.rotation.z = Math.PI / 2
  axle.position.y = .34
  axle.castShadow = true
  axle.receiveShadow = true
  tool.add(axle)
  const star = new THREE.Shape()
  const teeth = 10
  for (let point = 0; point < teeth * 2; point++) {
    const angle = point * Math.PI / teeth
    const radius = point % 2 === 0 ? .33 : .15
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (point === 0) star.moveTo(x, y)
    else star.lineTo(x, y)
  }
  star.closePath()
  const bore = new THREE.Path()
  bore.absarc(0, 0, .064, 0, Math.PI * 2, true)
  star.holes.push(bore)
  const geometry = new THREE.ExtrudeGeometry(star, {
    depth: .014, bevelEnabled: true, bevelThickness: .003, bevelSize: .003,
    bevelSegments: 1, steps: 1, curveSegments: 12,
  })
  geometry.translate(0, 0, -.007)
  geometry.rotateY(Math.PI / 2)
  const discs = new THREE.InstancedMesh(geometry, steel, 11)
  const dummy = new THREE.Object3D()
  for (let index = 0; index < 11; index++) {
    dummy.position.set(-.48 + index * .096, .34, 0)
    dummy.rotation.set((index % 4) * Math.PI / 20, 0, 0)
    dummy.updateMatrix()
    discs.setMatrixAt(index, dummy.matrix)
  }
  discs.name = 'Disques étoilés en acier'
  discs.castShadow = true
  discs.receiveShadow = true
  tool.add(discs)
  return { tool }
}
