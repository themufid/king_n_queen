'use client'

import { unlockAudio } from '@/lib/sound-utils'
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Candidate } from '@/lib/candidates'
import {
  PREDETERMINED_WINNER_KING_ID,
  PREDETERMINED_WINNER_QUEEN_ID,
  weightedKingCandidates,
  weightedQueenCandidates,
} from '@/lib/candidates'
import { playTickSound, playCelebrationMusic, playCountdownSound } from '@/lib/sound-utils'

interface RevealScreenProps {
  kingCandidates: Candidate[]
  queenCandidates: Candidate[]
  onRevealComplete: (king: Candidate, queen: Candidate) => void
}

// Slot machine phases:
//   'countdown'  — 5 4 3 2 1 display (1 second each)
//   'burst'      — initial fast burst
//   'suspense'   — alternating pause/spin to build tension
//   'slowdown'   — final deceleration landing on winner
//   'done'       — freeze on winner
type Phase = 'countdown' | 'burst' | 'suspense' | 'slowdown' | 'done'

export default function RevealScreen({
  kingCandidates,
  queenCandidates,
  onRevealComplete,
}: RevealScreenProps) {
  const [phase, setPhase] = useState<Phase>('countdown')
  const [countdown, setCountdown] = useState(5)
  const [currentKingIndex, setCurrentKingIndex] = useState(0)
  const [currentQueenIndex, setCurrentQueenIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [flashLabel, setFlashLabel] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const winnerKing = useRef<Candidate>(
    kingCandidates.find((c) => c.id === PREDETERMINED_WINNER_KING_ID) ??
      kingCandidates[0]
  )
  const winnerQueen = useRef<Candidate>(
    queenCandidates.find((c) => c.id === PREDETERMINED_WINNER_QUEEN_ID) ??
      queenCandidates[0]
  )

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // ── PHASE: countdown 5 → 0 (each number shown for 1 second) ──
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) {
      const t = setTimeout(() => setPhase('burst'), 700)
      return () => clearTimeout(t)
    }
    // Play sound for current countdown number (5, 4, 3, 2, 1)
    if (countdown > 0) {
      playCountdownSound(countdown)
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 2000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // ── PHASE: burst (fast spin, ~3 seconds) ──
  useEffect(() => {
    if (phase !== 'burst') return
    clearTimer()
    let elapsed = 0
    const INTERVAL = 70
    const DURATION = 3000

    const tick = () => {
      playTickSound()
      elapsed += INTERVAL
      setCurrentKingIndex((i) => (i + 1) % weightedKingCandidates.length)
      setCurrentQueenIndex((i) => (i + 1) % weightedQueenCandidates.length)
      if (elapsed >= DURATION) {
        setPhase('suspense')
      } else {
        timerRef.current = setTimeout(tick, INTERVAL)
      }
    }
    timerRef.current = setTimeout(tick, INTERVAL)
    return clearTimer
  }, [phase, clearTimer])

  // ── PHASE: suspense (pause ↔ spin cycles to build tension) ──
  useEffect(() => {
    if (phase !== 'suspense') return
    clearTimer()

    const rounds = [
      { spinMs: 700,  pauseMs: 800,  label: null },
      { spinMs: 500,  pauseMs: 1000, label: null },
      { spinMs: 600,  pauseMs: 1200, label: null },
      { spinMs: 350,  pauseMs: 1400, label: 'Siapa ya...' },
      { spinMs: 450,  pauseMs: 1000, label: null },
      { spinMs: 250,  pauseMs: 1600, label: 'Penasaran?' },
      { spinMs: 350,  pauseMs: 900,  label: null },
      { spinMs: 200,  pauseMs: 1800, label: 'Sebentar lagi...' },
    ]

    let roundIndex = 0
    const SPIN_INTERVAL = 80

    const doSpin = (spinRemaining: number, onDone: () => void) => {
      if (spinRemaining <= 0) { onDone(); return }
      playTickSound()
      setCurrentKingIndex((i) => (i + 1) % weightedKingCandidates.length)
      setCurrentQueenIndex((i) => (i + 1) % weightedQueenCandidates.length)
      timerRef.current = setTimeout(
        () => doSpin(spinRemaining - SPIN_INTERVAL, onDone),
        SPIN_INTERVAL
      )
    }

    const nextRound = () => {
      if (roundIndex >= rounds.length) {
        setIsPaused(false)
        setFlashLabel(null)
        setPhase('slowdown')
        return
      }
      const round = rounds[roundIndex++]
      setIsPaused(false)
      setFlashLabel(null)

      doSpin(round.spinMs, () => {
        setIsPaused(true)
        if (round.label) setFlashLabel(round.label)
        timerRef.current = setTimeout(() => {
          setFlashLabel(null)
          nextRound()
        }, round.pauseMs)
      })
    }

    nextRound()
    return () => {
      clearTimer()
      setIsPaused(false)
      setFlashLabel(null)
    }
  }, [phase, kingCandidates.length, queenCandidates.length, clearTimer])

  // ── PHASE: slowdown (decelerate to winner) ──
  useEffect(() => {
    if (phase !== 'slowdown') return
    clearTimer()

    let delay = 120
    let steps = 0
    const MAX_STEPS = 26

    const tick = () => {
      if (steps >= MAX_STEPS) {
        setCurrentKingIndex(weightedKingCandidates.findIndex(c => c.id === winnerKing.current.id))
        setCurrentQueenIndex(weightedQueenCandidates.findIndex(c => c.id === winnerQueen.current.id))
        setPhase('done')
        return
      }
      playTickSound()
      setCurrentKingIndex((i) => (i + 1) % weightedKingCandidates.length)
      setCurrentQueenIndex((i) => (i + 1) % weightedQueenCandidates.length)
      steps++
      delay = Math.min(delay * 1.18, 1200)
      timerRef.current = setTimeout(tick, delay)
    }
    timerRef.current = setTimeout(tick, delay)
    return clearTimer
  }, [phase, clearTimer])

  // ── PHASE: done → fire callback ──
  useEffect(() => {
    if (phase !== 'done') return
    playCelebrationMusic()
    const t = setTimeout(() => {
      onRevealComplete(winnerKing.current, winnerQueen.current)
    }, 2200)
    return () => clearTimeout(t)
  }, [phase, onRevealComplete])

  const currentKing = weightedKingCandidates[currentKingIndex]
  const currentQueen = weightedQueenCandidates[currentQueenIndex]
  const isSpinning = !isPaused && (phase === 'burst' || phase === 'suspense' || phase === 'slowdown')
  const isDone = phase === 'done'

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[130vw] h-[80vh]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, oklch(0.55 0.2 300 / 0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh]"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, oklch(0.78 0.18 80 / 0.10) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.78 0.18 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.18 80) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ── COUNTDOWN ── */}
      <AnimatePresence mode="wait">
        {phase === 'countdown' && countdown > 0 && (
          <motion.div
            key={`count-${countdown}`}
            initial={{ scale: 2.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-8 z-10"
          >
            <p className="font-sans text-muted-foreground/70 tracking-[0.4em] uppercase text-xs md:text-sm">
              Grand Reveal Starts In
            </p>
            <div className="flex flex-col items-center gap-4">
              <span
                className="font-serif font-black leading-none shimmer-text select-none"
                style={{ fontSize: 'clamp(8rem, 22vw, 16rem)' }}
              >
                {countdown}
              </span>
              <p className="font-sans text-[var(--gold)]/80 tracking-[0.2em] uppercase text-sm md:text-base font-semibold">
                {countdown === 5 && 'FIVE'}
                {countdown === 4 && 'FOUR'}
                {countdown === 3 && 'THREE'}
                {countdown === 2 && 'TWO'}
                {countdown === 1 && 'ONE'}
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'countdown' && countdown === 0 && (
          <motion.div
            key="start-label"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="font-serif font-black shimmer-text tracking-widest z-10 select-none"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
          >
            GO!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SLOT MACHINE ── */}
      {(phase === 'burst' || phase === 'suspense' || phase === 'slowdown' || phase === 'done') && (
        <div className="z-10 w-full max-w-3xl px-4 flex flex-col items-center gap-8">
          {/* Status label */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isDone ? (
                <motion.p
                  key="selamat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-[var(--gold)] tracking-[0.3em] uppercase text-base font-bold"
                >
                  SELAMAT KEPADA...
                </motion.p>
              ) : flashLabel ? (
                <motion.p
                  key={flashLabel}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-sans text-muted-foreground/80 tracking-[0.2em] uppercase text-sm italic"
                >
                  {flashLabel}
                </motion.p>
              ) : (
                <motion.p
                  key="memilih"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-serif text-[var(--gold)]/60 tracking-[0.3em] uppercase text-sm"
                >
                  Memilih Pemenang...
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Slot cards */}
          <div className="flex gap-6 md:gap-10 justify-center items-start">
            <SlotCard
              candidate={currentKing}
              label="KING"
              isDone={isDone}
              isPaused={isPaused}
              isSpinning={isSpinning}
              color="gold"
            />

            <div className="flex items-center self-center pb-10">
              <span className="font-serif text-xl md:text-3xl text-muted-foreground/30 font-black select-none">
                &times;
              </span>
            </div>

            <SlotCard
              candidate={currentQueen}
              label="QUEEN"
              isDone={isDone}
              isPaused={isPaused}
              isSpinning={isSpinning}
              color="purple"
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface SlotCardProps {
  candidate: Candidate
  label: string
  isDone: boolean
  isPaused: boolean
  isSpinning: boolean
  color: 'gold' | 'purple'
}

function SlotCard({ candidate, label, isDone, isPaused, isSpinning, color }: SlotCardProps) {
  const isGold = color === 'gold'

  const borderBase = isGold ? 'var(--gold)' : 'oklch(0.65 0.22 295)'
  const shadowActive = isGold
    ? '0 0 50px 14px oklch(0.78 0.18 80 / 0.55)'
    : '0 0 50px 14px oklch(0.65 0.22 295 / 0.55)'
  const shadowIdle = isGold
    ? '0 0 20px 4px oklch(0.78 0.18 80 / 0.2)'
    : '0 0 20px 4px oklch(0.65 0.22 295 / 0.2)'

  const blurAmount = isDone ? 0 : isPaused ? 0 : isSpinning ? 2.5 : 0

  return (
    <motion.div
      animate={isDone ? { scale: [1, 1.07, 1] } : { scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3"
    >
      <p
        className="font-serif text-xs tracking-[0.3em] uppercase font-bold"
        style={{ color: borderBase }}
      >
        {label}
      </p>

      <div
        className="relative rounded-2xl overflow-hidden border-2 transition-all duration-150"
        style={{
          width: 'clamp(130px, 18vw, 200px)',
          aspectRatio: '3/4',
          borderColor: borderBase,
          boxShadow: isDone || isPaused ? shadowActive : shadowIdle,
          filter: `blur(${blurAmount}px)`,
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={candidate.id + '-' + candidate.name}
            initial={isSpinning ? { y: -60, opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={isSpinning ? { y: 60, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: isDone ? 0.5 : isSpinning ? 0.07 : 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={candidate.photo}
              alt={candidate.name}
              fill
              className="object-cover object-top"
              sizes="200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
              <p className="font-serif text-xs font-bold text-white leading-tight text-balance line-clamp-2">
                {candidate.name}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pulsing border when paused */}
        {isPaused && !isDone && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ boxShadow: `inset 0 0 0 2px ${borderBase}` }}
          />
        )}
      </div>

      {/* Name below card shown when paused or done */}
      <AnimatePresence>
        {(isPaused || isDone) && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="font-serif text-xs font-semibold tracking-wide text-balance text-center max-w-[160px]"
            style={{ color: borderBase }}
          >
            {candidate.name}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
