import { Recipient } from "@/models/recipient";
import { getApiInstance } from "../api";

function fromUser() {
    return getApiInstance().get<Recipient[]>(`/user/recipients`);
}
function fromSelf(id: number) {
    return getApiInstance().get<Recipient[]>(`/user/recipients/${id}`);
}
function post(data: Recipient) {
    return getApiInstance().post(`/user/recipients`, data);
}
function put(data: Recipient) {
    return getApiInstance().put(`/user/recipients`, data);
}
function deleteOne(id: number | string) {
    return getApiInstance().delete(`/user/recipients/${id}`);
}

export default {
    list,
    fromUser,
    fromSelf,
    post,
    put,
    delete: deleteOne,
}