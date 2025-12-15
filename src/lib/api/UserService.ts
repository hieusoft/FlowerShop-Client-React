import { User } from "@/models/user";
import { clientApiInstance, getApiInstance } from "../api";
import { Manager } from "../manager";

const update = async (userId: number | string, fullName: string, email: string) => {
    return getApiInstance().put("/user", { userId, Email: email, UserName: fullName });
};
const profile = async()=>{
    return getApiInstance().get("/user/profile");
}
const logout = async()=>{
    return getApiInstance().get("/user/logout");
}

export default {
    update,
    profile,
    logout
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