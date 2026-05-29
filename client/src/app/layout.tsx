import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'BugBounty Academy - Apprends le Bug Bounty',
  description:
    'Plateforme de formation interactive au bug bounty et à la cybersécurité. Apprenez les vulnérabilités web, pratiquez avec des challenges et devenez un hunter.',
  keywords: ['bug bounty', 'cybersécurité', 'hacking', 'formation', 'CTF', 'web security', 'XSS', 'SQL injection'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-cyber-bg">
        <Navbar />
        <main className="pt-16"> {/* Padding top for fixed navbar */}
          {children}
        </main>
      </body>
    </html>
  );
}
