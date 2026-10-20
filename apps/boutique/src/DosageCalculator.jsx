import { useEffect, useId, useState } from 'react';
import { calculateDosage, formatDosageAmount, formatDosageNumber, getDosageProfile, getTrustedKnownArea } from './dosage.js';
import './dosage.css';

export function DosageCalculator({ product, onAdd, knownArea = null }) {
  const id = useId();
  const profile = getDosageProfile(product);
  const parentId = product?.productId || product?.id;
  const trustedArea = getTrustedKnownArea(knownArea);
  const [area, setArea] = useState(trustedArea === null ? '' : String(trustedArea));
  const [contextId, setContextId] = useState(profile?.defaultContextId ?? '');
  const [rate, setRate] = useState('');
  const [sprayVolume, setSprayVolume] = useState('');
  const [foliarConfirmed, setFoliarConfirmed] = useState(false);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    setArea(trustedArea === null ? '' : String(trustedArea));
    setContextId(profile?.defaultContextId ?? ''); setRate(''); setSprayVolume(''); setFoliarConfirmed(false); setAdded(false);
  }, [parentId, trustedArea]);
  useEffect(() => { setAdded(false); }, [product?.id]);
  const context = profile?.contexts.find(item => item.id === contextId);
  const result = calculateDosage({ productId: product?.id, areaM2: area, contextId, rate, sprayVolumeLHa: sprayVolume, foliarConfirmed });
  if (!profile) return <p className="dosage-note">Le calcul de quantité attend sa documentation fabricant.</p>;
  const rangeLabel = context ? `${formatDosageNumber(context.min)}${context.min === context.max ? '' : ` à ${formatDosageNumber(context.max)}`} ${profile.rateUnit}` : '';
  const hasResult = result.status === 'ready' || result.status === 'range';
  const packagesLabel = count => `${count} ${profile.packageLabel}${count > 1 ? 's' : ''} de ${profile.packageSize} ${profile.unit}`;
  function changeContext(value) { setContextId(value); setRate(''); setFoliarConfirmed(false); setAdded(false); }
  function addCalculated() {
    if (result.canAdd && typeof onAdd === 'function') { const accepted = onAdd(product, result.packageCount); setAdded(accepted !== false); }
  }
  return <section id={`calcul-${parentId}`} className="dosage-calculator" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>Calculer pour mon jardin</h3>
    <div className="dosage-fields">
      <label htmlFor={`${id}-area`}>Ma surface
        <span className="dosage-input-unit"><input id={`${id}-area`} type="text" inputMode="decimal" autoComplete="off" placeholder="Ex. 150" value={area} onChange={event => { setArea(event.target.value); setAdded(false); }} aria-describedby={`${id}-area-note`} /><span>m²</span></span>
      </label>
      <label htmlFor={`${id}-context`}>Mon usage
        <select id={`${id}-context`} value={contextId} onChange={event => changeContext(event.target.value)}>
          <option value="">Choisir mon usage</option>
          {profile.contexts.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
    </div>
    <p id={`${id}-area-note`} className="dosage-note">{trustedArea === null ? 'Saisissez votre surface. Le préremplissage client sera disponible avec la connexion sécurisée.' : 'Surface préremplie depuis votre dossier client vérifié ; vous pouvez l’ajuster pour ce calcul.'}</p>
    {trustedArea === null && <button className="dosage-client-connect" type="button" disabled aria-describedby={`${id}-area-note`}>Préremplissage depuis mon espace client · à venir</button>}
    {profile.foliar && <div className="dosage-foliar">
      <p className="dosage-note">{profile.unsupportedContextMessage}</p>
      <label htmlFor={`${id}-spray`}>Volume total de bouillie prévu (400 à 800 L/ha)<input id={`${id}-spray`} type="text" inputMode="decimal" value={sprayVolume} onChange={event => { setSprayVolume(event.target.value); setAdded(false); }} placeholder="Volume réglé sur votre pulvérisateur" /></label>
      <label className="dosage-check"><input type="checkbox" checked={foliarConfirmed} onChange={event => { setFoliarConfirmed(event.target.checked); setAdded(false); }} />Je confirme l’application foliaire et le réglage du matériel pour ce volume.</label>
    </div>}
    {context && <details className="dosage-reference" open={hasResult && result.packageCount === null ? true : undefined}>
      <summary><strong>Plage fabricant : {rangeLabel}</strong><span>Affiner la dose</span></summary>
      {context.sourceRateLabel && <p>{context.sourceRateLabel}</p>}
      <p className="dosage-note">{context.period}. {context.conditions}</p>
      {context.min !== context.max && <label htmlFor={`${id}-rate`} className="dosage-rate">Dose retenue, si vous la connaissez <span className="dosage-input-unit"><input id={`${id}-rate`} type="text" inputMode="decimal" placeholder={`${context.min} à ${context.max}`} value={rate} onChange={event => { setRate(event.target.value); setAdded(false); }} /><span>{profile.rateUnit}</span></span></label>}
      <a href={context.source.url} target="_blank" rel="noreferrer">{context.source.kind === 'technical_sheet' ? 'Fiche technique fabricant' : 'Fiche produit fabricant'} · {context.source.version} · p. {context.source.page}</a>
    </details>}
    <div className="dosage-result" role="status" aria-live="polite" aria-atomic="true">
      {hasResult ? <>
        <strong>{result.status === 'ready' ? formatDosageAmount(result.amount, result.unit) : `${formatDosageAmount(result.minAmount, result.unit)} à ${formatDosageAmount(result.maxAmount, result.unit)}`} pour {formatDosageNumber(result.areaM2)} m²</strong>
        <span>{result.packageCount !== null ? packagesLabel(result.packageCount) : `${result.minPackages} à ${result.maxPackages} ${profile.packageLabel}s de ${profile.packageSize} ${profile.unit}, selon la dose retenue`}</span>
        {result.packageCount !== null && <span>Restant après ce passage : {formatDosageAmount(result.packageCount * profile.packageSize - (result.amount ?? result.maxAmount), result.unit)}{result.amount === null && result.minAmount !== result.maxAmount ? ` à ${formatDosageAmount(result.packageCount * profile.packageSize - result.minAmount, result.unit)}` : ''}.</span>}
        {result.sprayVolumeLiters !== null && <span>Volume total de bouillie : {formatDosageNumber(result.sprayVolumeLiters)} L.</span>}
        {result.status === 'range' && <p className="dosage-note">Estimation sur toute la plage fabricant. {result.packageCount === null ? 'Renseignez la dose retenue pour déterminer le nombre de conditionnements.' : 'Le nombre de conditionnements est identique sur cette plage.'}</p>}
        {result.packageCount > 99 && <p className="dosage-note">Ce besoin dépasse la limite de 99 conditionnements du panier.</p>}
      </> : <span className="dosage-note">{area || result.status !== 'invalid_surface' ? result.message : 'La quantité se calcule dès que votre surface et votre usage sont renseignés.'}</span>}
    </div>
    <button type="button" className="dosage-add" disabled={!result.canAdd || typeof onAdd !== 'function'} onClick={addCalculated}>{added ? 'Ajouté au panier' : result.canAdd ? `Ajouter ${packagesLabel(result.packageCount)}` : 'Compléter mon calcul'}</button>
    <p className="dosage-note dosage-disclaimer">Quantités pour un passage, selon l’usage choisi. Le calcul ne détermine pas les besoins agronomiques de votre jardin.</p>
  </section>;
}
