import type { Metadata } from 'next';
import '@/styles/globals.css';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';

export const metadata: Metadata = {
  title: 'Hanami - Des gazons plus beaux, plus vite, plus longtemps',
  description: 'Coaching personnalisé, rénovation express et produits professionnels pour particuliers et paysagistes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Header />
          <CartPanel />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
