# BugBounty Academy — Roadmap d'implémentation

> Ce document décrit toutes les étapes restantes pour compléter le MVP.
> La Phase 1 (scaffolding) est terminée. Les Phases 2 à 5 restent à implémenter.
>
> **Stack** : Next.js 14 (App Router) + Tailwind CSS + Zustand | Express.js + Prisma + SQLite | TypeScript partout
>
> **Règles** :
> - Chaque sous-étape = un commit séparé avec message conventionnel (`feat:`, `fix:`, `docs:`, `chore:`)
> - TypeScript strict partout, pas de `any`
> - Validation Zod sur tous les inputs (front et back)
> - Commenter le code clairement
> - Chaque fichier doit être fonctionnel et testable isolément
> - Sécurité maximale : ce site enseigne la cybersécurité

---

## PHASE 2 — BACKEND API

### 2.1 — Setup Express + middleware de base
**Fichier** : `server/src/index.ts` (déjà créé, à compléter)
**À faire** :
- Installer les dépendances : `cd server && npm install`
- Vérifier que le serveur démarre : `npm run dev`
- Le fichier existe déjà avec : helmet, cors, morgan, rate-limit, body-parser
- Ajouter le import des routes (une fois créées dans les étapes suivantes)

**Commit** : `chore: verify server startup and middleware`

---

### 2.2 — Schéma Prisma + migration initiale
**Fichier** : `server/prisma/schema.prisma` (déjà créé)
**À faire** :
- Copier `.env.example` vers `.env` dans `server/`
- Remplir `JWT_SECRET` et `JWT_REFRESH_SECRET` avec des chaînes aléatoires de 64 caractères
- Exécuter : `npx prisma generate` puis `npx prisma db push`
- Vérifier avec `npx prisma studio` que les tables sont créées

**Modèles existants dans le schéma** :
```
User          : id, username, email, passwordHash, avatar, bio, xp, rank, role, createdAt, updatedAt
Module        : id, title, slug, description, category, difficulty, order, image, published, createdAt, updatedAt
Lesson        : id, moduleId, title, slug, content (markdown), order, xpReward, published, createdAt, updatedAt
Challenge     : id, lessonId, type, prompt, flagHash, hints (JSON string), xpReward, difficulty, order, createdAt
UserProgress  : id, userId, lessonId, completed, completedAt, createdAt (unique: userId+lessonId)
UserChallenge : id, userId, challengeId, solved, attempts, solvedAt, createdAt (unique: userId+challengeId)
Badge         : id, name, description, icon, condition (JSON), xpRequired
UserBadge     : id, userId, badgeId, earnedAt (unique: userId+badgeId)
```

**Commit** : `chore: generate prisma client and push initial schema`

---

### 2.3 — Authentification (register, login, refresh, logout)

#### 2.3a — Validators Zod
**Fichier** : `server/src/validators/auth.validator.ts`
```typescript
// Schemas Zod pour :
// - registerSchema : { username: string (3-30 chars, alphanum), email: string (email valid), password: string (min 8, 1 majuscule, 1 chiffre) }
// - loginSchema : { email: string, password: string }
// - refreshSchema : { refreshToken: string }
```

#### 2.3b — Service Auth
**Fichier** : `server/src/services/auth.service.ts`
```typescript
// Fonctions :
// - hashPassword(password: string): Promise<string>  → bcrypt.hash avec BCRYPT_ROUNDS
// - comparePassword(password, hash): Promise<boolean> → bcrypt.compare
// - generateTokens(userId: string): { accessToken, refreshToken }  → JWT sign avec secrets distincts
// - verifyAccessToken(token: string): JwtPayload | null
// - verifyRefreshToken(token: string): JwtPayload | null
```

#### 2.3c — Controller Auth
**Fichier** : `server/src/controllers/auth.controller.ts`
```typescript
// Endpoints :
// POST /api/auth/register → valider input (Zod), vérifier unicité email+username, hash password, créer user, générer tokens, retourner { user, tokens }
// POST /api/auth/login    → valider input, trouver user par email, comparer password, générer tokens, retourner { user, tokens }
// POST /api/auth/refresh  → valider refreshToken, vérifier validité, générer nouveaux tokens
// POST /api/auth/logout   → (stateless JWT, juste retourner success — optionnel : blacklist token)
// GET  /api/auth/me       → middleware JWT requis, retourner le profil user courant
```

#### 2.3d — Middleware JWT
**Fichier** : `server/src/middleware/auth.middleware.ts`
```typescript
// - authenticate : extraire Bearer token du header Authorization, vérifier avec verifyAccessToken, attacher user à req
// - requireAdmin : vérifier que req.user.role === 'admin'
// - optionalAuth : comme authenticate mais ne fail pas si pas de token (pour les pages publiques qui montrent du contenu personnalisé)
```

