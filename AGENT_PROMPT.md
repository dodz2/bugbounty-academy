

Tu es un développeur fullstack senior spécialisé en cybersécurité. Tu travailles sur **BugBounty Academy**, une plateforme de formation bug bounty (style TryHackMe). Le repo est : https://github.com/dodz2/bugbounty-academy

## OBJECTIF : Site 100% statique sur GitHub Pages

Le site DOIT être accessible via `https://dodz2.github.io/bugbounty-academy/`. **Pas de backend. Pas de serveur. Pas d'API. Tout côté client.**

## PREMIÈRE CHOSE À FAIRE : Supprimer le backend

Le projet contient un dossier `server/` avec un backend Express + Prisma + SQLite. **Supprime-le entièrement.** Il n'est pas utile — on passe à une architecture 100% statique.

```bash
rm -rf server/
```

Supprime aussi le `docker-compose.yml` et le `setup.ps1` à la racine — ils ne servent plus.

Le projet final ne doit contenir que :
```
bugbounty-academy/
├── client/                  # Next.js (static export) — C'EST TOUT LE SITE
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   ├── components/      # UI, layout, features
│   │   ├── data/            # Données statiques en JSON/TS
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── content/                 # Fichiers Markdown des leçons (optionnel, pour rédaction)
├── .github/workflows/       # GitHub Actions pour déployer sur Pages
├── README.md
└── ROADMAP.md
```

## Architecture statique

### Données
- Les modules, leçons, challenges et badges sont définis directement dans des fichiers TypeScript dans `client/src/data/` :
  - `modules.ts` — liste des modules avec métadonnées
  - `lessons.ts` — contenu Markdown des leçons (inline ou importé)
  - `challenges.ts` — prompts + hash SHA-256 des flags (pas de bcrypt, trop lent côté client)
  - `badges.ts` — définitions des badges et conditions de déblocage

### Authentification
- **Pas de vrai système auth.** L'utilisateur choisit un pseudo au premier lancement, stocké dans `localStorage`.
- Pas de mot de passe, pas de JWT, pas de register/login sécurisé.
- C'est une plateforme de formation, pas un service en prod — la simplicité prime.

