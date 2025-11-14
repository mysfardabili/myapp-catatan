Bash

git clone <URL_REPOSITORI>

Menjalankan Proyek Anda (dari DEVELOPMENT.md)

1.	Prasyarat

Sebelum memulai, Anda perlu menginstal beberapa hal:
1.	Encore CLI:

- macOS: brew install encoredev/tap/encore
- Linux: curl -L https://encore.dev/install.sh | bash
- indows: iwr https://encore.dev/install.ps1 | iex
2. Bun: Anda juga perlu menginstal bun untuk manajemen paket. Jika belum, jalankan: npm install -g bun
3. Menjalankan Aplikasi
Pengaturan Backend
1.	Masuk ke direktori backend:

cd backend
2.	Mulai server pengembangan Encore:

encore run

Backend akan tersedia di URL yang ditampilkan di terminal Anda (biasanya http://localhost:4000).
Pengaturan Frontend

3. Masuk ke direktori frontend:

cd frontend

4. Instal dependensi:

npm install

5. Mulai server pengembangan:

npx vite dev

Frontend akan tersedia di http://localhost:5173 (atau port berikutnya yang tersedia).

