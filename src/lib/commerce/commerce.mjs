import catalogueMap from './catalogue-map.json' with {type:'json'};

export const CATALOGUE_QUERY=`query HanamiCatalogue($ids:[ID!]!) @inContext(country:FR,language:FR) { nodes(ids:$ids) { ... on ProductVariant { id sku title availableForSale price { amount currencyCode } quantityRule { minimum maximum increment } product { id title handle description productType vendor featuredImage { url altText } } } } }`;
export const CART_QUERY=`mutation HanamiCart($input:CartInput!) { cartCreate(input:$input) { cart { id checkoutUrl lines(first:100) { nodes { quantity merchandise { ... on ProductVariant { id sku price { amount currencyCode } } } } pageInfo { hasNextPage } } cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } totalTaxAmount { amount currencyCode } } } userErrors { field message code } warnings { code message target } } }`;

class CommerceError extends Error { constructor(code,status=503){super(code);this.code=code;this.status=status;} }
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
function cents(money){
 if(money?.currencyCode!=='EUR'||typeof money.amount!=='string'||!/^\d+(?:\.\d{1,2})?$/.test(money.amount))throw new CommerceError('currency_or_price_invalid');
 const n=Math.round(Number(money.amount)*100);
 if(!Number.isSafeInteger(n)||n<=0)throw new CommerceError('price_not_set');
 return n;
}
async function shopify(query,variables,{env,fetchImpl}){
 const domain=env.SHOPIFY_STORE_DOMAIN||catalogueMap.storeDomain;
 if(domain!==catalogueMap.storeDomain)throw new CommerceError('shop_domain_invalid');
 const headers={'Content-Type':'application/json'};
 if(env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN)headers['X-Shopify-Storefront-Access-Token']=env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
 const response=await fetchImpl(`https://${domain}/api/2026-10/graphql.json`,{method:'POST',headers,body:JSON.stringify({query,variables}),signal:AbortSignal.timeout(10000)});
 const body=await response.json();
 if(!response.ok||body.errors?.length||!body.data)throw new CommerceError('shopify_unavailable');
 return body.data;
}
export async function readCatalogue(context){
 const map=context.map||catalogueMap;
 const data=await shopify(CATALOGUE_QUERY,{ids:map.variants.map(v=>v.shopifyVariantId)},context);
 if(!Array.isArray(data.nodes)||data.nodes.length!==map.variants.length)throw new CommerceError('catalogue_response_incomplete');
 const sourceById=new Map(map.variants.map(v=>[v.shopifyVariantId,v]));
 const parents=new Map(map.products.map(p=>[p.id,p]));
 const groups=new Map(); const seen=new Set();
 for(const node of data.nodes){
  if(node===null)continue; // A draft or unpublished product is never made sellable here.
  const source=sourceById.get(node.id);
  if(!source||seen.has(node.id)||node.sku!==source.sku)throw new CommerceError('variant_identity_changed');
  seen.add(node.id);
  let price;
  try{price=cents(node.price);}catch(error){if(error.code==='price_not_set')continue;throw error;}
  const parent=parents.get(source.productId);
  if(!parent||!node.product)throw new CommerceError('product_identity_missing');
  const rule=node.quantityRule;
  if(!rule||!Number.isInteger(rule.minimum)||!Number.isInteger(rule.increment)||rule.minimum<1||rule.increment<1||(rule.maximum!==null&&(!Number.isInteger(rule.maximum)||rule.maximum<rule.minimum)))throw new CommerceError('quantity_rule_invalid');
  let product=groups.get(parent.id);
  if(!product){
   product={...parent,name:node.product.title,manufacturer:node.product.vendor||parent.manufacturer,copy:node.product.description||parent.copy,image:parent.image||node.product.featuredImage?.url||null,variants:[]};
   groups.set(parent.id,product);
  }
  product.variants.push({...source,priceTtcCents:price,availableForSale:node.availableForSale===true,quantityRule:rule});
 }
 return {connected:true,products:[...groups.values()],checkoutReady:context.env.HANAMI_CHECKOUT_ENABLED==='true'&&[...groups.values()].some(p=>p.variants.some(v=>v.availableForSale))};
}
export async function handleCommerce(request,options={}){
 const context={env:options.env||process.env,fetchImpl:options.fetchImpl||fetch,map:options.map||catalogueMap};
 try{
  if(request.method==='GET')return json(await readCatalogue(context));
  if(request.method!=='POST')return json({error:'method_not_allowed'},405);
  const origin=request.headers.get('origin');
  const allowed=[new URL(request.url).origin];
  if(!context.env.VERCEL)allowed.push('http://127.0.0.1:3102','http://localhost:3102');
  if(!origin||!allowed.includes(origin))return json({error:'origin_not_allowed'},403);
  if(context.env.HANAMI_CHECKOUT_ENABLED!=='true')return json({error:'checkout_not_enabled'},503);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'json_required'},415);
  const raw=await request.text(); if(raw.length>16384)return json({error:'request_too_large'},413);
  let input;try{input=JSON.parse(raw);}catch{return json({error:'invalid_json'},400);}
  if(!Array.isArray(input.items)||!input.items.length||input.items.length>100||!Number.isSafeInteger(input.expectedTotalCents)||input.expectedTotalCents<=0)return json({error:'basket_invalid'},400);
  const seen=new Set();
  for(const item of input.items){if(typeof item?.id!=='string'||seen.has(item.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>99)return json({error:'basket_invalid'},400);seen.add(item.id);}
  const live=await readCatalogue(context);
  const variants=new Map(live.products.flatMap(p=>p.variants).map(v=>[v.id,v]));
  const lines=[];let expected=0;
  for(const item of input.items){
   const v=variants.get(item.id); const r=v?.quantityRule;
   if(!v?.availableForSale||!r||item.quantity<r.minimum||(r.maximum!==null&&item.quantity>r.maximum)||item.quantity%r.increment!==0)return json({error:'items_unavailable',catalogue:live},409);
   expected+=v.priceTtcCents*item.quantity;
   lines.push({merchandiseId:v.shopifyVariantId,quantity:item.quantity});
  }
  if(expected!==input.expectedTotalCents)return json({error:'price_changed',catalogue:live},409);
  const data=await shopify(CART_QUERY,{input:{lines,buyerIdentity:{countryCode:'FR'}}},context);
  const result=data.cartCreate;
  if(!result||!Array.isArray(result.userErrors)||!Array.isArray(result.warnings))throw new CommerceError('cart_response_incomplete');
  if(result.userErrors.length)return json({error:'cart_rejected',catalogue:live},409);
  const cart=result.cart;
  if(!cart?.id?.includes('?key=')||!Array.isArray(cart.lines?.nodes)||cart.lines.pageInfo?.hasNextPage!==false)throw new CommerceError('cart_response_incomplete');
  const actual=new Map(cart.lines.nodes.map(line=>[line.merchandise?.id,line]));
  if(result.warnings.length||actual.size!==lines.length||lines.some(line=>actual.get(line.merchandiseId)?.quantity!==line.quantity))return json({error:'basket_adjusted',catalogue:live},409);
  for(const line of input.items){const v=variants.get(line.id);if(cents(actual.get(v.shopifyVariantId).merchandise.price)!==v.priceTtcCents)return json({error:'price_changed',catalogue:live},409);}
  const checkout=new URL(cart.checkoutUrl);
  if(checkout.protocol!=='https:'||checkout.username||checkout.password||checkout.port||checkout.hostname!==catalogueMap.storeDomain)throw new CommerceError('checkout_host_invalid');
  // Only Shopify's intended checkout link reaches the buyer. Full cart IDs and keys stay server-side.
  return json({checkoutUrl:checkout.href});
 }catch(error){
  console.error('hanami_commerce',error instanceof CommerceError?error.code:'service_error');
  return json({error:error instanceof CommerceError?error.code:'shopify_unavailable'},error instanceof CommerceError?error.status:503);
 }
}
