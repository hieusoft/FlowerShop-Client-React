import { getApiInstance } from "../api";

const createOrder = async (orderData: any) => {
    return getApiInstance().post("/orders", orderData);
};

export default {
    createOrder,
};
