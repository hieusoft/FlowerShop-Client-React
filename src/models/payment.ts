type PaymentStatus = "idle" | "processing" | "success" | "failed";

export type Payment = {
    payment_id: number,
    order_id: number,
    user_id: number,
    provider: string,
    provider_order_id: string,
    amount: number,
    currency: string,
    converted_amount: number,
    status: string,
    expires_at: string
}

export type PaymentQuery = {
    page?: number,
    limit: number,
}
