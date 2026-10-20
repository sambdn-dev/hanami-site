import {products} from './products.js';
import catalogueMap from './catalogue-map.json' with {type:'json'};

const normalize=v=>Object.freeze({...v,formatLabel:v.packaging,isRepacked:v.packaging.includes('Reconditionné'),packaging:v.packageSize&&v.unit?`${v.packageSize} ${v.unit}`:v.packaging});
const parents=new Map(catalogueMap.products.map(p=>[p.id,p]));
const variants=new Map(catalogueMap.variants.map(v=>[v.id,normalize(v)]));
const originalIds=products.flatMap(p=>catalogueMap.variants.filter(v=>v.productId===p.id).map(v=>v.id));
export const allVariantIds=Object.freeze(originalIds);
export const catalogueVariantIds=Object.freeze([...variants.keys()]);
let liveConnected=false;
let catalogueProducts=products;
const published=new Set();
const empty=Object.freeze([]);
const priceFormatter=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'});

export function getVariant(id){return variants.get(id)??null;}
export function getVariants(parentIdOrProduct){
 const id=typeof parentIdOrProduct==='string'?parentIdOrProduct:parentIdOrProduct?.id;
 const parentId=getVariant(id)?.productId??id;
 const list=[...variants.values()].filter(v=>v.productId===parentId&&(!liveConnected||published.has(v.id)||originalIds.includes(v.id)));
 return list.length?Object.freeze(list):empty;
}
export function getProductForVariant(id){const v=getVariant(id);const p=v&&parents.get(v.productId);return p?{...p,...v}:null;}
export function getCatalogueProducts(){return catalogueProducts;}
export function canBuy(id){const v=getVariant(id);return Boolean(v&&Number.isSafeInteger(v.priceTtcCents)&&v.priceTtcCents>0&&(!liveConnected||v.availableForSale));}
export function registerShopifyCatalogue(live){
 if(live?.connected!==true||!Array.isArray(live.products))throw Error('catalogue_invalid');
 const updates=[];const groups=[];const ids=new Set();
 for(const product of live.products){
  if(!parents.has(product.id)||!Array.isArray(product.variants)||!product.variants.length)throw Error('product_unknown');
  for(const v of product.variants){const source=variants.get(v.id);if(!source||ids.has(v.id)||source.productId!==product.id||v.shopifyVariantId!==source.shopifyVariantId||v.currency!=='EUR'||!Number.isSafeInteger(v.priceTtcCents)||v.priceTtcCents<=0)throw Error('variant_invalid');ids.add(v.id);updates.push(v);}
  groups.push({...parents.get(product.id),...product,variants:undefined});
 }
 liveConnected=true;published.clear();
 for(const [id,v] of variants)variants.set(id,Object.freeze({...v,availableForSale:false}));
 for(const v of updates){published.add(v.id);variants.set(v.id,normalize(v));}
 for(const p of groups)parents.set(p.id,p);
 const order=new Map(products.map((p,i)=>[p.id,i]));
 catalogueProducts=Object.freeze(groups.sort((a,b)=>(order.get(a.id)??100)-(order.get(b.id)??100)).map(p=>getProductForVariant(getVariants(p.id)[0].id)));
 return catalogueProducts;
}
export function formatPrice(cents){if(!Number.isSafeInteger(cents)||cents<0)throw new RangeError('price_must_be_nonnegative_integer_cents');return priceFormatter.format(cents/100);}
export function basketSubtotal(items){
 if(!Array.isArray(items))return null;
 let total=0;const seen=new Set();
 for(const item of items){const v=getVariant(item?.id);if(!v||!Number.isSafeInteger(v.priceTtcCents)||v.priceTtcCents<=0||seen.has(item.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>99)return null;seen.add(item.id);const amount=v.priceTtcCents*item.quantity;if(!Number.isSafeInteger(amount)||!Number.isSafeInteger(total+amount))return null;total+=amount;}
 return total;
}
