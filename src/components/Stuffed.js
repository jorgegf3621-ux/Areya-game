// Stuffed animal Canvas drawing functions - ultra realistic
// Each animal has: body shading, fur texture strokes, realistic eyes with reflections,
// detailed face anatomy, paws with toe pads, accessories

export function drawBear(ctx, cx, cy, scale = 1) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)

  const C = '#E8732A' // Areya orange bear

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  ctx.beginPath(); ctx.ellipse(0, 44, 23, 7, 0, 0, Math.PI * 2); ctx.fill()

  // === BODY ===
  const bodyG = ctx.createRadialGradient(-10, -6, 3, 4, 8, 36)
  bodyG.addColorStop(0, '#F4944A')
  bodyG.addColorStop(0.5, '#E8732A')
  bodyG.addColorStop(1, '#B84A10')
  ctx.fillStyle = bodyG
  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.bezierCurveTo(-22, -8, -20, -24, 0, -28)
  ctx.bezierCurveTo(20, -24, 22, -8, 18, 0)
  ctx.bezierCurveTo(22, 10, 20, 30, 12, 40)
  ctx.bezierCurveTo(6, 44, -6, 44, -12, 40)
  ctx.bezierCurveTo(-20, 30, -22, 10, -18, 0)
  ctx.closePath(); ctx.fill()
  ctx.strokeStyle = '#9A3A08'; ctx.lineWidth = 1.2; ctx.stroke()

  // Belly cream patch
  const bellyG = ctx.createRadialGradient(0, 12, 1, 0, 12, 15)
  bellyG.addColorStop(0, 'rgba(255,240,200,0.7)')
  bellyG.addColorStop(1, 'rgba(255,220,160,0.1)')
  ctx.fillStyle = bellyG
  ctx.beginPath(); ctx.ellipse(0, 14, 11, 16, 0, 0, Math.PI * 2); ctx.fill()

  // Fur texture strokes on body
  ctx.strokeStyle = 'rgba(100,30,0,0.2)'; ctx.lineWidth = 0.7; ctx.lineCap = 'round'
  const furLines = [[-14,4,-10,0],[14,4,10,0],[-16,14,-12,10],[16,14,12,10],
    [-8,36,-5,28],[8,36,5,28],[0,36,0,28],[-13,28,-9,22],[13,28,9,22]]
  for (const [x1,y1,x2,y2] of furLines) {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  }

  // === ARMS ===
  const armG = ctx.createRadialGradient(-4, -4, 1, 0, 0, 10)
  armG.addColorStop(0, '#F09040'); armG.addColorStop(1, '#C05C18')
  ctx.fillStyle = armG

  // Left arm
  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.bezierCurveTo(-28, -6, -34, 4, -30, 14)
  ctx.bezierCurveTo(-28, 20, -24, 22, -20, 20)
  ctx.bezierCurveTo(-16, 18, -16, 10, -18, 0)
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#9A3A08'; ctx.lineWidth = 1; ctx.stroke()

  // Left paw
  ctx.fillStyle = '#C05C18'
  ctx.beginPath(); ctx.ellipse(-26, 20, 7, 5, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(80,20,0,0.4)'
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.arc(-26 + i*2.2, 22, 1.4, 0, Math.PI * 2); ctx.fill()
  }

  // Right arm
  ctx.fillStyle = armG
  ctx.beginPath()
  ctx.moveTo(18, 0)
  ctx.bezierCurveTo(28, -6, 34, 4, 30, 14)
  ctx.bezierCurveTo(28, 20, 24, 22, 20, 20)
  ctx.bezierCurveTo(16, 18, 16, 10, 18, 0)
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#9A3A08'; ctx.lineWidth = 1; ctx.stroke()

  ctx.fillStyle = '#C05C18'
  ctx.beginPath(); ctx.ellipse(26, 20, 7, 5, -0.3, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(80,20,0,0.4)'
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.arc(26 + i*2.2, 22, 1.4, 0, Math.PI * 2); ctx.fill()
  }

  // === LEGS ===
  const legG = ctx.createRadialGradient(-2, -2, 1, 0, 0, 12)
  legG.addColorStop(0, '#E07030'); legG.addColorStop(1, '#A84010')

  ctx.fillStyle = legG
  ctx.beginPath(); ctx.ellipse(-10, 40, 9, 7, 0.2, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#9A3A08'; ctx.lineWidth = 1; ctx.stroke()
  ctx.beginPath(); ctx.ellipse(10, 40, 9, 7, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke()

  // Toe pads
  ctx.fillStyle = 'rgba(60,15,0,0.45)'
  for (const [bx, by] of [[-10,44],[10,44]]) {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.arc(bx + i*3, by, 1.8, 0, Math.PI * 2); ctx.fill()
    }
  }

  // === HEAD ===
  const headG = ctx.createRadialGradient(-8, -44, 3, 2, -34, 24)
  headG.addColorStop(0, '#F09A50')
  headG.addColorStop(0.6, '#E07030')
  headG.addColorStop(1, '#C05018')
  ctx.fillStyle = headG
  ctx.beginPath(); ctx.arc(0, -38, 24, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#9A3A08'; ctx.lineWidth = 1.3; ctx.stroke()

  // Head fur texture
  ctx.strokeStyle = 'rgba(100,30,0,0.18)'; ctx.lineWidth = 0.8
  const hFur = [[-18,-48,-14,-44],[18,-48,14,-44],[-20,-36,-16,-32],[20,-36,16,-32],
    [-16,-28,-12,-24],[16,-28,12,-24],[0,-58,0,-52],[-8,-58,-6,-52],[8,-58,6,-52]]
  for (const [x1,y1,x2,y2] of hFur) {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  }

  // === EARS ===
  const earG = ctx.createRadialGradient(-2, -2, 1, 0, 0, 11)
  earG.addColorStop(0, '#F09040'); earG.addColorStop(1, '#C05020')

  ctx.fillStyle = earG
  ctx.beginPath(); ctx.arc(-18, -58, 11, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#9A3A08'; ctx.lineWidth = 1.1; ctx.stroke()
  ctx.beginPath(); ctx.arc(18, -58, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke()

  // Inner ears
  const innerEarG = ctx.createRadialGradient(0, 0, 1, 0, 0, 7)
  innerEarG.addColorStop(0, 'rgba(255,160,120,0.9)')
  innerEarG.addColorStop(1, 'rgba(200,80,60,0.5)')
  ctx.fillStyle = innerEarG
  ctx.beginPath(); ctx.arc(-18, -58, 6, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(18, -58, 6, 0, Math.PI * 2); ctx.fill()

  // === MUZZLE ===
  const muzzleG = ctx.createRadialGradient(-3, -29, 1, 0, -27, 11)
  muzzleG.addColorStop(0, 'rgba(255,230,190,0.95)')
  muzzleG.addColorStop(1, 'rgba(230,180,130,0.7)')
  ctx.fillStyle = muzzleG
  ctx.beginPath(); ctx.ellipse(0, -28, 11, 8, 0, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = 'rgba(160,70,20,0.4)'; ctx.lineWidth = 0.8; ctx.stroke()

  // Nose
  const noseG = ctx.createRadialGradient(-1, -35, 0.5, 0, -34, 5)
  noseG.addColorStop(0, '#4a1a08'); noseG.addColorStop(1, '#1a0800')
  ctx.fillStyle = noseG
  ctx.beginPath()
  ctx.moveTo(-5, -35); ctx.bezierCurveTo(-5, -38, 5, -38, 5, -35)
  ctx.bezierCurveTo(6, -33, 4, -32, 0, -31)
  ctx.bezierCurveTo(-4, -32, -6, -33, -5, -35)
  ctx.closePath(); ctx.fill()
  // Nose highlight
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.beginPath(); ctx.ellipse(-2, -36, 1.5, 1, -0.3, 0, Math.PI * 2); ctx.fill()

  // Mouth
  ctx.strokeStyle = '#2a0800'; ctx.lineWidth = 1.3; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(0, -31); ctx.lineTo(0, -27); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0, -27); ctx.quadraticCurveTo(-6, -24, -9, -22); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0, -27); ctx.quadraticCurveTo(6, -24, 9, -22); ctx.stroke()

  // === EYES ===
  for (const ex of [-8, 8]) {
    // Eye socket dark area
    ctx.fillStyle = 'rgba(60,20,0,0.3)'
    ctx.beginPath(); ctx.ellipse(ex, -41, 7, 8.5, ex<0?0.1:-0.1, 0, Math.PI * 2); ctx.fill()

    // Whites
    ctx.fillStyle = 'rgba(255,252,245,0.95)'
    ctx.beginPath(); ctx.ellipse(ex, -41, 5.5, 7, ex<0?0.1:-0.1, 0, Math.PI * 2); ctx.fill()

    // Iris - rich brown with depth
    const irisG = ctx.createRadialGradient(ex-0.5, -42, 0.5, ex, -41, 4)
    irisG.addColorStop(0, '#7B3A10')
    irisG.addColorStop(0.5, '#4A2008')
    irisG.addColorStop(1, '#1A0800')
    ctx.fillStyle = irisG
    ctx.beginPath(); ctx.ellipse(ex, -41, 4, 5.5, 0, 0, Math.PI * 2); ctx.fill()

    // Pupil
    ctx.fillStyle = '#0a0400'
    ctx.beginPath(); ctx.ellipse(ex, -41, 2.2, 3.5, 0, 0, Math.PI * 2); ctx.fill()

    // Main catchlight
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath(); ctx.arc(ex - 1.5, -43.5, 1.6, 0, Math.PI * 2); ctx.fill()
    // Secondary small catchlight
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.beginPath(); ctx.arc(ex + 2, -40, 0.9, 0, Math.PI * 2); ctx.fill()

    // Eyelid crease
    ctx.strokeStyle = 'rgba(100,40,10,0.5)'; ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(ex-5.5, -44)
    ctx.quadraticCurveTo(ex, -47, ex+5.5, -44)
    ctx.stroke()
  }

  // Eyebrow fur tufts
  ctx.fillStyle = 'rgba(120,50,10,0.7)'; ctx.lineWidth = 1
  for (const ex of [-8, 8]) {
    for (let i = -2; i <= 2; i++) {
      ctx.strokeStyle = 'rgba(100,35,5,0.6)'; ctx.lineWidth = 0.9
      ctx.beginPath()
      ctx.moveTo(ex + i*1.8, -49)
      ctx.lineTo(ex + i*1.5, -52)
      ctx.stroke()
    }
  }

  // Blush cheeks
  ctx.fillStyle = 'rgba(255,120,60,0.2)'
  ctx.beginPath(); ctx.ellipse(-16, -32, 7, 5, -0.2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(16, -32, 7, 5, 0.2, 0, Math.PI * 2); ctx.fill()

  ctx.restore()
}

export function drawFox(ctx, cx, cy, scale = 1) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath(); ctx.ellipse(0, 44, 23, 7, 0, 0, Math.PI * 2); ctx.fill()

  // BODY
  const bodyG = ctx.createRadialGradient(-8, -4, 2, 2, 6, 32)
  bodyG.addColorStop(0, '#AABCCC')
  bodyG.addColorStop(0.6, '#8597AC')
  bodyG.addColorStop(1, '#5A6E80')

  ctx.fillStyle = bodyG
  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.bezierCurveTo(-22, -8, -20, -24, 0, -28)
  ctx.bezierCurveTo(20, -24, 22, -8, 18, 0)
  ctx.bezierCurveTo(22, 10, 20, 30, 12, 40)
  ctx.bezierCurveTo(6, 44, -6, 44, -12, 40)
  ctx.bezierCurveTo(-20, 30, -22, 10, -18, 0)
  ctx.closePath(); ctx.fill()
  ctx.strokeStyle = '#3A4E5E'; ctx.lineWidth = 1.2; ctx.stroke()

  // Chest white patch
  const chestG = ctx.createRadialGradient(0, 8, 1, 0, 12, 18)
  chestG.addColorStop(0, 'rgba(225,232,240,0.9)')
  chestG.addColorStop(1, 'rgba(200,215,228,0.2)')
  ctx.fillStyle = chestG
  ctx.beginPath(); ctx.ellipse(0, 14, 12, 17, 0, 0, Math.PI * 2); ctx.fill()

  // Fur strokes
  ctx.strokeStyle = 'rgba(40,60,80,0.2)'; ctx.lineWidth = 0.7; ctx.lineCap = 'round'
  const fFur = [[-15,4,-11,0],[15,4,11,0],[-17,14,-13,10],[17,14,13,10],[-8,36,-5,28],[8,36,5,28]]
  for (const [x1,y1,x2,y2] of fFur) {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  }

  // Tail (bushy)
  const tailG = ctx.createRadialGradient(38, 34, 2, 32, 38, 18)
  tailG.addColorStop(0, '#9AAEBE'); tailG.addColorStop(1, '#5A6E80')
  ctx.fillStyle = tailG
  ctx.beginPath()
  ctx.moveTo(14, 24)
  ctx.bezierCurveTo(30, 18, 52, 22, 54, 36)
  ctx.bezierCurveTo(56, 50, 44, 58, 32, 52)
  ctx.bezierCurveTo(20, 46, 12, 38, 14, 24)
  ctx.closePath(); ctx.fill()
  ctx.strokeStyle = '#3A4E5E'; ctx.lineWidth = 1; ctx.stroke()
  // Tail tip white
  ctx.fillStyle = 'rgba(225,232,240,0.85)'
  ctx.beginPath(); ctx.ellipse(42, 50, 9, 6, -0.5, 0, Math.PI * 2); ctx.fill()

  // Arms
  const armG = ctx.createRadialGradient(-2, -2, 1, 0, 0, 10)
  armG.addColorStop(0, '#9AAEBE'); armG.addColorStop(1, '#6A7E90')
  ctx.fillStyle = armG
  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.bezierCurveTo(-28, -4, -34, 6, -30, 16)
  ctx.bezierCurveTo(-28, 22, -22, 23, -18, 20)
  ctx.bezierCurveTo(-14, 17, -15, 8, -18, 0)
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#3A4E5E'; ctx.lineWidth = 1; ctx.stroke()

  ctx.fillStyle = 'rgba(220,230,240,0.7)'
  ctx.beginPath(); ctx.ellipse(-26, 21, 6, 4, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(40,60,80,0.35)'
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.arc(-26 + i*2.5, 23, 1.3, 0, Math.PI * 2); ctx.fill()
  }

  ctx.fillStyle = armG
  ctx.beginPath()
  ctx.moveTo(18, 0)
  ctx.bezierCurveTo(28, -4, 34, 6, 30, 16)
  ctx.bezierCurveTo(28, 22, 22, 23, 18, 20)
  ctx.bezierCurveTo(14, 17, 15, 8, 18, 0)
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#3A4E5E'; ctx.lineWidth = 1; ctx.stroke()

  ctx.fillStyle = 'rgba(220,230,240,0.7)'
  ctx.beginPath(); ctx.ellipse(26, 21, 6, 4, -0.3, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(40,60,80,0.35)'
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.arc(26 + i*2.5, 23, 1.3, 0, Math.PI * 2); ctx.fill()
  }

  // Legs
  ctx.fillStyle = armG
  ctx.beginPath(); ctx.ellipse(-10, 40, 9, 7, 0.15, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#3A4E5E'; ctx.lineWidth = 1; ctx.stroke()
  ctx.beginPath(); ctx.ellipse(10, 40, 9, 7, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.fillStyle = 'rgba(220,230,240,0.7)'
  ctx.beginPath(); ctx.ellipse(-10, 44, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(10, 44, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill()

  // HEAD
  const headG = ctx.createRadialGradient(-6, -44, 2, 2, -36, 25)
  headG.addColorStop(0, '#AABCCC')
  headG.addColorStop(0.6, '#8597AC')
  headG.addColorStop(1, '#607080')
  ctx.fillStyle = headG
  ctx.beginPath(); ctx.arc(0, -38, 24, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#3A4E5E'; ctx.lineWidth = 1.3; ctx.stroke()

  // EARS - pointy triangular
  ctx.fillStyle = '#6A7E90'
  ctx.strokeStyle = '#3A4E5E'; ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(-22, -52); ctx.lineTo(-12, -76); ctx.lineTo(-2, -52)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(22, -52); ctx.lineTo(12, -76); ctx.lineTo(2, -52)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  // Inner ear orange tint (Areya brand!)
  ctx.fillStyle = 'rgba(243,114,42,0.45)'
  ctx.beginPath(); ctx.moveTo(-18,-54); ctx.lineTo(-12,-70); ctx.lineTo(-5,-54); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(18,-54); ctx.lineTo(12,-70); ctx.lineTo(5,-54); ctx.closePath(); ctx.fill()

  // White face mask
  const faceG = ctx.createRadialGradient(0, -30, 1, 0, -28, 14)
  faceG.addColorStop(0, 'rgba(235,242,248,0.95)')
  faceG.addColorStop(1, 'rgba(210,222,234,0.7)')
  ctx.fillStyle = faceG
  ctx.beginPath(); ctx.ellipse(0, -30, 13, 10, 0, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = 'rgba(100,130,150,0.3)'; ctx.lineWidth = 0.6; ctx.stroke()

  // Nose
  const noseG = ctx.createRadialGradient(-1, -35, 0.5, 0, -34, 4)
  noseG.addColorStop(0, '#2a2a38'); noseG.addColorStop(1, '#0a0a14')
  ctx.fillStyle = noseG
  ctx.beginPath()
  ctx.moveTo(-4, -35); ctx.bezierCurveTo(-4, -37, 4, -37, 4, -35)
  ctx.bezierCurveTo(5, -33, 3, -32, 0, -31)
  ctx.bezierCurveTo(-3, -32, -5, -33, -4, -35)
  ctx.closePath(); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.beginPath(); ctx.ellipse(-1.5, -36, 1.3, 0.9, -0.3, 0, Math.PI * 2); ctx.fill()

  // Mouth
  ctx.strokeStyle = '#1a1a28'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(0,-31); ctx.lineTo(0,-28); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0,-28); ctx.quadraticCurveTo(-5,-25,-8,-23); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0,-28); ctx.quadraticCurveTo(5,-25,8,-23); ctx.stroke()

  // EYES - blue-grey irises
  for (const ex of [-8, 8]) {
    ctx.fillStyle = 'rgba(40,60,80,0.3)'
    ctx.beginPath(); ctx.ellipse(ex, -41, 7, 8.5, ex<0?0.1:-0.1, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,252,248,0.95)'
    ctx.beginPath(); ctx.ellipse(ex, -41, 5.5, 7, ex<0?0.1:-0.1, 0, Math.PI * 2); ctx.fill()
    const irisG = ctx.createRadialGradient(ex-0.5,-42,0.5,ex,-41,4)
    irisG.addColorStop(0, '#5A8AAA'); irisG.addColorStop(0.5, '#2A5070'); irisG.addColorStop(1, '#0A1E2E')
    ctx.fillStyle = irisG
    ctx.beginPath(); ctx.ellipse(ex, -41, 4, 5.5, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#050e18'
    ctx.beginPath(); ctx.ellipse(ex, -41, 2.2, 3.5, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.beginPath(); ctx.arc(ex-1.5, -43.5, 1.6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.beginPath(); ctx.arc(ex+2, -40, 0.9, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = 'rgba(40,70,100,0.5)'; ctx.lineWidth = 0.8
    ctx.beginPath(); ctx.moveTo(ex-5.5,-44); ctx.quadraticCurveTo(ex,-47,ex+5.5,-44); ctx.stroke()
  }

  // Blush - Areya orange hint
  ctx.fillStyle = 'rgba(243,114,42,0.18)'
  ctx.beginPath(); ctx.ellipse(-15, -32, 7, 4.5, -0.2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(15, -32, 7, 4.5, 0.2, 0, Math.PI * 2); ctx.fill()

  ctx.restore()
}

export function drawBunny(ctx, cx, cy, scale = 1) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath(); ctx.ellipse(0, 46, 23, 7, 0, 0, Math.PI * 2); ctx.fill()

  // BODY
  const bodyG = ctx.createRadialGradient(-8, -4, 2, 2, 8, 34)
  bodyG.addColorStop(0, '#F0E0FF')
  bodyG.addColorStop(0.5, '#C890E8')
  bodyG.addColorStop(1, '#9050C0')

  ctx.fillStyle = bodyG
  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.bezierCurveTo(-22, -8, -20, -24, 0, -28)
  ctx.bezierCurveTo(20, -24, 22, -8, 18, 0)
  ctx.bezierCurveTo(22, 10, 20, 32, 12, 42)
  ctx.bezierCurveTo(6, 46, -6, 46, -12, 42)
  ctx.bezierCurveTo(-20, 32, -22, 10, -18, 0)
  ctx.closePath(); ctx.fill()
  ctx.strokeStyle = '#7030A0'; ctx.lineWidth = 1.2; ctx.stroke()

  // Belly
  const bellyG = ctx.createRadialGradient(0, 12, 1, 0, 14, 18)
  bellyG.addColorStop(0, 'rgba(255,250,255,0.7)')
  bellyG.addColorStop(1, 'rgba(240,220,255,0.1)')
  ctx.fillStyle = bellyG
  ctx.beginPath(); ctx.ellipse(0, 16, 11, 17, 0, 0, Math.PI * 2); ctx.fill()

  // Fur strokes
  ctx.strokeStyle = 'rgba(80,20,120,0.2)'; ctx.lineWidth = 0.7; ctx.lineCap = 'round'
  const bFur = [[-15,4,-11,0],[15,4,11,0],[-17,16,-13,12],[17,16,13,12],[-8,38,-5,30],[8,38,5,30]]
  for (const [x1,y1,x2,y2] of bFur) {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  }

  // Arms
  const armG2 = ctx.createRadialGradient(-2,-2,1,0,0,10)
  armG2.addColorStop(0,'#D8A0F0'); armG2.addColorStop(1,'#9050C0')
  ctx.fillStyle = armG2

  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.bezierCurveTo(-28, -4, -34, 6, -30, 16)
  ctx.bezierCurveTo(-28, 23, -22, 24, -18, 21)
  ctx.bezierCurveTo(-14, 18, -15, 8, -18, 0)
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7030A0'; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = 'rgba(255,220,255,0.65)'
  ctx.beginPath(); ctx.ellipse(-26, 22, 6, 4, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(80,20,120,0.35)'
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.arc(-26+i*2.5, 24, 1.3, 0, Math.PI*2); ctx.fill()
  }

  ctx.fillStyle = armG2
  ctx.beginPath()
  ctx.moveTo(18, 0)
  ctx.bezierCurveTo(28, -4, 34, 6, 30, 16)
  ctx.bezierCurveTo(28, 23, 22, 24, 18, 21)
  ctx.bezierCurveTo(14, 18, 15, 8, 18, 0)
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7030A0'; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = 'rgba(255,220,255,0.65)'
  ctx.beginPath(); ctx.ellipse(26, 22, 6, 4, -0.3, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = 'rgba(80,20,120,0.35)'
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.arc(26+i*2.5, 24, 1.3, 0, Math.PI*2); ctx.fill()
  }

  // Legs
  ctx.fillStyle = armG2
  ctx.beginPath(); ctx.ellipse(-10, 42, 10, 8, 0.15, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#7030A0'; ctx.lineWidth = 1; ctx.stroke()
  ctx.beginPath(); ctx.ellipse(10, 42, 10, 8, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.fillStyle = 'rgba(255,200,255,0.6)'
  ctx.beginPath(); ctx.ellipse(-10, 47, 7, 4, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(10, 47, 7, 4, 0, 0, Math.PI * 2); ctx.fill()

  // HEAD
  const headG = ctx.createRadialGradient(-7,-44,2,2,-36,25)
  headG.addColorStop(0,'#EED8FF'); headG.addColorStop(0.6,'#C890E8'); headG.addColorStop(1,'#A060D0')
  ctx.fillStyle = headG
  ctx.beginPath(); ctx.arc(0,-38,24,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#7030A0'; ctx.lineWidth = 1.3; ctx.stroke()

  // LONG FLOPPY EARS
  const earBodyG = ctx.createLinearGradient(-10, -60, 10, -60)
  earBodyG.addColorStop(0, '#B870D8'); earBodyG.addColorStop(0.5, '#D0A0F0'); earBodyG.addColorStop(1, '#B070D8')

  ctx.fillStyle = earBodyG
  ctx.beginPath()
  ctx.moveTo(-14, -52)
  ctx.bezierCurveTo(-20, -66, -18, -86, -10, -88)
  ctx.bezierCurveTo(-2, -90, 0, -80, -2, -66)
  ctx.bezierCurveTo(-2, -58, -6, -52, -14, -52)
  ctx.closePath(); ctx.fill()
  ctx.strokeStyle = '#7030A0'; ctx.lineWidth = 1.1; ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(14, -52)
  ctx.bezierCurveTo(20, -66, 18, -86, 10, -88)
  ctx.bezierCurveTo(2, -90, 0, -80, 2, -66)
  ctx.bezierCurveTo(2, -58, 6, -52, 14, -52)
  ctx.closePath(); ctx.fill(); ctx.stroke()

  // Inner ear pink lining
  const innerEarLG = ctx.createLinearGradient(-8, -60, 8, -60)
  innerEarLG.addColorStop(0, 'rgba(255,140,180,0.7)')
  innerEarLG.addColorStop(1, 'rgba(255,160,200,0.5)')
  ctx.fillStyle = innerEarLG
  ctx.beginPath()
  ctx.moveTo(-11, -54)
  ctx.bezierCurveTo(-16, -66, -14, -82, -8, -84)
  ctx.bezierCurveTo(-3, -85, -2, -75, -4, -64)
  ctx.bezierCurveTo(-5, -57, -8, -53, -11, -54)
  ctx.closePath(); ctx.fill()
  ctx.beginPath()
  ctx.moveTo(11, -54)
  ctx.bezierCurveTo(16, -66, 14, -82, 8, -84)
  ctx.bezierCurveTo(3, -85, 2, -75, 4, -64)
  ctx.bezierCurveTo(5, -57, 8, -53, 11, -54)
  ctx.closePath(); ctx.fill()

  // BOW - Areya orange
  ctx.fillStyle = '#F3722A'; ctx.strokeStyle = '#C04A00'; ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-2, -50)
  ctx.bezierCurveTo(-14, -58, -15, -44, -2, -50)
  ctx.fill(); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(2, -50)
  ctx.bezierCurveTo(14, -58, 15, -44, 2, -50)
  ctx.fill(); ctx.stroke()
  // Bow center knot
  const bowKnotG = ctx.createRadialGradient(0,-50,0.5,0,-50,4)
  bowKnotG.addColorStop(0,'#FF8844'); bowKnotG.addColorStop(1,'#C04400')
  ctx.fillStyle = bowKnotG
  ctx.beginPath(); ctx.arc(0, -50, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()

  // MUZZLE
  const muzzleG2 = ctx.createRadialGradient(-2,-30,1,0,-28,11)
  muzzleG2.addColorStop(0,'rgba(255,240,255,0.95)')
  muzzleG2.addColorStop(1,'rgba(230,200,240,0.6)')
  ctx.fillStyle = muzzleG2
  ctx.beginPath(); ctx.ellipse(0,-28,10,7.5,0,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle = 'rgba(140,60,180,0.3)'; ctx.lineWidth = 0.7; ctx.stroke()

  // Nose - little pink triangle
  ctx.fillStyle = '#FF88BB'
  ctx.beginPath()
  ctx.moveTo(0,-33); ctx.lineTo(-3.5,-29); ctx.lineTo(3.5,-29)
  ctx.closePath(); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.beginPath(); ctx.arc(-1,-31.5,1,0,Math.PI*2); ctx.fill()

  // Mouth
  ctx.strokeStyle = '#9030B0'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(0,-29); ctx.lineTo(0,-26); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0,-26); ctx.quadraticCurveTo(-5,-23,-8,-21); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0,-26); ctx.quadraticCurveTo(5,-23,8,-21); ctx.stroke()

  // EYES - big anime purple
  for (const ex of [-8, 8]) {
    ctx.fillStyle = 'rgba(80,20,120,0.3)'
    ctx.beginPath(); ctx.ellipse(ex,-41,7.5,9,ex<0?0.05:-0.05,0,Math.PI*2); ctx.fill()
    ctx.fillStyle = 'rgba(255,252,255,0.96)'
    ctx.beginPath(); ctx.ellipse(ex,-41,6,8,ex<0?0.05:-0.05,0,Math.PI*2); ctx.fill()
    const irisG2 = ctx.createRadialGradient(ex-0.5,-42.5,0.5,ex,-41,5)
    irisG2.addColorStop(0,'#9050D0'); irisG2.addColorStop(0.4,'#6020A0'); irisG2.addColorStop(1,'#300860')
    ctx.fillStyle = irisG2
    ctx.beginPath(); ctx.ellipse(ex,-41,4.5,6.5,0,0,Math.PI*2); ctx.fill()
    ctx.fillStyle = '#150430'
    ctx.beginPath(); ctx.ellipse(ex,-41,2.5,4,0,0,Math.PI*2); ctx.fill()
    // Big anime catchlight
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.beginPath(); ctx.arc(ex-1.8,-44,2.2,0,Math.PI*2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.beginPath(); ctx.arc(ex+2.5,-40,1.2,0,Math.PI*2); ctx.fill()
    // Bottom iris shimmer
    ctx.fillStyle = 'rgba(200,150,255,0.4)'
    ctx.beginPath(); ctx.ellipse(ex,-39,3,2,0,0,Math.PI); ctx.fill()
    // Eyelashes
    ctx.strokeStyle = '#4A1080'; ctx.lineWidth = 1.1; ctx.lineCap = 'round'
    const lashes = ex < 0
      ? [[-13,-45,-15,-48],[-10,-47,-11,-51],[-7,-48,-7,-52]]
      : [[13,-45,15,-48],[10,-47,11,-51],[7,-48,7,-52]]
    for (const [x1,y1,x2,y2] of lashes) {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(120,40,180,0.45)'; ctx.lineWidth = 0.8
    ctx.beginPath(); ctx.moveTo(ex-6,-46); ctx.quadraticCurveTo(ex,-49,ex+6,-46); ctx.stroke()
  }

  // Pink blush circles
  ctx.fillStyle = 'rgba(255,140,200,0.3)'
  ctx.beginPath(); ctx.ellipse(-16,-31,7,5,-0.15,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(16,-31,7,5,0.15,0,Math.PI*2); ctx.fill()
  // Tiny blush dots
  ctx.fillStyle = 'rgba(255,100,160,0.45)'
  for (const ex of [-16, 16]) {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.arc(ex+i*2,-32,0.9,0,Math.PI*2); ctx.fill()
    }
  }

  ctx.restore()
}
