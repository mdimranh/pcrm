"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, sleep } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UnitSelector } from "./unit-selector";

const formSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  email: z.email({
    error: (iss) => (iss.input === "" ? "Please enter your email" : undefined),
  }),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(7, "Password must be at least 7 characters long"),
  divisionId: z.string().min(1, "Please select your division"),
  districtId: z.string().optional(),
  upazilaId: z.string().optional(),
  unionId: z.string().optional(),
  pollingUnitId: z.string().optional(),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { auth } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      divisionId: "",
      districtId: "",
      upazilaId: "",
      unionId: "",
      pollingUnitId: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    toast.promise(sleep(2000), {
      loading: "Registering, please wait...",
      success: () => {
        setIsLoading(false);

        // Mock successful authentication with expiry computed at success time
        const mockUser = {
          accountNo: "ACC001",
          email: data.email,
          role: ["user"],
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        };

        // Set user and access token
        auth.setUser(mockUser);
        auth.setAccessToken("mock-access-token");

        // Redirect to the stored location or default to dashboard
        const targetPath = redirectTo || "/";
        router.push(targetPath);

        return `Welcome back, ${data.email}!`;
      },
      error: "Error",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <div className="flex w-full gap-2 justify-between">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <UnitSelector setValue={form.setValue} form={form} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                href="/forgot-password"
                className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading} type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Sign up
        </Button>
      </form>
    </Form>
  );
}
