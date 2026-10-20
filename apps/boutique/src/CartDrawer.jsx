import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, CaretDown, Check, LockSimple, Minus, Plus, ShoppingCart, Trash, X } from '@phosphor-icons/react';
import { getProductForVariant, formatPrice } from './variants.js';
import { basketTaxTotals } from './taxes.js';
import './cart.css';

export function CartDrawer({ items, count, subtotal, onQuantity, onRemove, onClose, onBrowse, renderPackshot, checkoutReady = false, checkoutPending = false, checkoutBusy = false, onCheckout, checkoutError, commerceConnected, onRefresh }) {
  const dialog = useRef(null);
  const titleId = useId();
  const lines = items.map(item => ({ ...item, product: getProductForVariant(item.id) }));
  const taxes = basketTaxTotals(items);
  const total = subtotal === null ? 'Montant à vérifier' : formatPrice(subtotal);

  useEffect(() => {
    const element = dialog.current;
    const returnFocus = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.documentElement.style.overflow = previousOverflow;
      const target = returnFocus?.isConnected && returnFocus !== document.body ? returnFocus : document.querySelector('[data-cart-launch]');
      target?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(<dialog ref={dialog} className="basket-drawer" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="basket-heading"><div className="basket-heading-copy"><p className="eyebrow">LA SÉLECTION HANAMI</p><h2 id={titleId}>Votre panier <span className="basket-heading-count">{count}</span></h2></div><button className="icon-button basket-close" aria-label="Fermer le panier" onClick={onClose}><X size={22} /></button></header>
    {!items.length ? <div className="basket-empty"><span className="basket-empty-icon"><ShoppingCart size={36} weight="light" /></span><h3>Tout commence<br />par le bon produit.</h3><p>Votre panier est encore vide.<br />Retrouvez nos essentiels pour votre gazon.</p><button className="primary-button" onClick={onBrowse}>Découvrir la sélection <ArrowRight size={19} /></button></div> : <>
      <div className="basket-content">
        <><p className="basket-intro">{count} article{count > 1 ? 's' : ''} pour prendre soin de votre gazon.</p><ul className="basket-items">{lines.map(({ product: p, quantity }) => <li className="basket-item" key={p.id}>
          <div className="basket-item-picture">{renderPackshot(p)}</div><div className="basket-item-info"><p className="maker">{p.manufacturer}</p><h3>{p.name}</h3><span className="basket-format">{p.packaging}</span><p className="basket-unit-price">{Number.isSafeInteger(p.priceTtcCents) ? `${formatPrice(p.priceTtcCents)} TTC / unité` : "Actualisation du prix…"}</p><div className="basket-item-bottom"><div className="basket-quantity" role="group" aria-label={`Quantité de ${p.name} ${p.packaging}`}><button aria-label={`Retirer une unité de ${p.name} ${p.packaging}`} onClick={() => onQuantity(p.id, quantity - 1)}><Minus size={15} /></button><output aria-live="polite">{quantity}</output><button aria-label={`Ajouter une unité de ${p.name} ${p.packaging}`} disabled={quantity >= 99} onClick={() => onQuantity(p.id, quantity + 1)}><Plus size={15} /></button></div><strong className="basket-line-total">{Number.isSafeInteger(p.priceTtcCents) ? formatPrice(p.priceTtcCents * quantity) : "—"}</strong></div><button className="basket-remove" aria-label={`Supprimer ${p.name} ${p.packaging} du panier`} onClick={() => onRemove(p.id)}><Trash size={15} /> Retirer</button></div>
        </li>)}</ul></>
      </div>
      <footer className="basket-footer">{checkoutError && <div className="basket-checkout-error" role="alert"><p>{checkoutError}</p><button type="button" className="text-button" onClick={onRefresh}>Actualiser mon panier</button></div>}
        {taxes && <><div className="basket-tax-row"><span>Sous-total HT</span><strong>{formatPrice(taxes.totalHtCents)}</strong></div><details className="basket-tax-details"><summary><span>TVA <CaretDown size={13} /></span><strong>{formatPrice(taxes.totalVatCents)}</strong></summary><dl>{taxes.groups.map(group => <div key={group.rateBasisPoints}><dt>TVA {group.rateBasisPoints / 100} %</dt><dd>{formatPrice(group.vatCents)}</dd></div>)}</dl></details></>}
        <div className="basket-total"><span>Total <small>TTC</small></span><strong>{total}</strong></div><p className="basket-delivery">Sur commande fournisseur · Livraison France en 3 à 5 jours ouvrés. Frais de 9 à 22 €, calculés au paiement.</p><button className="primary-button" disabled={!checkoutReady || checkoutBusy || subtotal === null} onClick={onCheckout} aria-describedby={!checkoutReady ? `${titleId}-checkout` : undefined}>{checkoutBusy ? 'Préparation du paiement…' : 'Commander'} <LockSimple size={18} /></button><button className="basket-continue" onClick={onClose}><ArrowLeft size={16} /> Continuer mes achats</button><p className="basket-preview-note"><Check size={14} /> Panier conservé sur cet appareil.<br /><span id={`${titleId}-checkout`}>{checkoutReady ? 'Paiement sécurisé. Taxes et livraison confirmées avant paiement.' : checkoutPending ? 'Les commandes seront bientôt ouvertes. Votre panier est conservé.' : commerceConnected ? 'Un format de ce panier est indisponible actuellement.' : 'Connexion de la boutique en cours.'}</span></p>
      </footer>
    </>}
  </dialog>, document.body);
}
