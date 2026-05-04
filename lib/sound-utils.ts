// ==========================
// 🔊 SOUND + EFFECT ENGINE (FINAL MOBILE FIX)
// ==========================

let ctx: AudioContext | null = null

export const getCtx = () => {
  if (typeof window === 'undefined') return null

  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  return ctx
}

// ==========================
// 🎤 SPEAK
// ==========================
const speak = (text: string, delay = 0) => {
  setTimeout(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.9
      u.pitch = 1
      u.volume = 1
      speechSynthesis.speak(u)
    }
  }, delay)
}

// ==========================
// 💥 FLASH
// ==========================
export const triggerFlash = () => {
  const f = document.createElement('div')
  f.style.cssText = `
    position:fixed;inset:0;
    background:white;
    opacity:1;
    z-index:9999;
    pointer-events:none;
  `
  document.body.appendChild(f)

  setTimeout(() => {
    f.style.transition = 'opacity 0.6s'
    f.style.opacity = '0'
  }, 50)

  setTimeout(() => f.remove(), 700)
}

// ==========================
// 📳 SHAKE
// ==========================
export const triggerShake = () => {
  document.body.animate(
    [
      { transform: 'translate(0,0)' },
      { transform: 'translate(-12px,6px)' },
      { transform: 'translate(12px,-6px)' },
      { transform: 'translate(-8px,4px)' },
      { transform: 'translate(8px,-4px)' },
      { transform: 'translate(0,0)' },
    ],
    { duration: 600 }
  )
}

// ==========================
// 🔊 TICK
// ==========================
export const playTickSound = () => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()

  o.type = 'square'
  o.frequency.setValueAtTime(1200, now)

  g.gain.setValueAtTime(0.8, now)
  g.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

  o.connect(g)
  g.connect(ctx.destination)

  o.start(now)
  o.stop(now + 0.05)
}

// ==========================
// 🎉 VICTORY
// ==========================
export const playVictorySound = () => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  ;[523, 659, 783, 1046].forEach((f, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()

    o.type = 'triangle'
    o.frequency.setValueAtTime(f, now + i * 0.2)

    g.gain.setValueAtTime(0.7, now + i * 0.2)
    g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.4)

    o.connect(g)
    g.connect(ctx.destination)

    o.start(now + i * 0.2)
    o.stop(now + i * 0.4)
  })
}

// ==========================
// 🔥 MAIN CELEBRATION (SUPER FIX)
// ==========================
export const playCelebrationMusic = (
  kingName?: string,
  queenName?: string
) => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.setValueAtTime(3, now) // 🔥 SUPER KERAS
  master.connect(ctx.destination)

  // 🎸 GUITAR LAYER (LEBIH TEBAL)
  const guitar = (freq: number, time: number, duration: number) => {
    for (let i = 0; i < 4; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()

      o.type = 'sawtooth'
      o.frequency.setValueAtTime(freq + i * 5, time)

      g.gain.setValueAtTime(1 / (i + 1), time)
      g.gain.exponentialRampToValueAtTime(0.01, time + duration)

      o.connect(g)
      g.connect(master)

      o.start(time)
      o.stop(time + duration)
    }
  }

  // 💥 BASS IMPACT
  const bass = (time: number) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()

    o.type = 'sine'
    o.frequency.setValueAtTime(50, time)

    g.gain.setValueAtTime(2.5, time)
    g.gain.exponentialRampToValueAtTime(0.01, time + 1)

    o.connect(g)
    g.connect(master)

    o.start(time)
    o.stop(time + 1)
  }



  // 🎵 MELODY (SEKALI SAJA)
  const melody = (start: number) => {
    const seq = [523, 659, 783, 659]

    seq.forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()

      o.type = 'sine'
      o.frequency.setValueAtTime(f, start + i * 0.4)

      g.gain.setValueAtTime(0.3, start + i * 0.4)
      g.gain.exponentialRampToValueAtTime(0.01, start + i * 0.4 + 0.4)

      o.connect(g)
      g.connect(master)

      o.start(start + i * 0.4)
      o.stop(start + i * 0.4 + 0.4)
    })
  }

  // ======================
  // 🎬 CINEMATIC FLOW
  // ======================

  speak('Kongratulations', 0)

  guitar(350, now + 1.2, 0.7)
  guitar(600, now + 1.9, 0.7)
  guitar(1000, now + 2.6, 1.2)

  setTimeout(() => {
    triggerFlash()
    triggerShake()
  }, 2600)

  bass(now + 2.6)


 
  melody(now + 3)
}

// ==========================
// ⏱️ COUNTDOWN
// ==========================
export const playCountdownSound = (n: number) => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime
  const freq: any = { 5: 400, 4: 500, 3: 650, 2: 800, 1: 1000 }

  const o = ctx.createOscillator()
  const g = ctx.createGain()

  o.type = 'square'
  o.frequency.setValueAtTime(freq[n] || 400, now)

  g.gain.setValueAtTime(0.9, now)
  g.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

  o.connect(g)
  g.connect(ctx.destination)

  o.start(now)
  o.stop(now + 0.3)
}
