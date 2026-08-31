import { useEffect, useRef } from 'react'

function heatMap(THREE) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(64, 58, 4, 64, 64, 62)
  g.addColorStop(0, 'rgba(255,236,180,0.95)')
  g.addColorStop(0.22, 'rgba(255,140,32,0.65)')
  g.addColorStop(0.5, 'rgba(0,200,5,0.28)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function flameShapes(THREE) {
  const outer = new THREE.Shape()
  outer.moveTo(13, 1.2)
  outer.bezierCurveTo(13.35, 5.4, 15.05, 8.85, 16.95, 10.7)
  outer.bezierCurveTo(19.85, 8.35, 24.05, 9.95, 23.55, 15.55)
  outer.bezierCurveTo(23.2, 19.55, 20.45, 22.35, 18.05, 24.15)
  outer.bezierCurveTo(20.7, 25.55, 23.15, 28.25, 13, 31.55)
  outer.bezierCurveTo(2.85, 28.25, 5.3, 25.55, 7.95, 24.15)
  outer.bezierCurveTo(5.55, 22.35, 2.8, 19.55, 2.45, 15.55)
  outer.bezierCurveTo(1.95, 9.95, 6.15, 8.35, 9.05, 10.7)
  outer.bezierCurveTo(10.95, 8.85, 12.65, 5.4, 13, 1.2)

  const hole = new THREE.Path()
  hole.moveTo(13, 13.55)
  hole.bezierCurveTo(14.6, 16.25, 15.75, 18.55, 15.5, 21.25)
  hole.bezierCurveTo(14.7, 23.45, 13, 25.25, 13, 25.25)
  hole.bezierCurveTo(13, 25.25, 11.3, 23.45, 10.5, 21.25)
  hole.bezierCurveTo(10.25, 18.55, 11.4, 16.25, 13, 13.55)
  outer.holes.push(hole)
  return [outer]
}

function flameGeometry(THREE) {
  const geo = new THREE.ExtrudeGeometry(flameShapes(THREE), {
    depth: 7.4,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0.65,
    bevelSegments: 1,
    curveSegments: 10,
  })
  geo.rotateX(Math.PI)
  geo.center()
  geo.computeBoundingBox()
  const h = Math.max(0.001, geo.boundingBox.max.y - geo.boundingBox.min.y)
  geo.scale(2.42 / h, 2.42 / h, 2.42 / h)
  return geo
}

