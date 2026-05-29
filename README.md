# BugBounty Academy

> Plateforme de formation interactive pour apprentis bug bounty hunters.
> Inspirée de TryHackMe et PortSwigger Academy.

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D20-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.6-blue)

## Apercu

BugBounty Academy est une plateforme web de formation en cybersecurite offensive. Elle propose des modules de cours structures, des challenges pratiques (CTF-like) et un systeme de progression gamifie pour apprendre le bug bounty hunting de maniere progressive.

### Fonctionnalites

- **Modules de formation** : Parcours structures par theme (fondamentaux, XSS, SQLi, etc.)
- **Lecons interactives** : Theorie en Markdown + blocs de code avec syntax highlighting
- **Challenges** : Soumission de flags pour valider les competences
- **Progression** : XP, badges, suivi d'avancement par module
- **Dashboard** : Statistiques personnelles, activite recente
- **Mode sombre** : Theme cyber/terminal par defaut

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend  | Next.js 14 + Tailwind CSS + Zustand |
| Backend   | Express.js + TypeScript + Prisma |
| Database  | SQLite (dev) / PostgreSQL (prod) |
| Auth      | JWT (access + refresh tokens) |
| Validation| Zod |

## Installation

### Prerequis

- Node.js >= 20
- npm >= 10
- Git

### Setup rapide

```bash
# Cloner le repo
git clone https://github.com/<USERNAME>/bugbounty-academy.git
cd bugbounty-academy

# --- Backend ---
cd server
npm install
cp ../.env.example .env  # Editer les valeurs JWT_SECRET et JWT_REFRESH_SECRET
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev

# --- Frontend (dans un autre terminal) ---
cd client
npm install
npm run dev
```

L'API tourne sur `http://localhost:4000` et le client sur `http://localhost:3000`.

### Avec Docker

```bash
docker compose up --build
```

## Structure du projet

```
bugbounty-academy/
├── client/                  # Frontend Next.js
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # UI, layout, features
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API client (Axios)
│   │   ├── stores/          # Zustand state management
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Helper functions
│   └── package.json
├── server/                  # Backend Express
│   ├── prisma/              # Database schema & migrations
│   ├── src/
│   │   ├── config/          # Environment & database config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, security, validation
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── validators/      # Zod schemas
│   │   └── utils/           # Helpers
│   ├── seeds/               # Database seed data
│   └── package.json
├── content/                 # Pedagogical content (Markdown)
│   ├── modules/
│   └── challenges/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Modules de formation

| # | Module | Difficulte | Lecons |
|---|--------|-----------|--------|
| 01 | Fondamentaux Web | Debutant | HTTP, DNS, Cookies, SOP |
| 02 | Cross-Site Scripting (XSS) | Intermediaire | Reflected, Stored, DOM, Bypass |
| 03 | SQL Injection | Intermediaire | Bases, Union, Blind, Prevention |
| 04 | Reconnaissance (a venir) | Debutant | OSINT, Enumeration, Scanning |
| 05 | Methodologie (a venir) | Avance | Workflow, Rapports, Triage |
| 06 | Outils (a venir) | Intermediaire | Burp, ffuf, Nmap, Nuclei |

## Scripts disponibles

### Serveur

| Commande | Description |
|----------|-------------|
| `npm run dev` | Demarrer en mode dev (hot-reload) |
| `npm run build` | Compiler TypeScript |
| `npm run db:migrate` | Executer les migrations Prisma |
| `npm run db:seed` | Peupler la base avec le contenu initial |
| `npm run db:studio` | Ouvrir Prisma Studio (GUI) |
| `npm run test` | Lancer les tests |
| `npm run lint` | Lancer ESLint |

### Client

| Commande | Description |
|----------|-------------|
| `npm run dev` | Demarrer Next.js en mode dev |
| `npm run build` | Build de production |
| `npm run lint` | Lancer ESLint |

## Securite

Cette plateforme enseigne la cybersecurite — elle se doit d'etre securisee elle-meme :

- Mots de passe hashes avec bcrypt (cout 12)
- Flags hashes en base (jamais en clair)
- JWT avec rotation de tokens
- Rate limiting sur les endpoints sensibles
- Validation Zod stricte sur tous les inputs
- Headers de securite (Helmet.js : CSP, HSTS, X-Frame-Options)
- Sanitization du contenu Markdown

## Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](docs/CONTRIBUTING.md) pour les guidelines.

## Licence

MIT - voir [LICENSE](LICENSE)
