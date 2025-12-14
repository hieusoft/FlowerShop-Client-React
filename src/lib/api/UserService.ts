import { User } from "@/models/user";
import { clientApiInstance, getApiInstance } from "../api";
import { Manager } from "../manager";

const update = async (userId: number | string, fullName: string, email: string) => {
    return getApiInstance().put("/user", { userId, Email: email, UserName: fullName });
};

const list = async () => {
    return getApiInstance().get("/users");
};

const fromId = async(id: number | string) => {
   return getApiInstance().get(`/users/${id}`);
}

const post = async(item: User) => {
   return getApiInstance().post(`/users/`, item);
}

const put = async(item: User) => {
   return getApiInstance().put(`/users/${item.id}`, item);
}

const deleteOne = async(id: number | string) => {
   return getApiInstance().delete(`/users/${id}`);
}


export default {
    list,
    fromId,
    post,
    put,
    delete: deleteOne,
    update
};

export class UserManager extends Manager<User, null> {
    async list(): Promise<User[]> {
        const x = await list();
        return x.data;
    }
    async post(item: User): Promise<void> {
        await post(item);
    }
    async put(item: User): Promise<void> {
        await put(item);
    }
    async delete(id: number | string): Promise<void> {
        await deleteOne(id);
    }
}