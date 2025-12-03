'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, Trash2, Leaf, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { productsData } from '@/data/products';

export default function PanierPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
    notes: '',
  });

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = productsData.find(p => p.id === parseInt(id));
    return { product, quantity: qty };
  }).filter(item => item.product);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Votre demande a été envoyée ! Notre équipe vous recontactera sous 24-48h.');
  };

  const subtotal = getCartTotal();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F3EF',
      boxSizing: 'border-box',
    }}>
      {/* Back link */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 2rem 0',
        boxSizing: 'border-box',
      }}>
        <Link
          href="/boutique"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#666666',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          <ArrowLeft size={16} />
          Continuer mes achats
        </Link>
      </div>

      {/* Title */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem 2rem 2rem',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1A1A1A',
          margin: 0,
        }}>
          Mon panier ({getCartCount()} article{getCartCount() > 1 ? 's' : ''})
        </h1>
      </div>

      {/* Main content */}
      <div style={{
        backgroundColor: '#F5F3EF',
        padding: '0 0 3rem',
        boxSizing: 'border-box',
      }}>
        <div className="cart-layout" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
        }}>
          {/* Cart items */}
          <div className="cart-items" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {cartItems.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '3rem 2rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <Leaf size={60} color="#E8E5DF" style={{ marginBottom: '1rem' }} />
                <p style={{ fontSize: '1rem', color: '#666666', marginBottom: '1rem' }}>
                  Votre panier est vide
                </p>
                <Link
                  href="/boutique"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#2D5016',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => product && (
                <div key={product.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}>
                  {/* Product image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #E8F5F0, #FFF4E6)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Leaf size={32} color="#00C896" style={{ opacity: 0.5 }} />
                  </div>

                  {/* Product info */}
                  <div style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#666666',
                      marginBottom: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {product.brand}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      marginBottom: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {product.name}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#666666',
                    }}>
                      {product.weight}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0,
                  }}>
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1px solid #E8E5DF',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{
                      fontWeight: 600,
                      minWidth: '32px',
                      textAlign: 'center',
                      fontSize: '1rem',
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1px solid #E8E5DF',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Price */}
                  <div style={{
                    textAlign: 'right',
                    flexShrink: 0,
                    minWidth: '80px',
                  }}>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#1A1A1A',
                    }}>
                      {(product.price * quantity).toFixed(2)}€
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#666666',
                    }}>
                      {product.price.toFixed(2)}€ / unité
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#FFF0F0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={18} color="#E53935" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary panel */}
          <div className="cart-summary">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              position: 'sticky',
              top: '100px',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1A1A1A',
                marginBottom: '1.5rem',
                margin: '0 0 1.5rem',
              }}>
                Récapitulatif
              </h2>

              {/* Subtotal */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}>
                <span style={{ color: '#666666' }}>Sous-total</span>
                <span style={{ fontWeight: 600 }}>{subtotal.toFixed(2)}€</span>
              </div>

              {/* Shipping */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #E8E5DF',
              }}>
                <span style={{ color: '#666666' }}>Livraison</span>
                <span style={{ color: '#666666' }}>Sur devis</span>
              </div>

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D5016' }}>
                  {subtotal.toFixed(2)}€
                </span>
              </div>

              {/* Contact form */}
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1A1A1A',
                marginBottom: '1rem',
                margin: '0 0 1rem',
              }}>
                Vos coordonnées
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Prénom / Nom */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}>
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom *"
                    required
                    value={formData.prenom}
                    onChange={handleInputChange}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '0.75rem 1rem',
                      border: '1px solid #E8E5DF',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom *"
                    required
                    value={formData.nom}
                    onChange={handleInputChange}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '0.75rem 1rem',
                      border: '1px solid #E8E5DF',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Téléphone */}
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Téléphone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Adresse */}
                <input
                  type="text"
                  name="adresse"
                  placeholder="Adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Code postal / Ville */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}>
                  <input
                    type="text"
                    name="codePostal"
                    placeholder="Code postal"
                    value={formData.codePostal}
                    onChange={handleInputChange}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '0.75rem 1rem',
                      border: '1px solid #E8E5DF',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <input
                    type="text"
                    name="ville"
                    placeholder="Ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '0.75rem 1rem',
                      border: '1px solid #E8E5DF',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Notes */}
                <textarea
                  name="notes"
                  placeholder="Notes (optionnel)"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E8E5DF',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: cartItems.length === 0 ? '#E8E5DF' : '#2D5016',
                    color: cartItems.length === 0 ? '#999999' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: cartItems.length === 0 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxSizing: 'border-box',
                  }}
                >
                  Envoyer ma demande
                  <ChevronRight size={20} />
                </button>
              </form>

              {/* Info text */}
              <p style={{
                fontSize: '0.75rem',
                color: '#666666',
                textAlign: 'center',
                marginTop: '1rem',
                marginBottom: 0,
                lineHeight: 1.5,
              }}>
                Notre équipe vous recontactera sous 24-48h pour finaliser votre commande et organiser la livraison.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
