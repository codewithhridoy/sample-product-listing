export interface Product {
  id: number | string
  name: string
  description?: string
  price: number
  regular_price?: number
  discount_price?: number
  image?: string
  category?: {
    id: number
    name: string
  }
  stock?: number
  sku?: string
  [key: string]: any
}

export interface OrderData {
  product_ids: string
  s_product_qty: string
  c_phone: string
  c_name: string
  courier: string
  address: string
  advance: string | null
  cod_amount: string
  discount_amount: string | null
  delivery_charge: string
}
