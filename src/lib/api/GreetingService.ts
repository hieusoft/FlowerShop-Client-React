
import { getApiInstance } from "../api";
import { Manager, PaginatedManager } from "../manager";
import { Greeting } from "@/models/greeting";

const list = async () => {
    return getApiInstance().get("/greetings");
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/greetings/${id}`);
}

const post = async(item: Greeting) => {
   return getApiInstance().post(`/greetings/`, item);
}

const put = async(item: Greeting) => {
   return getApiInstance().put(`/greetings/${item.id}`, item);
}

const deleteOne = async(id: number | string) => {
   return getApiInstance().delete(`/greetings/${id}`);
}

export default {
    list,
    fromId,
    post,
    put,
    delete: deleteOne
};

export class GreetingManager extends Manager<Greeting, null> {
    async list(): Promise<Greeting[]> {
        const x = await list();
        return x.data;
    }
    async post(item: Greeting): Promise<void> {
        await post(item);
    }
    async put(item: Greeting): Promise<void> {
        await put(item);
    }
    async delete(id: number | string): Promise<void> {
        await deleteOne(id);
    }
}