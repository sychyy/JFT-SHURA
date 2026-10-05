# JFT-Basic Practice — Modular Build

Basis: versi `JFT-Basic-Practice-admin-global-chat-10-fixed.html`, karena versi ini mempertahankan logika leaderboard yang sebelumnya sudah dikonfirmasi benar.

## Modul baru
- `js/modules/image-question.js` — dukungan soal bergambar.
- `js/modules/ai-image-generator.js` — integrasi generator gambar Omegatech tanpa API key.
- `js/modules/deploy-module.js` — Deploy Center ringan di area admin + helper perintah deploy.
- `data/question-bank.js` — bank soal dipisahkan dari logika aplikasi.
- `IMAGE_QUESTION_PROMPTS.md` — 10 prompt gambar AI untuk soal 491–500.

## Penempatan soal bergambar
Soal baru ditempatkan di `vocab` / **文字と語彙**, kategori `word-meaning`, karena pola sampel resmi JFT-Basic memang menunjukkan format “Look at the illustration and choose the correct word” pada bagian tersebut.

## API gambar
Endpoint yang digunakan oleh modul:
`https://api.omegatech.app/api/ai/easemate-image?action=generate&prompt=...&aspectRatio=1:1&quality=1K&fileType=jpg`

Hasil endpoint berupa JSON dan URL gambar bertanda tangan/bertenggat. Modul menyimpan URL sementara di browser. Untuk produksi, lebih aman menyimpan hasil gambar sebagai aset lokal di `assets/questions/`.

## Jalankan lokal
```bash
python -m http.server 8080
```
Lalu buka `http://localhost:8080/`.

## Deploy
### Cloudflare Pages
```bash
npx wrangler pages deploy . --project-name jft-basic-practice
```

### GitHub Pages
Commit dan push ke branch `main`; workflow `deploy/github/deploy-pages.yml` akan melakukan deploy.
