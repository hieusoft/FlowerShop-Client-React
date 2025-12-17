"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import AuthService from "@/lib/api/AuthService";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { AlertCircleIcon, Eye, EyeOff } from "lucide-react"; // Thêm icon Eye và EyeOff
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const searchParams = useSearchParams();
    let rawToken = searchParams.get("token") || "";
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [checkingToken, setCheckingToken] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    rawToken = rawToken.replace(/ /g, "+");
    const token = decodeURIComponent(rawToken);

    useEffect(() => {
        ;
        if (!token) {
            router.replace("/");
        } else {
            setCheckingToken(false);
        }
    }, [router]);

    if (checkingToken) {
        return null;
    }

    const handleRessetPass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        setError("");
        try {
            await AuthService.resetPassword(token, newPassword);
            setError("");
            router.push("/login?reset=success");
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err?.response?.data?.message)
            
            }
        }
    };

    return <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
            <CardHeader>
                <CardTitle>
                    <h2 className="font-heading text-2xl">Reset Password</h2>
                </CardTitle>
                <CardDescription>
                    Enter your new password below to reset your account password.
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
                <form onSubmit={handleRessetPass}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="confirm-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </Field>
                    </FieldGroup>
                    {error && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircleIcon />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Field className="mt-4">
                        <Button>Reset Password</Button>
                    </Field>
                </form>

            </CardContent>
        </Card>
    </div >;
}