'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type ThemeMode = 'dark' | 'light' | 'gradient'

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('kingqueen-theme') as ThemeMode | null
    const initialTheme = savedTheme || 'dark'
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (mode: ThemeMode) => {
    const html = document.documentElement
    // Remove all theme classes
    html.classList.remove('theme-dark', 'theme-light', 'theme-gradient')
    // Add new theme class
    html.classList.add(`theme-${mode}`)
    
    // Force style update
    if (mode === 'dark') {
      document.documentElement.style.background = 'oklch(0.08 0 0)'
    } else if (mode === 'light') {
      document.documentElement.style.background = 'linear-gradient(135deg, oklch(0.98 0.01 0) 0%, oklch(0.95 0.02 280) 50%, oklch(0.92 0.03 85) 100%)'
    } else if (mode === 'gradient') {
      document.documentElement.style.background = 'linear-gradient(135deg, oklch(0.12 0.02 280) 0%, oklch(0.08 0 0) 50%, oklch(0.10 0.02 85) 100%)'
    }
  }

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme)
    localStorage.setItem('kingqueen-theme', newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full p-2 border border-[var(--gold)]/20">
      {(['dark', 'light', 'gradient'] as const).map((mode) => (
        <motion.button
          key={mode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleThemeChange(mode)}
          className={`px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all duration-300 uppercase tracking-wider ${
            theme === mode
              ? 'bg-[var(--gold)] text-black'
              : 'text-[var(--gold)]/60 hover:text-[var(--gold)]'
          }`}
        >
          {mode === 'dark' ? '◼' : mode === 'light' ? '◻' : '◐'}
        </motion.button>
      ))}
    </div>
  )
}
