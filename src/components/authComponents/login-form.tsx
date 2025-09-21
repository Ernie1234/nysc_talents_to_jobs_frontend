import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

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
import { useAuth } from "../../hooks/useAuth";
import { getGoogleOAuthUrl } from "../../api/apiClient";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn, loginError, isAuthenticated, clearErrors } =
    useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const intendedPath =
        sessionStorage.getItem("intended-path") || "/dashboard";
      sessionStorage.removeItem("intended-path");
      navigate(intendedPath, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  // Show error message from URL params (e.g., from OAuth failures)
  useEffect(() => {
    const errorParam = new URLSearchParams(location.search).get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        session_expired: "Your session has expired. Please log in again.",
        oauth_failed: "Google authentication failed. Please try again.",
        authentication_failed: "Authentication failed. Please try again.",
      };
      const message =
        errorMessages[errorParam] || "An error occurred. Please try again.";
      // You can replace this with your toast notification system
      console.error("Auth error:", message);
    }
  }, [location.search]);

  function onSubmit(values: LoginFormValues) {
    login({
      email: values.email,
      password: values.password,
    });
  }

  const handleGoogleLogin = () => {
    // Store intended path before redirecting to Google
    sessionStorage.setItem(
      "intended-path",
      location.state?.from?.pathname || "/dashboard"
    );
    window.location.href = getGoogleOAuthUrl();
  };

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
                {/* Display login errors */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="text-sm text-red-800">
                      <p className="font-medium">
                        {loginError.error?.message || "Login failed"}
                      </p>
                      {loginError.error?.details && (
                        <ul className="mt-2 space-y-1">
                          {loginError.error.details.map((detail, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{detail.message}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? "Logging In..." : "Login"}
                  {isLoggingIn && (
                    <Loader2 className="animate-spin ml-2 h-4 w-4" />
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
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
                e.currentTarget.src =
                  "https://placehold.co/600x400/000000/FFFFFF?text=Image";
                e.currentTarget.onerror = null;
              }}
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
