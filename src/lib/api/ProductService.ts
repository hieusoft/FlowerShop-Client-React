import { clientApiInstance, getApiInstance } from "../api";

const list = async (params: Record<string, any>) => {
    return getApiInstance().get("/bouquets", { params });
};

const GetOccasionName = async () => {
    return getApiInstance().get("/occasions");
}

const GetOccasionByName = async (name: string) => {
    return getApiInstance().get(`/occasions/${name}`);
}

export default {
    list,
    GetOccasionName
};
