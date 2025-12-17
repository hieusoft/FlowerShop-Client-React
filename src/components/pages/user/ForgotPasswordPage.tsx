"use client"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import React, { useEffect, useState } from "react"
import AuthService from "@/lib/api/AuthService"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AxiosError } from "axios"

const COOLDOWN_TIME = 60 
const STORAGE_KEY = "forgot_password_cooldown"

export default function ForgotPasswordPage({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [remaining, setRemaining] = useState(0)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return

        const startTime = Number(stored)
        const diff = Math.floor((Date.now() - startTime) / 1000)

        if (diff < COOLDOWN_TIME) {
            setRemaining(COOLDOWN_TIME - diff)
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [])

    useEffect(() => {
        if (remaining <= 0) return

        const timer = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    localStorage.removeItem(STORAGE_KEY)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [remaining])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")

        try {
            await AuthService.forgotPassword(email)
            localStorage.setItem(STORAGE_KEY, Date.now().toString())
            setRemaining(COOLDOWN_TIME)

            setMessage("Reset link sent. Please check your email.")
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err?.response?.data?.message)
            }
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
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>

                            {message && (
                                <Alert>
                                    <CheckCircle2Icon />
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Field className="mt-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={remaining > 0}
                                >
                                    {remaining > 0
                                        ? `Wait ${remaining}s`
                                        : "Send"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
