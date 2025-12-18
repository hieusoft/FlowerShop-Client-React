export type Order = {
    order_id: number
    order_code: string
    user_id: number
    total_price: number
    discount: number
    coupon_code: string | null
    vat_amount: number
    shipping_fee: number
    message: string | null
    status: OrderPaymentStatus
    description: string | null
    delivery_date: string
    created_at: string
    updated_at: string
}

export type OrderPaymentStatus = "Paid" | "Pending"

export type OrderItem = {
    order_item_id: number,
    order_id: number,
    bouquet_id: string,
    bouquet_name: string;
    quantity: number,
    price: number,
    created_at: string,
    updated_at: string,
}

export type OrderQuery = {
    order_code?: string,
    status?: string,
    pages?: number,
    limit?: number,
}
