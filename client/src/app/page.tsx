export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto animate-fade-in">
        {/* Terminal-style header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-card border border-cyber-border rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-text-secondary text-sm font-mono">v0.1.0 — MVP</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-gradient">BugBounty</span>
          <br />
          <span className="text-text-primary">Academy</span>
        </h1>

        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
          Apprends le bug bounty de A à Z. Vulnérabilités web, outils, méthodologie
          — le tout avec des labs pratiques et des challenges interactifs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/setup"
            className="px-8 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg
                       hover:bg-accent-green-dim transition-colors glow-green"
          >
            Commencer gratuitement
          </a>
          <a
            href="/modules"
            className="px-8 py-3 border border-cyber-border-light text-text-primary rounded-lg
                       hover:bg-cyber-card transition-colors"
          >
            Voir les modules
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
          <div>
            <div className="text-3xl font-bold text-accent-green">3</div>
            <div className="text-sm text-text-muted">Modules</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-blue">12</div>
            <div className="text-sm text-text-muted">Challenges</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-purple">100%</div>
            <div className="text-sm text-text-muted">Gratuit</div>
          </div>
        </div>
      </div>

      {/* Terminal preview decoration */}
      <div className="mt-20 w-full max-w-2xl mx-auto">
        <div className="bg-cyber-card border border-cyber-border rounded-xl overflow-hidden">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-cyber-surface border-b border-cyber-border">
            <span className="w-3 h-3 rounded-full bg-accent-red" />
            <span className="w-3 h-3 rounded-full bg-accent-orange" />
            <span className="w-3 h-3 rounded-full bg-accent-green" />
            <span className="ml-4 text-text-muted text-sm font-mono">~/bugbounty-academy</span>
          </div>
          {/* Terminal content */}
          <div className="p-6 font-mono text-sm leading-relaxed">
            <p className="text-text-muted">$ whoami</p>
            <p className="text-accent-green mb-3">apprenti-hacker</p>
            <p className="text-text-muted">$ cat parcours.txt</p>
            <p className="text-text-primary mb-1">
              <span className="text-accent-blue">[01]</span> Fondamentaux Web
            </p>
            <p className="text-text-primary mb-1">
              <span className="text-accent-blue">[02]</span> Cross-Site Scripting (XSS)
            </p>
            <p className="text-text-primary mb-1">
              <span className="text-accent-blue">[03]</span> SQL Injection
            </p>
            <p className="text-text-muted">
              $ ./start-learning.sh<span className="animate-pulse text-accent-green">_</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
