import { useEffect, useId, useRef, useState } from 'react';
import { Minus, Plus, ShoppingCart, X } from '@phosphor-icons/react';
import { formatPrice, getVariant } from './variants.js';
import './quantity.css';

function panelPosition(trigger, panel) {
  const rect = trigger.getBoundingClientRect();
  const viewport = window.visualViewport;
  const topBound = (viewport?.offsetTop || 0) + 16;
  const bottomBound = (viewport ? viewport.offsetTop + viewport.height : window.innerHeight) - 16;
  const width = Math.min(288, window.innerWidth - 32);
  const height = panel?.offsetHeight || 224;
  const below = rect.bottom + height + 8 <= bottomBound;
  return {
    left: Math.max(16, Math.min(rect.right - width, window.innerWidth - width - 16)),
    top: Math.max(topBound, Math.min(below ? rect.bottom + 8 : rect.top - height - 8, bottomBound - height)),
  };
}

export function AddToCart({ product, onAdd, disabled, maxQuantity = 99, compact = false, onOpen }) {
  const id = useId();
  const trigger = useRef(null);
  const panel = useRef(null);
  const input = useRef(null);
  const [open, setOpen] = useState(false);
  const [rawQuantity, setRawQuantity] = useState('1');
  const [position, setPosition] = useState({ left: 16, top: 16 });
  const quantity = Number(rawQuantity);
  const priceTtcCents = getVariant(product.id)?.priceTtcCents;
  const valid = rawQuantity !== '' && Number.isInteger(quantity) && quantity >= 1 && quantity <= maxQuantity;

  function close(returnFocus = false) {
    panel.current?.hidePopover();
    if (returnFocus) trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    const reposition = () => setPosition(panelPosition(trigger.current, panel.current));
    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    window.visualViewport?.addEventListener('resize', reposition);
    window.visualViewport?.addEventListener('scroll', reposition);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      window.visualViewport?.removeEventListener('resize', reposition);
      window.visualViewport?.removeEventListener('scroll', reposition);
    };
  }, [open]);

  function reveal() {
    if (open) { close(true); return; }
    onOpen?.();
    setRawQuantity('1');
    setPosition(panelPosition(trigger.current, panel.current));
    panel.current.showPopover();
    // Keep the mobile keyboard closed until the customer taps the numeric field.
    panel.current.focus({ preventScroll: true });
  }

  function submit(event) {
    event.preventDefault();
    if (!valid) { input.current?.focus(); return; }
    if (onAdd(product, quantity) !== false) close(true);
  }

  return <>
    <button ref={trigger} type="button" className={compact ? 'primary-button compact' : 'small-add'}
      disabled={disabled || maxQuantity < 1} onClick={reveal}
      aria-label={`Ajouter ${product.name} au panier`} aria-haspopup="dialog" aria-expanded={open} aria-controls={id}>
      <ShoppingCart size={compact ? 18 : 20} />{compact && <span>Ajouter</span>}
    </button>
    <div ref={panel} id={id} popover="auto" role="dialog" aria-modal="false" tabIndex={-1}
      aria-label={`Choisir la quantité de ${product.name}`} className="quantity-popover"
      style={{ left: position.left, top: position.top }}
      onToggle={event => setOpen(event.newState === 'open')}>
      <form onSubmit={submit}>
        <div className="quantity-heading"><div><strong>{product.name}</strong><small>{product.packaging}</small></div>
          <button type="button" className="quantity-close" aria-label="Fermer le sélecteur de quantité" onClick={() => close(true)}><X size={18} /></button>
        </div>
        <div className="quantity-selection"><label htmlFor={`${id}-value`}>Quantité</label>
          <div className="quantity-stepper">
            <button type="button" aria-label="Diminuer la quantité" disabled={!valid || quantity <= 1} onClick={() => setRawQuantity(String(quantity - 1))}><Minus size={17} /></button>
            <input ref={input} id={`${id}-value`} type="number" inputMode="numeric" min="1" max={maxQuantity} step="1"
              value={rawQuantity} onFocus={event => event.currentTarget.select()} onChange={event => setRawQuantity(event.target.value)} aria-invalid={!valid} />
            <button type="button" aria-label="Augmenter la quantité" disabled={!valid || quantity >= maxQuantity} onClick={() => setRawQuantity(String(quantity + 1))}><Plus size={17} /></button>
          </div>
        </div>
        <button type="submit" className="primary-button quantity-confirm" disabled={!valid}>
          <span>Ajouter au panier</span><strong>{valid && Number.isSafeInteger(priceTtcCents) ? formatPrice(priceTtcCents * quantity) : '—'}</strong>
        </button>
        {!valid && <p className="quantity-error" role="status">Choisissez de 1 à {maxQuantity} unités.</p>}
      </form>
    </div>
  </>;
}
