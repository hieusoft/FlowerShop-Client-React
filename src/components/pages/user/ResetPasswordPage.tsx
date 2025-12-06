"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

// TODO Implement page
export default function ResetPasswordPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const handleRessetPass = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        console.log("Resetting password to:", newPassword);
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
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="confirm-password" required />
                        </Field>
                    </FieldGroup>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    <Field className="mt-4">
                        <Button>Reset Password</Button>
                    </Field>
                </form>

            </CardContent>
        </Card>
    </div >;
}