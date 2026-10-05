import { SHOP_FULFILLMENT_OPTIONS, SHOP_FULFILLMENT_NOTE, formatShopPrice } from '@/lib/shop-catalog'
import styles from './Shop.module.css'

export default function ShopFulfillmentNotice() {
  return <div className={styles.fulfillmentNotice}>
    <p>{SHOP_FULFILLMENT_OPTIONS.map(option => <span key={option.id}>{option.label} <strong>{formatShopPrice(option.priceTtcCents)} TTC</strong></span>)}</p>
    <small>{SHOP_FULFILLMENT_NOTE}</small>
  </div>
}
