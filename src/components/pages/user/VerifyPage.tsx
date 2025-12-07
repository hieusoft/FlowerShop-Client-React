"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthService from "@/lib/AuthService";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function VerifyPage() {
    const searchParams = useSearchParams(); 
    const user = searchParams.get("user");
    const [message, setMessage] = React.useState("");

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AuthService.ResendVerificationEmail(user || "");
            setMessage("Verification email has been sent!");
        } catch (error) {
            console.error("Resend verification email failed", error);
            setMessage("Resend failed. Please try again.");
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
                        <Button type="submit">Resend</Button>
                    </form>
                    {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
