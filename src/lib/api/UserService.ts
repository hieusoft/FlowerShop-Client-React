import { User, UserMn, UserQuery } from "@/models/user";
import { getApiInstance } from "../api";
import { Manager, PaginatedManager } from "../manager";
import { PaginateResult } from "@/models/common";


const update = async (userId: number | string, fullName: string, email: string) => {
    return getApiInstance().put("/user", { userId, Email: email, UserName: fullName });
};
const profile = async () => {
    return getApiInstance().get("/user/profile");
}
const list = async (params : UserQuery) => {
    return getApiInstance().get("/user", {params});
}
const deleteOne = async (userId : number | string) => {
    return getApiInstance().delete(`/user/${userId}`);

}
const post  = async (item: User) => {
    return getApiInstance().post("/user", item);
}

const put = async (item: User) => {
    return getApiInstance().put(`/User/${item.userId}`, item);
}

export default {
    update,
    profile,
    list,
    post,
    delete: deleteOne
};


export class UserManager extends PaginatedManager<UserMn, UserQuery> {
    async listPaginated(filter: UserQuery & { page: number; limit: number; }): Promise<PaginateResult<UserMn>> {
        const x = await list(filter);
        return x.data;
    }
    async list(filter: UserQuery): Promise<UserMn[]> {
        const x = await list(filter);
        console.log(x.data);
        return x.data;
    }
    async post(item: User): Promise<void> {
        await post(item);
    }
    async put(item: User): Promise<void> {
        await put(item);
    }
    async delete(userId: number | string): Promise<void> {
        await deleteOne(userId);
    }
}
