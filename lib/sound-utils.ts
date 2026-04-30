// Sound effects utilities
export const playTickSound = () => {
  const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null
  if (!audioContext) return

  const now = audioContext.currentTime
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()

  osc.connect(gain)
  gain.connect(audioContext.destination)

  osc.frequency.setValueAtTime(800, now)
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.05)
  gain.gain.setValueAtTime(0.3, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

  osc.start(now)
  osc.stop(now + 0.05)
}

export const playVictorySound = () => {
  const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null
  if (!audioContext) return

  const notes = [
    { freq: 523.25, duration: 0.2 }, // C5
    { freq: 659.25, duration: 0.2 }, // E5
    { freq: 783.99, duration: 0.2 }, // G5
    { freq: 1046.5, duration: 0.5 }, // C6
  ]

  let delay = 0
  notes.forEach(({ freq, duration }) => {
    const now = audioContext.currentTime + delay
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.connect(gain)
    gain.connect(audioContext.destination)
    osc.frequency.setValueAtTime(freq, now)
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

    osc.start(now)
    osc.stop(now + duration)
    delay += duration
  })
}

export const playCelebrationMusic = () => {
  const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null
  if (!audioContext) return

  const playNote = (freq: number, start: number, duration: number, volume = 0.3) => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.connect(gain)
    gain.connect(audioContext.destination)
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.01, start + duration)
    osc.start(start)
    osc.stop(start + duration)
  }

  const startTime = audioContext.currentTime
  // Simple celebration melody
  const melody = [
    { freq: 523.25, duration: 0.3 }, // C
    { freq: 523.25, duration: 0.3 },
    { freq: 659.25, duration: 0.3 }, // E
    { freq: 783.99, duration: 0.6 }, // G
    { freq: 659.25, duration: 0.3 }, // E
    { freq: 1046.5, duration: 0.9 }, // C
  ]

  let currentTime = startTime
  melody.forEach(({ freq, duration }) => {
    playNote(freq, currentTime, duration)
    currentTime += duration
  })
}

// Countdown sounds with English numbers
export const playCountdownSound = (number: number) => {
  const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null
  if (!audioContext) return

  // Different frequency for each number to make them distinct
  const frequencies: Record<number, number> = {
    5: 400,  // Lower pitch
    4: 500,
    3: 600,
    2: 700,
    1: 800,  // Higher pitch for "ONE"
  }

  const freq = frequencies[number] || 400
  const now = audioContext.currentTime

  // Create a beep sound with the appropriate frequency
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()

  osc.connect(gain)
  gain.connect(audioContext.destination)

  osc.frequency.setValueAtTime(freq, now)
  gain.gain.setValueAtTime(0.4, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

  osc.start(now)
  osc.stop(now + 0.3)
}
