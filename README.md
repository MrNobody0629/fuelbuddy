# FuelBuddy - Task Management App

FuelBuddy is a full-stack application with a Vue 3 frontend and a NestJS backend for managing personal and shared tasks. It supports Firebase authentication, PostgreSQL as the database, and Docker for containerization.

---

## 🚀 Tech Stack

* **Frontend**: Vue 3 (Vite)
* **Backend**: NestJS (Node.js)
* **Auth**: Firebase + JWT
* **Database**: PostgreSQL
* **ORM**: TypeORM
* **Containerization**: Docker, Docker Compose

---

## 🔧 Setup Instructions (Standalone)

### 🐳 Prerequisites

* Node.js (v18+ recommended)
* npm
* PostgreSQL running locally (default: `localhost:5432`)
* Firebase project setup
* `.env` files for both frontend and backend

---

### 📁 Folder Structure

```bash
.
├── backend
│   └── ...
├── frontend
│   └── ...
├── docker-compose.yml
```

---

### 🔑 Environment Variables

#### `./backend/.env`

```
PORT= ""
HOST= ""

DB_HOST= ""
DB_PORT= ""
DB_USERNAME= ""
DB_PASSWORD= ""
DB_DATABASE= ""

JWT_SECRET= ""
JWT_PRIVATE= ""
JWT_EXPIRES_IN= ""

FIREBASE_TYPE= ""
FIREBASE_PROJECT_ID= ""
FIREBASE_PRIVATE_KEY_ID= ""
FIREBASE_PRIVATE_KEY= ""
FIREBASE_CLIENT_EMAIL= ""
FIREBASE_CLIENT_ID= ""
FIREBASE_AUTH_URI= ""
FIREBASE_TOKEN_URI= ""
FIREBASE_AUTH_PROVIDER_CERT_URL= ""
FIREBASE_CLIENT_CERT_URL= ""
```

#### `./frontend/.env`

```
#Backend server URL
VITE_API_BASE_URL=

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MSG_SENDER_ID=
VITE_FIREBASE_MEASUREMENTID=
```

---

### ▶️ Start Locally (Without Docker)

#### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Setup Using Docker

### 🔧 Build and Start All Services

```bash
docker-compose -f deploy-compose.yml up

#Everytime build
docker-compose -f deploy-compose.yml up --build

# For detach mode
docker-compose -f deploy-compose.yml up -d --build
```

### Note:- While using compose-up change `./backend/.env` DB_HOST=db

### 🛆 Services

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:3000](http://localhost:3000)
* PostgreSQL: localhost:5432

---

## 🥪 Testing

* Visit the app at `http://localhost:5173`
* Log in using Firebase credentials
* Tasks will load and sync with backend API
* You can view "All", “My Tasks”, “Shared Tasks”, and use the sharing popup

---

## 📌 Common Issues

* **bcrypt errors** in Docker?
  → Use `bcryptjs` or `node:slim` base image for backend.

* **Frontend container exiting?**
  → Ensure Vite server is used in Docker (`npm run dev` or `vite preview` in CMD).

---

## 📄 License

MIT © Anuj Verma
