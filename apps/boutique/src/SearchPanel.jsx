import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { MagnifyingGlass, X, CaretRight, Leaf, Plant, Drop } from '@phosphor-icons/react';
import { searchProductFormats } from './search-formats.js';
import { getVariant, formatPrice } from './variants.js';
import './search.css';

const fold = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('fr').replace(/[^\p{L}\p{N}]/gu, '');
const groupIcons = { Semences: Leaf, Engrais: Plant, 'Engrais liquide': Drop };

// Keep the original spelling and spacing, including accents, in the highlighted name.
function Highlight({ text, query }) {
  const positions = [];
  let normalized = '', offset = 0;
  for (const character of text) {
    const part = fold(character);
    for (let n = 0; n < part.length; n++) positions.push([offset, offset + character.length]);
    normalized += part; offset += character.length;
  }
  const terms = [...new Set([fold(query), ...query.split(/[^\p{L}\p{N}]+/u).map(fold)])].filter(term => term.length >= 2);
  const ranges = [];
  for (const term of terms) {
    let start = normalized.indexOf(term);
    while (start >= 0) {
      ranges.push([positions[start][0], positions[start + term.length - 1][1]]);
      start = normalized.indexOf(term, start + term.length);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  const fragments = []; let cursor = 0;
  for (const [start, end] of merged) {
    fragments.push(text.slice(cursor, start), <mark key={start}>{text.slice(start, end)}</mark>); cursor = end;
  }
  return <>{fragments}{text.slice(cursor)}</>;
}

export function SearchPanel({ query, onQueryChange, products, onSelect, onClose, onOpen, open, autoFocus = false, className = '', label, placeholder = 'Un produit, un besoin…', renderPackshot }) {
  const id = useId();
  const root = useRef(null), input = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [maxHeight, setMaxHeight] = useState(440);
  const hasQuery = Boolean(query.trim());
  const found = hasQuery ? searchProductFormats(products, query) : [];
  const groups = [];
  for (const product of found) {
    let group = groups.find(item => item.name === product.category);
    if (!group) { group = { name: product.category, products: [] }; groups.push(group); }
    group.products.push(product);
  }
  const results = groups.flatMap(group => group.products);
  const expanded = open && hasQuery;
  const selected = expanded && activeIndex >= 0 ? results[activeIndex] : null;

  useEffect(() => { if (autoFocus) input.current?.focus({ preventScroll: true }); }, [autoFocus]);
  useEffect(() => { setActiveIndex(-1); }, [query]);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!root.current?.contains(event.target)) onClose(); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open, onClose]);
  useLayoutEffect(() => {
    if (!expanded) return;
    const resize = () => {
      const bottom = root.current?.querySelector('form')?.getBoundingClientRect().bottom ?? 0;
      const viewport = window.visualViewport;
      const edge = viewport ? viewport.height + viewport.offsetTop : window.innerHeight;
      setMaxHeight(Math.max(96, Math.min(480, edge - bottom - 20)));
    };
    resize();
    window.addEventListener('resize', resize); window.addEventListener('scroll', resize, { capture: true, passive: true });
    window.visualViewport?.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('scroll', resize);
    return () => {
      window.removeEventListener('resize', resize); window.removeEventListener('scroll', resize, true);
      window.visualViewport?.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('scroll', resize);
    };
  }, [expanded]);
  useEffect(() => {
    if (selected) document.getElementById(`${id}-${selected.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [selected?.id, id]);

  function choose(product) { onClose(); onSelect(product); }
  function keys(event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setActiveIndex(-1); onClose(); }
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length) {
      event.preventDefault(); onOpen();
      setActiveIndex(current => event.key === 'ArrowDown' ? (current + 1) % results.length : (current <= 0 ? results.length - 1 : current - 1));
    }
  }
  return <div ref={root} className={`search-box ${className} ${open ? 'is-open' : ''}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onClose(); }}>
    <form role="search" aria-label={label} onSubmit={event => { event.preventDefault(); if (expanded && results.length) choose(selected || results[0]); }}>
      <label className="search-field">
        <MagnifyingGlass size={23} weight="light" />
        <input ref={input} type="search" role="combobox" aria-label={label} aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={expanded} aria-controls={expanded ? `${id}-results` : undefined} aria-activedescendant={selected ? `${id}-${selected.id}` : undefined} placeholder={placeholder} value={query} maxLength={180} autoComplete="off" spellCheck={false} onFocus={onOpen} onClick={onOpen} onKeyDown={keys} onChange={event => { onQueryChange(event.target.value); onOpen(); }} />
        {hasQuery && <button type="button" className="search-clear" aria-label="Effacer la recherche" onClick={() => { onQueryChange(''); setActiveIndex(-1); onOpen(); input.current?.focus(); }}><span className="search-clear-disc"><X size={17} /></span></button>}
      </label>
    </form>
    {expanded && <div className="search-popover" style={{ maxHeight }}>
      <p className="search-announcement" role="status" aria-live="polite">{results.length ? `${results.length} produit${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}` : `Aucun résultat pour « ${query.trim()} »`}</p>
      <div id={`${id}-results`} role="listbox" aria-label="Produits trouvés">
        {groups.map((group, groupIndex) => {
          const Icon = groupIcons[group.name] || Leaf;
          return <section key={group.name} className="search-group" role="group" aria-labelledby={`${id}-group-${groupIndex}`}>
            <h3 id={`${id}-group-${groupIndex}`}><Icon size={17} weight="light" />{group.name}<span>{group.products.length}</span></h3>
            {group.products.map(product => <button key={product.id} id={`${id}-${product.id}`} type="button" role="option" aria-selected={selected?.id === product.id} tabIndex={-1} className="search-option" onPointerDown={event => event.preventDefault()} onClick={() => choose(product)}>
              {renderPackshot(product)}<span className="search-result-copy"><strong><Highlight text={product.name} query={query} /></strong><small><span>{product.manufacturer}</span><span className="search-result-format">{product.packaging}</span></small></span><span className="search-result-price">{formatPrice(getVariant(product.id).priceTtcCents)}<small>TTC</small></span><CaretRight size={18} weight="light" />
            </button>)}
          </section>;
        })}
      </div>
      {!results.length && <div className="search-empty"><MagnifyingGlass size={29} weight="light" /><strong>Aucun résultat pour « {query.trim()} »</strong><p>Essayez un produit ou votre besoin.</p><div className="search-examples">{['Racines', 'Regarnir'].map(value => <button key={value} type="button" onClick={() => { onQueryChange(value); input.current?.focus(); }}>{value}</button>)}</div></div>}
    </div>}
  </div>;
}
