Bash
git clone <URL_REPOSITORI>
Menjalankan Proyek Anda (dari DEVELOPMENT.md)
Namun, sepertinya Anda sudah memiliki file-file untuk proyek ini (karena Anda telah mengunggahnya). Jika Anda ingin tahu cara menjalankannya secara lokal, berikut adalah instruksi yang saya temukan di file DEVELOPMENT.md Anda.
1.	Prasyarat
Sebelum memulai, Anda perlu menginstal beberapa hal:
1.	Encore CLI:
o	macOS: brew install encoredev/tap/encore
o	Linux: curl -L https://encore.dev/install.sh | bash
o	Windows: iwr https://encore.dev/install.ps1 | iex
2.	Bun:
o	Anda juga perlu menginstal bun untuk manajemen paket. Jika belum, jalankan: npm install -g bun
2.	Menjalankan Aplikasi
Pengaturan Backend
1.	Masuk ke direktori backend:
Bash
cd backend
2.	Mulai server pengembangan Encore:
Bash
encore run
Backend akan tersedia di URL yang ditampilkan di terminal Anda (biasanya http://localhost:4000).
Pengaturan Frontend
3.	Masuk ke direktori frontend:
Bash
cd frontend
4.	Instal dependensi:
Bash
npm install
5.	Mulai server pengembangan:
Bash
npx vite dev
Frontend akan tersedia di http://localhost:5173 (atau port berikutnya yang tersedia).

