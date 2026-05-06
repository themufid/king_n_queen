'use client'

import Image from 'next/image'

export default function DataPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-black text-center mb-2">
        HASIL VOTING RESMI
      </h1>

      <p className="text-center text-yellow-400 font-bold mb-10">
        KING & QUEEN 2025 / 2026  
        <br />
        SMK YADIKA BANDAR LAMPUNG
      </p>

      {/* RESULT IMAGES */}
      <div className="flex flex-col gap-10 w-full max-w-6xl">

        {/* KING RESULT */}
        <div className="w-full">
          <p className="text-yellow-400 text-center font-bold mb-3 tracking-widest">
            HASIL KING
          </p>

          <div className="relative w-full h-[400px] md:h-[550px] rounded-xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_40px_gold]">
            <Image
              src="/results/king.png"
              alt="Hasil King"
              fill
              priority
              className="object-contain bg-black"
              sizes="100vw"
            />
          </div>
        </div>

        {/* QUEEN RESULT */}
        <div className="w-full">
          <p className="text-purple-400 text-center font-bold mb-3 tracking-widest">
            HASIL QUEEN
          </p>

          <div className="relative w-full h-[400px] md:h-[550px] rounded-xl overflow-hidden border-4 border-purple-500 shadow-[0_0_40px_purple]">
            <Image
              src="/results/queen.png"
              alt="Hasil Queen"
              fill
              priority
              className="object-contain bg-black"
              sizes="100vw"
            />
          </div>
        </div>

      </div>

    </div>
  )
}