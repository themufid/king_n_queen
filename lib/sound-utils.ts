// ==========================
// 🔊 SOUND + EFFECT ENGINE (MEGA EVENT VERSION)
// ==========================

const getCtx = () => {
  return typeof window !== 'undefined'
    ? new (window.AudioContext || (window as any).webkitAudioContext)()
    : null
}

// ==========================
// 🎤 SPEAK
// ==========================
const speak = (text: string, delay = 0) => {
  setTimeout(() => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.85
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
    f.style.transition = 'opacity 0.7s'
    f.style.opacity = '0'
  }, 50)

  setTimeout(() => f.remove(), 800)
}

// ==========================
// 📳 SHAKE (LEBIH KERAS)
// ==========================
export const triggerShake = () => {
  document.body.animate(
    [
      { transform: 'translate(0,0)' },
      { transform: 'translate(-10px,5px)' },
      { transform: 'translate(10px,-5px)' },
      { transform: 'translate(-8px,3px)' },
      { transform: 'translate(8px,-3px)' },
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
// 🔥 MAIN CELEBRATION (SUPER RAMAI)
// ==========================
export const playCelebrationMusic = (
  kingName?: string,
  queenName?: string
) => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.setValueAtTime(2.5, now) // 🔥 LEBIH KERAS
  master.connect(ctx.destination)

  // ======================
  // 🎸 GUITAR (TEBAL)
  // ======================
  const guitar = (freq: number, time: number, duration: number) => {
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()

      o.type = 'sawtooth' // lebih “gitar”
      o.frequency.setValueAtTime(freq + i * 3, time)

      g.gain.setValueAtTime(1.2 / (i + 1), time)
      g.gain.exponentialRampToValueAtTime(0.01, time + duration)

      o.connect(g)
      g.connect(master)

      o.start(time)
      o.stop(time + duration)
    }
  }

  // ======================
  // 💥 SUB BASS (GEDE)
  // ======================
  const bass = (time: number) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()

    o.type = 'sine'
    o.frequency.setValueAtTime(50, time)

    g.gain.setValueAtTime(2, time)
    g.gain.exponentialRampToValueAtTime(0.01, time + 1.2)

    o.connect(g)
    g.connect(master)

    o.start(time)
    o.stop(time + 1.2)
  }

  // ======================
  // 🎵 BACKGROUND
  // ======================
  const melody = (start: number) => {
    const seq = [523, 659, 783, 659]
    let t = start

    for (let i = 0; i < seq.length; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()

      o.type = 'sine'
      o.frequency.setValueAtTime(seq[i % seq.length], t)

      g.gain.setValueAtTime(0.3, t)
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.4)

      o.connect(g)
      g.connect(master)

      o.start(t)
      o.stop(t + 0.4)

      t += 0.4
    }
  }

  // ======================
  // 🎬 FLOW CINEMATIC
  // ======================

  // 🎤 ANNOUNCER
  speak('And the winner is...', 0)

  // 🎸 JENG JENG JEEEEENG (LEBIH KERAS)
  guitar(350, now + 1.2, 0.6)
  guitar(550, now + 1.8, 0.6)
  guitar(900, now + 2.4, 1)

  // 💥 IMPACT + VISUAL
  setTimeout(() => {
    triggerFlash()
    triggerShake()
  }, 2400)

  bass(now + 2.4)

  // 🎤 NAMA PEMENANG
  speak(
    `Congratulations'}`,
    3500
  )

  // 🎵 BACKGROUND
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