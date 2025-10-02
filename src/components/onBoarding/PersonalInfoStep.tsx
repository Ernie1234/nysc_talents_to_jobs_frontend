/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/onboarding/steps/PersonalInfoStep.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// Create separate schemas for different roles with proper phone validation
const corpsMemberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  stateOfService: z.string().min(1, "State of service is required"),
  stateCode: z.string().min(1, "State code is required"),
  callUpNumber: z.string().min(1, "Call-up number is required"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
});

const siwesSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  tertiarySchool: z.string().min(1, "Tertiary school is required"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
});

interface PersonalInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  userRole?: string;
  isLastStep: boolean;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const { user } = useAuth();
  const isCorpsMember = user?.role === "CORPS_MEMBER";

  // Use appropriate schema based on role
  const schema = isCorpsMember ? corpsMemberSchema : siwesSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneNumber: data.personalInfo?.phoneNumber || "",
      stateOfService: data.personalInfo?.stateOfService || "",
      tertiarySchool: data.personalInfo?.tertiarySchool || "",
      stateCode: data.personalInfo?.stateCode || "",
      callUpNumber: data.personalInfo?.callUpNumber || "",
      dateOfBirth: data.personalInfo?.dateOfBirth || "",
      gender: data.personalInfo?.gender || "",
    },
  });

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const nigerianSchools = [
    "University of Lagos",
    "University of Ibadan",
    "University of Nigeria, Nsukka",
    "Ahmadu Bello University",
    "University of Benin",
    "University of Ilorin",
    "University of Port Harcourt",
    "University of Abuja",
    "University of Maiduguri",
    "Federal University of Technology, Akure",
    "Covenant University",
    "Bayero University Kano",
    "University of Calabar",
    "Nnamdi Azikiwe University",
    "Obafemi Awolowo University",
    "University of Uyo",
    "Federal University of Technology, Minna",
    "University of Jos",
    "Lagos State University",
    "Rivers State University",
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) =>
          onNext({ personalInfo: formData })
        )}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+234800000000"
                    {...field}
                    maxLength={15}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-muted-foreground">
                  Format: +234800000000 (max 15 digits)
                </div>
              </FormItem>
            )}
          />

          {isCorpsMember ? (
            <FormField
              control={form.control}
              name="stateOfService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State of Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="tertiarySchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tertiary School</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nigerianSchools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {isCorpsMember && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stateCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AB/23A/1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="callUpNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call-up Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your call-up number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={true}
          >
            Back
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};
