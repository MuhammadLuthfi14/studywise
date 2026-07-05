# Backend StudyWise

Backend FastAPI untuk StudyWise. Aplikasi ini menyimpan basis pengetahuan di SQLite dan menjalankan mesin inferensi Forward Chaining + Certainty Factor di Python.

## Menjalankan Backend

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

Saat aplikasi pertama kali berjalan, SQLite akan dibuat dan data awal akan di-seed otomatis.

## Akun Seed

- Admin: `admin@studywise.ac.id`
- Mahasiswa: `mahasiswa@studywise.ac.id`
- Password default: `studywise123`
