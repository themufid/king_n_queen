'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Candidate } from '@/lib/candidates'

interface CandidateCardProps {
  candidate: Candidate
  index?: number
}

export default function CandidateCard({ candidate, index = 0 }: CandidateCardProps) {
  const isKing = candidate.category === 'king'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.04, y: -5 }}
      className="relative group cursor-default rounded-2xl overflow-hidden border border-[var(--border)] transition-all duration-300"
      style={{ background: 'oklch(0.11 0.01 280)' }}
    >
      {/* Photo */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={candidate.photo}
          alt={`Foto ${candidate.name}`}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Category badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-serif font-semibold tracking-widest ${
            isKing
              ? 'bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40'
              : 'bg-[var(--purple)]/20 text-[var(--purple-bright)] border border-[var(--purple-bright)]/40'
          }`}
        >
          {isKing ? 'KING' : 'QUEEN'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3
          className={`font-serif font-bold text-sm leading-tight text-balance ${
            isKing ? 'text-[var(--gold-bright)]' : 'text-[var(--purple-bright)]'
          }`}
        >
          {candidate.name}
        </h3>
        <p className="text-muted-foreground text-xs font-sans">
          NISN: <span className="text-foreground/80">{candidate.nisn}</span>
        </p>
        <p className="text-muted-foreground text-xs font-sans">
          Kelas: <span className="text-foreground/80">{candidate.class}</span>
        </p>
      </div>

      {/* Hover glow ring */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl ${
          isKing
            ? 'ring-1 ring-[var(--gold)]/50'
            : 'ring-1 ring-[var(--purple-bright)]/50'
        }`}
      />
    </motion.div>
  )
}
