'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, Leaf, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { productsData } from '@/data/products';

export default function CartPanel() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, showCartPanel, setShowCartPanel } = useCart();
  
  if (!showCartPanel) return null;

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = productsData.find(p => p.id === parseInt(id));
    return { product, quantity: qty };
  }).filter(item => item.product);

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100
        }}
        onClick={() => setShowCartPanel(false)}
      />
      
      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '400px',
        maxWidth: '100vw',
        backgroundColor: 'white',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #E8E5DF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingCart size={24} color="#2D5016" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Mon panier</h2>
          </div>
          <button 
            onClick={() => setShowCartPanel(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666666' }}>
              <ShoppingCart size={60} color="#E8E5DF" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Votre panier est vide</p>
              <p style={{ fontSize: '0.875rem' }}>Découvrez notre sélection de produits professionnels</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map(({ product, quantity }) => product && (
                <div key={product.id} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#F5F3EF',
                  borderRadius: '12px',
                  border: '1px solid #E8E5DF'
                }}>
                  {/* Image placeholder */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #E8F5F0, #FFF4E6)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Leaf size={28} color="#00C896" style={{ opacity: 0.5 }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#666666', marginBottom: '0.25rem' }}>
                      {product.brand}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '0.25rem' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666666', marginBottom: '0.5rem' }}>
                      {product.weight}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Quantity controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #E8E5DF',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #E8E5DF',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price & Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: '#1A1A1A' }}>
                          {(product.price * quantity).toFixed(2)}€
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#999999',
                            padding: '0.25rem'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #E8E5DF',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1rem', color: '#666666' }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A' }}>
                {getCartTotal().toFixed(2)}€
              </span>
            </div>
            <Link
              href="/panier"
              onClick={() => setShowCartPanel(false)}
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#2D5016',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              Commander
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
