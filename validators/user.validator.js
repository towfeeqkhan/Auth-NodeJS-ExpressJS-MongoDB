import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .trim()
    .min(3, { error: "Name must be at least 3 characters long" }),
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Email must be a string",
    })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Invalid email address" })),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .trim()
    .min(6, { error: "Password must be at least 6 characters long" }),
  role: z.enum(["user", "admin"]).optional(),
});