#### 2.3e — Rate limiter auth
**Fichier** : `server/src/middleware/rateLimiter.ts`
```typescript
// - authLimiter : 5 requêtes / 15 minutes sur /api/auth/login et /api/auth/register
// - globalLimiter : déjà dans index.ts (100 req / 15 min)
```

#### 2.3f — Routes Auth
**Fichier** : `server/src/routes/auth.routes.ts`
```typescript
// Router Express avec les 5 routes ci-dessus
// Appliquer authLimiter sur login et register
// Appliquer authenticate middleware sur /me
```

#### 2.3g — Brancher les routes dans index.ts
**Fichier** : `server/src/index.ts`
- Décommenter `app.use('/api/auth', authRoutes);`

**Commit** : `feat: implement JWT authentication (register, login, refresh, me)`

---

### 2.4 — CRUD Modules & Leçons & Challenges

#### 2.4a — Validators
**Fichier** : `server/src/validators/module.validator.ts`
```typescript
// - createModuleSchema : { title, slug, description, category (enum), difficulty (enum), order?, image? }
// - updateModuleSchema : partial du create
```

**Fichier** : `server/src/validators/lesson.validator.ts`
```typescript
// - createLessonSchema : { moduleId, title, slug, content, order?, xpReward? }
// - updateLessonSchema : partial du create
```

**Fichier** : `server/src/validators/challenge.validator.ts`
```typescript
// - createChallengeSchema : { lessonId, type?, prompt, flag (string clair → sera hashé côté service), hints?, xpReward?, difficulty? }
// - updateChallengeSchema : partial (sans flag, ou avec flag optionnel)
```

#### 2.4b — Services
**Fichier** : `server/src/services/module.service.ts`
```typescript
// - getAllModules(filters?) : retourne les modules publiés avec count de leçons
// - getModuleBySlug(slug) : retourne le module + ses leçons (publiées)
// - createModule(data) : admin only
// - updateModule(id, data) : admin only
// - deleteModule(id) : admin only
```

**Fichier** : `server/src/services/lesson.service.ts`
```typescript
// - getLessonBySlug(slug, userId?) : retourne la leçon + challenges (sans flagHash !!) + isCompleted pour le user
// - createLesson(data) : admin only
// - updateLesson(id, data) : admin only
// - deleteLesson(id) : admin only
```

#### 2.4c — Controllers
**Fichier** : `server/src/controllers/module.controller.ts`
```typescript
// GET    /api/modules          → liste des modules (filtrable par category, difficulty)
// GET    /api/modules/:slug    → détail module + leçons
// POST   /api/modules          → créer (admin)
// PUT    /api/modules/:id      → modifier (admin)
// DELETE /api/modules/:id      → supprimer (admin)
```

**Fichier** : `server/src/controllers/lesson.controller.ts`
```typescript
// GET    /api/lessons/:slug    → détail leçon + challenges
// POST   /api/lessons          → créer (admin)
// PUT    /api/lessons/:id      → modifier (admin)
// DELETE /api/lessons/:id      → supprimer (admin)
```

#### 2.4d — Routes
**Fichier** : `server/src/routes/module.routes.ts`
**Fichier** : `server/src/routes/lesson.routes.ts`

- Les routes GET sont publiques (optionalAuth pour le suivi de progression)
- Les routes POST/PUT/DELETE nécessitent authenticate + requireAdmin

#### 2.4e — Brancher dans index.ts
```typescript
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
```

**Commit** : `feat: implement CRUD for modules, lessons, and challenges`

---

### 2.5 — Soumission de flags

**Fichier** : `server/src/controllers/challenge.controller.ts`
```typescript
// POST /api/challenges/:id/submit
// Body : { flag: string }
// Logic :
//   1. Trouver le challenge par id
//   2. Vérifier que l'utilisateur est authentifié
//   3. Comparer le flag soumis avec flagHash via bcrypt.compare
//   4. Si correct :
//      a. Créer/mettre à jour UserChallenge (solved: true, solvedAt: now, incrémenter attempts)
//      b. Ajouter XP au user (challenge.xpReward)
//      c. Vérifier si la leçon est complète (tous les challenges solved) → marquer UserProgress
//      d. Vérifier si des badges sont débloqués (voir 2.6)
//      e. Retourner { correct: true, xpEarned, message, newBadges? }
//   5. Si incorrect :
//      a. Incrémenter attempts dans UserChallenge
//      b. Retourner { correct: false, message: "Flag incorrect" }
```

