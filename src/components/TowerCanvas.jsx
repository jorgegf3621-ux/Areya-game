import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { drawBear, drawFox, drawBunny } from './Stuffed.js'

const DRAW_FNS = [drawBear, drawFox, drawBunny]
const CW = 160, CH = 280
const TUBE_TOP = 44, TUBE_H = 130, TUBE_W = 28

function lerp(a, b, t) { return a + (b - a) * t }

const TowerCanvas = forwardRef(function TowerCanvas(
  { playerIndex, waterLevel, won, isActive, color },
  ref
) {
  const canvasRef = useRef(null)
  const stateRef  = useRef({
    stuffedY: TUBE_TOP + TUBE_H - 20,
    jets: [], particles: [], recoil: 0, stars: null
  })

  const drawFn = DRAW_FNS[playerIndex % 3]
  const tubeBot = TUBE_TOP + TUBE_H

  // Expose fireGun to parent via ref
  useImperativeHandle(ref, () => ({
    fireGun(hit) {
      const st = stateRef.current
      st.recoil = 1
      const mx = (Math.random() > .5 ? 1 : -1) * (10 + Math.random() * 9)
      const my = (Math.random() > .5 ? 1 : -1) * (6 + Math.random() * 7)
      st.jets.push({ t: 0, hit, mx, my, splashed: false, done: false })
    }
  }))

  function spawnParticles(j) {
    const st = stateRef.current
    const bx = CW / 2, by = tubeBot + 28
    const cx = j.hit ? bx : bx + j.mx
    const cy = j.hit ? by : by + j.my
    const n  = j.hit ? 14 : 6
    for (let k = 0; k < n; k++) {
      const a  = Math.random() * Math.PI * 2
      const sp = j.hit ? (1.5 + Math.random() * 2.8) : (0.7 + Math.random() * 1.4)
      st.particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (j.hit ? 2 : 0.8),
        r: j.hit ? (2 + Math.random() * 2.8) : (1 + Math.random() * 2),
        life: 1, hit: j.hit
      })
    }
    j.done = true
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const st  = stateRef.current
    ctx.clearRect(0, 0, CW, CH)

    const bg = ctx.createLinearGradient(0, 0, 0, CH)
    bg.addColorStop(0, '#1a2030'); bg.addColorStop(1, '#222838')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH)

    if (!st.stars) {
      st.stars = Array.from({ length: 10 }, () => ({
        x: Math.random() * CW, y: Math.random() * CH, r: 0.4 + Math.random() * 0.7
      }))
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    for (const s of st.stars) { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill() }

    const tx = CW / 2

    // ALARM
    const ay = 14
    if (won) {
      const bk = Math.sin(Date.now() / 260) * 0.5 + 0.5
      const gl = ctx.createRadialGradient(tx, ay, 0, tx, ay, 24)
      gl.addColorStop(0, `rgba(243,114,42,${0.55 * bk})`); gl.addColorStop(1, 'transparent')
      ctx.fillStyle = gl; ctx.fillRect(tx - 26, ay - 26, 52, 52)
      ctx.strokeStyle = `rgba(245,185,121,${0.3 + bk * 0.4})`; ctx.lineWidth = 1
      for (let r = 0; r < 6; r++) {
        const a = r * Math.PI / 3 + Date.now() / 900
        ctx.beginPath()
        ctx.moveTo(tx + Math.cos(a) * 10, ay + Math.sin(a) * 10)
        ctx.lineTo(tx + Math.cos(a) * 20, ay + Math.sin(a) * 20)
        ctx.stroke()
      }
    }
    ctx.beginPath(); ctx.arc(tx, ay, 9, 0, Math.PI * 2)
    ctx.fillStyle = won ? '#c04a00' : '#181f38'; ctx.fill()
    ctx.strokeStyle = won ? '#F3722A' : '#252f50'; ctx.lineWidth = 1.6; ctx.stroke()
    ctx.beginPath(); ctx.arc(tx, ay, 5.5, 0, Math.PI * 2)
    const blinkVal = Math.round((Math.sin(Date.now() / 260) * 0.5 + 0.5) * 100)
    ctx.fillStyle = won ? `rgba(243,${80 + blinkVal},42,.9)` : '#0d1325'; ctx.fill()

    // TUBE HOUSING
    const metal = ctx.createLinearGradient(tx - TUBE_W / 2 - 3, 0, tx + TUBE_W / 2 + 3, 0)
    metal.addColorStop(0, '#1a2235'); metal.addColorStop(0.4, '#202c44'); metal.addColorStop(1, '#141c2c')
    ctx.fillStyle = metal
    ctx.beginPath(); ctx.roundRect(tx - TUBE_W / 2 - 4, TUBE_TOP - 4, TUBE_W + 8, TUBE_H + 8, 6); ctx.fill()
    ctx.fillStyle = 'rgba(8,14,32,.95)'
    ctx.beginPath(); ctx.roundRect(tx - TUBE_W / 2, TUBE_TOP, TUBE_W, TUBE_H, 4); ctx.fill()

    // WATER
    const wh = TUBE_H * Math.min(1, waterLevel)
    const wyTop = tubeBot - wh
    if (wh > 2) {
      ctx.save()
      ctx.beginPath(); ctx.roundRect(tx - TUBE_W / 2, TUBE_TOP, TUBE_W, TUBE_H, 4); ctx.clip()
      const wg = ctx.createLinearGradient(0, wyTop, 0, tubeBot)
      wg.addColorStop(0, '#F18A21'); wg.addColorStop(0.4, '#C05A10'); wg.addColorStop(1, '#7A3200')
      ctx.fillStyle = wg; ctx.fillRect(tx - TUBE_W / 2, wyTop, TUBE_W, wh)
      const wt = Date.now() / 500
      ctx.fillStyle = 'rgba(255,190,100,.28)'
      ctx.beginPath(); ctx.moveTo(tx - TUBE_W / 2, wyTop + 3)
      for (let x = 0; x <= TUBE_W; x += 2) ctx.lineTo(tx - TUBE_W / 2 + x, wyTop + Math.sin((x / 6) + wt) * 2.5)
      ctx.lineTo(tx + TUBE_W / 2, wyTop); ctx.lineTo(tx + TUBE_W / 2, wyTop + 6)
      ctx.lineTo(tx - TUBE_W / 2, wyTop + 6); ctx.closePath(); ctx.fill()
      ctx.restore()
    }
    ctx.strokeStyle = 'rgba(243,114,42,.28)'; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.roundRect(tx - TUBE_W / 2, TUBE_TOP, TUBE_W, TUBE_H, 4); ctx.stroke()
    ctx.strokeStyle = 'rgba(243,114,42,.14)'; ctx.lineWidth = 0.6
    for (let k = 1; k < 9; k++) {
      const ty = tubeBot - k * TUBE_H / 9
      ctx.beginPath(); ctx.moveTo(tx - TUBE_W / 2, ty); ctx.lineTo(tx - TUBE_W / 2 + 4, ty); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(tx + TUBE_W / 2 - 4, ty); ctx.lineTo(tx + TUBE_W / 2, ty); ctx.stroke()
    }

    // STUFFED ANIMAL
    const tgtY = wh > 4 ? Math.max(TUBE_TOP + 18, tubeBot - wh - 18) : tubeBot - 18
    st.stuffedY = lerp(st.stuffedY, tgtY, 0.055)
    ctx.save()
    ctx.beginPath(); ctx.roundRect(tx - TUBE_W / 2, TUBE_TOP, TUBE_W, TUBE_H, 4); ctx.clip()
    drawFn(ctx, tx, st.stuffedY, 0.28)
    ctx.restore()

    // BULLSEYE
    const bx = tx, by = tubeBot + 28
    ;[[20, '#1e0e00'], [14, '#a83800'], [9, '#E4630E'], [4.5, '#F5B979'], [2, '#fff']].forEach(([r, c]) => {
      ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill()
    })
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 0.4
    ;[20, 14, 9].forEach(r => { ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.stroke() })
    ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 0.6
    ctx.beginPath(); ctx.moveTo(bx - 24, by); ctx.lineTo(bx + 24, by); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(bx, by - 24); ctx.lineTo(bx, by + 24); ctx.stroke()

    // JETS
    for (const j of st.jets) {
      const gx2 = tx, gy2 = CH - 18
      const ex = bx + (j.hit ? 0 : j.mx), ey = by + (j.hit ? 0 : j.my)
      ctx.save(); ctx.lineWidth = j.hit ? 3.5 : 2; ctx.lineCap = 'round'
      const steps = 24
      for (let s = 0; s < steps * j.t; s++) {
        const ta = s / steps, tb = (s + 1) / steps
        const px = lerp(gx2, ex, ta), py = lerp(gy2, ey, ta) - Math.sin(ta * Math.PI) * 32
        const px2 = lerp(gx2, ex, tb), py2 = lerp(gy2, ey, tb) - Math.sin(tb * Math.PI) * 32
        ctx.strokeStyle = j.hit
          ? `rgba(243,114,42,${0.9 * (1 - ta * 0.25)})`
          : `rgba(165,166,162,${0.6 * (1 - ta * 0.4)})`
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px2, py2); ctx.stroke()
      }
      ctx.restore()
    }

    // PARTICLES
    for (const p of st.particles) {
      ctx.save(); ctx.globalAlpha = p.life
      ctx.fillStyle = p.hit
        ? `rgba(243,${80 + Math.round(p.life * 80)},42,${p.life})`
        : `rgba(165,166,162,${p.life})`
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    }

    // GUN
    const gxd = tx, gyd = CH - 18, rec = st.recoil || 0
    ctx.save(); ctx.translate(gxd - rec * 4, gyd)
    const bG = ctx.createLinearGradient(-22, 0, 22, 0)
    bG.addColorStop(0, '#1a2438'); bG.addColorStop(0.5, '#243450'); bG.addColorStop(1, '#141e30')
    ctx.fillStyle = bG; ctx.beginPath(); ctx.roundRect(-22, -7, 38, 14, 5); ctx.fill()
    ctx.strokeStyle = 'rgba(243,114,42,.32)'; ctx.lineWidth = 0.8; ctx.stroke()
    ctx.fillStyle = '#0e1e30'; ctx.beginPath(); ctx.roundRect(14, -4, 18, 8, 3); ctx.fill()
    ctx.strokeStyle = 'rgba(243,114,42,.22)'; ctx.stroke()
    ctx.fillStyle = '#0a1626'; ctx.beginPath(); ctx.roundRect(-10, 7, 10, 14, 3); ctx.fill()
    const tkg = ctx.createRadialGradient(-7, -2, 1, -7, -2, 9)
    tkg.addColorStop(0, 'rgba(243,114,42,.4)'); tkg.addColorStop(1, 'rgba(180,60,0,.15)')
    ctx.fillStyle = tkg; ctx.beginPath(); ctx.ellipse(-7, -2, 10, 7, 0, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = 'rgba(243,114,42,.22)'; ctx.lineWidth = 0.8; ctx.stroke()
    ctx.fillStyle = '#162e48'; ctx.beginPath(); ctx.roundRect(30, -2, 6, 4, 2); ctx.fill()
    ctx.restore()

    // SCORE BAR
    const bW = TUBE_W + 6, bX = tx - bW / 2
    ctx.fillStyle = 'rgba(255,255,255,.06)'
    ctx.beginPath(); ctx.roundRect(bX, CH - 6, bW, 4, 2); ctx.fill()
    ctx.fillStyle = color
    ctx.beginPath(); ctx.roundRect(bX, CH - 6, bW * Math.min(1, waterLevel), 4, 2); ctx.fill()
  }

  useEffect(() => {
    const st = stateRef.current
    let id
    function loop() {
      for (const j of st.jets) {
        j.t = Math.min(1, j.t + 0.045)
        if (j.t >= 1 && !j.splashed) { j.splashed = true; spawnParticles(j) }
      }
      st.jets = st.jets.filter(j => j.t < 1 || !j.done)
      for (const p of st.particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.28; p.life = Math.max(0, p.life - 0.032)
      }
      st.particles = st.particles.filter(p => p.life > 0)
      if (st.recoil > 0) st.recoil = Math.max(0, st.recoil - 0.1)
      draw()
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [waterLevel, won, playerIndex, color])

  return (
    <canvas
      ref={canvasRef}
      width={CW}
      height={CH}
      style={{
        borderRadius: 10,
        display: 'block',
        outline: isActive ? `2px solid ${color}` : 'none',
        outlineOffset: 2
      }}
    />
  )
})

export default TowerCanvas
