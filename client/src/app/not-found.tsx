import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Decoration */}
        <div className="text-8xl font-bold text-accent-green/20 mb-4">404</div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Page non trouvée
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          Vérifiez l'URL ou retournez à l'accueil.
        </p>

        {/* Terminal decoration */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 font-mono text-sm mb-8 text-left">
          <p className="text-text-muted">$ curl -I https://bugbounty-academy.com{window.location.pathname}</p>
          <p className="text-accent-red">HTTP/1.1 404 Not Found</p>
          <p className="text-text-muted mt-2">$ cd /</p>
          <p className="text-accent-green">Retour à l'accueil...</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/modules"
            className="px-6 py-3 border border-cyber-border-light text-text-primary rounded-lg hover:bg-cyber-card transition-colors"
          >
            Voir les modules
          </Link>
        </div>
      </div>
    </div>
  );
}
