/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterMutation } from "@/features/auth/authAPI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

// Define the schema with proper types - ONLY these two are selectable
const schema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "Password must contain uppercase, lowercase, number and special character",
    }),
  role: z.enum(["corps_member", "employer"]), // Only these two are selectable by users
});

type FormValues = z.infer<typeof schema>;

// Password Strength Component
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({
  password,
}) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    const checks = [
      { regex: /.{8,}/, message: "At least 8 characters" },
      { regex: /[a-z]/, message: "Lowercase letter" },
      { regex: /[A-Z]/, message: "Uppercase letter" },
      { regex: /[0-9]/, message: "Number" },
      { regex: /[@$!%*?&]/, message: "Special character (@$!%*?&)" },
    ];

    const passedChecks = checks.filter((check) => check.regex.test(password));
    const failedChecks = checks.filter((check) => !check.regex.test(password));

    setStrength((passedChecks.length / checks.length) * 100);
    setFeedback(failedChecks.map((check) => check.message));
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      {feedback.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>Missing: {feedback.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "corps_member",
    },
  });

  // Watch email field to detect NITDA emails
  const emailValue = form.watch("email");
  const isNITDAEmail = emailValue.toLowerCase().endsWith("@nitda.gov.ng");
  const selectedRole = form.watch("role");

  // Auto-switch to employer role when NITDA email is detected
  useEffect(() => {
    if (isNITDAEmail && selectedRole !== "employer") {
      form.setValue("role", "employer");
      toast.info(
        "NITDA email detected. Your account will have enhanced administrator privileges.",
        {
          duration: 6000,
        }
      );
    }
  }, [isNITDAEmail, selectedRole, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Prepare the data for submission - backend will handle nitda role conversion
      const submitData = {
        ...values,
        // Send the form role, backend will convert NITDA emails to 'nitda' role
      };

      await register(submitData).unwrap();

      form.reset();

      // Show appropriate success message
      if (isNITDAEmail) {
        toast.success(
          "NITDA Administrator account created successfully! You now have full system access and enhanced privileges."
        );
      } else {
        toast.success(
          "Registration successful! Please check your email for verification."
        );
      }

      navigate(AUTH_ROUTES.SIGN_IN);
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.status === 409) {
        toast.error("User already exists with this email");
      } else if (error?.status === 400) {
        toast.error("Invalid registration data");
      } else {
        toast.error("Failed to register. Please try again.");
      }
    }
  };

  // Watch the password field for strength indicator
  const passwordValue = form.watch("password");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign up to COPA</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Fill information below to create your account
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
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
                  <Input
                    placeholder="john.doe@example.com"
                    {...field}
                    className={
                      isNITDAEmail ? "border-green-500 bg-green-50" : ""
                    }
                  />
                </FormControl>
                <FormMessage />
                {isNITDAEmail && (
                  <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <span className="font-semibold">🎯 NITDA Account</span>
                    <span>• Full system access enabled</span>
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-muted-foreground mt-1">
                  Password must contain at least 8 characters with uppercase,
                  lowercase, number, and special character
                </div>
                <PasswordStrengthIndicator password={passwordValue} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value} // Use the actual form value, not "nitda"
                  disabled={isNITDAEmail} // Disable selection for NITDA emails
                >
                  <FormControl>
                    <SelectTrigger
                      className={
                        isNITDAEmail
                          ? "bg-green-50 border-green-200 text-green-700 font-semibold"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select account type">
                        {isNITDAEmail
                          ? "NITDA Administrator"
                          : field.value === "corps_member"
                          ? "Corps Member"
                          : "Employer"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="corps_member">Corps Member</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                {/* {isNITDAEmail && (
                  <div className="text-xs text-green-600 mt-1">
                    <span className="font-semibold">
                      🔒 Automatic Role Assignment:
                    </span>{" "}
                    NITDA emails receive enhanced administrator privileges.
                  </div>
                )} */}
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            type="submit"
            className={`w-full duration-300 transition-all ${
              isNITDAEmail
                ? "bg-green-900 hover:bg-green-800 shadow-lg"
                : "bg-green-800 hover:bg-green-700"
            }`}
          >
            {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            {isNITDAEmail
              ? "Create NITDA Administrator Account"
              : "Create Account"}
          </Button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
