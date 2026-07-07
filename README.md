# StudyWise: Sistem Pakar Rekomendasi Strategi Belajar Mahasiswa Menggunakan Metode Forward Chaining dan Certainty Factor

## Identitas Proyek

- Kelompok: Kelompok 2
- Kampus: Politeknik Negeri Padang
- Jurusan: Teknologi Informasi
- Program Studi: D4 Teknologi Rekayasa Perangkat Lunak
- Kelas: 2D
- Dosen Pengampu: Dwiny Meidelfi, S.Kom., M.Cs.
- Tahun: 2026

| No | Nama | NIM |
| --- | --- | --- |
| 1 | Ahmad Ridho Hadaffi | 2411082036 |
| 2 | Salwa Febriani | 2411083020 |
| 3 | Muhammad Gibran Pangestu | 2411083021 |
| 4 | Muhammad Luthfi | 2411083023 |

## Deskripsi

StudyWise adalah sistem pakar berbasis web untuk merekomendasikan strategi belajar mahasiswa berdasarkan kondisi belajar yang dipilih pengguna. Otak AI berada di backend Python dan memakai Forward Chaining serta Certainty Factor, bukan machine learning.

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite, Pydantic, JWT, bcrypt
- AI: Python pure logic untuk Forward Chaining + Certainty Factor
- Frontend: React 18, TypeScript, Vite 6, Tailwind CSS, shadcn/ui

## Menjalankan Backend

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8010 --reload
```

Backend berjalan di `http://127.0.0.1:8010`. Saat pertama boot, database SQLite dan seed data dibuat otomatis.

## Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173` dan membaca API backend dari `VITE_API_URL`.

## Environment

Salin contoh env sesuai kebutuhan:

- `backend/.env.example`
- `frontend/.env.example`

Jangan commit file `.env` atau database SQLite (`*.db`) ke repo public.

## Deploy

### Backend Render

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Persistent disk: mount path `/var/data`
- `SECRET_KEY=<secret-kuat-baru>`
- `DATABASE_URL=sqlite:////var/data/studywise.db`
- `CORS_ORIGINS=https://<url-vercel-final>,http://localhost:5173`

File `render.yaml` tersedia sebagai blueprint awal. Setelah URL Vercel final tersedia, update `CORS_ORIGINS` di Render lalu redeploy backend.

### Frontend Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://<url-backend-render>`

`frontend/vercel.json` sudah berisi SPA rewrite agar refresh deep route seperti `/app/konsultasi` dan `/admin/basis-pengetahuan` tidak 404.

## Akun Demo

- Admin: `admin@studywise.ac.id`
- Mahasiswa: `mahasiswa@studywise.ac.id`
- Password default: `studywise123`
