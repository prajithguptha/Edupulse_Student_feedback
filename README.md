# EduPulse — B.Tech Student Feedback System

EduPulse supports B.Tech branches and all eight semesters, a student feedback experience, existing student analytics charts, and a protected administrator portal.

## Included functionality

- Branch catalogue: CSE, ECE, EEE, MECH, CIVIL, AI&DS, DS, AI&ML, IT and CHEM.
- Semesters 1–8, with five editable subject entries per branch/semester as starter catalogue rows.
- Student feedback form records student name, university ID, branch, semester, subject and five 1–5 ratings.
- Student dashboard keeps the existing chart types, chart colours, and overall page background palette.
- Admin sign-in at `/admin/login`.
- Admin can edit subject, lecturer name, profession/designation, branch and semester, and add new subjects.
- Admin portal lists individual feedback records and the five ratings per student, with search and branch/semester filters.
- Student-facing summary API returns aggregates only; student identities and individual submissions are available only through authenticated admin endpoints.
- PostgreSQL/Supabase storage for hosted deployments; local JSON files for local development.

**Important catalogue note:** the project creates five starter subject labels (`Subject 1` ... `Subject 5`) for every branch/semester. They are placeholders, not an official university syllabus. Sign in as admin and replace them with the actual subjects and lecturer details before collecting feedback.

## Run locally (Windows PowerShell)

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
$env:SECRET_KEY="use-a-long-random-secret"
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="set-a-strong-password"
python app.py
```

Open `http://127.0.0.1:5000`. Admin: `http://127.0.0.1:5000/admin/login`.

## Deploy with Supabase PostgreSQL

Set these environment variables in Render/Vercel:

- `DATABASE_URL`: Supabase PostgreSQL connection string.
- `SECRET_KEY`: long random secret value.
- `ADMIN_USERNAME`: admin login username.
- `ADMIN_PASSWORD`: strong unique password.

Redeploy after changing environment variables. On first run, the app creates/migrates `course_feedback_submissions` and creates `edupulse_courses`. It seeds the starter catalogue if the new catalogue table is empty. Existing feedback rows are retained; older rows will have blank student identity because those fields did not exist when they were submitted.

## Privacy and access

This version is **not anonymous**: students enter their name and student ID so the authorized admin can see who submitted each rating, as requested. Student-facing pages and `/api/summary` expose aggregate metrics only. Individual records are served from `/admin/api/data` after admin session authentication. Do not publish admin credentials, use HTTPS, and follow your institution's consent and student-data retention rules. Do not collect real student data until the institution approves the process.

## Routes

- `/` student site
- `/api/catalog` active subject catalogue
- `/api/summary` aggregated chart data
- `/api/feedback` submit feedback
- `/api/export.csv` aggregated summary export
- `/admin/login` admin sign-in
- `/admin` admin portal
- `/admin/api/data` authenticated catalogue and individual feedback data
- `/admin/api/course` authenticated subject/faculty editor
- `/health` deployment health check

## Notes

Local development stores `data/feedback.json` and `data/courses.json`. Keep these files private. The original chart rendering code and visual palette are retained.
