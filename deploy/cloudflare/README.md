# Cloudflare Pages

Dari root project:

```bash
npx wrangler pages deploy . --project-name jft-basic-practice
```

Untuk CI/CD GitHub, gunakan `deploy/github/deploy-cloudflare.yml` dan simpan `CLOUDFLARE_API_TOKEN` serta `CLOUDFLARE_ACCOUNT_ID` di GitHub Actions Secrets.
