"use client";

import { Logo } from "@/assets/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { UserAuthForm } from "./components/user-auth-form";

export default function SignIn() {
  const redirect = useSearchParams().get("redirect") || "/";

  return (
    <div className="container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
        <div className="mb-4 flex items-center justify-center">
          <Logo className="me-2" />
          <h1 className="text-xl font-medium">Shadcn Admin</h1>
        </div>
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password below to <br />
              log into your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserAuthForm redirectTo={redirect} />
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground px-8 text-center text-sm">
              By clicking sign in, you agree to our{" "}
              <a
                href="/terms"
                className="hover:text-primary underline underline-offset-4"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="hover:text-primary underline underline-offset-4"
              >
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
