import { clientApiInstance, getApiInstance } from "../api";

const update = async (userId: number | string, fullName: string, email: string) => {
    return getApiInstance().put("/user", { userId, Email: email, UserName: fullName });
};

export default {
    update
};
