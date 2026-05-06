'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Candidate } from '@/lib/candidates'
import { playCelebrationMusic } from '@/lib/sound-utils'

interface WinnerDisplayProps {
  king: Candidate
  queen: Candidate
  onReplay: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  vx: number
  vy: number
  angle: number
  spin: number
  opacity: number
  shape: 'rect' | 'circle'
}

const CONFETTI_COLORS = [
  '#D4AF37', '#FFD700', '#FFA500',
  '#9B59B6', '#8E44AD', '#C39BD3',
  '#FFFFFF', '#F8F9FA', '#E8E8E8',
  '#E74C3C', '#2ECC71',
]

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const idRef = useRef(0)

  const spawnBurst = (cx: number, cy: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 4 + Math.random() * 10
      particlesRef.current.push({
        id: idRef.current++,
        x: cx,
        y: cy,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initial bursts
    setTimeout(() => spawnBurst(canvas.width * 0.25, canvas.height * 0.4, 80), 0)
    setTimeout(() => spawnBurst(canvas.width * 0.75, canvas.height * 0.4, 80), 200)
    setTimeout(() => spawnBurst(canvas.width * 0.5, canvas.height * 0.3, 60), 500)
    setTimeout(() => spawnBurst(canvas.width * 0.1, canvas.height * 0.5, 50), 800)
    setTimeout(() => spawnBurst(canvas.width * 0.9, canvas.height * 0.5, 50), 800)

    // Continuous drizzle from top
    const drizzleInterval = setInterval(() => {
      const x = Math.random() * canvas.width
      spawnBurst(x, -10, 3)
    }, 80)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0.01)

      for (const p of particlesRef.current) {
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate((p.angle * Math.PI) / 180)

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.25
        p.vx *= 0.99
        p.angle += p.spin
        if (p.y > canvas.height * 0.2) {
          p.opacity -= 0.008
        }
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
      clearInterval(drizzleInterval)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      aria-hidden="true"
    />
  )
}

interface WinnerCardProps {
  candidate: Candidate
  title: string
  delay: number
  color: 'gold' | 'purple'
}

function WinnerCard({ candidate, title, delay, color }: WinnerCardProps) {
  const isGold = color === 'gold'

  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0, y: 60 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-4"
    >
      {/* Crown */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
        className="float-anim select-none"
        aria-label="Crown"
        role="img"
      >
        <svg
          viewBox="0 0 64 48"
          className="w-14 h-14 md:w-16 md:h-16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 40L14 16L28 30L32 8L36 30L50 16L60 40H4Z"
            fill={isGold ? 'oklch(0.78 0.18 80)' : 'oklch(0.65 0.22 295)'}
            stroke={isGold ? 'oklch(0.88 0.16 85)' : 'oklch(0.75 0.22 295)'}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="4" y="40" width="56" height="6"
            rx="2"
            fill={isGold ? 'oklch(0.68 0.16 78)' : 'oklch(0.55 0.2 300)'}
            stroke={isGold ? 'oklch(0.88 0.16 85)' : 'oklch(0.75 0.22 295)'}
            strokeWidth="1.5"
          />
          <circle cx="32" cy="8" r="3" fill={isGold ? 'oklch(0.96 0 0)' : 'oklch(0.92 0.08 295)'} />
          <circle cx="14" cy="16" r="2.5" fill={isGold ? 'oklch(0.96 0 0)' : 'oklch(0.92 0.08 295)'} />
          <circle cx="50" cy="16" r="2.5" fill={isGold ? 'oklch(0.96 0 0)' : 'oklch(0.92 0.08 295)'} />
        </svg>
      </motion.div>

      {/* Photo card */}
      <motion.div
        className="relative rounded-2xl overflow-hidden border-4"
        style={{
          width: 'clamp(140px, 22vw, 240px)',
          aspectRatio: '3/4',
          borderColor: isGold ? 'var(--gold)' : 'oklch(0.65 0.22 295)',
          boxShadow: isGold
            ? '0 0 60px 16px oklch(0.78 0.18 80 / 0.5)'
            : '0 0 60px 16px oklch(0.65 0.22 295 / 0.5)',
        }}
        animate={
          isGold
            ? {
                boxShadow: [
                  '0 0 40px 10px oklch(0.78 0.18 80 / 0.4)',
                  '0 0 70px 20px oklch(0.78 0.18 80 / 0.7)',
                  '0 0 40px 10px oklch(0.78 0.18 80 / 0.4)',
                ],
              }
            : {
                boxShadow: [
                  '0 0 40px 10px oklch(0.65 0.22 295 / 0.4)',
                  '0 0 70px 20px oklch(0.65 0.22 295 / 0.7)',
                  '0 0 40px 10px oklch(0.65 0.22 295 / 0.4)',
                ],
              }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src={candidate.photo}
          alt={`Pemenang: ${candidate.name}`}
          fill
          className="object-cover object-top"
          sizes="240px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
          <p
            className={`font-serif font-black text-sm md:text-base leading-tight text-balance ${
              isGold ? 'text-[var(--gold-bright)]' : 'text-[var(--purple-bright)]'
            }`}
          >
            {candidate.name}
          </p>
        </div>
      </motion.div>

      {/* Title badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.4 }}
        className={`px-6 py-2 rounded-full border font-serif font-bold tracking-[0.2em] uppercase text-sm ${
          isGold
            ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10'
            : 'border-[var(--purple-bright)] text-[var(--purple-bright)] bg-[var(--purple)]/10'
        }`}
      >
        {title}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.5, 1, 0.5],
          textShadow: [
            '0 0 5px rgba(255,255,255,0.2)',
            '0 0 25px rgba(255,255,255,1)',
            '0 0 5px rgba(255,255,255,0.2)',
          ]
        }}
        transition={{
          delay: delay + 0.7,
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="text-center mt-1"
      >
        <p className="text-sm md:text-base font-black tracking-widest text-white">
          {candidate.class}
        </p>
      </motion.div>
    
    </motion.div>
  )
}

import { useRouter } from 'next/navigation'

export default function WinnerDisplay({ king, queen, onReplay }: WinnerDisplayProps) {
  const [showReplay, setShowReplay] = useState(false)
  const musicPlayedRef = useRef(false)
  const router = useRouter() // ✅ TAMBAHAN

  useEffect(() => {
    // ==========================
    // 🔥 FIX MOBILE AUDIO
    // ==========================
    const unlockAudio = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        if (ctx.state === 'suspended') ctx.resume()

        const buffer = ctx.createBuffer(1, 1, 22050)
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.connect(ctx.destination)
        source.start(0)
      } catch {}

      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('click', unlockAudio)
    }

    document.addEventListener('touchstart', unlockAudio, { once: true })
    document.addEventListener('click', unlockAudio, { once: true })

    // ==========================
    // 🎬 MAIN SOUND
    // ==========================
    if (!musicPlayedRef.current) {
      playCelebrationMusic(king.name, queen.name)
      musicPlayedRef.current = true
    }

    // ==========================
    // 🎆 FX
    // ==========================
    const fx = setTimeout(() => {
      const flash = document.createElement('div')
      flash.style.cssText = `
        position:fixed;inset:0;
        background:white;
        opacity:1;
        z-index:9999;
        pointer-events:none;
      `
      document.body.appendChild(flash)

      setTimeout(() => {
        flash.style.transition = 'opacity 0.6s'
        flash.style.opacity = '0'
      }, 50)

      setTimeout(() => flash.remove(), 700)

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
    }, 2200)

    // ==========================
    // 🎤 SPEAK
    // ==========================
    const speakWinner = setTimeout(() => {
      if ('speechSynthesis' in window) {
        const text = `Congratulations to the winners. King ${king.name} and Queen ${queen.name}`
        const utter = new SpeechSynthesisUtterance(text)
        utter.rate = 0.85
        utter.pitch = 1
        utter.volume = 1
        speechSynthesis.cancel()
        speechSynthesis.speak(utter)
      }
    }, 3200)

    const t = setTimeout(() => setShowReplay(true), 3500)

    return () => {
      clearTimeout(t)
      clearTimeout(fx)
      clearTimeout(speakWinner)
    }
  }, [king.name, queen.name])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      <ConfettiCanvas />

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-15 bg-[radial-gradient(circle,oklch(0.78_0.18_80),transparent)]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-15 bg-[radial-gradient(circle,oklch(0.55_0.2_300),transparent)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-8">

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="tracking-[0.4em] text-xs text-gray-400">Selamat Kepada</p>

          <motion.h1
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            KING & QUEEN
          </motion.h1>

          <motion.p
            animate={{
              textShadow: [
                '0 0 10px gold',
                '0 0 40px gold',
                '0 0 10px gold',
              ]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-2 text-xl md:text-3xl font-bold text-white tracking-widest"
          >
            SMK YADIKA BANDAR LAMPUNG
          </motion.p>
        </motion.div>

        {/* WINNERS */}
        <div className="flex gap-10 items-end">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}>
            <WinnerCard candidate={king} title="King" delay={0.3} color="gold" />
          </motion.div>

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}>
            <WinnerCard candidate={queen} title="Queen" delay={0.6} color="purple" />
          </motion.div>
        </div>

        {/* ==========================
            🔥 BUTTON AREA (FIX)
           ========================== */}
        {showReplay && (
          <div className="flex gap-4 mt-6">
            
            {/* 🔁 ULANGI */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReplay}
              className="px-8 py-3 rounded-full border text-white border-white hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              Ulangi
            </motion.button>

            {/* 📊 LIHAT DATA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/data')} // ✅ PENTING
              className="px-8 py-3 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition font-bold"
            >
              Lihat Data
            </motion.button>

          </div>
        )}

      </div>
    </div>
  )
}