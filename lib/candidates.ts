export interface Candidate {
  id: number
  name: string
  nisn: string
  class: string
  photo: string
  category: 'king' | 'queen'
}

export const kingCandidates: Candidate[] = [
  {
    id: 1,
    name: 'Rehan Bastian',
    nisn: '0079380756',
    class: 'XII TO',
    photo: '/candidates/king-1.jpg',
    category: 'king',
  },
  {
    id: 2,
    name: 'Bima Arista',
    nisn: '0076868167',
    class: 'XII TO',
    photo: '/candidates/king-2.jpg',
    category: 'king',
  },
  {
    id: 3,
    name: 'Tio Mahardika',
    nisn: '0145893674',
    class: 'XII TO',
    photo: '/candidates/king-3.jpg',
    category: 'king',
  },
  {
    id: 4,
    name: 'Muhammad Mizard Ibrahim Candra Winata',
    nisn: '0086657998',
    class: 'XII DKV',
    photo: '/candidates/king-4.jpg',
    category: 'king',
  },
  {
    id: 5,
    name: 'Maulana Hidayat Makalegi',
    nisn: '0082452975',
    class: 'XII TJKT',
    photo: '/candidates/king-5.jpg',
    category: 'king',
  },
]

export const queenCandidates: Candidate[] = [
  {
    id: 6,
    name: 'Khania Fitra Mareta Anjani',
    nisn: '0086230966',
    class: 'XII TJKT',
    photo: '/candidates/queen-1.jpg',
    category: 'queen',
  },
  {
    id: 7,
    name: 'Asyifa Dwi Maelani',
    nisn: '0087171928',
    class: 'XII TJKT',
    photo: '/candidates/queen-2.jpg',
    category: 'queen',
  },
  {
    id: 8,
    name: 'Lily Essence Sinulingga',
    nisn: '0083879382',
    class: 'XII DKV',
    photo: '/candidates/queen-3.jpg',
    category: 'queen',
  },
  {
    id: 9,
    name: 'Aziza Putri Anisa',
    nisn: '0075890202',
    class: 'XII DKV',
    photo: '/candidates/queen-4.jpg',
    category: 'queen',
  },
]

export const allCandidates = [...kingCandidates, ...queenCandidates]

// ─────────────────────────────────────────────────────────────────────────────
// WEIGHTED CANDIDATE POOL — untuk efek spinning yang lebih dramatis
// Kandidat dengan bobot lebih tinggi muncul lebih sering
//
// King weights:
//   Rehan Bastian (id 1) — 3x (paling sering)
//   Bima Arista (id 2) — 2x
//   Maulana Hidayat (id 5) — 2x
//   Tio Mahardika (id 3) — 1x
//   Muhammad Mizard (id 4) — 1x
//
// ─────────────────────────────────────────────────────────────────────────────

export const weightedKingCandidates: Candidate[] = [
  kingCandidates[0], // Rehan 1
  kingCandidates[0], // Rehan 2
  kingCandidates[0], // Rehan 3
  kingCandidates[1], // Bima 1
  kingCandidates[1], // Bima 2
  kingCandidates[2], // Tio
  kingCandidates[3], // Mizard
  kingCandidates[4], // Maulana 1
  kingCandidates[4], // Maulana 2
]

export const weightedQueenCandidates: Candidate[] = [
  queenCandidates[0], // Khania
  queenCandidates[1], // Asyifa
  queenCandidates[2], // Lily
  queenCandidates[3], // Aziza
]

// ─────────────────────────────────────────────────────────────────────────────
// KONFIGURASI PEMENANG — Admin tentukan di sini sebelum acara
//
// Ubah ID di bawah sesuai kandidat yang menang:
//
//   King candidates:
//     id 1 = Rehan Bastian           (XII TO)
//     id 2 = Bima Arista             (XII TO)
//     id 3 = Tio Mahardika           (XII TO)
//     id 4 = Muhammad Mizard Ibrahim Candra Winata (XII DKV)
//     id 5 = Maulana Hidayat Makalegi (XII TJKT)  ← PEMENANG
//
//   Queen candidates:
//     id 6 = Khania Fitra Mareta Anjani (XII TJKT)
//     id 7 = Asyifa Dwi Maelani         (XII TJKT)
//     id 8 = Lily Essence Sinulingga    (XII DKV)  ← PEMENANG
//     id 9 = Aziza Putri Anisa          (XII DKV)
//
// Ganti angka di bawah, lalu deploy ulang sebelum acara dimulai.
// ─────────────────────────────────────────────────────────────────────────────

export const PREDETERMINED_WINNER_KING_ID = 1   // Rehan Bastian
export const PREDETERMINED_WINNER_QUEEN_ID = 6  // Khania Fitra Mareta Anjani
