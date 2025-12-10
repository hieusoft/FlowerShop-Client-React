"use client"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
} from "@/components/ui/field"
import React from "react"
import AuthService from "@/lib/api/AuthService"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [email, setEmail] = React.useState("")
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await AuthService.forgotPassword(email);
            setMessage("Reset link sent. Please check your email.");
            setError("");
        } catch (err: any) {
            setError("Failed to send reset link. Please try again.");
            setMessage("");
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2 className="font-heading text-2xl">Forgot Password</h2>
                    </CardTitle>
                    <p className="text-muted-foreground">
                        Enter your email to receive a reset link.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field className="mt-4">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            {message && <Alert>
                                <CheckCircle2Icon />
                                <AlertDescription>
                                    {message}
                                </AlertDescription>
                            </Alert>}
                            {error && (
                                <Alert variant="destructive" className="mt-2">
                                    <AlertCircleIcon />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Field className="mt-4">
                                <Button type="submit" className="w-full">
                                    Send
                                </Button>
                            </Field>

                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div >
    )
}