**Fichier** : `server/src/routes/challenge.routes.ts`
```typescript
// POST /api/challenges/:id/submit → authenticate required
// GET  /api/challenges/:id/hints  → retourne les hints (optionnel : limiter par tentatives)
```

**IMPORTANT SÉCURITÉ** : Ne JAMAIS retourner le flagHash dans les réponses API. Filtrer le champ dans tous les serializers.

**Commit** : `feat: implement flag submission and validation system`

---

### 2.6 — Progression, XP & Badges

**Fichier** : `server/src/services/progress.service.ts`
```typescript
// - getUserProgress(userId) : retourne stats globales (XP, rang, modules complétés, leçons complétées, challenges résolus)
// - getLessonProgress(userId, lessonId) : progression sur une leçon spécifique
// - getModuleProgress(userId, moduleId) : pourcentage complétion du module
// - addXp(userId, amount) : ajouter XP et recalculer le rang
```

**Fichier** : `server/src/services/badge.service.ts`
```typescript
// - checkAndAwardBadges(userId) : vérifie toutes les conditions de badges et attribue ceux débloqués
// - getUserBadges(userId) : retourne les badges du user
//
// Conditions de badges à implémenter :
//   - "Premier Pas"     : premier challenge résolu (challengesSolved >= 1)
//   - "Explorateur"     : première leçon complétée (lessonsCompleted >= 1)
//   - "Chercheur"       : premier module complété (modulesCompleted >= 1)
//   - "Centurion"       : 100 XP atteints
//   - "Hacker Junior"   : 500 XP atteints
//   - "Bug Hunter"      : 1000 XP atteints
//   - "Spécialiste XSS" : module XSS complété
//   - "SQL Master"      : module SQLi complété
```

**Fichier** : `server/src/services/rank.service.ts`
```typescript
// Calcul du rang basé sur l'XP :
//   0-99     → "Newbie"
//   100-299  → "Script Kiddie"
//   300-599  → "Apprentice"
//   600-999  → "Hacker"
//   1000-1999→ "Bug Hunter"
//   2000+    → "Elite Hunter"
```

**Fichier** : `server/src/controllers/user.controller.ts`
```typescript
// GET /api/users/me/stats      → dashboard stats (XP, rang, progression, badges, activité récente)
// GET /api/users/me/progress   → progression détaillée par module
// GET /api/users/me/badges     → liste des badges
// PUT /api/users/me/profile    → modifier profil (username, bio, avatar)
```

**Fichier** : `server/src/routes/user.routes.ts`

**Commit** : `feat: implement user progression, XP system, ranks, and badges`

---

### 2.7 — Seeding de la base de données

**Fichier** : `server/seeds/index.ts` (existe déjà, à compléter)
**À faire** :
- Importer le contenu pédagogique de la Phase 4 (fichiers Markdown dans `content/modules/`)
- Seed les modules, leçons, challenges avec des flags hashés en bcrypt
- Seed les badges
- Seed un user admin de test : `admin / admin@bugbounty.local / Admin123!`
- Seed un user de test : `testuser / test@bugbounty.local / Test1234!`

**Exécution** : `npm run db:seed`

**Commit** : `feat: seed database with initial content, badges, and test users`

---

### 2.8 — Middleware de sécurité global

**Fichier** : `server/src/middleware/security.ts`
```typescript
// - sanitizeInput : nettoyer les inputs HTML/JS potentiellement dangereux
// - validateContentType : vérifier que Content-Type est application/json
// - noSniff : X-Content-Type-Options: nosniff (déjà dans helmet)
```

**Fichier** : `server/src/middleware/error.ts`
```typescript
// - errorHandler : gestionnaire d'erreurs global
//   - ZodError → 400 avec détails de validation
//   - PrismaClientKnownRequestError → 409 pour les conflits d'unicité
//   - JsonWebTokenError → 401
//   - Autres → 500 (masquer le message en prod)
```

**Commit** : `feat: add security middleware and global error handler`

---

## PHASE 3 — FRONTEND

### 3.1 — Setup & installation
**À faire** :
- `cd client && npm install`
- Vérifier que `npm run dev` lance Next.js sur http://localhost:3000
- Les fichiers de config existent déjà (tailwind.config.ts, next.config.js, layout.tsx, globals.css)

**Commit** : `chore: verify client setup and dev server`

---

### 3.2 — Layout global (Navbar, Sidebar, Footer)

