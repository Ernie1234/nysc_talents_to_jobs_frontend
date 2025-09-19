import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormValues } from "../../lib/schemas";
import { useMutation } from "@tanstack/react-query";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";

// Mock API call to save user data
const mockRegisterUser = async (data: RegisterFormValues) => {
  return new Promise<RegisterFormValues>((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
        const existingUser = users.find(
          (user: RegisterFormValues) => user.email === data.email
        );

        if (existingUser) {
          throw new Error("Email already registered.");
        }

        const newUser = { ...data, id: Date.now() };
        localStorage.setItem("mock_users", JSON.stringify([...users, newUser]));
        localStorage.setItem("mock_current_user", JSON.stringify(newUser));
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // 1. Define your form.
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      isOrg: false,
      companyName: "",
      name: "",
    },
  });

  // Watch the 'isOrg' field to conditionally render the company input
  const isOrg = form.watch("isOrg");

  const registerMutation = useMutation<
    RegisterFormValues,
    Error,
    RegisterFormValues
  >({
    mutationFn: mockRegisterUser,
    onSuccess: (data) => {
      console.log("Registration successful!", data);
      // Simulate redirection to dashboard
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
      alert(error.message);
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-muted-foreground text-balance">
                Enter your details below to register
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isOrg ? (
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="isOrg"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Register as a Organization
                      </FormLabel>
                    </FormItem>
                  )}
                />

              

                 <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "Registering..." : "Register"}

                  {registerMutation.isPending && <Loader2 className="animate-spin ml-2"/>}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </a>
                </div>
              </form>
            </Form>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://techpoint.africa/wp-content/uploads/2017/09/jobs-nysc-employee-corper-5.jpg"
              alt="An office worker"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
