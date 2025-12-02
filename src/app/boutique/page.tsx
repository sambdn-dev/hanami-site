'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Filter, Leaf, ChevronDown } from 'lucide-react';
import { productsData, categories, brands } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

export default function BoutiquePage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedBrand, setSelectedBrand] = useState('Toutes');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = productsData.filter(product => {
    const matchCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchBrand = selectedBrand === 'Toutes' || product.brand === selectedBrand;
    return matchCategory && matchBrand;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF' }}>
      {/* Header */}
      <section style={{ padding: '2rem 2rem 1rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1A1A1A' }}>
            Boutique Hanami
          </h1>
          <p style={{ color: '#666666', fontSize: '1.125rem' }}>
            Produits professionnels accessibles aux particuliers
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E8E5DF', position: 'sticky', top: '100px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Filter size={20} color="#2D5016" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Filtres</h3>
              </div>

              {/* Categories */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#666666' }}>Catégorie</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: selectedCategory === cat ? '#E8F2E6' : 'transparent',
                        color: selectedCategory === cat ? '#2D5016' : '#666666',
                        fontWeight: selectedCategory === cat ? 600 : 400,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#666666' }}>Marque</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: selectedBrand === brand ? '#E8F2E6' : 'transparent',
                        color: selectedBrand === brand ? '#2D5016' : '#666666',
                        fontWeight: selectedBrand === brand ? 600 : 400,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div style={{ flex: 1 }}>
            {/* Sort */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#666666', fontSize: '0.875rem' }}>
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#666666' }}>Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #E8E5DF',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="name">Nom</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="shop-grid">
              {filteredProducts.map(product => (
                <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E8E5DF', transition: 'all 0.3s' }}>
                  <Link href={`/boutique/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '100%', height: '140px', background: 'linear-gradient(135deg, #E8F5F0, #FFF4E6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      <Leaf size={40} color="#00C896" style={{ opacity: 0.5 }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#666666', marginBottom: '0.25rem' }}>{product.brand}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem', color: '#1A1A1A' }}>{product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666666', marginBottom: '0.75rem' }}>{product.weight}</div>
                  </Link>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1A1A1A' }}>
                      {product.price > 0 ? `${product.price.toFixed(2)}€` : 'Sur devis'}
                    </span>
                    {product.price > 0 && (
                      <button
                        onClick={() => addToCart(product.id)}
                        style={{
                          backgroundColor: '#2D5016',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
