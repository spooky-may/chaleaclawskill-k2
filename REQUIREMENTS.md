# ELSA — Upgrade Roadmap Summary

**Project:** elsamultiskillagent (elsamultiskillagent.site)  
**Stack:** React + Vite + TypeScript + Supabase + Radix UI + ECharts  
**Scope:** 7 core upgrades + 2 optional infra

---

## Tier 1 — High Impact (Prioritas Utama)

### 1. Semantic / Vector Search
**Apa:** Ganti keyword search dengan search berbasis intent. User ketik "automate my slack" → sistem mengerti maksud dan menemukan skill yang relevan meskipun kata-katanya tidak match persis.

**Kenapa penting:** Ini adalah gap terbesar antara ELSA dan kompetitor seperti awesome-openclaw-skills yang masih pakai text search biasa.

**Cara implementasi:**
- Aktifkan ekstensi `pgvector` di Supabase (tersedia gratis)
- Generate embedding untuk setiap skill description menggunakan OpenAI `text-embedding-3-small`
- Simpan embedding di kolom baru di tabel skills
- Saat user search, convert query ke embedding lalu jalankan similarity search via Supabase

**Effort:** Medium — 3–5 hari developer

---

### 2. Skill Preview Pane
**Apa:** Render isi `SKILL.md` langsung di website dengan syntax highlighting. User bisa baca instruksi lengkap, frontmatter (requirements, env vars), dan contoh usage — tanpa harus pergi ke GitHub.

**Kenapa penting:** Saat ini user harus buka GitHub untuk tahu apa yang dilakukan skill. Friction ini menyebabkan drop-off. Ini seperti membaca README sebelum `npm install`.

**Cara implementasi:**
- Simpan raw content SKILL.md di Supabase saat sync
- Gunakan library `react-markdown` + `rehype-highlight` untuk render
- Tampilkan di drawer/modal saat user klik skill card
- Parse frontmatter YAML untuk tampilkan requirements secara terstruktur

**Effort:** Low-medium — 2–3 hari developer

---

### 3. One-Click Install Command
**Apa:** Tombol copy di setiap skill card yang langsung generate perintah `clawhub install <slug>`. User tidak perlu mengetik manual.

**Kenapa penting:** Fitur paling praktis yang bisa langsung dirasakan user. Ini adalah "call to action" utama dari sebuah skill directory.

**Cara implementasi:**
- Tambahkan tombol copy di setiap skill card menggunakan `navigator.clipboard.writeText()`
- Generate command: `clawhub install {slug}`
- Untuk bundle (beberapa skill): `clawhub install slug1 slug2 slug3`
- Tampilkan toast confirmation setelah copy (Sonner sudah ada di package.json)

**Effort:** Low — < 1 hari developer

---

### 4. Security Scan Badges
**Apa:** Tampilkan status keamanan setiap skill langsung di card: ✓ Clean / ⚠ Review / ✗ Flagged. Data diambil dari ClawHub (VirusTotal + ClawScan).

**Kenapa penting:** Komunitas OpenClaw sangat concern soal skill berbahaya — sudah ada beberapa skill malicious di ClawHub. Trust signal ini adalah diferensiator yang kuat dan langsung visible.

**Cara implementasi:**
- Fetch security status dari ClawHub API saat sync data skill
- Simpan field `security_status` dan `last_scanned_at` di Supabase
- Render badge di skill card dengan 3 state: clean (green), review (amber), flagged (red)
- Update via cron job Supabase Edge Function setiap 24 jam

**Effort:** Medium — 2–3 hari developer

---

## Tier 2 — UX Upgrade

### 5. Requirements Display
**Apa:** Tampilkan dependency setiap skill secara jelas: env vars yang dibutuhkan, binary yang harus ada di PATH (curl, git, docker), dan OS constraint. Diambil dari frontmatter SKILL.md.

**Kenapa penting:** Sumber utama frustrasi user adalah install skill tapi langsung gagal karena kurang setup. Menampilkan requirements sebelum install drastis mengurangi confusion.

**Cara implementasi:**
- Parse frontmatter YAML dari SKILL.md: field `requires.env`, `requires.bins`, `requires.os`
- Simpan sebagai JSON di kolom `requirements` di Supabase
- Render sebagai checklist di skill detail panel
- Bisa tambahkan "copy env setup" button untuk generate `.env` template

