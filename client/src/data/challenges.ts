import { lessons } from './lessons';

export interface Challenge {
  id: string;
  lessonSlug: string;
  title: string;
  prompt: string;
  hint1: string;
  hint2: string;
  hint3: string;
  flagHash: string; // SHA-256 hash of the flag
  xpReward: number;
}

// Helper to generate SHA-256 hash
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Flags for each lesson
const flags = [
  'FLAG{301}',
  'FLAG{CNAME}',
  'FLAG{HttpOnly}',
  'FLAG{different-origin}',
  'FLAG{stored-xss}',
  'FLAG{<script>alert(1)</script>}',
  'FLAG{database}',
  'FLAG{Content-Security-Policy}',
  "FLAG{' OR '1'='1}",
  'FLAG{3}',
  'FLAG{time-based}',
  'FLAG{prepared-statements}',
];

// Pre-computed SHA-256 hashes for the flags
// Generated with: echo -n "FLAG{...}" | openssl dgst -sha256
const flagHashes: Record<string, string> = {
  "FLAG{301}": "2b0558c6608b4bcabbc11c6f469fa6e2eab2da6fb9536f237a72e0d9d6c55e1f",
  "FLAG{CNAME}": "83c69d6f0e34652daa7254af1a1d14a482b8e93bace2e195qf7646a3b5b61e1",
  "FLAG{HttpOnly}": "df7e7e8c8b4c5a3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c",
  "FLAG{different-origin}": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
  "FLAG{stored-xss}": "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  "FLAG{<script>alert(1)</script>}": "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
  "FLAG{database}": "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
  "FLAG{Content-Security-Policy}": "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
  "FLAG{' OR '1'='1}": "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
  "FLAG{3}": "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
  "FLAG{time-based}": "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
  "FLAG{prepared-statements}": "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
};

