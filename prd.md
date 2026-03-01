# PRD: Professional File Upload Portal

## 1. Project Overview

Membangun sebuah aplikasi web satu halaman (SPA) menggunakan **Vite + React** yang berfungsi sebagai antarmuka pengunggahan file. Fokus utama aplikasi ini adalah pengalaman pengguna yang bersih (clean) dan integrasi langsung ke sistem workflow melalui API.

## 2. Tech Stack & Styling

* **Framework:** Vite + React.js
* **UI Component Framework:** Untitled UI
* **Styling:** Tailwind CSS.
* **Iconography:** Lucide-react.
* **Theme Color:** * Primary: Purple (#7F56D9 atau setara "Untitled UI Purple").
* Background: Clean White (#FFFFFF / #F9FAFB).


* **Typography:** Menggunakan font Sans-serif yang modern (seperti Inter atau Montserrat) untuk kesan profesional.

## 3. Functional Requirements

### A. File Uploader Component (Untitled UI Style)

* **Drag & Drop Zone:** Area luas dengan border putus-putus (dashed border).
* **Visual Elements:** Icon cloud upload berwarna ungu di bagian tengah atas.
* **Interaction:** * Klik pada area untuk membuka file explorer.
* Mendukung fitur drag & drop file dari komputer.


* **Format:** Mendukung format gambar (.jpg, .png) dan dokumen (.pdf).

### B. File Preview & Management

* Setelah file dipilih, munculkan **File Card** di bawah area upload.
* File Card harus menampilkan: Icon tipe file, Nama file, Ukuran file (MB), dan tombol "Remove" (X).

### C. Upload Action (Workflow Integration)

* **Button:** Tombol "Upload File" yang menonjol dengan warna ungu solid.
* **Logic:** Saat diklik, kirim file menggunakan `FormData` dengan metode **POST** ke sebuah endpoint API (Workflow URL).
* **Loading State:** Tombol berubah menjadi state "Uploading..." dan *disabled* saat proses berlangsung.
* **Success State:** Berikan notifikasi atau visual feedback sederhana saat workflow memberikan respon sukses.

## 4. UI/UX Specifications

* **Clean Aesthetic:** Gunakan *whitespace* yang cukup agar aplikasi tidak terlihat penuh.
* **Professional Heading:** Judul halaman menggunakan font tebal (bold) dengan tone warna gelap/charcoal untuk kontras yang baik terhadap background putih.
* **Responsive:** Tampilan harus proporsional baik di layar desktop maupun tablet.