**Effort:** Low — 1–2 hari developer

---

### 6. Bundle Builder / Loadout
**Apa:** User pilih beberapa skill → sistem generate satu install script sekaligus. Loadout bisa disimpan dan diberi nama (contoh: "Morning Automation Stack").

**Kenapa penting:** Power user sering butuh kombinasi skill, bukan satu-satu. Ini fitur yang membuat ELSA terasa seperti tools, bukan sekadar directory.

**Cara implementasi:**
- Tambahkan state "selected skills" di React (multi-select dari card)
- Floating bar muncul di bawah saat ada skill terpilih
- Generate command: `clawhub install slug1 slug2 slug3`
- Untuk save loadout: buat tabel `loadouts` di Supabase (butuh user login — auth sudah ada)
- Share loadout via URL: `/loadout?skills=slug1,slug2,slug3`

**Effort:** Medium — 3–4 hari developer

---

## Tier 3 — Diferensiasi

### 7. Community Ratings + Reviews
**Apa:** User yang sudah login bisa memberi rating (1–5 bintang) dan menulis review singkat untuk setiap skill. Rata-rata rating tampil di card.

**Kenapa penting:** Ini adalah diferensiator terkuat dari semua awesome-list dan direktori static yang ada. ClawHub sendiri belum punya review system yang bagus di website. User bisa tahu skill mana yang benar-benar berguna vs yang hanya terlihat bagus di deskripsi.

**Cara implementasi:**
- Buat tabel `reviews` di Supabase: `(user_id, skill_slug, rating, review_text, created_at)`
- Row-level security: user hanya bisa edit/hapus review milik sendiri
- Aggregate rating via Supabase view atau materialized column
- UI: star rating component di skill detail panel (Radix UI tidak punya ini — pakai library sederhana atau buat sendiri)
- Moderasi: flag system untuk review yang tidak pantas

**Effort:** Medium — 3–5 hari developer

---

## Tier 4 — Infrastruktur (Optional)

### 8. Live ClawHub API Sync *(optional)*
**Apa:** Auto-sync data skill dari ClawHub registry secara berkala, sehingga direktori ELSA selalu up-to-date tanpa update manual. Saat ini data 1.700 skill vs 13.700+ di ClawHub.

**Cara implementasi:**
- Buat Supabase Edge Function yang memanggil ClawHub API
- Jadwalkan via Supabase Cron setiap 6–24 jam
- Upsert data ke tabel skills berdasarkan slug (add new, update changed, flag removed)
- Simpan `last_synced_at` untuk monitoring

**Effort:** Medium — 3–4 hari developer  
**Catatan:** Perlu akses ClawHub API. Cek rate limits dan terms of use terlebih dahulu.

---

### 9. Submit Your Own Skill Flow *(optional)*
**Apa:** Form untuk developer submit skill baru ke direktori ELSA. Skill masuk ke moderation queue sebelum ditampilkan secara publik.

**Cara implementasi:**
- Form: nama skill, slug, GitHub URL, description, category
- Data masuk ke tabel `skill_submissions` dengan status `pending`
- Admin dashboard sederhana untuk approve/reject (bisa pakai Supabase Studio)
- CONTRIBUTING.md sudah ada — tinggal buat UI frontend-nya

**Effort:** Medium — 2–3 hari developer

---

## Ringkasan Prioritas

| # | Fitur | Tier | Effort | Impact |
|---|-------|------|--------|--------|
| 1 | One-click install command | 1 | < 1 hari | Langsung terasa |
| 2 | Security scan badges | 1 | 2–3 hari | Trust signal kuat |
| 3 | Skill preview pane | 1 | 2–3 hari | Kurangi drop-off |
| 4 | Requirements display | 2 | 1–2 hari | Kurangi frustrasi |
| 5 | Semantic / vector search | 1 | 3–5 hari | Diferensiasi utama |
| 6 | Bundle builder / loadout | 2 | 3–4 hari | Power user feature |
| 7 | Community ratings + reviews | 3 | 3–5 hari | Diferensiasi terkuat |
| 8 | Live ClawHub API sync | 4 | 3–4 hari | *(optional)* |
| 9 | Submit skill flow | 4 | 2–3 hari | *(optional)* |

**Total estimasi (core, #1–7):** ~18–25 hari developer  
**Total estimasi (dengan optional):** ~23–32 hari developer
