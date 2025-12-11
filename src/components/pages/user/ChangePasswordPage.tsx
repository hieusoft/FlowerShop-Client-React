"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import AuthService from "@/lib/api/AuthService";
import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";


export default function ChangePasswordPage({ className, ...props }: React.ComponentProps<"div">) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [checkingToken, setCheckingToken] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    React.useEffect(() => {
        const token = localStorage.getItem("auth-access-token");
        if (!token) {
            router.replace("/");
        } else {
            setCheckingToken(false);
        }
    }, [router]);

    if (checkingToken) {
        return null;
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (oldPassword === newPassword) {
            setError("New password cannot be the same as old password");
            return;
        }

        setError("");

        try {
            await AuthService.changePassword(oldPassword, newPassword);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            router.push("/");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to change password. Please try again.");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 justify-center items-center min-h-screen", className)} {...props}>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        <h2 className="font-heading text-2xl">Change Password</h2>
                    </CardTitle>
                    <CardDescription>
                        Enter your old password and a new password to update your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="old-password">Old Password</FieldLabel>
                                <Input
                                    id="old-password"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="confirm-password"
                                    required
                                />
                            </Field>
                        </FieldGroup>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="mt-4">
                            Change Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
