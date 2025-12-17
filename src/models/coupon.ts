
export type Coupon = {
    id: number,
    code: string,
    discountType: string,
    discountValue: number,
    maxUses: number,
    expiryDate: string,
    occasion: string,
    minPrice: number,
    created_at: string,
    updated_at: string,
}