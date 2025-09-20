import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { loginFormSchema, type LoginFormValues } from "../../lib/schemas";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Mock API call for login
const mockLoginUser = async (data: LoginFormValues) => {
  return new Promise<LoginFormValues>((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
        const existingUser = users.find(
          (user: any) =>
            user.email === data.email && user.password === data.password
        );

        if (!existingUser) {
          throw new Error("Invalid email or password.");
        }
        localStorage.setItem("mock_current_user", JSON.stringify(existingUser));
        resolve(existingUser);
      } catch (error: any) {
        reject(error);
      }
    }, 1000);
  });
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation<LoginFormValues, Error, LoginFormValues>({
    mutationFn: mockLoginUser,
    onSuccess: (data) => {
      console.log("Login successful!", data);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      // You can add a toast or alert here to notify the user
      alert(error.message);
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground text-balance">
                Login to your Acme Inc account
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
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging In..." : "Login"}

                  {loginMutation.isPending && (
                    <Loader2 className="animate-spin ml-2" />
                  )}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/auth/register"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </a>
                </div>
              </form>
            </Form>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhKpO8f18G9Gv_WEYLgPOl2OoK3xTSf0iCFZSIGEzPAHuiaE5GBdo4I-hsk7b_qw1HkB2ybtgzavHrKNUeFubkfSLyaLMUxch8gK3L5HURTKd60IzEeTrPWh7y3HN28zyvzxzhoUfu3tj1u/s738/FB_IMG_1630870913855.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400/000000/FFFFFF?text=Image";
                e.currentTarget.onerror = null;
              }}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

