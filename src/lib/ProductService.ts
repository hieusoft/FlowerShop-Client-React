import { apiInstance } from "./api";

const GetAllProducts = async (params: Record<string, any>) => {
    return apiInstance.get("/bouquets", { params });
};

const GetOccasionName = async () => {
    return apiInstance.get("/occasions");
}

const GetOccasionByName = async (name: string) => {
    return apiInstance.get(`/occasions/${name}`);
}

export default {
    GetAllProducts,
    GetOccasionName
};
