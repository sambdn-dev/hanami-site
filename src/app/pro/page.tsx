'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, TrendingUp, Clock, Users, Award, Sprout } from 'lucide-react';

export default function ProPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F1419', color: 'white' }}>
      {/* Hero */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div className="hero-grid">
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 217, 163, 0.2)', color: '#00D9A3', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(0, 217, 163, 0.3)' }}>
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              Pour les professionnels du paysage
            </div>
            
            <h1 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 700 }}>
              Devenez l'expert gazon de votre région avec{' '}
              <span className="gradient-text-pro">Hanami Pro</span>
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: '#A0A0A0', marginBottom: '2rem' }}>
              Augmentez vos marges, réduisez vos interventions et impressionnez vos clients avec des résultats professionnels garantis
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <Link href="/booking" className="btn-pro">
                Réserver mon appel découverte
                <Calendar size={22} />
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #2A2F3A' }}>
              {[
                { number: '+30%', label: 'de marge nette' },
                { number: '-60%', label: 'd\'allers-retours' },
                { number: '95%', label: 'satisfaction client' }
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00D9A3' }}>{stat.number}</div>
                  <div style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0, 217, 163, 0.1), rgba(255, 164, 99, 0.1))', 
            border: '1px solid rgba(0, 217, 163, 0.2)',
            borderRadius: '24px', 
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
              <p style={{ color: '#A0A0A0', fontSize: '1.125rem' }}>
                Votre gazon, notre expertise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#1A1F29' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Sans Hanami vs Avec Hanami
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#A0A0A0' }}>
              La différence qui change tout pour votre business
            </p>
          </div>

          <div className="reactif-grid">
            {/* Sans Hanami */}
            <div style={{ backgroundColor: '#0F1419', border: '2px solid #DC2626', borderRadius: '20px', padding: '2.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#DC2626', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>
                <span style={{ fontSize: '1.5rem' }}>❌</span>
                Sans Hanami
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Résultats incertains et aléatoires',
                  'Allers-retours coûteux pour corriger',
                  'Clients insatisfaits, mauvais avis',
                  'Concurrence sur les prix uniquement',
                  'Stress et pression sur les équipes'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✗</span>
                    </div>
                    <span style={{ color: '#FCA5A5', fontSize: '0.95rem', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avec Hanami */}
            <div style={{ backgroundColor: '#0F1419', border: '2px solid #00D9A3', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 24px rgba(0, 217, 163, 0.15)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#00D9A3', color: '#0F1419', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✓</span>
                Avec Hanami
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Résultats garantis dès 3 semaines',
                  '-60% d\'interventions correctives',
                  'Clients ravis qui recommandent',
                  'Différenciation par l\'expertise',
                  'Équipes formées et sereines'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#00D9A3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#0F1419', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ color: '#E8E8E8', fontSize: '0.95rem', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#0F1419' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Pourquoi les paysagistes choisissent Hanami</h2>
            <p style={{ fontSize: '1.25rem', color: '#A0A0A0' }}>Des résultats concrets, mesurables et rapides</p>
          </div>
          
          <div className="benefits-grid">
            {[
              { icon: TrendingUp, title: "Rentabilité garantie", desc: "Augmentez vos marges de 30%" },
              { icon: Clock, title: "Gain de temps", desc: "Réduisez vos allers-retours" },
              { icon: Users, title: "Satisfaction client", desc: "Résultats visibles dès 3 semaines" },
              { icon: Award, title: "Expertise reconnue", desc: "Formez vos équipes aux techniques pros" }
            ].map((benefit, index) => (
              <div key={index} style={{ backgroundColor: '#1A1F29', padding: '2rem', borderRadius: '16px', border: '1px solid #2A2F3A' }}>
                <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, rgba(0, 217, 163, 0.2), rgba(255, 164, 99, 0.2))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <benefit.icon size={28} color="#00D9A3" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{benefit.title}</h3>
                <p style={{ color: '#A0A0A0', fontSize: '0.875rem' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 217, 163, 0.1), rgba(255, 164, 99, 0.1))', border: '1px solid rgba(0, 217, 163, 0.2)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Prêt à transformer vos chantiers gazon ?
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#A0A0A0', marginBottom: '2rem' }}>
            Réservez votre appel découverte gratuit de 30 minutes
          </p>
          <Link href="/booking" className="btn-pro">
            Réserver mon appel de 30 min
            <Calendar size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}