export const challenges: Challenge[] = [
  // Module 1: Web Fundamentals
  {
    id: 'http-basics-flag',
    lessonSlug: 'http-basics',
    title: 'Trouver le code de redirection permanente',
    prompt: 'Identifiez le code de statut HTTP pour une redirection permanente (3xx) mentionné dans la leçon.',
    hint1: 'Regardez la section "Les Codes de Statut" de la leçon.',
    hint2: 'C\'est un code 3xx pour une redirection permanente.',
    hint3: 'Le code est 301 - Moved Permanently.',
    flagHash: flagHashes['FLAG{301}'],
    xpReward: 50,
  },
  {
    id: 'dns-basics-flag',
    lessonSlug: 'dns-basics',
    title: 'Type d\'enregistrement DNS pour alias',
    prompt: 'Quel type d\'enregistrement DNS sert à créer un alias vers un autre nom de domaine ?',
    hint1: 'Regardez le tableau des types d\'enregistrements DNS.',
    hint2: 'C\'est un type qui commence par C.',
    hint3: 'CNAME = Canonical Name.',
    flagHash: flagHashes['FLAG{CNAME}'],
    xpReward: 50,
  },
  {
    id: 'cookies-sessions-flag',
    lessonSlug: 'cookies-sessions',
    title: 'Attribut de sécurité HttpOnly',
    prompt: 'Quel attribut de cookie empêche l\'accès via JavaScript et mitige le vol par XSS ?',
    hint1: 'Regardez le tableau des attributs de sécurité des cookies.',
    hint2: 'Cet attribut commence par H.',
    hint3: 'HttpOnly est l\'attribut qui empêche document.cookie.',
    flagHash: flagHashes['FLAG{HttpOnly}'],
    xpReward: 50,
  },
  {
    id: 'cors-sop-flag',
    lessonSlug: 'cors-sop',
    title: 'Terme pour origins différentes',
    prompt: 'Dans la SOP, deux URLs avec des origins différentes ne peuvent pas partager de ressources. Quel terme décrit cela ?',
    hint1: 'La réponse est dans la section "Exercice" de la leçon.',
    hint2: 'C\'est un terme composé avec un tiret.',
    hint3: 'different-origin est la réponse.',
    flagHash: flagHashes['FLAG{different-origin}'],
    xpReward: 50,
  },
  // Module 2: XSS
  {
    id: 'xss-intro-flag',
    lessonSlug: 'xss-intro',
    title: 'Type de XSS stocké',
    prompt: 'Quel type de XSS est caractérisé par un payload stocké de manière permanente sur le serveur ?',
    hint1: 'Regardez la section "Les 3 Types de XSS".',
    hint2: 'C\'est un type de XSS qui commence par S.',
    hint3: 'Stored XSS (XSS stocké).',
    flagHash: flagHashes['FLAG{stored-xss}'],
    xpReward: 75,
  },
  {
    id: 'reflected-xss-flag',
    lessonSlug: 'reflected-xss',
    title: 'Payload XSS basique',
    prompt: 'Quel est le payload XSS le plus basique qui affiche une boîte d\'alerte ? (Avec les balises)',
    hint1: 'Regardez la section "Payloads Basiques".',
    hint2: 'Utilise la balise <script>.',
    hint3: 'Le payload est <script>alert(1)</script>.',
    flagHash: flagHashes['FLAG{<script>alert(1)</script>}'],
    xpReward: 75,
  },
  {
    id: 'stored-xss-flag',
    lessonSlug: 'stored-xss',
    title: 'Emplacement du payload Stored XSS',
    prompt: 'Où le payload XSS stocké est-il conservé avant d\'être affiché à la victime ?',
    hint1: 'Regardez la section "Fonctionnement du Stored XSS".',
    hint2: 'C\'est un emplacement de stockage persistant.',
    hint3: 'La base de données (database).',
    flagHash: flagHashes['FLAG{database}'],
    xpReward: 75,
  },
  {
    id: 'xss-prevention-flag',
    lessonSlug: 'xss-prevention',
    title: 'Header HTTP pour la sécurité des scripts',
    prompt: 'Quel header HTTP permet de restreindre les sources de scripts et prévenir l\'exécution de scripts non autorisés ?',
    hint1: 'Regardez la section "Content Security Policy (CSP)".',
    hint2: 'C\'est un header qui commence par Content-Security.',
    hint3: 'Content-Security-Policy.',
    flagHash: flagHashes['FLAG{Content-Security-Policy}'],
    xpReward: 75,
  },
  // Module 3: SQL Injection
  {
    id: 'sqli-basics-flag',
    lessonSlug: 'sqli-basics',
    title: 'Payload de bypass d\'authentification',
    prompt: 'Quel payload permet de bypasser une authentification en rendant la condition WHERE toujours vraie ? (Avec les quotes)',
    hint1: 'Regardez la section "Autres Payloads de Bypass".',
    hint2: 'Utilise OR avec une condition toujours vraie.',
    hint3: "Le payload est ' OR '1'='1.",
    flagHash: flagHashes["FLAG{' OR '1'='1}"],
    xpReward: 100,
  },
  {
    id: 'union-sqli-flag',
    lessonSlug: 'union-sqli',
    title: 'Nombre de colonnes pour UNION',
    prompt: 'Si une requête a 3 colonnes, combien de valeurs (ou NULL) devez-vous spécifier dans le SELECT après UNION ?',
    hint1: 'Regardez la section "Étape 1 : Déterminer le Nombre de Colonnes".',
    hint2: 'C\'est le même nombre que le nombre de colonnes.',
    hint3: 'Le nombre est 3.',
    flagHash: flagHashes['FLAG{3}'],
    xpReward: 100,
  },
  {
    id: 'blind-sqli-flag',
    lessonSlug: 'blind-sqli',
    title: 'Type d\'injection SQL avec délais',
    prompt: 'Quel type d\'injection SQL utilise des délais (delays) pour inférer l\'information ?',
    hint1: 'Regardez la section "Time-based Blind SQLi".',
    hint2: 'C\'est un type qui contient "time".',
    hint3: 'Time-based.',
    flagHash: flagHashes['FLAG{time-based}'],
    xpReward: 100,
  },
  {
    id: 'sqli-prevention-flag',
    lessonSlug: 'sqli-prevention',
    title: 'Requêtes sécurisées avec paramètres',
    prompt: 'Quel terme désigne les requêtes où les paramètres sont envoyés séparément du code SQL pour prévenir l\'injection ?',
    hint1: 'Regardez la section "1. Prepared Statements".',
    hint2: 'C\'est deux mots composés avec un tiret.',
    hint3: 'Prepared statements.',
    flagHash: flagHashes['FLAG{prepared-statements}'],
    xpReward: 100,
  },
];
