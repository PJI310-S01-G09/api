# Lava Jato API

Lava Jato is a car wash scheduling API.  
It allows clients to be created and associated with service appointments, managing overlapping schedules with full control. Built with Node.js, MySQL, and end-to-end testing support.

## 🧰 Tech Stack

- Node.js (v22)
- MySQL 5.7
- Knex.js (migrations)
- Express
- Jest (E2E tests)
- GitHub Actions (CI)

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Start MySQL database

Use the provided `docker-compose.yml`:

```bash
docker-compose up -d
```

Database credentials:

- **DB Name:** `api`
- **User:** `user`
- **Password:** `password`

### 3. Install dependencies

```bash
npm install
```

### 4. Run migrations

Copy the .env file (if you already want with the same credentials as above copy the `.env.test` file):

```bash
cp .env.example .env
npm run migrate
```

### 5. Start the application

```bash
npm start
```

### 6. Run tests (E2E)

```bash
npm test
```

---

## ✅ Features

- Client creation and editing
- Scheduling with conflict prevention
- Full client ↔ schedule relationship
- Automated end-to-end tests
- CI pipeline using GitHub Actions

---

## 📁 Project Structure

```
src/
  ├── controllers/
  ├── services/
  ├── repositories/
  ├── validators/
  └── db/
      └── conn.js
```

---

## 📄 License

This project is open-source and free to use.
