HMD Service - replacement package

Files to upload to the ROOT of souk-hmd repository:
- index.html
- style.css
- app.js
- manifest.json
- sw.js

Before using the service form:
1) Open Supabase SQL Editor.
2) Run supabase_hmd_service.sql.
3) Make sure Supabase Auth Email sign-up is enabled.
4) Push the files to GitHub Pages.

This first version is intentionally independent of the old ads table: it creates a new businesses table and keeps the old project data untouched.

Important: the browser uses only the Supabase publishable/anon key. Never put a service_role/secret key in app.js.
