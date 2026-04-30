# Fitur Baru - King & Queen 2026 🎉

## 1. Suara Tick Tik Tik saat Pencarian Kandidat 🔊

Ketika proses pengungkapan pemenang dimulai, Anda akan mendengar suara "tik tik tik" yang terus-menerus. Suara ini tercipta dari Web Audio API dan otomatis menyesuaikan dengan kecepatan spinning.

**Kapan digunakan:**
- Fase "burst" (3 detik awal): Suara cepat
- Fase "suspense": Suara dengan pola pause-spin
- Fase "slowdown": Suara melambat seiring kandidat mendekati posisi akhir

**Fitur:**
- Suara sintetis otomatis (tidak perlu file audio terpisah)
- Bekerja di semua browser modern
- Dapat diatur volume dari pengaturan browser

---

## 2. Musik Kemenangan saat Pemenang Diumumkan 🎵

Saat pemenang ditentukan, musik perayaan akan otomatis diputar! Melody yang indah akan terdengar 2 kali:
1. Ketika fase "done" dimulai di RevealScreen
2. Ketika halaman WinnerDisplay ditampilkan

**Melody Perayaan:**
- C5 → E5 → G5 → C6 (naik)
- Harmonis dan celebratory
- Durasi: ~1.5 detik

---

## 3. Distribusi Kandidat yang Dramatis 🎰

Kandidat tidak muncul dengan kesempatan yang sama! Kami mengatur bobot sehingga beberapa kandidat muncul lebih sering selama spinning:

### King Candidates:
```
Rehan Bastian       ███ (3 kali dari 9) = 33%
Bima Arista         ██  (2 kali dari 9) = 22%
Maulana Hidayat     ██  (2 kali dari 9) = 22%
Tio Mahardika       █   (1 kali dari 9) = 11%
Muhammad Mizard     █   (1 kali dari 9) = 11%
```

**Keuntungan:**
- Kandidat favorit muncul lebih sering = lebih dramatis
- Menciptakan suspense yang lebih baik
- Tetap random pada akhirnya (pemenang sudah ditentukan di awal)

---

## 4. Dark Mode / Tema Warna 🎨

Di sudut kanan atas halaman, ada tombol untuk mengubah tema:

### Opsi Tema:

**◼ Dark Mode (Gelap)**
- Background: Pure Black
- Warna teks: Gold & White
- Cocok untuk: Ruangan gelap, malam hari
- Default theme

**◻ Light Mode (Terang)**
- Background: Gradient putih → ungu terang → gold terang
- Warna teks: Dark purple & black
- Cocok untuk: Ruangan terang, siang hari

**◐ Gradient Mode (Gradiasi Gelap)**
- Background: Gradient dark purple → black → dark gold
- Warna teks: Gold & white
- Cocok untuk: Efek sinematik, tema glamor

### Cara Menggunakan:
1. Klik tombol tema di sudut kanan atas
2. Pilih tema yang diinginkan (◼, ◻, atau ◐)
3. Tema akan berubah instantly
4. Pilihan Anda disimpan otomatis

**Fitur Bonus:**
- Tema tersimpan di browser (tidak perlu setting ulang)
- Smooth transition antara tema
- Semua warna terjamin visible di semua tema
- Tidak ada text color clashing dengan background

---

## 5. Harmoni Warna yang Sempurna 🌈

Kami telah menyempurnakan palet warna untuk memastikan:

✅ **Contrast yang Baik**
- Text selalu mudah dibaca
- Tidak ada warna yang bertabrakan
- Accessible untuk semua orang

✅ **Brand Colors**
- Gold (King): oklch(0.78 0.18 80) - Bright & Royal
- Purple (Queen): oklch(0.55 0.2 300) - Elegant & Mystical
- White untuk clarity
- Dark backgrounds untuk drama

✅ **Gradient yang Harmonis**
- Menggunakan analogous colors (warna yang berdekatan di color wheel)
- Tidak menggunakan complementary yang berbenturan
- Smooth transitions antar warna

