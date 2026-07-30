# 📝 Todo App
 
Containerized Todo Application built with **Node.js (Express)**, **MongoDB**, **Docker Compose**, and deployed on **AWS EC2**.
 
**Status:** 🟢 Live / Production Ready
**Live URL:** [http://43.204.220.31:3000](http://43.204.220.31:3000)
 
---
 
## 📌 Overview
 
This project is a full-stack Todo application featuring an Express.js REST API backend and a static frontend, backed by a MongoDB database. It is containerized using Docker & Docker Compose, and deployed to production on AWS EC2.
 
---
 
## 🏗️ Architecture
 
```
[ User / Browser Client ]
            │
            ▼ (Port 3000 - Inbound TCP Rule)
┌─────────────────────────────────────────────────────────────┐
│  AWS EC2 Host Instance (Ubuntu | Public IP: 43.204.220.31)   │
│                                                               │
│  ┌───────────────────────────┐   ┌────────────────────────┐ │
│  │ Container 1: API (Express)│──▶│ Container 2: MongoDB    │ │
│  │ Image: dikshani12/todo-app│   │ Image: mongo:latest     │ │
│  │ Internal Port: 3000       │   │ Internal Port: 27017    │ │
│  └───────────────────────────┘   └────────────────────────┘ │
│              │                              │                │
│              └────── Docker Bridge Network ─┘                │
│                              │                                │
│                    [ Volume: mongo-data ]                    │
└─────────────────────────────────────────────────────────────┘
```
 
### Key Components
- **Application Layer:** Node.js (v20) runtime serving the Express REST API (`/api/tasks`) plus the static frontend UI.
- **Database Layer:** MongoDB container maintaining data consistency via a persistent named volume (`mongo-data`).
- **Orchestration:** Multi-container setup managed through `docker-compose.yml`.
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Backend | Node.js (v20), Express.js |
| Database | MongoDB (mongoose) |
| Containerization | Docker, Docker Compose |
| Hosting | AWS EC2 (Ubuntu) |
| CI/CD | GitHub Actions + Docker Hub |
 
---
 
## 📂 Project Structure
 
```
todo-app/
├── public/              # Static frontend assets (index.html etc.)
├── index.js             # Express backend controller
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```
 
---
 
## 🚀 Getting Started (Run Locally)
 
### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed
- Node.js v20 (only needed if running without Docker)
### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/todo-app.git
cd todo-app
```
 
### 2. Run with Docker Compose (Recommended)
```bash
docker compose up -d
```
This will start both containers (API + MongoDB).
 
The app will be available at: `http://localhost:3000`
 
### 3. Run without Docker (Manual)
```bash
npm install
MONGO_URI=mongodb://localhost:27017/todolist node index.js
```
 
### 📸 Screenshot — Local Server Run
 
./screenshots/local-run.png
 
---
 
## ☁️ Production Deployment (AWS EC2)
 
Live endpoint: **http://43.204.220.31:3000**
 
### Deployment Commands (on EC2 terminal)
```bash
# 1. SSH into Cloud Instance
ssh -i ~/.ssh/your-key.pem ubuntu@43.204.220.31
 
# 2. Navigate to project workspace
cd ~/todo-app
 
# 3. Stop old containers & purge cached images
docker compose down
docker rmi dikshani12/todo-app:latest
 
# 4. Pull fresh image and start containers in detached mode
docker compose pull
docker compose up -d
 
# 5. Verify running services & logs
docker compose ps
docker compose logs api --tail 30
```
 
### 📸 Screenshot — Server Run (Production / EC2)
 
./screenshots/server-run.png
 
---
 
## 🔁 CI/CD Pipeline (GitHub Actions)
 
An automated workflow triggers on every `git push origin main`:
 
```
Code Push → GitHub Actions Build → Push Image to Docker Hub (dikshani12/todo-app:latest) → Server Deployment (docker compose pull & up)
```
 
---
 
## 🐞 Debugging & Incident Log
 
Critical issues faced during development, along with their resolutions:
 
| # | Symptom / Error | Root Cause | Resolution |
|---|---|---|---|
| 1 | `ERR_CONNECTION_REFUSED` | Port 3000 inbound rule was blocked in the AWS EC2 Security Group | Added a Custom TCP rule for Port 3000, Source `0.0.0.0/0`, to AWS Inbound Rules |
| 2 | `PathError: Unexpected ( at index 1: /(.*)`  | Express v5's internal path-to-regexp wildcard parser crashed | Replaced the wildcard route with a custom safe fallback middleware |
| 3 | `ReferenceError: crypto is not defined` | Global `crypto` was missing in the Node.js 18 base image, required by the MongoDB v6 driver | Upgraded the base image to `node:20-alpine` |
| 4 | "Task failed to save on the server" | Frontend-backend payload key mismatch & DB connectivity issue | Synced API route payload parsing and fallback handling in `index.js` |
 
---
 
## 📡 API Endpoints
 
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Fetches all tasks (latest first) |
| POST | `/api/tasks` | Creates a new task |
| DELETE | `/api/tasks/:id` | Deletes a task by its ID |
