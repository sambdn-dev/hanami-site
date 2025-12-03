'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { productsData } from '@/data/products';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight, Leaf } from 'lucide-react';

export default function PanierPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const product = productsData.find(p => p.id === parseInt(id));
    return product ? { ...product, quantity } : null;
  }).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsComplete(true);
    clearCart();
  };

  if (isComplete) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F3EF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2D5016, #00C896)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            fontSize: '2.5rem'
          }}>
            ✓
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1A1A1A' }}>
            Demande envoyée !
          </h1>

          <p style={{ fontSize: '1.125rem', color: '#666666', marginBottom: '2rem', lineHeight: 1.6 }}>
            Merci pour votre commande. Notre équipe va traiter votre demande et vous recontacter
            sous <strong>24-48h</strong> pour confirmer les détails et le paiement.
          </p>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2D5016',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F3EF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
          <ShoppingBag size={64} color="#E8E5DF" style={{ marginBottom: '1.5rem' }} />

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#1A1A1A' }}>
            Votre panier est vide
          </h1>

          <p style={{ color: '#666666', marginBottom: '2rem' }}>
            Découvrez nos produits professionnels pour un gazon parfait
          </p>

          <Link
            href="/boutique"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2D5016',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Voir la boutique
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E8E5DF',
        padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link
            href="/boutique"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#666666',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={18} />
            Continuer mes achats
          </Link>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1A1A1A' }}>
            Mon panier ({getCartCount()} article{getCartCount() > 1 ? 's' : ''})
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem',
          alignItems: 'start'
        }} className="cart-grid">
          {/* Liste des produits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item: any) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  border: '1px solid #E8E5DF'
                }}
              >
                {/* Image placeholder */}
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#F5F3EF',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Leaf size={40} color="#2D5016" style={{ opacity: 0.3 }} />
                </div>

                {/* Infos produit */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: '#666666', marginBottom: '0.25rem' }}>
                    {item.brand}
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '0.25rem' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666666' }}>
                    {item.weight}
                  </div>
                </div>

                {/* Quantité */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#F5F3EF',
                  borderRadius: '8px',
                  padding: '0.5rem'
                }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Prix */}
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A' }}>
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666666' }}>
                    {item.price.toFixed(2)}€ / unité
                  </div>
                </div>

                {/* Supprimer */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Formulaire et récapitulatif */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid #E8E5DF',
            position: 'sticky',
            top: '2rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A1A' }}>
              Récapitulatif
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E8E5DF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666666' }}>
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(2)}€</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666666' }}>
                <span>Livraison</span>
                <span>Sur devis</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D5016' }}>
                {getCartTotal().toFixed(2)}€
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#1A1A1A' }}>
                Vos coordonnées
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Prénom *"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={{
                    padding: '0.875rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Nom *"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  style={{
                    padding: '0.875rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <input
                type="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #E8E5DF',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}
              />

              <input
                type="tel"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #E8E5DF',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}
              />

              <input
                type="text"
                placeholder="Adresse"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #E8E5DF',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Code postal"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  style={{
                    padding: '0.875rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{
                    padding: '0.875rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <textarea
                placeholder="Notes (optionnel)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #E8E5DF',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem',
                  resize: 'none'
                }}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: isSubmitting ? '#E8E5DF' : '#2D5016',
                  color: isSubmitting ? '#999' : 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                {!isSubmitting && <ChevronRight size={20} />}
              </button>

              <p style={{
                fontSize: '0.75rem',
                color: '#666666',
                textAlign: 'center',
                marginTop: '1rem'
              }}>
                Notre équipe vous recontactera sous 24-48h pour finaliser votre commande et organiser la livraison.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
