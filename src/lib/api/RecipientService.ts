import { Recipient } from "@/models/recipient";
import { clientApiInstance, getApiInstance } from "../api";

function fromUser(id: number) {
    return getApiInstance().get<Recipient[]>(`/user/${id}/recipients`);
}
function post(data: Recipient) {
    return getApiInstance().post(`/user/contacts`);
}
function put(data: Recipient) {
    return getApiInstance().put(`/user/contacts`);
}
function deleteOne(id: number) {
    return getApiInstance().delete(`/user/contacts/${id}`);
}

export default {
    fromUser,
    post,
    put,
    delete: deleteOne,
}