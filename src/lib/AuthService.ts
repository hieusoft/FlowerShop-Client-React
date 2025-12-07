// AuthService.ts
import { apiInstance } from "./api";

const Login = async (emailOrUsername: string, password: string) => {
    return apiInstance.post("/auth/login", { emailOrUsername, password });
};

const Register = async (
    fullName: string,
    username: string,
    email: string,
    password: string
) => {
    return apiInstance.post("/auth/register", { fullName, username, email, password });
};

const ResendVerificationEmail = async (email: string) => {
    return apiInstance.post("/auth/resend-verification", { email });
};

const ForgotPassword = async (email: string) => {
    return apiInstance.post("/auth/forgot-password", { email });
};

const ResetPassword = async (token: string, newPassword: string) => {
    return apiInstance.post("/auth/reset-password", { token, newPassword });
};

const ChangePassword = async (oldPassword: string, newPassword: string) => {
    return apiInstance.post("/auth/change-password", { oldPassword, newPassword });
};

const Profile = async () => {
    return apiInstance.get("/user/profile");
};

export default {
    Login,
    Register,
    ResendVerificationEmail,
    Profile,
    ForgotPassword,
    ResetPassword,
    ChangePassword,
};
