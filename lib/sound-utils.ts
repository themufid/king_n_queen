// ==========================
// 🔊 SOUND ENGINE (FINAL STABLE)
// ==========================

let ctx: AudioContext | null = null
let unlocked = false

// ==========================
// 🎧 GET AUDIO CONTEXT
// ==========================
export const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null

  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  if (ctx.state !== 'running') {
    ctx.resume().catch(() => {})
  }

  return ctx
}

// ==========================
// 🔓 UNLOCK AUDIO (WAJIB HP)
// ==========================
export const unlockAudio = () => {
  const c = getCtx()
  if (!c || unlocked) return

  try {
    const buffer = c.createBuffer(1, 1, 22050)
    const src = c.createBufferSource()
    src.buffer = buffer
    src.connect(c.destination)
    src.start(0)

    unlocked = true
    console.log('🔊 Audio unlocked')
  } catch (e) {
    console.log('unlock gagal', e)
  }
}

// ==========================
// 🎤 SPEAK (BRITISH SAFE)
// ==========================
const loadVoices = () =>
  new Promise<SpeechSynthesisVoice[]>((resolve) => {
    if (typeof window === 'undefined') return resolve([])

    let voices = speechSynthesis.getVoices()
    if (voices.length) return resolve(voices)

    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices()
      resolve(voices)
    }
  })

export const speak = async (text: string, delay = 0) => {
  if (typeof window === 'undefined') return
  if (!('speechSynthesis' in window)) return

  const voices = await loadVoices()

  setTimeout(() => {
    try {
      speechSynthesis.cancel()

      const utter = new SpeechSynthesisUtterance(text)

      const british =
        voices.find(v => v.lang === 'en-GB') ||
        voices.find(v => v.lang.includes('en'))

      if (british) utter.voice = british

      utter.rate = 0.85
      utter.pitch = 1
      utter.volume = 1

      speechSynthesis.speak(utter)
    } catch (e) {
      console.log('speak error:', e)
    }
  }, delay)
}

// ==========================
// 🔊 TICK (SPIN)
// ==========================
export const playTickSound = () => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()

  o.type = 'square'
  o.frequency.value = 700

  g.gain.setValueAtTime(0.15, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

  o.connect(g)
  g.connect(ctx.destination)

  o.start(now)
  o.stop(now + 0.05)
}

// ==========================
// ⏱️ COUNTDOWN (2 DETIK + VOICE)
// ==========================
export const playCountdownSound = (n: number) => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  const o = ctx.createOscillator()
  const g = ctx.createGain()

  o.type = 'triangle'
  o.frequency.value = 300 + n * 70

  g.gain.setValueAtTime(0.4, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

  o.connect(g)
  g.connect(ctx.destination)

  o.start(now)
  o.stop(now + 0.6)

  const words: Record<number, string> = {
    5: 'Five',
    4: 'Four',
    3: 'Three',
    2: 'Two',
    1: 'One',
    0: 'Zero',
  }

  if (words[n]) {
    speak(words[n], 500) // 🔥 biar jelas
  }
}

// ==========================
// 🎸 JRRENG GITAR REALISTIS (1x)
// ==========================
const guitarJreng = (time: number, root: number) => {
  const ctx = getCtx()
  if (!ctx) return

  const freqs = [
    root,
    root * 1.26,
    root * 1.5,
    root * 2.01,
  ]

  freqs.forEach((freq, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // 🔥 karakter gitar
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(freq + Math.random() * 2, time + i * 0.04)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1800, time)

    // 🎸 attack & decay gitar
    g.gain.setValueAtTime(1.4, time + i * 0.04)
    g.gain.exponentialRampToValueAtTime(0.001, time + 1.8)

    o.connect(filter)
    filter.connect(g)
    g.connect(ctx.destination)

    o.start(time + i * 0.04)
    o.stop(time + 1.8)
  })
}

// ==========================
// 🎉 CELEBRATION (FINAL)
// ==========================
export const playCelebrationMusic = (
  kingName?: string,
  queenName?: string
) => {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  // 🔥 JRRENG SEKALI
  guitarJreng(now, 196)

  // 💥 efek
  setTimeout(() => {
    document.body.animate(
      [
        { transform: 'translate(0,0)' },
        { transform: 'translate(-10px,5px)' },
        { transform: 'translate(10px,-5px)' },
        { transform: 'translate(0,0)' },
      ],
      { duration: 500 }
    )
  }, 800)

  // 🎤 voice
  speak(
    `Congratulations. King ${kingName ?? ''} and Queen ${queenName ?? ''}`,
    1500
  )
}