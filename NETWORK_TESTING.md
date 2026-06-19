# Prosedur Akses Jaringan Pengujian

Panduan ini mengikuti PRD V3 §4 untuk menguji chat real-time antara komputer developer dan
rekan penguji di perangkat/jaringan berbeda.

## 4.1 Prasyarat sisi klien

Kode socket di `views/chat.html` sudah memakai koneksi dinamis:

```js
const socket = io();
```

Tidak ada `io("http://localhost:3000")` yang hardcoded di mana pun di codebase, sehingga
browser rekan penguji akan otomatis terhubung ke origin yang sama dengan URL yang mereka buka
(IP lokal atau URL tunnel), bukan ke `localhost` milik mereka sendiri.

Server juga sudah listen di `0.0.0.0` (`server.js`), bukan `127.0.0.1`, sehingga bisa diakses dari
perangkat lain di jaringan yang sama.

## 4.2 Skenario A — Wi-Fi/LAN yang sama

1. Jalankan server: `npm run dev`
2. Di terminal baru, cek IP lokal:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
3. Cari **IPv4 Address** pada adapter Wi-Fi (contoh: `192.168.1.15`).
4. Bagikan ke rekan penguji: `http://192.168.1.15:3000`

Pastikan firewall Windows tidak memblokir port 3000 untuk koneksi masuk dari jaringan lokal.

## 4.3 Skenario B — Jaringan publik (tunneling)

1. Pastikan server lokal menyala di terminal pertama (`npm run dev`, port 3000).
2. Di terminal kedua, jalankan:
   ```
   npm run tunnel
   ```
   (setara dengan `npx localtunnel --port 3000`)
3. LocalTunnel akan menghasilkan URL publik, contoh: `https://beautiful-frog-12.loca.lt`
4. Bagikan URL tersebut ke rekan penguji.

Catatan: pada kunjungan pertama, LocalTunnel kadang menampilkan halaman peringatan
"Click to Continue" — rekan penguji perlu klik tombol tersebut sekali sebelum redirect ke aplikasi.
