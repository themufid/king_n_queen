export interface Candidate {
  id: number
  name: string
  nisn: string
  class: string
  photo: string
  category: 'king' | 'queen'
}

// ==========================
// 👑 DATA KANDIDAT
// ==========================
export const kingCandidates: Candidate[] = [
  { id: 1, name: 'Rehan Bastian', nisn: '0079380756', class: 'XII TO', photo: '/candidates/king-1.jpg', category: 'king' },
  { id: 2, name: 'Bima Arista', nisn: '0076868167', class: 'XII TO', photo: '/candidates/king-2.jpg', category: 'king' },
  { id: 3, name: 'Tio Mahardika', nisn: '0145893674', class: 'XII TO', photo: '/candidates/king-3.jpg', category: 'king' },
  { id: 4, name: 'Muhammad Mizard Ibrahim Candra Winata', nisn: '0086657998', class: 'XII DKV', photo: '/candidates/king-4.jpg', category: 'king' },
  { id: 5, name: 'Maulana Hidayat Makalegi', nisn: '0082452975', class: 'XII TJKT', photo: '/candidates/king-5.jpg', category: 'king' },
]

export const queenCandidates: Candidate[] = [
  { id: 6, name: 'Khania Fitra Mareta Anjani', nisn: '0086230966', class: 'XII TJKT', photo: '/candidates/queen-1.jpg', category: 'queen' },
  { id: 7, name: 'Asyifa Dwi Maelani', nisn: '0087171928', class: 'XII TJKT', photo: '/candidates/queen-2.jpg', category: 'queen' },
  { id: 8, name: 'Lily Essence Sinulingga', nisn: '0083879382', class: 'XII DKV', photo: '/candidates/queen-3.jpg', category: 'queen' },
  { id: 9, name: 'Aziza Putri Anisa', nisn: '0075890202', class: 'XII DKV', photo: '/candidates/queen-4.jpg', category: 'queen' },
]

export const allCandidates = [...kingCandidates, ...queenCandidates]

// ==========================
// 🎰 WEIGHTED (SPIN EFFECT)
// ==========================
export const weightedKingCandidates: Candidate[] = [
  kingCandidates[0], kingCandidates[0], kingCandidates[0],
  kingCandidates[1], kingCandidates[1],
  kingCandidates[2],
  kingCandidates[3],
  kingCandidates[4], kingCandidates[4],
]

export const weightedQueenCandidates: Candidate[] = [
  queenCandidates[0],
  queenCandidates[1],
  queenCandidates[2],
  queenCandidates[3],
]

// ==========================
// 🏆 PEMENANG
// ==========================
export const PREDETERMINED_WINNER_KING_ID = 1
export const PREDETERMINED_WINNER_QUEEN_ID = 8

// ==========================
// 📊 VOTING DATA (FIX UTAMA)
// ==========================
export interface VotingResult extends Candidate {
  votes: number
}

export const generateVotingData = (): VotingResult[] => {
  return allCandidates.map((c) => ({
    ...c,
    votes: Math.floor(Math.random() * 500) + 100,
  }))
}