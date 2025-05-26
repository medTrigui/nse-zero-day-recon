# NSE Zero-Day Recon

This repo is a *working lab + script skeleton* for writing Nmap NSE probes
against CrushFTP Authentication-Bypass (CVE-2025-31161).

| Path | What it contains |
|------|------------------|
| `docker/` | Reproducible vulnerable CrushFTP 10.8.3 container |
| `scripts/` | Lua NSE scripts (currently a banner fetcher) |
| `test/` | Captured banners / future regression artefacts |

## Quick start

```bash
# build & run lab
cd docker
docker-compose build
docker-compose up -d          # CrushFTP now at http://127.0.0.1:8080

# manual banner check
curl -I http://127.0.0.1:8080/WebInterface/login.html | grep Server

# run first-cut NSE script
cd ..
nmap -p8080 --script ./scripts/crushftp-banner.nse 127.0.0.1
