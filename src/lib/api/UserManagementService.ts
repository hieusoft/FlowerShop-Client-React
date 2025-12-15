import { Bouquet, BouquetQuery } from "@/models/bouquet";
import { getApiInstance } from "../api";
import { Manager, PaginatedManager } from "../manager";
import { PaginateResult } from "@/models/common";
import { SubOccasion } from "@/models/occasion";

const list = async () => {
    return getApiInstance().get("/suboccasions");
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/suboccasions/${id}`);
}

const post = async(item: SubOccasion) => {
   return getApiInstance().post(`/suboccasions/`, item);
}

const put = async(item: SubOccasion) => {
   return getApiInstance().put(`/suboccasions/${item.id}`, item);
}

const deleteOne = async(id: number | string) => {
   return getApiInstance().delete(`/suboccasions/${id}`);
}


export default {
    list,
    fromId,
    post,
    put,
    delete: deleteOne
};

export class SubOccasionManager extends Manager<SubOccasion, null> {
    async list(): Promise<SubOccasion[]> {
        const x = await list();
        return x.data;
    }
    async post(item: SubOccasion): Promise<void> {
        await post(item);
    }
    async put(item: SubOccasion): Promise<void> {
        await put(item);
    }
    async delete(id: number | string): Promise<void> {
        await deleteOne(id);
    }
}