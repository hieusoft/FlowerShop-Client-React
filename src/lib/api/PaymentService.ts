import { get } from "http";
import { getApiInstance } from "../api";

const getPaymentByOrderId = async (id: number) => {
    return getApiInstance().get(`/payments/order/${id}`);
};
const getPaymentByProviderOrderId = async (provider_id : string)=>{
    return getApiInstance().get(`/payments/status/${provider_id}`);
}
export default {
    getPaymentByOrderId,
    getPaymentByProviderOrderId
};
