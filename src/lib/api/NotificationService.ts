import { getApiInstance } from "../api"

const getNotiByUser = async (userId: number | string) => {
    return await getApiInstance().get(`Notification/users/${userId}/deliveries`);
}

const fromId = async (id : number | string) => {
    return await getApiInstance().get(`Notification/${id}`);
}

export default {
    getNotiByUser,
    fromId
}