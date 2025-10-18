# Hot CLI:
- python manage.py start all --dev  # run -> backend, frontend, db, pgadmin โหมด dev
- 🌟python manage.py start all --install --migrate --dev    # install dependency ของ frontend และ backend, run -> backend, frontend, db, ทำ migration ให้ database, pgadmin โหมด dev
- python manage.py generate-api     # Generate api from backend

# Migration:
- python manage.py generate-migration     # Generate migration to db if schema changed, with random migration file name
- 🌟python manage.py generate-migration --name [MIGRATION_NAME]     # With specific name


# คำสั่งพื้นฐาน:
- เริ่มทุกอย่าง (backend, frontend, db, pgadmin):
  - python manage.py start all --dev
  - python manage.py start all --dev --install    # Install Dependency ของ frontend และ backend
- เริ่ม Backend:
  - python manage.py start backend --dev          # Dev mode
  - python manage.py start backend                # Production mode
- เริ่ม Frontend:
  - python manage.py start frontend --dev         # Dev mode
  - python manage.py start frontend               # Production mode
- เริ่ม Docker:
  - python manage.py start docker                 # เริ่มทุก services
  - python manage.py start docker --build         # Build + เริ่ม
  - python manage.py start docker --service db    # เริ่มแค่ db
- หยุด Docker:
  - python manage.py stop docker                  # หยุดทั้งหมด
  - python manage.py stop docker --service db     # หยุดแค่ db
- ดู Logs:
  - python manage.py logs docker                  # ดู logs ทั้งหมด
  - python manage.py logs docker --follow         # Real-time logs
  - python manage.py logs docker --service api    # ดูแค่ api logs
- ติดตั้ง Dependencies:
  - python manage.py install backend
  - python manage.py install frontend
  - python manage.py install all
- Generate API Client:
  - python manage.py generate-api
- ดู Help:
  - python manage.py --help
  - python manage.py start --help