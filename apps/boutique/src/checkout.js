import {basketSubtotal,registerShopifyCatalogue} from './variants.js';

const endpoint='/api/commerce';
export async function fetchCatalogue(signal){
 const response=await fetch(endpoint,{signal,headers:{Accept:'application/json'},cache:'no-store'});
 if(!response.ok)throw Error('La boutique est momentanément indisponible. Réessayez dans un instant.');
 const live=await response.json();registerShopifyCatalogue(live);return live;
}
export async function beginCheckout(items){
 const total=basketSubtotal(items);
 if(total===null||total<=0)throw Error('Votre panier doit être actualisé avant de commander.');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({items,expectedTotalCents:total})});
 const data=await response.json();
 if(!response.ok){
  if(data.catalogue)registerShopifyCatalogue(data.catalogue);
  const messages={price_changed:'Les prix ont été actualisés. Vérifiez votre panier puis confirmez votre commande.',items_unavailable:'Un produit ou une quantité n’est plus disponible. Modifiez votre panier pour continuer.',basket_adjusted:'Shopify a ajusté votre sélection. Vérifiez vos quantités avant de continuer.'};
  const error=new Error(messages[data.error]||'Le paiement est momentanément indisponible. Votre panier est conservé.');
  error.catalogue=data.catalogue;throw error;
 }
 const url=new URL(data.checkoutUrl);
 if(url.protocol!=='https:'||url.hostname!=='eyaij4-ur.myshopify.com'||url.username||url.password||url.port)throw Error('Le lien de paiement n’a pas pu être vérifié.');
 return url.href;
}
