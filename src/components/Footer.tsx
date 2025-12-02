'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Shield } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isPro = pathname === '/pro' || pathname === '/booking';

  return (
    <footer style={{ 
      backgroundColor: isPro ? '#0F1419' : '#F5F3EF', 
      color: isPro ? '#A0A0A0' : '#666666',
      borderTop: isPro ? '1px solid #2A2F3A' : '1px solid #E8E5DF'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div className="footer-grid">
          {/* Logo & Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Leaf size={32} color={isPro ? '#00D9A3' : '#00C896'} style={{ display: 'inline-block' }} />
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: isPro ? '#00D9A3' : '#2D5016', marginTop: '0.5rem' }} className="font-logo">hanami</p>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Des gazons plus beaux, plus vite, plus longtemps
            </p>
          </div>

          {/* Hanami Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: isPro ? '#E8E8E8' : '#1A1A1A' }}>Hanami</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>À propos</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Notre méthode</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Contact</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Devenir partenaire</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: isPro ? '#E8E8E8' : '#1A1A1A' }}>Ressources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/blog" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Blog</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Guides pratiques</Link></li>
              <li><Link href="/calculatrice" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Calculatrice</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: isPro ? '#E8E8E8' : '#1A1A1A' }}>Légal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Mentions légales</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>CGV</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Politique de confidentialité</Link></li>
              <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.875rem' }}>Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '2rem', borderTop: isPro ? '1px solid #2A2F3A' : '1px solid #E8E5DF', marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>© 2025 Hanami - Tous droits réservés</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: isPro ? '#666666' : '#999999', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} />
                Paiement sécurisé
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {/* Visa */}
                <div style={{ 
                  backgroundColor: isPro ? '#2A2F3A' : '#F5F3EF', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '6px',
                  border: isPro ? '1px solid #3A3F4A' : '1px solid #E8E5DF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isPro ? '#E8E8E8' : '#1A1A1A'
                }}>
                  VISA
                </div>
                {/* Mastercard */}
                <div style={{ 
                  backgroundColor: isPro ? '#2A2F3A' : '#F5F3EF', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '6px',
                  border: isPro ? '1px solid #3A3F4A' : '1px solid #E8E5DF',
                  display: 'flex',
                  gap: '0.25rem',
                  alignItems: 'center'
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EB001B', opacity: 0.8 }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F79E1B', opacity: 0.8, marginLeft: '-6px' }}></div>
                </div>
                {/* CB */}
                <div style={{ 
                  backgroundColor: isPro ? '#2A2F3A' : '#F5F3EF', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '6px',
                  border: isPro ? '1px solid #3A3F4A' : '1px solid #E8E5DF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isPro ? '#E8E8E8' : '#1A1A1A'
                }}>
                  CB
                </div>
                {/* PayPal */}
                <div style={{ 
                  backgroundColor: isPro ? '#2A2F3A' : '#F5F3EF', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '6px',
                  border: isPro ? '1px solid #3A3F4A' : '1px solid #E8E5DF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0070BA'
                }}>
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