**Fichier** : `client/src/components/layout/Navbar.tsx`
```typescript
// Barre de navigation fixe en haut :
// - Logo "BugBounty Academy" à gauche (lien vers /)
// - Liens : Modules, Leaderboard (si connecté : Dashboard)
// - Droite : si connecté → avatar + username + XP badge + dropdown (Profil, Logout)
//            si non connecté → boutons Login / Register
// - Style : bg-cyber-surface, border-b border-cyber-border, hauteur fixe
```

**Fichier** : `client/src/components/layout/Sidebar.tsx`
```typescript
// Sidebar pour les pages de module/leçon :
// - Liste des leçons du module courant
// - Indicateur de complétion (checkmark vert si complété)
// - Leçon active highlighted
// - Progression du module en pourcentage (barre verte)
// - Collapsible sur mobile
```

**Fichier** : `client/src/components/layout/Footer.tsx`
```typescript
// Footer simple : copyright, liens GitHub, licence MIT
```

**Fichier** : `client/src/app/layout.tsx` (modifier l'existant)
- Intégrer Navbar dans le layout global
- Ajouter un AuthProvider qui appelle fetchProfile au montage

**Commit** : `feat: implement global layout with Navbar, Sidebar, Footer`

---

### 3.3 — Pages publiques (Landing, Login, Register)

**Fichier** : `client/src/app/page.tsx` (existe déjà — landing page)
- Déjà créée avec hero section, stats, terminal preview

**Fichier** : `client/src/app/login/page.tsx`
```typescript
// Formulaire de login :
// - Champs : email, password
// - Validation côté client (Zod ou état local)
// - Appel authStore.login()
// - Redirect vers /dashboard après succès
// - Lien vers /register
// - Style : centré, card cyber-dark, glow sur le bouton submit
```

**Fichier** : `client/src/app/register/page.tsx`
```typescript
// Formulaire d'inscription :
// - Champs : username, email, password, confirm password
// - Validation : username 3-30 chars, email valide, password 8+ avec 1 majuscule et 1 chiffre
// - Appel authStore.register()
// - Redirect vers /dashboard après succès
// - Lien vers /login
```

**Commit** : `feat: implement login and register pages`

---

### 3.4 — Auth côté client (guards, intercepteur)

**Fichier** : `client/src/components/features/AuthGuard.tsx`
```typescript
// HOC ou composant wrapper :
// - Si isLoading → spinner
// - Si !isAuthenticated → redirect vers /login
// - Sinon → rendre children
```

**Fichier** : `client/src/hooks/useAuth.ts`
```typescript
// Hook qui encapsule useAuthStore avec des helpers :
// - isLoggedIn, user, login, logout, register
// - useEffect au mount qui tente fetchProfile si un token existe dans localStorage
```

Les fichiers `services/api.ts` et `stores/authStore.ts` existent déjà avec les intercepteurs JWT et le refresh automatique.

**Commit** : `feat: implement client-side auth guards and hooks`

---

### 3.5 — Page Catalogue (liste des modules)

**Fichier** : `client/src/app/modules/page.tsx`
```typescript
// Page catalogue :
// - Titre "Modules de formation"
// - Filtres : par catégorie (pills cliquables), par difficulté (Débutant/Intermédiaire/Avancé)
// - Grille de cards de modules (responsive : 1 col mobile, 2 cols tablette, 3 cols desktop)
// - Chaque card : image/icône, titre, description courte, badge difficulté, nombre de leçons, barre de progression si connecté
// - Appel API : GET /api/modules?category=...&difficulty=...
```

**Fichier** : `client/src/components/features/ModuleCard.tsx`
```typescript
// Card d'un module :
// - Icône ou image en haut
// - Titre (h3)
// - Description (tronquée à 2 lignes)
// - Badges : difficulté (couleur selon niveau), catégorie
// - Footer : "X leçons" + barre de progression (si connecté et commencé)
// - Lien vers /modules/[slug]
// - Hover : border glow vert
```

**Commit** : `feat: implement modules catalog page with filters`

---

### 3.6 — Page Module (détail + liste leçons)

**Fichier** : `client/src/app/modules/[slug]/page.tsx`
```typescript
// Page détail d'un module :
// - Header : titre, description, badges (difficulté, catégorie), stats (nombre de leçons, XP total)
// - Barre de progression globale du module (si connecté)
// - Liste des leçons ordonnées :
//   - Numéro, titre, XP reward, statut (complété ✓ / en cours → / verrouillé 🔒)
//   - Chaque leçon est un lien vers /modules/[moduleSlug]/[lessonSlug]
// - Appel API : GET /api/modules/:slug
```

**Commit** : `feat: implement module detail page with lesson list`

---

### 3.7 — Page Leçon (Markdown + code + flag submit)

C'est la page la plus importante de toute la plateforme.

**Fichier** : `client/src/app/modules/[slug]/[lessonSlug]/page.tsx`
```typescript
// Layout : Sidebar gauche (liste leçons du module) + contenu principal
// Contenu :
//   1. Header : titre de la leçon, XP reward, badge difficulté
//   2. Corps : rendu Markdown avec react-markdown + rehype-highlight + rehype-sanitize + remark-gfm
//   3. Section challenges en bas : pour chaque challenge de la leçon, afficher le FlagSubmit
//   4. Boutons navigation : "← Leçon précédente" / "Leçon suivante →"
// Appel API : GET /api/lessons/:slug
```

**Fichier** : `client/src/components/features/MarkdownRenderer.tsx`
```typescript
// Composant de rendu Markdown :
// - react-markdown avec plugins : remark-gfm, rehype-highlight, rehype-raw, rehype-sanitize
// - Custom renderers :
//   - code blocks : fond noir, syntax highlighting, bouton "copier", numéros de ligne
//   - inline code : fond cyber-bg, texte accent-green, font-mono
//   - tables : stylées avec borders cyber
//   - blockquotes : barre verte à gauche, fond légèrement plus clair
//   - headings : tailles appropriées, text-gradient pour h1/h2
//   - links : couleur accent-blue, hover underline
//   - images : max-width 100%, rounded
```

**Fichier** : `client/src/components/features/FlagSubmit.tsx`
```typescript
// Composant de soumission de flag :
// - Affiche le prompt/question du challenge
// - Input type text avec style flag-input (font mono, texte vert)
// - Placeholder : "FLAG{...}"
// - Bouton "Soumettre" avec icône
// - States : idle → loading → success (vert, confetti?) / error (rouge, shake animation)
// - Si déjà résolu : afficher "✓ Résolu" en vert, input désactivé
// - Afficher le nombre de tentatives
// - Bouton "Indice" qui révèle les hints progressivement (un par clic)
// - Appel API : POST /api/challenges/:id/submit { flag }
```

**Fichier** : `client/src/components/features/CodeBlock.tsx`
```typescript
// Bloc de code amélioré :
// - Header : langage détecté + bouton copier
// - Numéros de ligne
// - Syntax highlighting (rehype-highlight ou prism)
// - Scroll horizontal si trop large
// - Style terminal cyber
```

**Commit** : `feat: implement lesson page with Markdown renderer and flag submission`

---

### 3.8 — Page Dashboard

**Fichier** : `client/src/app/dashboard/page.tsx`
```typescript
// Page protégée (AuthGuard)
// Layout :
//   1. Header : "Bonjour, {username}" + rang actuel + XP total
//   2. Stats cards (grille 2x2) :
//      - Modules complétés / total
//      - Leçons complétées / total
//      - Challenges résolus / total
//      - Rang actuel + XP vers prochain rang (progress bar)
//   3. Badges obtenus (grille horizontale scrollable, icône + nom)
//   4. Activité récente (timeline verticale, 5 dernières actions)
//   5. Modules en cours (cards des modules commencés mais pas finis, avec progression)
// Appel API : GET /api/users/me/stats
```

**Fichier** : `client/src/components/ui/ProgressBar.tsx`
```typescript
// Barre de progression réutilisable :
// - Props : value (0-100), color?, size?, showLabel?
// - Animation de remplissage au mount
// - Couleur par défaut : accent-green
```

**Fichier** : `client/src/components/ui/StatCard.tsx`
```typescript
// Card de statistique :
// - Icône, label, valeur, sous-texte optionnel
// - Style cyber-card
```

**Fichier** : `client/src/components/ui/BadgeDisplay.tsx`
```typescript
// Affichage d'un badge :
// - Icône (emoji), nom, description au hover
// - Glow si récemment obtenu
// - Grisé si non obtenu (pour une vue "tous les badges")
```

**Commit** : `feat: implement user dashboard with stats, badges, and activity`

---

### 3.9 — Page Profil

**Fichier** : `client/src/app/profile/page.tsx`
```typescript
// Page protégée
// - Avatar (placeholder généré à partir du username)
// - Infos : username, email, bio, rang, XP, date d'inscription
// - Formulaire d'édition inline (bio, username)
// - Section badges (tous les badges, obtenus en couleur, non obtenus grisés)
// - Stats de progression résumées
```

**Commit** : `feat: implement user profile page`

---

### 3.10 — Responsive + polish + mode sombre

**À faire** :
- Vérifier toutes les pages en mobile (375px), tablette (768px), desktop (1280px)
- Sidebar collapsible/drawer sur mobile
- Navbar hamburger menu sur mobile
- Le mode sombre est le défaut (déjà configuré via `dark` class sur html)
- Optionnel : toggle mode clair (ajouter un bouton dans la Navbar, toggler la class `dark`)
- Transitions et animations fluides
- Focus states accessibles sur tous les éléments interactifs
- Skip-to-content link pour l'accessibilité

**Commit** : `feat: responsive design and polish`

---

## PHASE 4 — CONTENU PÉDAGOGIQUE

### 4.1 — Module : Fondamentaux Web

**Dossier** : `content/modules/01-fundamentals/`

Créer les fichiers Markdown suivants. Chaque fichier suit le format :
**Objectif → Théorie → Démo/Exemple → Exercice → Flag → Récap**

**Leçon 1** : `01-http-basics.md` — Les bases du protocole HTTP
- Méthodes (GET, POST, PUT, DELETE), status codes, headers
- Exemples de requêtes/réponses
- **Flag** : répondre à une question sur un status code ou un header spécifique
- Ex: "Quel status code indique une redirection permanente ?" → `FLAG{301}`

**Leçon 2** : `02-dns-how-it-works.md` — Comprendre le DNS
- Résolution DNS, types de records (A, AAAA, CNAME, MX, TXT, NS)
- Outils : nslookup, dig
- **Flag** : identifier un type de record DNS → `FLAG{CNAME}`

**Leçon 3** : `03-cookies-sessions.md` — Cookies et sessions
- Fonctionnement des cookies, attributs (HttpOnly, Secure, SameSite, Path, Domain, Expires)
- Sessions côté serveur vs tokens
- **Flag** : identifier l'attribut qui empêche le JS d'accéder au cookie → `FLAG{HttpOnly}`

**Leçon 4** : `04-same-origin-policy.md` — Same-Origin Policy et CORS
- Définition de l'origin (scheme + host + port)
- Ce que SOP bloque et ne bloque pas
- CORS headers (Access-Control-Allow-Origin, etc.)
- **Flag** : déterminer si deux URLs sont same-origin → `FLAG{different-origin}`

**Commit** : `content: add Fundamentals Web module (4 lessons)`

---

### 4.2 — Module : Cross-Site Scripting (XSS)

**Dossier** : `content/modules/02-xss/`

**Leçon 1** : `01-xss-introduction.md` — Qu'est-ce que le XSS ?
- Types : Reflected, Stored, DOM-based
- Impact : vol de cookies, keylogging, redirection, defacement
- **Flag** : question théorique → `FLAG{stored-xss}`

**Leçon 2** : `02-reflected-xss.md` — Reflected XSS
- Mécanisme : input → réflexion dans la réponse sans échappement
- Exemples de payloads : `<script>alert(1)</script>`, `<img onerror=...>`
- Comment trouver des reflected XSS (paramètres GET, formulaires)
- **Flag** : construire un payload XSS minimal → `FLAG{<script>alert(1)</script>}`

**Leçon 3** : `03-stored-xss.md` — Stored XSS
- Mécanisme : input stocké en base → affiché à d'autres utilisateurs
- Scénarios : commentaires, profils, messages
- Exploitation : vol de session via document.cookie
- **Flag** : identifier où le payload serait stocké → `FLAG{database}`

**Leçon 4** : `04-xss-prevention.md` — Se protéger du XSS
- Output encoding (HTML entities)
- Content Security Policy (CSP)
- Sanitization des inputs
- Frameworks modernes et auto-escaping
- **Flag** : quel header HTTP prévient le XSS ? → `FLAG{Content-Security-Policy}`

**Commit** : `content: add XSS module (4 lessons)`

---

### 4.3 — Module : SQL Injection

**Dossier** : `content/modules/03-sqli/`

**Leçon 1** : `01-sqli-basics.md` — Introduction à l'injection SQL
- Comment fonctionne une requête SQL vulnérable
- Exemple : `SELECT * FROM users WHERE username='$input'`
- Payload basique : `' OR 1=1 --`
- **Flag** : compléter un payload d'injection → `FLAG{' OR '1'='1}`

**Leçon 2** : `02-union-based-sqli.md` — Union-based SQL Injection
- Technique UNION SELECT pour extraire des données d'autres tables
- Étapes : trouver le nombre de colonnes, identifier les colonnes affichées, extraire
- **Flag** : nombre de colonnes pour un UNION réussi → `FLAG{3}`

**Leçon 3** : `03-blind-sqli.md` — Blind SQL Injection
- Boolean-based blind : réponses différentes selon true/false
- Time-based blind : SLEEP() pour inférer des données
- Outils : sqlmap
- **Flag** : technique pour extraire des données sans output direct → `FLAG{time-based}`

**Leçon 4** : `04-sqli-prevention.md` — Prévention des injections SQL
- Requêtes préparées (parameterized queries)
- ORM et query builders
- Principe du moindre privilège sur la DB
- WAF et input validation (en défense en profondeur, pas en première ligne)
- **Flag** : meilleure défense contre SQLi → `FLAG{prepared-statements}`

**Commit** : `content: add SQL Injection module (4 lessons)`

---

### 4.4 — Challenges et flags

**À faire dans le seed** (`server/seeds/index.ts`) :
- Pour chaque leçon ci-dessus, créer un Challenge avec :
  - `type: "flag"`
  - `prompt` : la question posée
  - `flagHash` : hash bcrypt du flag (ex: `await bcrypt.hash("FLAG{301}", 12)`)
  - `hints` : JSON array de 2-3 indices progressifs
  - `xpReward` : 100 pour les leçons basiques, 150 pour les intermédiaires
  - `difficulty` : correspondant au module

**IMPORTANT** : Les flags doivent être case-sensitive. Le système de comparaison doit être exact.

---

### 4.5 — Badges de base

**Seed des badges** :
```
| Nom               | Icône | Condition                    | XP requis |
|--------------------|-------|------------------------------|-----------|
| Premier Pas        | 🏁    | 1 challenge résolu           | 0         |
| Explorateur        | 🔍    | 1 leçon complétée            | 0         |
| Chercheur          | 📚    | 1 module complété            | 0         |
| Centurion          | 💯    | 100 XP                       | 100       |
| Hacker Junior      | 👨‍💻   | 500 XP                       | 500       |
| Bug Hunter         | 🐛    | 1000 XP                      | 1000      |
| Spécialiste XSS    | 💉    | Module XSS complété          | 0         |
| SQL Master         | 🗄️    | Module SQLi complété         | 0         |
```

**Commit** : `content: seed challenges, flags, and badges`

---

## PHASE 5 — TESTS, SÉCURITÉ & DÉPLOIEMENT

### 5.1 — Tests unitaires

**Fichier** : `server/tests/unit/auth.service.test.ts`
```typescript
// Tests :
// - hashPassword retourne un hash valide
// - comparePassword retourne true pour le bon password
// - comparePassword retourne false pour le mauvais password
// - generateTokens retourne deux tokens valides
// - verifyAccessToken valide un token correct
// - verifyAccessToken rejette un token expiré/invalide
```

**Fichier** : `server/tests/unit/rank.service.test.ts`
```typescript
// Tests : chaque palier de rang retourne le bon titre
```

**Fichier** : `server/tests/unit/validators.test.ts`
```typescript
// Tests : chaque schema Zod accepte les inputs valides et rejette les invalides
```

**Commit** : `test: add unit tests for auth, ranks, and validators`

---

### 5.2 — Tests d'intégration

**Fichier** : `server/tests/integration/auth.routes.test.ts`
```typescript
// Tests avec supertest :
// - POST /api/auth/register → 201 avec user et tokens
// - POST /api/auth/register avec email existant → 409
// - POST /api/auth/login → 200 avec tokens
// - POST /api/auth/login avec mauvais password → 401
// - GET /api/auth/me avec token → 200 avec profil
// - GET /api/auth/me sans token → 401
// - POST /api/auth/refresh avec refreshToken valide → 200 avec nouveaux tokens
```

**Fichier** : `server/tests/integration/challenge.routes.test.ts`
```typescript
// Tests :
// - POST /api/challenges/:id/submit avec bon flag → 200, correct: true, XP ajouté
// - POST /api/challenges/:id/submit avec mauvais flag → 200, correct: false
// - POST /api/challenges/:id/submit sans auth → 401
// - Vérifier que le flagHash n'apparaît jamais dans les réponses GET
```

**Commit** : `test: add integration tests for auth and challenge routes`

---

### 5.3 — Audit de sécurité

**Checklist à vérifier** :
- [ ] `npm audit` ne retourne aucune vulnérabilité critique (server et client)
- [ ] Tous les passwords sont hashés en bcrypt (coût 12+)
- [ ] Tous les flags sont hashés en bcrypt (jamais en clair dans la DB ou les réponses API)
- [ ] JWT secret est suffisamment long (32+ caractères)
- [ ] Rate limiting actif sur /api/auth/login et /api/auth/register
- [ ] Helmet.js actif avec headers : CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- [ ] CORS configuré avec origin spécifique (pas `*`)
- [ ] Validation Zod sur TOUS les inputs de TOUTES les routes
- [ ] Le contenu Markdown est sanitizé avec rehype-sanitize
- [ ] Pas de secrets en dur dans le code (tout dans .env)
- [ ] .env est dans .gitignore
- [ ] Les erreurs en prod ne leakent pas de stack traces
- [ ] Les requêtes SQL passent par Prisma (pas de raw queries non paramétrisées)
- [ ] Le flagHash est exclu de toutes les réponses API (select Prisma)

**Commit** : `security: complete security audit checklist`

---

### 5.4 — GitHub Actions CI

**Fichier** : `.github/workflows/ci.yml` (existe déjà)
- Vérifier que le pipeline passe : lint + build + test pour server et client
- Ajouter `npm audit --audit-level=critical` dans le pipeline

**Commit** : `ci: add npm audit to CI pipeline`

---

### 5.5 — README final

**Fichier** : `README.md` (existe déjà, à mettre à jour)
- Mettre à jour avec les instructions de setup complètes et testées
- Ajouter des screenshots de l'interface
- Ajouter la section API endpoints
- Ajouter la section "Flags et challenges"

**Commit** : `docs: update README with final documentation`

---

### 5.6 — Release v0.1.0

```bash
git tag -a v0.1.0 -m "MVP: 3 modules, auth, progression, dashboard"
git push origin v0.1.0
```

Optionnel : déployer le front sur Vercel et l'API sur Railway/Render.

**Commit** : `release: v0.1.0 MVP`

---

## RÉSUMÉ DES FICHIERS À CRÉER PAR PHASE

### Phase 2 (Backend) — ~20 fichiers
```
server/src/validators/auth.validator.ts
server/src/validators/module.validator.ts
server/src/validators/lesson.validator.ts
server/src/validators/challenge.validator.ts
server/src/services/auth.service.ts
server/src/services/module.service.ts
server/src/services/lesson.service.ts
server/src/services/progress.service.ts
server/src/services/badge.service.ts
server/src/services/rank.service.ts
server/src/controllers/auth.controller.ts
server/src/controllers/module.controller.ts
server/src/controllers/lesson.controller.ts
server/src/controllers/challenge.controller.ts
server/src/controllers/user.controller.ts
server/src/middleware/auth.middleware.ts
server/src/middleware/rateLimiter.ts
server/src/middleware/security.ts
server/src/middleware/error.ts
server/src/routes/auth.routes.ts
server/src/routes/module.routes.ts
server/src/routes/lesson.routes.ts
server/src/routes/challenge.routes.ts
server/src/routes/user.routes.ts
```

### Phase 3 (Frontend) — ~15 fichiers
```
client/src/app/login/page.tsx
client/src/app/register/page.tsx
client/src/app/dashboard/page.tsx
client/src/app/profile/page.tsx
client/src/app/modules/page.tsx
client/src/app/modules/[slug]/page.tsx
client/src/app/modules/[slug]/[lessonSlug]/page.tsx
client/src/components/layout/Navbar.tsx
client/src/components/layout/Sidebar.tsx
client/src/components/layout/Footer.tsx
client/src/components/features/AuthGuard.tsx
client/src/components/features/ModuleCard.tsx
client/src/components/features/MarkdownRenderer.tsx
client/src/components/features/FlagSubmit.tsx
client/src/components/features/CodeBlock.tsx
client/src/components/ui/ProgressBar.tsx
client/src/components/ui/StatCard.tsx
client/src/components/ui/BadgeDisplay.tsx
client/src/hooks/useAuth.ts
```

### Phase 4 (Contenu) — 12 fichiers Markdown + seed
```
content/modules/01-fundamentals/01-http-basics.md
content/modules/01-fundamentals/02-dns-how-it-works.md
content/modules/01-fundamentals/03-cookies-sessions.md
content/modules/01-fundamentals/04-same-origin-policy.md
content/modules/02-xss/01-xss-introduction.md
content/modules/02-xss/02-reflected-xss.md
content/modules/02-xss/03-stored-xss.md
content/modules/02-xss/04-xss-prevention.md
content/modules/03-sqli/01-sqli-basics.md
content/modules/03-sqli/02-union-based-sqli.md
content/modules/03-sqli/03-blind-sqli.md
content/modules/03-sqli/04-sqli-prevention.md
server/seeds/index.ts (compléter)
```

### Phase 5 (Tests) — ~5 fichiers
```
server/tests/unit/auth.service.test.ts
server/tests/unit/rank.service.test.ts
server/tests/unit/validators.test.ts
server/tests/integration/auth.routes.test.ts
server/tests/integration/challenge.routes.test.ts
```