---

## Demo Penggunaan

### Skenario 1: Acara Malam di Aula Gelap
```
1. Mulai dengan tema default (Dark)
2. Tekan "Ungkap Pemenang"
3. Dengarkan suara tik tik tik... 🔊
4. Tunggu musik kemenangan ♫
5. Lihat pemenang dengan spotlight effect
```

### Skenario 2: Live Stream / Broadcasting
```
1. Ubah ke Gradient Mode (◐) untuk efek sinematik
2. Pencahayaan akan terlihat lebih dramatis
3. Gold & purple colors pop di camera
4. Audio akan terdengar jelas di microphone
```

### Skenario 3: Outdoor / Siang Hari
```
1. Ubah ke Light Mode (◻)
2. Background terang tapi tetap elegant
3. Text tetap mudah dibaca di cahaya matahari
4. Gold accents tetap berkilau
```

---

## Technical Notes

### Suara Sintetis
- Menggunakan Web Audio API oscillator
- CPU-efficient (tidak perlu decode file)
- Works offline (tidak perlu internet)
- Cross-browser compatible

### Theme System
- CSS-based (fast & efficient)
- LocalStorage untuk persistence
- No page reload needed
- Instant theme switch

### Candidate Weighting
- Array: weightedKingCandidates
- Simple but effective
- Bisa diubah di `lib/candidates.ts`
- Tidak mempengaruhi logi pemenang

---

## Troubleshooting

### Suara tidak terdengar?
- Periksa volume browser
- Pastikan speaker/headphone connected
- Reload page
- Coba browser lain (Chrome lebih baik untuk Web Audio API)

### Tema tidak tersimpan?
- Periksa localStorage di developer tools
- Clear browser cache
- Coba incognito/private mode

### Kandidat tertentu tidak muncul?
- Itu normal! Beberapa kandidat memang jarang muncul saat spinning
- Yang penting adalah pemenang sudah ditentukan di awal
- Hasil selalu konsisten dengan setting `PREDETERMINED_WINNER_*`

---

## Customization Guide

### Mengubah Distribusi Kandidat
Edit `lib/candidates.ts`:
```typescript
export const weightedKingCandidates: Candidate[] = [
  kingCandidates[0], // Tambah lebih banyak untuk increase frequency
  kingCandidates[0], // Rehan 1
  kingCandidates[0], // Rehan 2
  kingCandidates[0], // Rehan 3 ← 33% muncul
  // ... dst
]
```

### Mengubah Pitch Suara
Edit `lib/sound-utils.ts`:
```typescript
export const playTickSound = () => {
  // Ubah 800 ke frequency lain (Hz)
  // 800 = tinggi sedang
  // 600 = lebih rendah
  // 1000 = lebih tinggi
  osc.frequency.setValueAtTime(800, now) // ← ubah di sini
}
```

### Menambah Warna Baru
Edit `app/globals.css`:
```css
.theme-custom {
  --background: oklch(0.12 0.02 295);  /* Your custom color */
  --foreground: oklch(0.96 0 0);
}
```

Kemudian tambahkan di `components/ThemeToggle.tsx`:
```typescript
(['dark', 'light', 'gradient', 'custom'] as const)
```

---

## File yang Berubah

- **lib/sound-utils.ts** (baru) - Audio synthesis functions
- **components/ThemeToggle.tsx** (baru) - Theme selector UI
- **lib/candidates.ts** (edit) - Weighted candidate pools
- **components/RevealScreen.tsx** (edit) - Sound integration
- **components/WinnerDisplay.tsx** (edit) - Victory music
- **app/page.tsx** (edit) - Added theme toggle
- **app/layout.tsx** (edit) - Theme initialization
- **app/globals.css** (edit) - Theme styles

Semuanya commit dengan pesan: "Add sound effects, weighted candidates, and dark mode"

---

**Semoga acara King & Queen 2026 Anda spektakuler! 🏆✨**
