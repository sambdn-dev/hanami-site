'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Calculator, Leaf } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { productsData } from '@/data/products';

export default function Header() {
  const pathname = usePathname();
  const { getCartCount, setShowCartPanel } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const isPro = pathname === '/pro' || pathname === '/booking';
  const isOnboarding = pathname?.startsWith('/onboarding');

  const searchProducts = (query: string) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return productsData.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  };

  const searchResults = searchProducts(searchQuery);

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      backgroundColor: isPro ? 'rgba(26, 31, 41, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
      borderBottom: isPro ? '1px solid #2A2F3A' : '1px solid #E8E5DF',
      backdropFilter: 'blur(10px)'
    }}>
      <nav style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: isPro ? 'white' : '#2D5016' }} className="font-logo">hanami</span>
          {isPro && (
            <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(0, 217, 163, 0.2)', color: '#00D9A3', borderRadius: '4px' }}>PRO</span>
          )}
        </Link>
        
        {/* Search */}
        {!isOnboarding && (
          <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isPro ? '#666666' : '#999999', pointerEvents: 'none' }} />
            <input 
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim().length > 0);
              }}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              style={{ 
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                borderRadius: '8px',
                border: isPro ? '1px solid #2A2F3A' : '1px solid #E8E5DF',
                backgroundColor: isPro ? '#1A1F29' : '#F5F3EF',
                color: isPro ? '#E8E8E8' : '#1A1A1A',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                right: 0, 
                marginTop: '0.5rem', 
                backgroundColor: isPro ? '#1A1F29' : 'white',
                border: isPro ? '1px solid #2A2F3A' : '1px solid #E8E5DF',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 100
              }}>
                {searchResults.map(product => (
                  <Link 
                    key={product.id}
                    href={`/boutique/${product.id}`}
                    onClick={() => setShowSearchResults(false)}
                    style={{ 
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: isPro ? '1px solid #2A2F3A' : '1px solid #F5F3EF',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #E8F5F0, #FFF4E6)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Leaf size={20} color="#00C896" style={{ opacity: 0.5 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isPro ? '#E8E8E8' : '#1A1A1A', marginBottom: '0.125rem' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isPro ? '#A0A0A0' : '#666666' }}>
                        {product.brand} • {product.category}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isPro ? '#00D9A3' : '#1A1A1A' }}>
                      {product.price.toFixed(2)}€
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nav Links */}
        <div className="nav-links" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {!isPro && (
            <Link 
              href="/pro"
              style={{ color: '#1A1A1A', background: 'none', border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
            >
              Paysagistes
            </Link>
          )}
          <Link 
            href="/boutique"
            style={{ color: isPro ? 'white' : '#1A1A1A', background: 'none', border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Boutique
          </Link>
          <Link 
            href="/blog"
            style={{ color: isPro ? 'white' : '#1A1A1A', background: 'none', border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Blog
          </Link>
          <Link
            href="/calculatrice"
            style={{ 
              backgroundColor: 'transparent',
              color: isPro ? 'white' : '#1A1A1A',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 500,
              fontSize: '1rem',
              textDecoration: 'none'
            }}
          >
            Calculatrice
            <Calculator size={20} />
          </Link>
        </div>

        {/* Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button 
            onClick={() => setShowCartPanel(true)}
            style={{ 
              backgroundColor: 'transparent', 
              color: isPro ? 'white' : '#1A1A1A', 
              border: 'none', 
              padding: '0.5rem', 
              cursor: 'pointer',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShoppingCart size={20} />
            {getCartCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#00C896',
                color: 'white',
                fontSize: '0.65rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600
              }}>
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
