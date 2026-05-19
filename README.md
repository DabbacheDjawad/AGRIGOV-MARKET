<div align="center">

# 🌾 AGRIGOV-MARKET

**A digital marketplace connecting Algeria's farmers, buyers, transporters and government stakeholders — from field to table.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5-092E20?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Environment Variables](#-environment-variables) · [Contributing](#-contributing)

</div>

---

## 📖 Overview

AGRIGOV-MARKET digitalizes Algeria's agricultural supply chain by providing a unified platform for all stakeholders involved in agricultural produce management. Role-specific dashboards, real-time logistics, inventory tracking, and IoT integration bring the entire supply chain into a single, coherent system.

---

## ✨ Features

| Area | Features |
|---|---|
| 🧑‍🌾 **Farmer Dashboard** | List produce, manage inventory, track sales and orders |
| 🛒 **Buyer Dashboard** | Browse produce, cart & checkout, order history |
| 🚛 **Transporter Portal** | Route management, scheduling, live delivery status |
| 🏛️ **Ministry Portal** | Government oversight, reporting and regulatory visibility |
| 💬 **Chat & Notifications** | Real-time messaging and push alerts between all parties |
| 📦 **Inventory Management** | Add, update and remove products with region and type filters |
| 🌐 **IoT Integration** | Sensor data pipelines for produce quality and logistics |
| 🔒 **Role-Based Access** | Secure, scoped dashboards per user role |

---

## 🛠 Tech Stack

### Frontend — `client/`

- **[Next.js 14](https://nextjs.org/)** (App Router)
- **React 18** + **TypeScript**
- Component library under `client/components/`

### Backend — `server/`

- **[Django 5](https://www.djangoproject.com/)** + Django REST Framework
- **Python 3.10+**
- REST APIs under `server/Agrigov/api/`

### Additional

- Node.js tooling and scripts in `server/`
- IoT and logistics API integrations
- PostgreSQL (recommended for production)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 and npm or yarn
- **Python** ≥ 3.10 and pip
- **PostgreSQL** (or SQLite for local development)

### 1. Clone the repository

```bash
git clone <repo-url>
cd AGRIGOV-MARKET
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#-environment-variables) for the full reference.

### 3. Run the frontend

```bash
cd client
npm install
npm run dev
# → http://localhost:3000
```

**Build for production:**

```bash
npm run build
npm start
```

### 4. Run the backend

```bash
cd server/Agrigov

# Create and activate virtual environment
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate

# Install dependencies, apply migrations, start server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# → http://localhost:8000
```

---

## 📁 Project Structure

```
AGRIGOV-MARKET/
├── client/                  # Next.js frontend application
│   ├── app/                 # App Router pages & layouts
│   ├── components/          # Shared UI components
│   └── public/              # Static assets
├── server/                  # Backend services
│   └── Agrigov/
│       ├── api/             # Django REST API endpoints
│       ├── manage.py
│       └── requirements.txt
├── lib/                     # Shared client-side utilities
├── types/                   # Global TypeScript type definitions
└── .env.example             # Environment variable template
```

---

## 🔐 Environment Variables

Create a `.env` file at the project root (or set OS environment variables) before running either service.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Backend database connection string |
| `DJANGO_SECRET_KEY` | Django cryptographic secret key |
| `NEXT_PUBLIC_API_BASE` | API base URL consumed by the Next.js client |
| `ALLOWED_HOSTS` | Comma-separated list of Django allowed hosts |
| `DEBUG` | Set to `False` in production |

---

## 🗺 Roadmap

- [ ] Mobile application (React Native)
- [ ] Arabic & French localization
- [ ] Advanced analytics dashboard for ministry
- [ ] Payment gateway integration (CIB / Dahabia)
- [ ] Offline-first support for low-connectivity areas
- [ ] SMS notifications for rural users

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes using [conventional commits](https://www.conventionalcommits.org/): `git commit -m "feat: add feature"`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a Pull Request with a clear description of your changes

Please ensure linting and formatting are applied before committing.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For questions or support, open a [GitHub Issue](../../issues) or contact the maintainers listed in the repository.

---

<div align="center">
  <sub>Built with ❤️ for Algerian agriculture 🇩🇿</sub>
</div>
