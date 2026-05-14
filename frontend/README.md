# Frontend Deteksi Dini Tingkat Stres

Frontend ini dibangun dengan React + Vite dan disesuaikan langsung dengan backend Express di folder `backend`.

## Fitur

- Hero premium dan responsif untuk presentasi MVP
- Form input pola tidur yang sinkron dengan `GET /meta/form`
- Submit prediksi ke `POST /predictions`
- Dashboard ringkas dari `GET /dashboard/summary`
- Riwayat prediksi dan filter tingkat stres dari `GET /predictions`
- Status koneksi backend, loading, empty state, dan error state

## Menjalankan Lokal

1. Install Node.js LTS
2. Masuk ke folder `frontend`
3. Jalankan `npm install`
4. Salin `.env.example` menjadi `.env`
5. Jalankan `npm run dev`

Base env default:

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Testing

```bash
npm test
```

## Deploy

### Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL`

### Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variable: `VITE_API_BASE_URL`

## Struktur Singkat

- `src/App.jsx`: orkestrasi page, state, dan integrasi API
- `src/components`: komponen UI utama
- `src/lib/api.js`: util networking Axios + Fetch
- `src/lib/form.js`: fallback metadata, init form, dan validasi
- `src/lib/formatters.js`: formatter tampilan dan helper visual
