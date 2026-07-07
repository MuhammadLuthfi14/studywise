# Backend StudyWise

Backend FastAPI untuk StudyWise. Aplikasi ini menyimpan basis pengetahuan di SQLite dan menjalankan mesin inferensi Forward Chaining + Certainty Factor di Python.

## Menjalankan Backend

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8010 --reload
```

Saat aplikasi pertama kali berjalan, SQLite akan dibuat dan data awal akan di-seed otomatis.

## Environment

Salin `backend/.env.example` menjadi `backend/.env` untuk lokal. Jangan commit `.env` atau file SQLite (`*.db`).

Untuk Render, gunakan konfigurasi berikut:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Persistent disk: mount path `/var/data`
- `DATABASE_URL=sqlite:////var/data/studywise.db`
- `SECRET_KEY`: secret kuat dari dashboard Render
- `CORS_ORIGINS`: URL Vercel final dan localhost yang dibutuhkan

## Akun Seed

- Admin: `admin@studywise.ac.id`
- Mahasiswa: `mahasiswa@studywise.ac.id`
- Password default: `studywise123`
