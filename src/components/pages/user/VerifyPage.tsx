"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import AuthService from "@/lib/AuthService";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const user = searchParams.get("user");

    const [success, setSuccess] = React.useState("");
    const [error, setError] = React.useState("");
    const [cooldown, setCooldown] = React.useState(0);

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldown > 0) return;

        try {
            await AuthService.ResendVerificationEmail(user || "");
            setSuccess("Verification email has been sent!");
            setError("");
            setCooldown(60);

            const interval = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            console.error("Resend verification email failed", error);
            setError("Resend failed. Please try again.");
            setSuccess("");
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2 className="font-heading text-2xl">Verify your email</h2>
                    </CardTitle>
                    <p>Please check your email for a verification link.</p>
                </CardHeader>
                <CardContent className="mt-4">
                    <form onSubmit={handleResend}>
                        {success && <Alert className="mt-2">
                            <CheckCircle2Icon />
                            <AlertDescription>
                                {success}
                            </AlertDescription>
                        </Alert>}
                        {error && (
                            <Alert variant="destructive" className="mt-2">
                                <AlertCircleIcon />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Field className="mt-2">
                            <Button type="submit" disabled={cooldown > 0}>
                                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
                            </Button>
                        </Field>

                    </form>

                </CardContent>
            </Card>
        </div>
    );
}