export default function MachineVisual({ progress, mode = 'solid', side = 'center', lite = false, quality = 'lite' }) {
  const hostRef = useRef(null)
  const modeRef = useRef(mode)
  const progressRef = useRef(progress)
  modeRef.current = mode
  progressRef.current = progress
  const rich = !lite && quality === 'high'

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let dead = false
    let visible = true
    let dispose = () => {}

    ;(async () => {
      const THREE = await import('three')
      if (dead || !hostRef.current) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const renderer = new THREE.WebGLRenderer({
        antialias: rich,
        alpha: true,
        powerPreference: rich ? 'high-performance' : 'low-power',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, rich ? 1.5 : 1))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.shadowMap.enabled = rich
      if (rich) renderer.shadowMap.type = THREE.PCFSoftShadowMap
      host.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40)
      camera.position.set(side === 'right' ? 1.12 : 0, 0.28, 6.4)

      let env
      let envRt
      if (rich) {
        const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')
        if (dead) return
        env = new THREE.PMREMGenerator(renderer)
        envRt = env.fromScene(new RoomEnvironment(), 0.2)
        scene.environment = envRt.texture
        scene.environmentIntensity = 0.8
      }

      const junk = []
      const track = (item) => {
        junk.push(item)
        return item
      }

      const heat = track(heatMap(THREE))
      const bodyGeo = track(flameGeometry(THREE))
      const crystal = new THREE.Group()
      scene.add(crystal)

      const metal = new THREE.MeshStandardMaterial({
        color: 0x1f8a3a,
        metalness: 0.58,
        roughness: 0.28,
        emissive: new THREE.Color(0x0c4a1c),
        emissiveIntensity: 0.22,
      })
      const body = new THREE.Mesh(bodyGeo, metal)
      body.castShadow = rich
      crystal.add(body)

      const glass = new THREE.MeshStandardMaterial({
        color: 0x00c805,
        metalness: 0.12,
        roughness: 0.18,
        transparent: true,
        opacity: 0.38,
        emissive: new THREE.Color(0xff6a12),
        emissiveIntensity: 0.2,
      })
      const shell = new THREE.Mesh(bodyGeo, glass)
      shell.scale.set(1.04, 1.03, 0.72)
      crystal.add(shell)

      const emberMat = new THREE.MeshStandardMaterial({
        color: 0xff9a2a,
        roughness: 0.35,
        emissive: new THREE.Color(0xff6a00),
        emissiveIntensity: 1.35,
      })
      const ember = new THREE.Mesh(bodyGeo, emberMat)
      ember.scale.set(0.42, 0.4, 0.38)
      ember.position.y = -0.18
      crystal.add(ember)

      const core = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.13, 12, 12)),
        new THREE.MeshBasicMaterial({
          color: 0x8aff8a,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      )
      core.position.y = -0.12
      crystal.add(core)

      const glowMat = new THREE.SpriteMaterial({
        map: heat,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.62,
      })
      const glow = new THREE.Sprite(glowMat)
      glow.scale.set(2.35, 2.7, 1)
      glow.position.set(0, 0.05, 0.12)
      crystal.add(glow)

      const wire = new THREE.LineSegments(
        track(new THREE.WireframeGeometry(bodyGeo)),
        new THREE.LineBasicMaterial({ color: 0x6dff7a, transparent: true, opacity: 0.38 }),
      )
      wire.visible = false
      crystal.add(wire)

      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4b45a,
        metalness: 0.8,
        roughness: 0.28,
        emissive: new THREE.Color(0x8a5a10),
        emissiveIntensity: 0.16,
      })
      const ringA = new THREE.Mesh(track(new THREE.TorusGeometry(1.12, 0.018, 8, rich ? 64 : 32)), ringMat)
      ringA.rotation.x = Math.PI / 2
      ringA.position.y = -1.18
      crystal.add(ringA)

      const count = rich ? 42 : 18
      const pts = new Float32Array(count * 3)
      const cols = new Float32Array(count * 3)
      const vel = new Float32Array(count)
      const palette = [0x00c805, 0x8aff8a, 0xff8a1a, 0xffc14a]
      const c = new THREE.Color()
      for (let i = 0; i < count; i += 1) {
        const a = Math.random() * Math.PI * 2
        const r = 0.12 + Math.random() * 0.5
        pts[i * 3] = Math.cos(a) * r
        pts[i * 3 + 1] = -1.05 + Math.random() * 2.2
        pts[i * 3 + 2] = Math.sin(a) * r * 0.55
        vel[i] = 0.22 + Math.random() * 0.45
        c.setHex(palette[i % palette.length])
        cols[i * 3] = c.r
        cols[i * 3 + 1] = c.g
        cols[i * 3 + 2] = c.b
      }
      const sparkGeo = track(new THREE.BufferGeometry())
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
      sparkGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
      const sparkMat = new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const sparks = new THREE.Points(sparkGeo, sparkMat)
      crystal.add(sparks)

      if (rich) {
        const floor = new THREE.Mesh(track(new THREE.CircleGeometry(3, 32)), new THREE.ShadowMaterial({ opacity: 0.28 }))
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -1.42
        floor.receiveShadow = true
        scene.add(floor)
      }

      scene.add(new THREE.HemisphereLight(0xffe8c8, 0x0c1610, 0.45))
      const key = new THREE.DirectionalLight(0xfff4e2, 1.15)
      key.position.set(-2.4, 4.8, 2.6)
      if (rich) {
        key.castShadow = true
        key.shadow.mapSize.set(1024, 1024)
        key.shadow.radius = 3
        key.shadow.camera.near = 0.5
        key.shadow.camera.far = 14
        key.shadow.camera.left = -3
        key.shadow.camera.right = 3
        key.shadow.camera.top = 3
        key.shadow.camera.bottom = -3
      }
      scene.add(key)
      const coreLight = new THREE.PointLight(0x00c805, 2, 8, 2)
      coreLight.position.set(0, -0.05, 0.35)
      scene.add(coreLight)
      const emberLight = new THREE.PointLight(0xff7a18, 2.2, 7, 2)
      emberLight.position.set(0, 0.55, 0.4)
      scene.add(emberLight)

      const clock = new THREE.Clock()
      let frame = 0
      let pSmooth = progressRef.current ?? 0
      let yaw = -0.28
      let pitch = 0.12
      let shown = false
      let skip = 0
      const camX = side === 'right' ? 1.12 : 0
      const lookX = side === 'right' ? 0.42 : 0

      const fit = () => {
        const w = host.clientWidth || 1
        const h = host.clientHeight || 1
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      fit()
      const ro = new ResizeObserver(fit)
      ro.observe(host)

      const readP = () => {
        if (progressRef.current != null) return progressRef.current
        const n = parseFloat(getComputedStyle(host).getPropertyValue('--p'))
        return Number.isFinite(n) ? n : 0
      }

      const tick = () => {
        if (dead || !visible) {
          frame = 0
          return
        }
        frame = requestAnimationFrame(tick)
        if (!rich && skip === 1) {
          skip = 0
          return
        }
        skip = 1

        const dt = Math.min(clock.getDelta(), 0.05)
        const ease = 1 - Math.exp(-3.2 * dt)
        pSmooth += (readP() - pSmooth) * ease
        const wireOn = modeRef.current === 'wire'
        metal.transparent = wireOn
        metal.opacity = wireOn ? 0.14 : 1
        glass.opacity = wireOn ? 0.08 : 0.38
        wire.visible = wireOn

        const t = clock.elapsedTime
        const idle = reduce ? 0 : t * 0.04
        const sway = reduce ? 0 : Math.sin(t * 1.1) * 0.012
        const flicker = reduce ? 1 : 0.93 + Math.sin(t * 7.2) * 0.035
        yaw += (-0.28 + pSmooth * 0.8 + idle - yaw) * ease
        pitch += (0.12 - pSmooth * 0.08 + sway - pitch) * ease
        crystal.rotation.set(pitch, yaw, sway * 0.5)
        ember.rotation.y = -t * 0.28
        glow.scale.set(2.2 + flicker * 0.2, 2.5 + flicker * 0.24, 1)
        glowMat.opacity = (wireOn ? 0.26 : 0.58) * flicker
        coreLight.intensity = 1.7 * flicker
        emberLight.intensity = 1.9 * flicker
        ringA.rotation.z = t * 0.06

        if (rich && !reduce) {
          const pos = sparkGeo.attributes.position.array
          for (let i = 0; i < count; i += 1) {
            pos[i * 3 + 1] += vel[i] * dt
            if (pos[i * 3 + 1] > 1.35) {
              const a = Math.random() * Math.PI * 2
              const r = 0.1 + Math.random() * 0.4
              pos[i * 3] = Math.cos(a) * r
              pos[i * 3 + 1] = -1.15
              pos[i * 3 + 2] = Math.sin(a) * r * 0.5
            }
          }
          sparkGeo.attributes.position.needsUpdate = true
        }

        camera.lookAt(lookX, 0.08, 0)
        renderer.render(scene, camera)
        if (!shown) {
          shown = true
          renderer.domElement.classList.add('is-on')
        }
      }
      tick()

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
          if (visible && !frame && !dead) frame = requestAnimationFrame(tick)
        },
        { rootMargin: '12% 0px' },
      )
      io.observe(host)

      dispose = () => {
        cancelAnimationFrame(frame)
        io.disconnect()
        ro.disconnect()
        renderer.dispose()
        env?.dispose()
        envRt?.dispose()
        metal.dispose()
        glass.dispose()
        emberMat.dispose()
        core.material.dispose()
        glowMat.dispose()
        wire.material.dispose()
        ringMat.dispose()
        sparkMat.dispose()
        junk.forEach((item) => item.dispose?.())
        renderer.domElement.remove()
      }
    })()

    return () => {
      dead = true
      dispose()
    }
  }, [lite, quality, rich, side])

  return <div ref={hostRef} className={`machine-stage ${mode}`} aria-hidden="true" />
}