### Progression & XP
- Tout stocké dans `localStorage` :
  - Challenges résolus (liste d'IDs)
  - Leçons complétées
  - XP total
  - Badges obtenus
- Un store Zustand (déjà partiellement créé dans `client/src/stores/`) gère l'état en mémoire et persiste dans `localStorage`.

### Validation des flags
- Les flags sont hashés en SHA-256 dans les données statiques.
- Côté client : on hash l'input utilisateur en SHA-256 et on compare avec le hash stocké.
- Oui, un utilisateur peut tricher en lisant le JS — c'est acceptable pour de la formation.

```typescript
// Exemple de validation
async function validateFlag(input: string, expectedHash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === expectedHash;
}
```

### Déploiement GitHub Pages
- Configurer Next.js avec `output: 'export'` dans `next.config.js` et `basePath: '/bugbounty-academy'`
- Créer `.github/workflows/deploy.yml` qui build et déploie sur GitHub Pages à chaque push sur main
- Le build génère un site statique dans `out/` qui est publié sur la branche `gh-pages`

## État actuel du frontend (déjà créé)

```
client/src/
├── app/
│   ├── globals.css          ✅ Styles Tailwind + thème cyber sombre
│   ├── layout.tsx           ✅ Layout racine
│   └── page.tsx             ✅ Landing page (hero + terminal preview)
├── services/
│   └── api.ts               ⚠️ Client Axios vers backend — À REMPLACER par accès direct aux données statiques
├── stores/
│   └── authStore.ts         ⚠️ Store auth avec appels API — À RÉÉCRIRE pour localStorage uniquement
├── types/
│   └── index.ts             ✅ Interfaces TypeScript (User, Module, Lesson, Challenge, Badge, etc.)
└── tailwind.config.ts       ✅ Thème cyber avec palette custom
```

## Ce que tu dois faire (dans l'ordre)

### Étape 1 : Nettoyage
- Supprimer `server/`, `docker-compose.yml`, `setup.ps1`
- Modifier `next.config.js` : ajouter `output: 'export'` et `basePath: '/bugbounty-academy'`
- Supprimer ou réécrire `client/src/services/api.ts` (plus besoin d'Axios — les données sont locales)
- Réécrire `client/src/stores/authStore.ts` pour utiliser localStorage au lieu d'appels API

### Étape 2 : Données statiques
Créer `client/src/data/` avec :
- `modules.ts` — 3 modules (Fondamentaux Web, XSS, SQL Injection) avec titre, slug, description, catégorie, difficulté, image
- `lessons.ts` — 4 leçons par module (12 total), contenu Markdown inline, xpReward, ordre
- `challenges.ts` — 1 challenge par leçon (12 total), prompt, SHA-256 hash du flag, hints, xpReward
- `badges.ts` — 8 badges (Premier Pas, Explorateur, Chercheur, Centurion, Hacker Junior, Bug Hunter, Spécialiste XSS, SQL Master)

### Étape 3 : Stores Zustand
- `progressStore.ts` — gère progression, XP, challenges résolus, leçons complétées, persisté dans localStorage
- `authStore.ts` — réécriture : juste un pseudo + avatar stockés dans localStorage
- `badgeStore.ts` — calcul et attribution des badges basé sur la progression

### Étape 4 : Pages
- `/` — Landing page (existe déjà ✅)
- `/modules` — Catalogue des modules avec filtres
- `/modules/[slug]` — Détail module + liste des leçons avec progression
- `/modules/[slug]/[lessonSlug]` — Page leçon : rendu Markdown + soumission de flag
- `/dashboard` — Stats de l'utilisateur, XP, badges, progression par module
- `/profile` — Pseudo, stats résumées, badges obtenus

### Étape 5 : Composants
- `Navbar.tsx` — navigation + pseudo + XP
- `ModuleCard.tsx` — card module avec progression
- `MarkdownRenderer.tsx` — react-markdown + syntax highlight + code blocks copiables
- `FlagSubmit.tsx` — input + validation SHA-256 + feedback visuel (correct/incorrect)
- `ProgressBar.tsx`, `BadgeDisplay.tsx`, `StatCard.tsx`

### Étape 6 : GitHub Actions
Créer `.github/workflows/deploy.yml` :
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install & Build
        working-directory: ./client
        run: |
          npm ci
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/out
```

## Contenu des modules (à intégrer dans les données)

### Module 1 : Fondamentaux Web (beginner)
- Leçon 1 : HTTP (méthodes, status codes, headers) → Flag: `FLAG{301}`
- Leçon 2 : DNS (records, résolution) → Flag: `FLAG{CNAME}`
- Leçon 3 : Cookies & Sessions (attributs, HttpOnly, Secure) → Flag: `FLAG{HttpOnly}`
- Leçon 4 : Same-Origin Policy & CORS → Flag: `FLAG{different-origin}`

### Module 2 : XSS (intermediate)
- Leçon 1 : Introduction XSS (types, impact) → Flag: `FLAG{stored-xss}`
- Leçon 2 : Reflected XSS (payload basique) → Flag: `FLAG{<script>alert(1)</script>}`
- Leçon 3 : Stored XSS (persistance) → Flag: `FLAG{database}`
- Leçon 4 : Prévention XSS (CSP, encoding) → Flag: `FLAG{Content-Security-Policy}`

### Module 3 : SQL Injection (intermediate)
- Leçon 1 : Bases SQLi (injection basique) → Flag: `FLAG{' OR '1'='1}`
- Leçon 2 : Union-based SQLi → Flag: `FLAG{3}`
- Leçon 3 : Blind SQLi (boolean, time-based) → Flag: `FLAG{time-based}`
- Leçon 4 : Prévention SQLi → Flag: `FLAG{prepared-statements}`

Chaque leçon suit le format : **Objectif → Théorie → Exemple → Exercice → Flag → Récap**
Le contenu Markdown doit être pédagogique, technique et rigoureux. Écris le vrai contenu, pas du placeholder.

## Règles

- **TypeScript strict**, pas de `any`
- Mode sombre par défaut (thème cyber déjà configuré dans Tailwind)
- Responsive mobile-first
- Commits conventionnels (`feat:`, `fix:`, `chore:`)
- Code commenté clairement
- Chaque fichier fonctionnel et isolé
