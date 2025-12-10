// AuthService.ts
import { User } from "@/models/user";
import { clientApiInstance, getApiInstance } from "../api";

const login = async (emailOrUsername: string, password: string) => {
    return clientApiInstance.post("/auth/login", { emailOrUsername, password });
};

const register = async (
    fullName: string,
    username: string,
    email: string,
    password: string
) => {
    return getApiInstance().post("/auth/register", { fullName, username, email, password });
};

const resendVerificationEmail = async (email: string) => {
    return getApiInstance().post("/auth/resend-verification", { email });
};

const forgotPassword = async (email: string) => {
    return getApiInstance().post("/auth/forgot-password", { email });
};

const resetPassword = async (token: string, newPassword: string) => {
    return getApiInstance().post("/auth/reset-password", { token, newPassword });
};

const changePassword = async (oldPassword: string, newPassword: string) => {
    return getApiInstance().post("/auth/change-password", { oldPassword, newPassword });
};

const profile = async () => {
    return getApiInstance().get<User>("/user/profile");
};

export default {
    login,
    register,
    resendVerificationEmail,
    profile,
    forgotPassword,
    resetPassword,
    changePassword,
};
