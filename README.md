# Real-time Chat Application 💬

Aplikasi obrolan (chat) real-time berbasis web yang dibangun menggunakan **Node.js**, **Express**, **Socket.io**, dan database **MySQL**. Aplikasi ini dirancang dengan arsitektur MVC (Model-View-Controller) yang bersih, modular, dan siap digunakan untuk pengujian jaringan lokal maupun publik.

---

## 🚀 Fitur Utama

- **Autentikasi Pengguna**: Sistem Registrasi dan Login yang aman menggunakan enkripsi password.
- **Pesan Real-time**: Komunikasi instan dua arah menggunakan Socket.io tanpa perlu me-refresh halaman.
- **Indikator Status Pengguna**: Menampilkan daftar pengguna yang sedang online, offline, serta waktu terakhir dilihat (*last seen*).
- **Indikator Mengetik (Typing Indicator)**: Mengetahui secara langsung ketika lawan bicara sedang mengetik pesan (*"typing..."*).
- **Status Pengiriman Pesan (Read Receipts)**: Pelacakan status pesan mulai dari dikirim, terkirim (*delivered*), hingga dibaca (*read*).
- **Hapus Pesan Real-time**: Pengguna dapat menghapus pesan yang dikirim dan status penghapusan akan tersinkronisasi secara instan di sisi penerima.
- **Lampiran Media (Uploads)**: Mendukung pengiriman pesan berupa gambar dan rekaman audio (voice note) yang disimpan secara dinamis di server.
- **Desain Responsif**: Antarmuka pengguna yang bersih, modern, dan nyaman diakses baik melalui desktop maupun perangkat mobile.

---

## 📂 Struktur Proyek

Proyek ini menggunakan struktur folder MVC yang terorganisir:

```text
chat-app/
├── config/             # Konfigurasi database MySQL
├── controllers/        # Logika bisnis aplikasi (Auth, User, Message, Upload, Sockets)
├── middlewares/        # Middleware Express (misal: verifikasi sesi)
├── models/             # Query ke database (User, Message)
├── public/             # File statis (CSS, JS, Asset Gambar, Uploads)
│   └── uploads/        # Direktori penyimpanan media (gambar/audio) yang diunggah
├── routes/             # Defini API dan routing halaman (Page, Auth, User, Message, dll)
├── sockets/            # Manajemen event dan koneksi Socket.io
├── views/              # Halaman antarmuka HTML (Login, Register, Chat)
├── .env.example        # Template konfigurasi environment variables
├── .gitignore          # File untuk mengecualikan folder/file tertentu dari git
├── NETWORK_TESTING.md  # Panduan pengujian jaringan (lokal & publik)
├── package.json        # Dependensi dan script NPM
└── server.js           # Entry point utama aplikasi
```

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:
1. **Node.js** (versi 16 atau lebih baru direkomendasikan)
2. **NPM** (terbawa secara otomatis saat menginstal Node.js)
3. **MySQL Server** (seperti XAMPP, Laragon, MySQL Installer, atau Docker)

---

## ⚙️ Langkah Instalasi & Konfigurasi

### 1. Klon / Unduh Proyek
Unduh repositori ini dan pastikan Anda berada di root folder proyek:
```bash
cd chat-app
```

### 2. Install Dependensi
Jalankan perintah berikut di terminal untuk menginstal semua library Node.js yang dibutuhkan:
```bash
npm install
```

### 3. Siapkan Database MySQL
1. Aktifkan modul **MySQL** pada panel kontrol database Anda (misal: XAMPP atau Laragon).
2. Masuk ke halaman pengelolaan database (seperti **phpMyAdmin** di `http://localhost/phpmyadmin`).
3. Buat database baru bernama **`chat-app`**.
4. Impor file `chat-app.sql`

### 4. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan sesuaikan kredensial koneksi database MySQL milik Anda jika berbeda:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=chat-app
PORT=3000
```

---

## 🏃 Cara Menjalankan Aplikasi

Aplikasi menyediakan dua buah mode eksekusi melalui NPM Script:

### A. Mode Development (Disarankan)
Menggunakan **Nodemon** sehingga server otomatis me-restart setiap kali Anda melakukan perubahan kode:
```bash
npm run dev
```

### B. Mode Produksi / Biasa
Menjalankan server langsung menggunakan Node.js tanpa fitur auto-restart:
```bash
npm start
```

Setelah server berhasil dijalankan, buka browser Anda dan akses aplikasi melalui tautan berikut:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Panduan Pengujian Jaringan (Network Testing)

Untuk menguji fitur real-time chat dengan perangkat lain (misalnya ponsel Anda atau rekan penguji di lokasi berbeda), silakan ikuti petunjuk berikut:

### Skenario A — Menggunakan Jaringan Wi-Fi/LAN yang Sama
1. Pastikan server lokal Anda menyala (`npm run dev`).
2. Cari IP lokal komputer Anda (IPv4 Address).
   - Di Windows (CMD/PowerShell): `ipconfig`
   - Di macOS/Linux: `ifconfig` atau `ip a`
   - Contoh IP lokal yang didapat: `192.168.1.15`
3. Akses dari browser perangkat lain yang terhubung ke Wi-Fi yang sama menggunakan alamat:
   ```text
   http://192.168.1.15:3000
   ```

### Skenario B — Menggunakan Jaringan Internet Publik (Tunneling)
Jika Anda ingin menguji aplikasi dengan rekan penguji yang berada di luar jaringan lokal Anda (jarak jauh), gunakan fitur tunneling bawaan proyek ini:
1. Pastikan server lokal Anda tetap menyala di port 3000.
2. Buka terminal baru dan jalankan perintah berikut:
   ```bash
   npm run tunnel
   ```
3. LocalTunnel akan membuat URL publik yang aman secara dinamis (contoh: `https://beautiful-frog-12.loca.lt`).
4. Bagikan URL tersebut kepada rekan penguji untuk dicoba.

---

## 🧱 Teknologi yang Digunakan

- **Backend**: Node.js, Express, Socket.io (v4)
- **Database**: MySQL (driver `mysql2`)
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript (DOM & Fetch API)
- **Media Upload**: Multer
- **Keamanan**: BcryptJS (untuk enkripsi password)
- **Development Tool**: Nodemon, LocalTunnel (untuk tunneling)
- **Environment**: Dotenv
