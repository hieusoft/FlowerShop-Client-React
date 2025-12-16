// lib/api/PaymentService.ts
import { PaginateResult } from "@/models/common";
import { getApiInstance } from "../api";
import { Payment, PaymentQuery } from "@/models/payment";
import { PaginatedManager } from "../manager";

const list = async (params?: PaymentQuery) => {
  return getApiInstance().get("/payments", { params });
};

const getById = async (id: number | string) => {
  return getApiInstance().get(`/payments/${id}`);
};

const getByOrderId = async (orderId: number) => {
  return getApiInstance().get(`/payments/order/${orderId}`);
};

const getByProviderOrderId = async (providerOrderId: string) => {
  return getApiInstance().get(`/payments/status/${providerOrderId}`);
};

const post = async (item: Payment) => {
  return getApiInstance().post("/payments", item);
};

const put = async (item: Payment) => {
  return getApiInstance().put(`/payments/${item.payment_id}`, item);
};

const deleteOne = async (payment_id: number | string) => {
  return getApiInstance().delete(`/payments/${payment_id}`);
};

export default {
  list,
  getById,
  getByOrderId,
  getByProviderOrderId,
  post,
  put,
  delete: deleteOne,
};

export class PaymentManager extends PaginatedManager<Payment, PaymentQuery> {
        async list(filter: PaymentQuery): Promise<Payment[]> {
        const x = await list(filter);
        return x.data;
    }
    async listPaginated(filter: PaymentQuery & { page: number; limit: number; }): Promise<PaginateResult<Payment>> {
        const x = await list(filter);
        return x.data;
    }

    async post(item: Payment): Promise<void> {
        await post(item);
    }
    async put(item: Payment): Promise<void> {
        await put(item);
    }
    async delete(payment_id: number | string): Promise<void> {
        await deleteOne(payment_id);
    }
}
