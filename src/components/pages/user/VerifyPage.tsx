"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import AuthService from "@/lib/api/AuthService";
import { AxiosError } from "axios";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const COOLDOWN_TIME = 60;
const STORAGE_KEY = "verify_email_cooldown";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const user = searchParams.get("user");

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const start = Number(stored);
        const diff = Math.floor((Date.now() - start) / 1000);

        if (diff < COOLDOWN_TIME) {
            setCooldown(COOLDOWN_TIME - diff);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    localStorage.removeItem(STORAGE_KEY);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldown > 0) return;

        try {
            await AuthService.resendVerificationEmail(user || "");

            localStorage.setItem(STORAGE_KEY, Date.now().toString());
            setCooldown(COOLDOWN_TIME);

            setSuccess("Verification email has been sent!");
            setError("");
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err?.response?.data?.message)
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2 className="font-heading text-2xl">
                            Verify your email
                        </h2>
                    </CardTitle>
                    <p>Please check your email for a verification link.</p>
                </CardHeader>

                <CardContent className="mt-4">
                    <form onSubmit={handleResend}>
                        {success && (
                            <Alert className="mt-2">
                                <CheckCircle2Icon />
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive" className="mt-2">
                                <AlertCircleIcon />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Field className="mt-4">
                            <Button type="submit" disabled={cooldown > 0}>
                                {cooldown > 0
                                    ? `Resend in ${cooldown}s`
                                    : "Resend"}
                            </Button>
                        </Field>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
