import { Order, OrderQuery } from "@/models/order";
import { getApiInstance } from "../api";
import { Manager, PaginatedManager } from "../manager";
import { PaginateResult } from "@/models/common";

// TODO change param type
const list = async (params: OrderQuery) => {
    return getApiInstance().get("/orders", { params });
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/orders/${id}`);
}

const post = async(item: Order) => {
   return getApiInstance().post(`/orders/`, item);
}

const put = async(item: Order) => {
   return getApiInstance().put(`/orders/${item.id}`, item);
}

const deleteOne = async(id: number | string) => {
   return getApiInstance().delete(`/orders/${id}`);
}


export default {
    list,
    fromId,
    post,
    put,
    delete: deleteOne
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