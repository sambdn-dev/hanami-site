'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogArticles, blogCategories, seasons } from '@/data/blogArticles';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedSeason, setSelectedSeason] = useState('Toutes');

  const filteredArticles = blogArticles.filter(article => {
    const matchCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    const matchSeason = selectedSeason === 'Toutes' || article.season === selectedSeason;
    return matchCategory && matchSeason;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF' }}>
      {/* Header */}
      <section style={{ padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1A1A1A' }}>
            Le Blog Hanami
          </h1>
          <p style={{ color: '#666666', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Conseils d'experts, guides pratiques et actualités pour un gazon parfait toute l'année
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div className="blog-layout">
          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E8E5DF', position: 'sticky', top: '100px' }}>
              {/* Categories */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1A1A1A' }}>Catégories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {blogCategories.map(cat => (
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

              {/* Seasons */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1A1A1A' }}>Saison</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {seasons.map(season => (
                    <button
                      key={season}
                      onClick={() => setSelectedSeason(season)}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: selectedSeason === season ? '#FFF4E6' : 'transparent',
                        color: selectedSeason === season ? '#FF8C42' : '#666666',
                        fontWeight: selectedSeason === season ? 600 : 400,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Articles Grid */}
          <div style={{ flex: 1 }}>
            <p style={{ color: '#666666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
            </p>

            <div className="blog-grid">
              {filteredArticles.map(article => (
                <Link 
                  key={article.id} 
                  href={`/blog/${article.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid #E8E5DF',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}>
                    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                      <img 
                        src={article.image} 
                        alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        left: '1rem', 
                        backgroundColor: '#2D5016', 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600 
                      }}>
                        {article.season}
                      </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#FF8C42', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {article.category}
                      </div>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1A1A1A', lineHeight: 1.4 }}>
                        {article.title}
                      </h2>
                      <p style={{ fontSize: '0.875rem', color: '#666666', lineHeight: 1.6 }}>
                        {article.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
