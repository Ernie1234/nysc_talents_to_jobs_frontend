// hooks/useJobForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobFormSchema, type JobFormData } from "@/types/job";
import { useCreateJobMutation } from "@/features/job/jobAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useJobForm = () => {
  const [createJob, { isLoading }] = useCreateJobMutation();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>("");

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      jobTitle: "",
      jobType: undefined,
      experienceLevel: undefined,
      workLocation: undefined,
      jobPeriod: undefined,
      skills: [],
      aboutJob: "",
      jobRequirements: "",
      hiringLocation: {
        type: "nation-wide",
        state: "",
      },
    },
  });

  const onSubmit = async (
    data: JobFormData,
    status: "draft" | "published" = "draft"
  ) => {
    try {
      setServerError("");

      const jobData = {
        title: data.jobTitle,
        jobType: data.jobType!,
        experienceLevel: data.experienceLevel!,
        workLocation: data.workLocation!,
        jobPeriod: data.jobPeriod!,
        skills: data.skills,
        aboutJob: data.aboutJob,
        requirements: data.jobRequirements,
        hiringLocation: data.hiringLocation,
        status: status,
      };

      const result = await createJob(jobData).unwrap();

      toast.success(
        status === "published"
          ? "Job Posted Successfully!"
          : "Job Saved as Draft",
        {
          description:
            status === "published"
              ? "Your job has been published and is now visible to job seekers."
              : "Your job has been saved as draft. You can publish it later.",
        }
      );

      // Redirect to jobs list or job preview
      navigate("/dashboard");

      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Job creation error:", error);

      const errorMessage =
        error?.data?.message || "Failed to create job. Please try again.";
      setServerError(errorMessage);

      toast.error("Error", {
        description: errorMessage,
      });
    }
  };

  const onSaveDraft = async (data: JobFormData) => {
    return onSubmit(data, "draft");
  };

  const onPublish = async (data: JobFormData) => {
    return onSubmit(data, "published");
  };

  return {
    form,
    onSubmit,
    onSaveDraft,
    onPublish,
    isLoading,
    error: serverError,
    isSubmitting: isLoading,
  };
};
