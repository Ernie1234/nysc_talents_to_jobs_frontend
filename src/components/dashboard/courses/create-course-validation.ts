import z from "zod";

export const courseTitleSchema = z
  .string()
  .trim()
  .min(1, "Course title is required")
  .max(200, "Course title cannot exceed 200 characters");

export const courseDescriptionSchema = z
  .string()
  .min(1, "Course description is required")
  .max(2000, "Course description cannot exceed 2000 characters");

export const createCourseSchema = z.object({
  title: courseTitleSchema,
  description: courseDescriptionSchema,
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  prerequisites: z
    .array(
      z.string().trim().max(200, "Prerequisite cannot exceed 200 characters")
    )
    .optional(),
  learningObjectives: z
    .array(
      z
        .string()
        .trim()
        .max(200, "Learning objective cannot exceed 200 characters")
    )
    .optional(),
  coverImage: z.string().url("Please enter a valid URL").optional(),
});
export type CreateCourseSchemaType = z.infer<typeof createCourseSchema>;
