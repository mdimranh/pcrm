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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Organization, Role } from "@/core/db/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { signUp } from "../actions";
import { OrgSelector } from "./org-select";
import { UnitSelector } from "./unit-selector";

const formSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  email: z.email({
    error: (iss) => (iss.input === "" ? "Please enter your email" : undefined),
  }),
  phone: z.string().length(11, "Phone number must be 11 digits"),
  nid: z
    .string()
    .min(10, "NID must be at least 10 digits")
    .max(17, "NID must be at most 17 digits"),
  gender: z.string().min(1, "Please select your gender"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(7, "Password must be at least 7 characters long"),
  organizationId: z.string().min(1, "Please select your organization"),
  divisionId: z.string().optional(),
  districtId: z.string().optional(),
  upazilaId: z.string().optional(),
  unionId: z.string().optional(),
  pollingUnitId: z.string().optional(),
  designation: z.string().min(1, "Please select your designation"),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { auth } = useAuthStore();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgFetching, setOrgFetching] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesFetching, setRolesFetching] = useState<boolean>(false);
  useEffect(() => {
    async function LoaderOrganizations() {
      setOrgFetching(true);
      const org = await fetch("/api/auth/signup/organizations");
      const data = (await org.json()) as Organization[];
      setOrganizations(data);
      setOrgFetching(false);
    }
    async function LoadRoles() {
      setRolesFetching(true);
      const res = await fetch("/api/auth/signup/roles");
      const data = (await res.json()) as Role[];
      setRoles(data);
      setRolesFetching(false);
    }
    LoaderOrganizations();
    LoadRoles();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nid: "",
      gender: "",
      password: "",
      organizationId: "",
      divisionId: "",
      districtId: "",
      upazilaId: "",
      unionId: "",
      pollingUnitId: "",
      designation: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    toast.promise(signUp(data), {
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
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
    });
  }

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (currentStep === 1) {
        setIsButtonDisabled(!value.organizationId);
      }
      return true;
    });

    return () => subscription.unsubscribe();
  }, [currentStep, form, isLoading]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        {currentStep === 1 && (
          <OrgSelector
            organizations={organizations}
            fetching={orgFetching}
            setValue={form.setValue}
            form={form}
          />
        )}
        {currentStep === 2 && (
          <UnitSelector setValue={form.setValue} form={form} setLoading={setIsLoading} />
        )}
        {currentStep === 3 && (
          <>
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="01234567890"
                      {...field}
                      type="text"
                      inputMode="numeric"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 11);
                        field.onChange(target.value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex w-full gap-2 justify-between">
              <FormField
                control={form.control}
                name="nid"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>NID Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234567890"
                        {...field}
                        type="text"
                        inputMode="numeric"
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          target.value = target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 17);
                          field.onChange(target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Third Gender</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Designation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your designation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
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
          </>
        )}
        <div
          className={`flex items-center gap-2 mt-2 ${currentStep === 1 ? "justify-center" : "justify-between"
            }`}
        >
          {currentStep !== 1 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              type="button"
            >
              Back
            </Button>
          )}
          <Button
            className={`${currentStep === 1 ? "w-full" : ""}`}
            type="button"
            onClick={() => {
              if (currentStep === 3) {
                form.handleSubmit(onSubmit)();
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={isButtonDisabled || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
            {currentStep === 3 ? "Sign up" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
