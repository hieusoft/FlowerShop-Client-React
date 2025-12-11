import { getApiInstance } from "../api";

const getPaymentByOrderId = async (id: number) => {
    return getApiInstance().get(`/payment/order/${id}`);
};

export default {
    getPaymentByOrderId,
};
