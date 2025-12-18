import { Order, OrderQuery } from "@/models/order";
import { getApiInstance } from "../api";
import { Manager, PaginatedManager } from "../manager";
import { PaginateResult } from "@/models/common";

const fromOrder = async(id: number | string) => {
   return getApiInstance().get(`/orders/${id}/items`);
}


export default {
    fromOrder
};