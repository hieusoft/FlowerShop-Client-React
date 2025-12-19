import { getApiInstance } from "../api";

const list = async () => {
    return getApiInstance().get("/chat");
};

const post = async (message: string) => {
   return getApiInstance().post(`/chat`, { message });
};

export default {
    list,
    post,
};
