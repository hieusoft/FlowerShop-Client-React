import { clientApiInstance, getApiInstance } from "../api";

const update = async (userId: number | string, fullName: string, email: string) => {
    return getApiInstance().put("/user", { userId, Email: email, UserName: fullName });
};
const profile = async()=>{
    return getApiInstance().get("/user/profile");
}
export default {
    update,
    profile
};
