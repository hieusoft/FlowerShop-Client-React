"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { setAccessToken } from "@/lib/api"
import AuthService from "@/lib/api/AuthService"
import React, { useContext } from "react"
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { GlobalContext, useUser } from "@/components/providers/contexts/global-context"



export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [emailOrUsername, setEmailOrUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();
  const [checkingToken, setCheckingToken] = React.useState(true);

  const global = useContext(GlobalContext);


  React.useEffect(() => {
    const token = localStorage.getItem("auth-access-token");
    if (token) {
      router.replace("/");
    } else {
      setCheckingToken(false);
    }
  }, [router]);

  if (checkingToken) {
    return null;
  }


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    try {
      const data = await AuthService.login(emailOrUsername, password);
      setError("");
      setAccessToken(data.data.accessToken);

      const profile = await AuthService.profile();
      global.set.user(profile.data);
      console.log("Login successful");
      router.push("/");
    } catch (err: any) {
      if (err?.response?.data?.message === "Email not verified") {
        router.push(`/verify-email?user=${encodeURIComponent(emailOrUsername)}`);
        return;
      }
      setError("Login failed. Please check your credentials and try again.");
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="font-heading text-2xl">Login to your account</h2>
          </CardTitle>
          <CardDescription>
            Enter your email or username to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="emailOrUsername">Email or Username</FieldLabel>
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="m@example.com or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="password"
                  required
                />
              </Field>

              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircleIcon />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
