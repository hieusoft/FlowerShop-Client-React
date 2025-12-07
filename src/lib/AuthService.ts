import { apiInstance } from "./api";

const Login = async (emailOrUsername: string, password: string) => {
    return await apiInstance.post("/auth/login", {
        emailOrUsername,
        password
    });
};

const Register = async (fullName: string, username: string, email: string, password: string) => {
    return await apiInstance.post("/auth/register", {
        fullName,
        username,
        email,
        password
    });
};

const ResendVerificationEmail = async (email: string) => {
    return await apiInstance.post("/auth/resend-verification", {
        email
    });
}
export default {
    Login,
    Register,
    ResendVerificationEmail
};
