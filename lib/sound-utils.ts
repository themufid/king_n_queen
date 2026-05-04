// Sound effects utilities

// Helper: create audio context aman
const getCtx = () => {
  return typeof window !== 'undefined'
    ? new (window.AudioContext || (window as any).webkitAudioContext)()
    : null
}

// ==========================
// 🔊 TICK SOUND
// ==========================
export const playTickSound = () => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(1000, now)
  osc.frequency.exponentialRampToValueAtTime(500, now + 0.05)

  gain.gain.setValueAtTime(0.6, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.05)
}

// ==========================
// 🎉 VICTORY SOUND
// ==========================
export const playVictorySound = () => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  const notes = [523.25, 659.25, 783.99, 1046.5]

  notes.forEach((freq, i) => {
    const t = now + i * 0.25

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t)

    gain.gain.setValueAtTime(0.5, t)
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + 0.3)
  })
}

// ==========================
// 🔥 MAIN CELEBRATION (FINAL)
// ==========================
export const playCelebrationMusic = () => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  // MASTER VOLUME
  const master = ctx.createGain()
  master.gain.setValueAtTime(1.2, now)
  master.connect(ctx.destination)

  // 🎸 JENG (clean guitar feel)
  const playJeng = (freq: number, time: number, duration: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle' // clean
    osc.frequency.setValueAtTime(freq, time)

    gain.gain.setValueAtTime(0.8, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration)

    osc.connect(gain)
    gain.connect(master)

    osc.start(time)
    osc.stop(time + duration)
  }

  // 🎵 MELODY LOOP (1 MENIT)
  const playMelody = (startTime: number) => {
    const melody = [
      523.25, 659.25, 783.99, 659.25,
      523.25, 659.25, 783.99, 1046.5,
    ]

    let t = startTime

    for (let i = 0; i < 60; i++) {
      const freq = melody[i % melody.length]

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5)

      osc.connect(gain)
      gain.connect(master)

      osc.start(t)
      osc.stop(t + 0.5)

      t += 0.5
    }
  }

  // ==========================
  // 🎼 SEQUENCE UTAMA
  // ==========================

  // 🎸 JENG JENG JENG
  playJeng(400, now + 0.1, 0.4)
  playJeng(600, now + 0.5, 0.4)
  playJeng(900, now + 0.9, 0.7)

  // 🎤 VOICE
  setTimeout(() => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(
        'Congratulations for the winner'
      )

      utter.lang = 'en-US'
      utter.pitch = 1
      utter.rate = 0.9
      utter.volume = 1

      window.speechSynthesis.speak(utter)
    }
  }, 1400)

  // 🎵 MUSIK LATAR 1 MENIT
  playMelody(now + 2)
}

// ==========================
// ⏱️ COUNTDOWN
// ==========================
export const playCountdownSound = (number: number) => {
  const ctx = getCtx()
  if (!ctx) return

  const frequencies: Record<number, number> = {
    5: 400,
    4: 500,
    3: 650,
    2: 800,
    1: 1000,
  }

  const freq = frequencies[number] || 400
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(freq, now)

  gain.gain.setValueAtTime(0.7, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.3)
}