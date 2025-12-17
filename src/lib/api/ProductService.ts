import { Bouquet, BouquetQuery } from "@/models/bouquet";
import { getApiInstance } from "../api";
import { Manager, PaginatedManager } from "../manager";
import { PaginateResult } from "@/models/common";

const list = async (params: BouquetQuery) => {
    return getApiInstance().get("/bouquets", { params });
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/bouquets/${id}`);
}

const post = async(item: Bouquet) => {
   return getApiInstance().post(`/bouquets/`, item);
}

const put = async(item: Bouquet) => {
   return getApiInstance().put(`/bouquets/${item.id}`, item);
}

const deleteOne = async(id: number | string) => {
   return getApiInstance().delete(`/bouquets/${id}`);
}


export default {
    list,
    fromId,
    post,
    put,
    delete: deleteOne
};

export class ProductManager extends PaginatedManager<Bouquet, BouquetQuery> {
    async list(filter: BouquetQuery): Promise<Bouquet[]> {
        const x = await list(filter);
        return x.data;
    }
    async listPaginated(filter: BouquetQuery & { page: number; limit: number; }): Promise<PaginateResult<Bouquet>> {
        const x = await list(filter);
        return x.data;
    }
    async post(item: Bouquet): Promise<void> {
        await post(item);
    }
    async put(item: Bouquet): Promise<void> {
        await put(item);
    }
    async delete(id: number | string): Promise<void> {
        await deleteOne(id);
    }
}