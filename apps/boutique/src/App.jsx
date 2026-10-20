import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MagnifyingGlass, ShoppingCart, ArrowRight, ArrowLeft, X, Plus, Check, FileText, ArrowUpRight, Leaf, Plant, Drop, CaretDown } from '@phosphor-icons/react';
import { products } from './products.js';
import { catalogueVariantIds, getCatalogueProducts, canBuy, getVariant, getVariants, getProductForVariant, formatPrice, basketSubtotal } from './variants.js';
import { searchProducts } from './search.js';
import { SearchPanel } from './SearchPanel.jsx';
import { loadBasket, saveBasket, setQuantity, removeItem, totalQuantity } from './basket.js';
import { DosageCalculator } from './DosageCalculator.jsx';
import { CartDrawer } from './CartDrawer.jsx';
import { AddToCart } from './AddToCart.jsx';
import {fetchCatalogue, beginCheckout} from './checkout.js';
import './commerce.css';

const ids = catalogueVariantIds;
const assetURL = path => /^https:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
function browserStorage() { try { return window.localStorage; } catch { return null; } }
const baseCategories = ['Tous', 'Semences', 'Engrais', 'Engrais liquide', 'Biostimulants', 'Amendements', 'Terreaux', 'Matériel', 'UAB', 'Autres'];
const positions = {
  'resrpr-15': 'res', 'fl-racines-25': 'racines', 'pro12-15': 'pro',
  'sierrablen-3m-25': 'active', 'ferrotop-mini-25': 'ferro', 'basfoliar-ferrotop-10l': 'liquid'
};
function Packshot({ product, className = '', ...props }) {
  const pictured = products.find(p => p.id === (product.productId || product.id)) || product;
  return !product.image ? <span className="packshot packshot-placeholder">Visuel à venir</span> : <span className={`packshot ${product.seed ? 'seed' : ''} ${className}`}><img src={assetURL(product.image)} alt={`${pictured.name}, visuel fabricant ${product.manufacturerPackaging || pictured.packaging}`} {...props} /></span>;
}
function Price({ product }) {
  const format = getVariant(product.id);
  return <span className="price-value">{Number.isSafeInteger(format?.priceTtcCents) ? <>{formatPrice(format.priceTtcCents)} <small>TTC</small></> : "Actualisation…"}</span>;
}
function CardPrice({ product }) {
  const format = getVariant(product.id);
  return <div className="card-pricing"><Price product={product} />{format?.packageSize && Number.isSafeInteger(format.priceTtcCents) ? <small className="unit-price">{formatPrice(Math.round(format.priceTtcCents / format.packageSize))} TTC/{format.unit}</small> : null}</div>;
}
function Modal({ title, onClose, className = '', children }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; const returnFocus = document.activeElement; el.showModal(); el.querySelector('input[type=search]')?.focus({ preventScroll: true }); return () => { el.close(); if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); }; }, []);
  return createPortal(<dialog ref={ref} aria-label={title} className={`modal ${className}`} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal-close-wrap"><button className="icon-button modal-close" aria-label="Fermer" onClick={onClose}><X size={22} /></button></div>{children}
  </dialog>, document.body);
}
export function App() {
  const [catalogue, setCatalogue] = useState(products);
  const [commerceConnected, setCommerceConnected] = useState(false);
  const [serverCheckoutReady, setServerCheckoutReady] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const checkoutLock = useRef(false);
  const categoryMatches = (p, c) => c === 'Tous' || (c === 'UAB' ? p.uab === true : p.category === c);
  const categories = baseCategories.filter(c => catalogue.some(p => categoryMatches(p, c)));
  async function refreshCatalogue(signal) {
    const live = await fetchCatalogue(signal);
    setCatalogue(getCatalogueProducts().length ? getCatalogueProducts() : products); setCommerceConnected(true); setServerCheckoutReady(live.checkoutReady === true);
    return live;
  }
  useEffect(() => {
    const abort = new AbortController();
    refreshCatalogue(abort.signal).catch(error => { if (error.name !== 'AbortError') setCheckoutError('La boutique est momentanément indisponible. Votre panier reste conservé.'); });
    return () => abort.abort();
  }, []);
  async function checkout() {
    if (checkoutLock.current) return;
    checkoutLock.current = true; setCheckoutBusy(true); setCheckoutError('');
    try { window.location.assign(await beginCheckout(basket)); }
    catch (error) { setCheckoutError(error.message); if (error.catalogue) { setCatalogue(getCatalogueProducts().length ? getCatalogueProducts() : products); setCommerceConnected(true); setServerCheckoutReady(error.catalogue.checkoutReady === true); } }
    finally { checkoutLock.current = false; setCheckoutBusy(false); }
  }
  const [basket, setBasket] = useState(() => loadBasket(browserStorage(), ids));
  const [cartOpen, setCartOpen] = useState(() => new URLSearchParams(window.location.search).get('panier') === '1' && !new URLSearchParams(window.location.search).get('produit'));
  const [detail, setDetail] = useState(() => getProductForVariant(new URLSearchParams(window.location.search).get('produit')) || null);
  const initialSearch = new URLSearchParams(window.location.search).get('recherche') === '1' && !getProductForVariant(new URLSearchParams(window.location.search).get('produit'));
  const [activeSearch, setActiveSearch] = useState(initialSearch ? 'header' : null);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState(() => (new URLSearchParams(window.location.search).get('q') || '').slice(0,180));
  const [category, setCategory] = useState('Tous');
  const [quick, setQuick] = useState(null);
  const [toast, setToast] = useState('');
  const closeTimer = useRef(null);
  const hoverMutedUntil = useRef(0);
  const toastTimer = useRef(null);
  const quickRef = useRef(null);
  const triggerRef = useRef(null);
  const filtered = searchProducts(catalogue, query, category);
  const count = totalQuantity(basket);
  useEffect(() => { saveBasket(browserStorage(), basket); }, [basket]);
  useEffect(() => () => { clearTimeout(closeTimer.current); clearTimeout(toastTimer.current); }, []);
  useEffect(() => {
    const close = e => {
      if (e.key === 'Escape') { hoverMutedUntil.current = Date.now() + 400; setQuick(null); triggerRef.current?.focus(); }
      if (e.type === 'pointerdown' && !quickRef.current?.contains(e.target) && !e.target.closest('[data-product-trigger]')) setQuick(null);
    };
    document.addEventListener('keydown', close); document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, []);
  function add(product, quantity = 1) {
    if (!getVariant(product?.id)) return false;
    if (!canBuy(product.id)) { setToast('Ce format n’est pas disponible à la commande actuellement.'); return false; }
    const current = basket.find(item => item.id === product.id)?.quantity || 0;
    if (!Number.isInteger(quantity) || quantity < 1 || current + quantity > 99) {
      setToast('Limite du panier : 99 conditionnements par produit. Modifiez votre sélection.');
      clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 5000); return false;
    }
    setBasket(items => setQuantity(items, product.id, (items.find(item => item.id === product.id)?.quantity || 0) + quantity));
    setToast(`${product.name} · ${product.packaging} ajouté au panier`); clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3300);
  }
  function openQuick(product, el, pinned = false) {
    if (!pinned && (quick?.pinned || detail || cartOpen || activeSearch || Date.now() < hoverMutedUntil.current)) return;
    clearTimeout(closeTimer.current); triggerRef.current = el;
    const r = el.getBoundingClientRect();
    const width = 300;
    const left = Math.min(window.innerWidth - width - 20, Math.max(20, r.right + 10 < window.innerWidth - width ? r.right + 10 : r.left - width - 10));
    const top = Math.max(20, Math.min(window.innerHeight - 355, r.top + r.height * .25));
    setQuick({ product, pinned, left, top });
  }
  function closeQuickLater() { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setQuick(q => q?.pinned ? q : null), 260); }
  function openDetail(product) { hoverMutedUntil.current = Date.now() + 400; setQuick(null); setToast(''); setActiveSearch(null); setDetail(getProductForVariant(product.id)); }
  function selectCategory(value) { setActiveSearch(null); setCategory(value); setQuery(''); document.getElementById('selection').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  const remainingFor = id => Math.max(0, 99 - (basket.find(item => item.id === id)?.quantity || 0));
  const subtotal = basketSubtotal(basket);
  return <>
    <a className="skip-link" href="#selection">Aller aux produits</a>
    <div className="announcement"><span>LA SÉLECTION D’AUTOMNE</span><span className="preview-note">Prix TTC · hors livraison</span></div>
    <header className="header">
      <a href="/" className="brand" aria-label="Hanami, accueil du site"><img src={assetURL('/assets/logo-principal-vert.png')} alt="Hanami — Expert gazon" /></a>
      <nav aria-label="Navigation principale"><button onClick={() => selectCategory('Tous')} className={category === 'Tous' ? 'selected' : ''}>Boutique</button><button onClick={() => selectCategory('Semences')} className={category === 'Semences' ? 'selected' : ''}>Semences</button><button onClick={() => selectCategory('Engrais')} className={category === 'Engrais' ? 'selected' : ''}>Engrais</button></nav>
      <div className="header-tools"><SearchPanel className="header-search" label="Rechercher un produit ou un besoin" open={activeSearch === 'header'} autoFocus={initialSearch} onOpen={() => { setQuick(null); setActiveSearch('header'); }} onClose={() => setActiveSearch(null)} query={searchQuery} onQueryChange={setSearchQuery} products={catalogue} onSelect={openDetail} renderPackshot={p => <Packshot product={p} />} /><button data-cart-launch className="cart-launch" onClick={() => { setQuick(null); setActiveSearch(null); setCartOpen(true); }} aria-label={`Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`}><ShoppingCart size={21} /><span>Panier</span><span className="cart-count">{count}</span></button></div>
    </header>
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="scene" aria-label="Les six produits de la sélection présentés sur une terrasse d’automne">
          <div className="scene-plane">
            <img className="terrace" src={assetURL('/assets/hero-automne-background.png')} alt="Marches de pierre claire, lumière d’automne et quelques feuilles dorées" fetchPriority="high" />
            {products.map(product => <button key={product.id} data-product-trigger className={`scene-product ${positions[product.id]} ${quick?.product.id === product.id ? 'is-active' : ''}`} aria-label={`Découvrir ${product.name}`} aria-haspopup="dialog" aria-expanded={quick?.product.id === product.id} onPointerEnter={e => { if (e.pointerType === 'mouse') openQuick(product, e.currentTarget); }} onPointerLeave={closeQuickLater} onClick={e => { openQuick(product, e.currentTarget, true); requestAnimationFrame(() => quickRef.current?.querySelector('button')?.focus()); }}><span className="scene-shadow cast-shadow" aria-hidden="true"><Packshot product={product} alt="" /></span><span className="scene-shadow contact-shadow" aria-hidden="true"><Packshot product={product} alt="" /></span><Packshot product={product} className="scene-packshot" /><span className="scene-dot"><Plus size={15} weight="light" /></span></button>)}
          </div>
          <p className="scene-hint">Touchez un produit pour le découvrir <ArrowUpRight size={15} /></p>
        </div>
        <div className="hero-copy"><p className="eyebrow">LE JARDIN CHANGE DE SAISON.</p><h1 id="hero-title">Le beau gazon<br /> se prépare<br /><em>à l’automne.</em></h1><p className="hero-description">Regarnir, nourrir,<br /> préparer la saison froide.</p><a className="primary-button hero-cta" href="#selection">Découvrir la sélection <ArrowRight size={21} weight="light" /></a><p className="hero-footnote">Six essentiels, choisis par Hanami.</p></div>
      </section>
      <div className="needs" aria-label="Trouver un produit selon son besoin"><button onClick={() => selectCategory('Semences')}><Leaf size={34} weight="light" /><span><strong>Regarnir</strong><small>Une pelouse dense et résistante</small></span><ArrowRight size={20} /></button><button onClick={() => selectCategory('Engrais')}><Plant size={34} weight="light" /><span><strong>Nourrir</strong><small>Accompagner le gazon et ses racines</small></span><ArrowRight size={20} /></button><button onClick={() => selectCategory('Engrais liquide')}><Drop size={32} weight="light" /><span><strong>Entretenir</strong><small>Retrouver une belle couleur</small></span><ArrowRight size={20} /></button></div>
      <section id="selection" className="selection" aria-labelledby="selection-title">
        <div className="section-heading"><div><p className="eyebrow">LE BON PRODUIT, AU BON MOMENT.</p><h2 id="selection-title">La boutique Hanami</h2><p>Les essentiels d’automne et les produits pour votre gazon.</p></div><span className="product-count">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</span></div>
        <div className="catalogue-layout"><aside className="catalogue-categories"><h3>Catégories</h3><div className="filters" role="group" aria-label="Filtrer les produits">{categories.map(c => <button key={c} className={c === category ? 'active' : ''} aria-pressed={c === category} onClick={() => setCategory(c)}>{c}<span className="filter-count">{c === 'Tous' ? catalogue.length : catalogue.filter(product => categoryMatches(product, c)).length}</span></button>)}</div></aside><div className="catalogue-results"><div className="catalogue-tools"><p className="catalogue-label">La sélection Hanami</p><SearchPanel className="catalogue-search-box" label="Rechercher dans la sélection" open={activeSearch === 'catalogue'} onOpen={() => { setQuick(null); setActiveSearch('catalogue'); }} onClose={() => setActiveSearch(null)} query={searchQuery} onQueryChange={setSearchQuery} products={catalogue} onSelect={openDetail} renderPackshot={p => <Packshot product={p} />} /></div>
        {filtered.length ? <div className="product-grid">{filtered.map(product => <article className="product-card" key={product.id}><button className="product-picture" onClick={() => openDetail(product)} aria-label={`Voir la fiche de ${product.name}`}><Packshot product={product} loading="lazy" /><ArrowUpRight size={20} className="picture-arrow" /></button><div className="card-copy"><div className="card-tags"><p className="maker">{product.manufacturer}</p><span>{product.category}</span></div><h3><button onClick={() => openDetail(product)}>{product.name}</button></h3><p className="product-meta">{product.packaging}{product.formula ? ` · ${product.formula}` : ''}</p><p className="product-role">{product.role}</p><div className="card-bottom"><CardPrice product={product} /><AddToCart product={product} onAdd={add} disabled={!canBuy(product.id)} maxQuantity={remainingFor(product.id)} /></div></div></article>)}</div> : <div className="empty-state"><MagnifyingGlass size={30} weight="light" /><h3>Aucun produit trouvé</h3><p>Essayez un nom, « regarnir » ou « reverdir ».</p><button className="text-button" onClick={() => { setQuery(''); setCategory('Tous'); }}>Retrouver les produits <ArrowRight size={18} /></button></div>}
        </div></div>
        <p className="season-note">Semis et regarnissage : adaptez vos travaux aux conditions du sol et à la météo. Les produits sont des options selon votre besoin, pas un programme à cumuler.</p>
      </section>
      <section className="guidance"><p className="eyebrow">CHAQUE JARDIN A SA MESURE.</p><h2>Le bon format.<br /><em>Pour votre surface.</em></h2><p>Retrouvez le calcul de quantité sur notre sélection d’automne, avec les repères du fabricant.</p><button className="text-button" onClick={() => openDetail(products[1])}>Essayer avec Floranid Twin Racines <ArrowRight size={19} /></button></section>
    </main>
    <footer><img src={assetURL('/assets/logo-principal-vert.png')} alt="Hanami — Expert gazon" /><p>Le soin du gazon, avec justesse.</p><a href="#selection">Tous les produits <ArrowUpRight size={14} /></a><small>Livraison France en 3 à 5 jours ouvrés · de 9 à 22 €.</small></footer>
    {quick && createPortal(<aside ref={quickRef} className="quick-glass" role="dialog" aria-label={`Aperçu de ${quick.product.name}`} style={{ '--quick-left': `${quick.left}px`, '--quick-top': `${quick.top}px` }} onPointerEnter={() => clearTimeout(closeTimer.current)} onPointerLeave={closeQuickLater}>
      <button className="icon-button quick-close" aria-label="Fermer l’aperçu" onClick={() => { hoverMutedUntil.current = Date.now() + 400; setQuick(null); triggerRef.current?.focus(); }}><X size={18} /></button><p className="maker">{quick.product.manufacturer}</p><h3>{quick.product.name}</h3><p className="product-meta">{quick.product.packaging}{quick.product.formula ? ` · ${quick.product.formula}` : ''}</p><p className="quick-description">{quick.product.copy}</p><button className="text-button quick-detail" onClick={() => openDetail(quick.product)}>Fiche et calcul de quantité <ArrowUpRight size={17} /></button><div className="quick-buy"><Price product={quick.product} /><AddToCart compact product={quick.product} onAdd={add} disabled={!canBuy(quick.product.id)} maxQuantity={remainingFor(quick.product.id)} onOpen={() => { clearTimeout(closeTimer.current); setQuick(current => current ? { ...current, pinned: true } : null); }} /></div>
    </aside>, document.body)}
    {detail && <Modal title={`Fiche produit ${detail.name}`} onClose={() => { hoverMutedUntil.current = Date.now() + 400; setDetail(null); }} className="product-modal"><div className="detail-layout"><div className="detail-visual"><button className="text-button back-link" onClick={() => setDetail(null)}><ArrowLeft size={16} /> La sélection</button><Packshot product={detail} />{detail.id !== detail.productId && <p className="packshot-caption">Visuel du format fabricant {getVariants(detail.productId).find(v => !v.isRepacked)?.packaging || ''}.</p>}</div><div className="detail-content"><p className="eyebrow">{detail.manufacturer} · {detail.category}</p><h2>{detail.name}</h2><p className="detail-formula">{detail.formula || detail.role}</p><div className="detail-price"><Price product={detail} /></div><div className="format-picker" role="group" aria-label="Choisir le conditionnement"><span>Mon format</span><div>{getVariants(detail).map(v => <button key={v.id} aria-pressed={v.id === detail.id} onClick={() => setDetail(getProductForVariant(v.id))}>{v.packaging}</button>)}</div></div><button className="text-button surface-jump" onClick={() => document.getElementById(`calcul-${detail.productId || detail.id}`)?.scrollIntoView({behavior:'instant',block:'start'})}>Calculer pour mon jardin <ArrowRight size={16} /></button><p className="detail-description">{detail.copy}</p><ul className="quick-facts">{detail.quickFacts.map(f => <li key={f}><Check size={16} />{f === 'Bidon de 10 L' ? `Format ${detail.packaging}` : f}</li>)}</ul><div className="detail-buy"><div><small>{canBuy(detail.id) ? "Sur commande fournisseur · 3 à 5 jours ouvrés" : "Indisponible actuellement"}</small></div><AddToCart key={detail.id} compact product={detail} onAdd={add} disabled={!canBuy(detail.id)} maxQuantity={remainingFor(detail.id)} /></div><DosageCalculator product={detail} onAdd={add} knownArea={null} /><div className="documentation">{detail.documentation && <a href={detail.documentation.url} target="_blank" rel="noreferrer"><FileText size={19} />{detail.documentation.label} <ArrowUpRight size={16} /></a>}{detail.manufacturerURL && <a href={detail.manufacturerURL} target="_blank" rel="noreferrer">Informations fabricant <ArrowUpRight size={16} /></a>}</div></div></div>{toast && <div className="toast visible" role="status" aria-live="polite">{toast.startsWith('Limite') ? <X size={18} /> : <Check size={18} />}{toast}<button onClick={() => { setDetail(null); setToast(''); setCartOpen(true); }}>Voir le panier</button></div>}</Modal>}

    {cartOpen && <CartDrawer checkoutReady={serverCheckoutReady && basket.every(item => canBuy(item.id))} checkoutPending={commerceConnected && !serverCheckoutReady} checkoutBusy={checkoutBusy} checkoutError={checkoutError} commerceConnected={commerceConnected} onCheckout={checkout} onRefresh={() => { setCheckoutError(''); refreshCatalogue().catch(error => setCheckoutError(error.message)); }} items={basket} count={count} subtotal={subtotal} onQuantity={(id, quantity) => { setCheckoutError(''); setBasket(items => setQuantity(items, id, quantity)); }} onRemove={id => { setCheckoutError(''); setBasket(items => removeItem(items, id)); }} onClose={() => { hoverMutedUntil.current = Date.now() + 400; setCartOpen(false); }} onBrowse={() => { setCartOpen(false); document.getElementById('selection')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} renderPackshot={product => <Packshot product={product} />} />}
    <div className={`toast ${toast && !detail ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <>{toast.startsWith('Limite') ? <X size={18} /> : <Check size={18} />}{toast}<button onClick={() => { setToast(''); setCartOpen(true); }} >Voir le panier</button></>}</div>
  </>;
}
