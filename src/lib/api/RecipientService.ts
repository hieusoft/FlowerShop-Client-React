import { Recipient } from "@/models/recipient";
import { getApiInstance } from "../api";

function fromUser(id: number) {
    return getApiInstance().get<Recipient[]>(`/user/${id}/recipients`);
}
function fromSelf() {
    return getApiInstance().get<Recipient[]>(`/user/recipients`);
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
    fromUser,
    fromSelf,
    post,
    put,
    delete: deleteOne,
}