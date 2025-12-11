
import { getApiInstance } from "../api";
import { Manager, PaginatedManager } from "../manager";
import { Order } from "@/models/order";

// TODO change param type
const list = async () => {
    return getApiInstance().get("/orders");
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

export class OrderManager extends Manager<Order, null> {
    async list(): Promise<Order[]> {
        const x = await list();
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