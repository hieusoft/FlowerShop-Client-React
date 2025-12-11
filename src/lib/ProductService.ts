import { apiInstance } from "./api";

const GetAllProducts = async (params: Record<string, any>) => {
    return apiInstance.get("/bouquets", { params });
};

const GetOccasionName = async () => {
    return apiInstance.get("/occasions");
}

const GetOccasionByName = async (id: string) => {
    return apiInstance.get(`/occasions/${id}`);
}

const GetProductById = async(id : string) => {
   return apiInstance.get(`/bouquets/${id}`);
}


export default {
    GetAllProducts,
    GetOccasionByName,
    GetProductById
};
