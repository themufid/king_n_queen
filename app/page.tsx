'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CandidateCard from '@/components/CandidateCard'
import RevealScreen from '@/components/RevealScreen'
import WinnerDisplay from '@/components/WinnerDisplay'
import { kingCandidates, queenCandidates, type Candidate } from '@/lib/candidates'

type AppStage = 'lobby' | 'reveal' | 'winner'

export default function HomePage() {
  const [stage, setStage] = useState<AppStage>('lobby')
  const [winnerKing, setWinnerKing] = useState<Candidate | null>(null)
  const [winnerQueen, setWinnerQueen] = useState<Candidate | null>(null)

  const handleStartReveal = () => {
    setStage('reveal')
  }

  const handleRevealComplete = useCallback((king: Candidate, queen: Candidate) => {
    setWinnerKing(king)
    setWinnerQueen(queen)
    setStage('winner')
  }, [])

  const handleReplay = () => {
    setWinnerKing(null)
    setWinnerQueen(null)
    setStage('lobby')
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AnimatePresence>
        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RevealScreen
              kingCandidates={kingCandidates}
              queenCandidates={queenCandidates}
              onRevealComplete={handleRevealComplete}
            />
          </motion.div>
        )}

        {stage === 'winner' && winnerKing && winnerQueen && (
          <motion.div
            key="winner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WinnerDisplay
              king={winnerKing}
              queen={winnerQueen}
              onReplay={handleReplay}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LobbyView onStart={handleStartReveal} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function LobbyView({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh]"
          style={{
            background:
              'radial-gradient(ellipse at 50% -10%, oklch(0.55 0.2 300 / 0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-1/2 h-[40vh]"
          style={{
            background:
              'radial-gradient(ellipse at 0% 100%, oklch(0.78 0.18 80 / 0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-1/2 h-[40vh]"
          style={{
            background:
              'radial-gradient(ellipse at 100% 100%, oklch(0.55 0.2 300 / 0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.78 0.18 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.18 80) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-12 md:py-16 max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-sans text-[var(--gold)]/70 uppercase text-xs md:text-sm tracking-[0.5em] mb-4"
          >
            Grand Reveal Ceremony
          </motion.p>

          <h1 className="font-serif font-black text-5xl md:text-7xl lg:text-8xl shimmer-text tracking-wider text-balance leading-none mb-4">
            KING &amp; QUEEN
          </h1>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
            <span className="font-serif text-[var(--gold)] text-2xl md:text-4xl font-bold tracking-[0.3em]">
              SMK YADIKA BANDAR LAMPUNG
            </span>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
          </div>

          <p className="font-sans text-muted-foreground text-sm tracking-[0.2em] uppercase">
            THIRTEEN GENERATION (2025/2026)
          </p>
        </motion.header>

        {/* King section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          aria-labelledby="king-section-title"
          className="mb-16"
        >
          <SectionHeading
            id="king-section-title"
            label="Kandidat"
            title="King"
            color="gold"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {kingCandidates.map((c, i) => (
              <CandidateCard key={c.id} candidate={c} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full h-px mb-16"
          style={{
            background:
              'linear-gradient(90deg, transparent, oklch(0.78 0.18 80 / 0.4), oklch(0.55 0.2 300 / 0.4), transparent)',
          }}
        />

        {/* Queen section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          aria-labelledby="queen-section-title"
          className="mb-20"
        >
          <SectionHeading
            id="queen-section-title"
            label="Kandidat"
            title="Queen"
            color="purple"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {queenCandidates.map((c, i) => (
              <CandidateCard key={c.id} candidate={c} index={i} />
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex flex-col items-center gap-4 pb-16"
        >
          <p className="font-sans text-muted-foreground text-xs tracking-[0.3em] uppercase">
            Siap untuk pengumuman?
          </p>

          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 50px 16px oklch(0.78 0.18 80 / 0.3)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              // ==========================
              // 🔥 FIX AUDIO MOBILE (WAJIB)
              // ==========================
              const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
              const ctx = new AudioCtx()

              if (ctx.state === 'suspended') {
                ctx.resume()
              }

              // 🔥 unlock tambahan biar aman semua device
              const unlockSound = () => {
                const buffer = ctx.createBuffer(1, 1, 22050)
                const source = ctx.createBufferSource()
                source.buffer = buffer
                source.connect(ctx.destination)
                source.start(0)
              }
              unlockSound()

              // ==========================
              // ▶️ JALANKAN ASLI
              // ==========================
              onStart()
            }}
            className="relative px-12 py-5 rounded-full font-serif font-bold text-lg md:text-xl
              tracking-widest uppercase text-black overflow-hidden cursor-pointer select-none"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.88 0.16 85) 0%, oklch(0.78 0.18 80) 50%, oklch(0.65 0.15 75) 100%)',
              boxShadow: '0 0 30px 8px oklch(0.78 0.18 80 / 0.25)',
            }}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
            <span className="relative z-10">Ungkap Pemenang</span>
          </motion.button>

          <p className="font-sans text-muted-foreground/40 text-xs">
            Sore yang paling ditunggu-tunggu
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function SectionHeading({
  id,
  label,
  title,
  color,
}: {
  id: string
  label: string
  title: string
  color: 'gold' | 'purple'
}) {
  const isGold = color === 'gold'
  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className={`h-px flex-1 ${
          isGold
            ? 'bg-gradient-to-r from-[var(--gold)]/40 to-transparent'
            : 'bg-gradient-to-r from-[var(--purple)]/40 to-transparent'
        }`}
      />
      <div className="text-center">
        <p
          className={`font-sans text-xs tracking-[0.4em] uppercase mb-0.5 ${
            isGold
              ? 'text-[var(--gold)]/60'
              : 'text-[var(--purple-bright)]/60'
          }`}
        >
          {label}
        </p>
        <h2
          id={id}
          className={`font-serif font-black text-xl md:text-2xl tracking-[0.15em] uppercase ${
            isGold ? 'text-[var(--gold-bright)]' : 'text-[var(--purple-bright)]'
          }`}
        >
          {title}
        </h2>
      </div>
      <div
        className={`h-px flex-1 ${
          isGold
            ? 'bg-gradient-to-l from-[var(--gold)]/40 to-transparent'
            : 'bg-gradient-to-l from-[var(--purple)]/40 to-transparent'
        }`}
      />
    </div>
  )
}
