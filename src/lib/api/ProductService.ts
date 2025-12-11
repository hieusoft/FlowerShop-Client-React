import { getApiInstance } from "../api";

// TODO change param type
const list = async (params: Record<string, any>) => {
    return getApiInstance().get("/bouquets", { params });
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/bouquets/${id}`);
}

export default {
    list,
    fromId,
};
