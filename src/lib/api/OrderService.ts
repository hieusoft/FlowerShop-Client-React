// lib/api/OrderService.ts
import { PaginateResult } from "@/models/common";
import { getApiInstance } from "../api";
import { Order, OrderQuery } from "@/models/order";
import { PaginatedManager } from "../manager";

const list = async (params?: OrderQuery) => {
  return getApiInstance().get("/orders", { params });
};

const getById = async (id: number | string) => {
  return getApiInstance().get(`/orders/${id}`);
};

const getByOrderId = async (orderId: number) => {
  return getApiInstance().get(`/orders/order/${orderId}`);
};

const getByProviderOrderId = async (providerOrderId: string) => {
  return getApiInstance().get(`/orders/status/${providerOrderId}`);
};

const post = async (item: Order) => {
  return getApiInstance().post("/orders", item);
};

const put = async (item: Order) => {
  return getApiInstance().put(`/orders/${item.order_id}`, item);
};

const deleteOne = async (order_id: number | string) => {
  return getApiInstance().delete(`/orders/${order_id}`);
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

export class OrderManager extends PaginatedManager<Order, OrderQuery> {
        async list(filter: OrderQuery): Promise<Order[]> {
        const x = await list(filter);
        return x.data;
    }
    async listPaginated(filter: OrderQuery & { page: number; limit: number; }): Promise<PaginateResult<Order>> {
        const x = await list(filter);
        return x.data;
    }
    async post(item: Order): Promise<void> {
        await post(item);
    }
    async put(item: Order): Promise<void> {
        await put(item);
    }
    async delete(id: number | string): Promise<void> {
        await deleteOne(id);
    }
}
