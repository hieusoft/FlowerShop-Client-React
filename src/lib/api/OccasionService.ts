import { Bouquet, BouquetQuery } from "@/models/bouquet";
import { Manager, PaginatedManager } from "../manager";
import { PaginateResult } from "@/models/common";
import { Occasion } from "@/models/occasion";
import { getApiInstance } from "../api";

// TODO change param type
const list = async () => {
    return getApiInstance().get("/occasions");
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/occasions/${id}`);
}

const post = async(item: Occasion) => {
   return getApiInstance().post(`/occasions/`, item);
}

const put = async(item: Occasion) => {
   return getApiInstance().put(`/occasions/${item.id}`, item);
}

const deleteOne = async(id: number | string) => {
   return getApiInstance().delete(`/occasions/${id}`);
}


export default {
    list,
    fromId,
    post,
    put,
    delete: deleteOne
};

export class OccasionManager extends Manager<Occasion, null> {
    async list(): Promise<Occasion[]> {
        const x = await list();
        return x.data;
    }
    async post(item: Occasion): Promise<void> {
        await post(item);
    }
    async put(item: Occasion): Promise<void> {
        await put(item);
    }
    async delete(id: number | string): Promise<void> {
        await deleteOne(id);
    }
}