'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Users, Sparkles, Leaf, Star, ArrowRight } from 'lucide-react';
import { productsData } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

// Slider Avant/Après Hero
function HeroSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Transformation réelle</h3>
        <div style={{ color: '#666666', fontSize: '0.9rem' }}>Résultat 21 jours après la rénovation avec la méthode Hanami</div>
      </div>
      
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '400px', 
          borderRadius: '12px', 
          overflow: 'hidden',
          cursor: 'ew-resize',
          userSelect: 'none'
        }}
        onMouseMove={handleSliderMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Badges */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'white', color: '#1A1A1A', padding: '0.375rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', zIndex: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          Avant
        </div>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'white', color: '#1A1A1A', padding: '0.375rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', zIndex: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          Après
        </div>

        {/* Image APRÈS */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://i.imgur.com/0BP3AAk.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        {/* Image AVANT avec clip */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://i.imgur.com/LyrbFS2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} />

        {/* Slider line */}
        <div style={{ position: 'absolute', top: 0, left: `${sliderPosition}%`, width: '4px', height: '100%', backgroundColor: 'white', transform: 'translateX(-2px)', zIndex: 2, boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            ⬌
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666666', fontSize: '0.875rem' }}>
        ← Faites glisser pour comparer →
      </div>
    </div>
  );
}

// Carousel 5 moments
function FiveMomentsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const moments = [
    { title: 'Préparation de printemps 🌸', desc: 'Le réveil de la nature est le moment idéal pour scarifier, aérer le sol et semer là où c\'est nécessaire.', gradient: 'linear-gradient(135deg, #FFE5F1 0%, #D4F1F4 50%, #C8E6C9 100%)' },
    { title: 'Renforcement d\'été ☀️', desc: 'L\'été peut être rude pour votre pelouse. Grâce à nos conseils, vous apprendrez à maintenir l\'humidité.', gradient: 'linear-gradient(135deg, #FFF59D 0%, #FFE082 30%, #FFAB91 70%, #FFCCBC 100%)' },
    { title: 'Transition d\'automne 🍂', desc: 'L\'automne est le moment de renforcer votre gazon pour l\'aider à résister aux mois froids.', gradient: 'linear-gradient(135deg, #FFCCBC 0%, #FFAB91 30%, #D7CCC8 70%, #BCAAA4 100%)' },
    { title: 'Protection hivernale ❄️', desc: 'Même en hiver, votre gazon a besoin d\'attention. Nos recommandations protègent votre pelouse.', gradient: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 30%, #CFD8DC 70%, #B0BEC5 100%)' },
    { title: 'Sortie d\'hiver ❄️🌺', desc: 'Deux mois avant le printemps, nous vous aidons à réveiller votre gazon.', gradient: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 30%, #E1BEE7 70%, #F8BBD0 100%)' }
  ];

  return (
    <section style={{ padding: '4rem 2rem', backgroundColor: '#F5F3EF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>5 moments clés pour un gazon parfait</h2>
          <p style={{ fontSize: '1.125rem', color: '#666666' }}>
            Nous vous accompagnons à <strong>5 moments clés de l'année</strong>
          </p>
        </div>

        <div style={{ position: 'relative', background: moments[currentSlide].gradient, borderRadius: '16px', padding: '3rem 5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minHeight: '250px', transition: 'background 0.5s ease' }}>
          <button onClick={() => setCurrentSlide((prev) => (prev - 1 + moments.length) % moments.length)} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #E8E5DF', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <ChevronLeft size={24} color="#2D5016" />
          </button>

          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>{moments[currentSlide].title}</h3>
            <p style={{ fontSize: '1.125rem', color: '#1A1A1A', lineHeight: 1.8 }}>{moments[currentSlide].desc}</p>
          </div>

          <button onClick={() => setCurrentSlide((prev) => (prev + 1) % moments.length)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #E8E5DF', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <ChevronRight size={24} color="#2D5016" />
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            {moments.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} style={{ width: index === currentSlide ? '32px' : '12px', height: '12px', borderRadius: '6px', border: 'none', backgroundColor: index === currentSlide ? '#2D5016' : '#E8E5DF', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Section Produits
function ProductsSection() {
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Nos produits professionnels</h2>
            <p style={{ color: '#666666' }}>Les mêmes que les paysagistes utilisent</p>
          </div>
          <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#2D5016', fontWeight: 600, textDecoration: 'none' }}>
            Voir tout
            <ArrowRight size={20} />
          </Link>
        </div>

        <div ref={scrollContainerRef} className="products-scroll scrollbar-hide" style={{ cursor: 'grab' }}>
          {productsData.slice(0, 8).map(product => (
            <div key={product.id} style={{ minWidth: '280px', backgroundColor: '#F5F3EF', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E8E5DF' }}>
              <div style={{ width: '100%', height: '160px', background: 'linear-gradient(135deg, #E8F5F0, #FFF4E6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Leaf size={50} color="#00C896" style={{ opacity: 0.5 }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666666', marginBottom: '0.25rem' }}>{product.brand}</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1A1A1A' }}>{product.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#666666', marginBottom: '1rem' }}>{product.weight}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A' }}>{product.price > 0 ? `${product.price.toFixed(2)}€` : 'Sur devis'}</span>
                {product.price > 0 && (
                  <button onClick={() => addToCart(product.id)} style={{ backgroundColor: '#2D5016', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                    Ajouter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Page principale
export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF' }}>
      {/* Hero */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div className="hero-grid">
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#E8F2E6', color: '#2D5016', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>✓</span>
              Méthode professionnelle accessible
            </div>
            
            <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', color: '#1A1A1A', fontWeight: 700 }}>
              Des gazons{' '}
              <span className="gradient-text">
                plus beaux, plus vite, plus longtemps
              </span>
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: '#666666', marginBottom: '2rem' }}>
              Coaching personnalisé, rénovation express et produits professionnels pour particuliers et paysagistes
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <Link href="/onboarding" className="btn-primary">
                Diagnostic Express
                <ChevronRight size={20} />
              </Link>
              <Link href="/pro" className="btn-secondary">
                <Users size={20} />
                Je suis paysagiste
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E8E5DF' }}>
              <div style={{ display: 'flex' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C896, #FF8C42)', border: '3px solid #F5F3EF', marginLeft: i === 0 ? 0 : '-12px' }} />
                ))}
              </div>
              <div>
                <div style={{ color: '#FF8C42', fontSize: '1.2rem' }}>★★★★★</div>
                <div style={{ color: '#666666', fontSize: '0.9rem' }}>
                  <strong>120+ clients satisfaits</strong> · 4.9/5
                </div>
              </div>
            </div>
          </div>

          <HeroSlider />
        </div>
      </section>

      {/* Méthode Hanami */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFF4E6', color: '#FF8C42', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
              <Sparkles size={18} />
              Notre différence
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: '#1A1A1A' }}>
              La méthode de rénovation Hanami
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#666666', maxWidth: '800px', margin: '0 auto' }}>
              Arrêtez de perdre votre temps avec des méthodes lourdes et peu efficaces
            </p>
          </div>

          <div className="reactif-grid">
            {/* Carte MYTHE */}
            <div style={{ backgroundColor: '#FEF2F2', border: '3px solid #FCA5A5', borderRadius: '20px', padding: '3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#DC2626', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>
                <span style={{ fontSize: '1.5rem' }}>❌</span>
                Ce qu'on vous fait croire
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#991B1B' }}>La méthode traditionnelle</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Retourner toute la terre', 'Briser les mottes à la main', 'Enlever pierres et débris', 'Ratisser pendant des heures'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✗</span>
                    </div>
                    <span style={{ color: '#991B1B', fontSize: '1rem', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte RÉALITÉ */}
            <div style={{ backgroundColor: '#F0FDF4', border: '3px solid #86EFAC', borderRadius: '20px', padding: '3rem', boxShadow: '0 8px 24px rgba(45, 80, 22, 0.15)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#16A34A', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✓</span>
                La méthode Hanami
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#166534' }}>Le regarnissage express</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Scarification légère uniquement', 'Semences pro adaptées', 'Résultats visibles en 3 semaines', 'Économie de temps et d\'argent'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ color: '#166534', fontSize: '1rem', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FiveMomentsCarousel />
      <ProductsSection />

      {/* CTA */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(45, 80, 22, 0.1), rgba(255, 140, 66, 0.1))', border: '1px solid rgba(45, 80, 22, 0.2)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Prêt à transformer votre gazon ?
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#666666', marginBottom: '2rem' }}>
            Obtenez votre diagnostic personnalisé en 2 minutes
          </p>
          <Link href="/onboarding" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1.25rem 2.5rem' }}>
            Commencer mon diagnostic
            <ChevronRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}
