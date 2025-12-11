
export type Coupon = {
    id: number,
    code: string,
    discount_type: string,
    discount_value: number,
    max_uses: number,
    expiry_date: string,
    occasion: string,
    min_price: number,
    created_at: string,
    updated_at: string,
}