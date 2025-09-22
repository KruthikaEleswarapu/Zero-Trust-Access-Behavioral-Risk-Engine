# Zero Trust Access Engine — Final Full Project (Minimal, Ready-to-run)

This bundle contains a compact, runnable Zero Trust Access Engine with:
- Backend (Node.js + Express) with MongoDB + Redis + Prometheus metrics
- Frontend (React) simple app served by nginx
- Anomaly service (Flask + IsolationForest) with a tiny training script
- Dockerfiles and docker-compose to run everything locally

Run:
1. Copy `backend/.env.example` to `backend/.env` and fill Twilio values if you want real SMS (or leave blank to use mock).
2. From project root:
   ```bash
   docker-compose up --build
   ```
3. Access frontend at http://localhost:3000, backend at http://localhost:4000, Prometheus at http://localhost:9090, Grafana at http://localhost:3001 (admin/admin).

This is a minimal, educational bundle — expand and harden before production use.
