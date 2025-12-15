import { getApiInstance } from "../api";

const createOrder = async (orderData: any) => {
  return getApiInstance().post("/orders", orderData);
};

const getOrderByOrderId = async (id: number | string) => {
  return getApiInstance().get(`/orders/${id}`);
};

export default {
  createOrder,
  getOrderByOrderId,
};
