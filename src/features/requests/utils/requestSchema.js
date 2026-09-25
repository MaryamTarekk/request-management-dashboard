import { z } from "zod";

export const requestSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Title is required",
  }),

  status: z.enum(["open", "in_progress", "blocked", "done"], {
    error: "Please select a valid status",
  }),

  priority: z.enum(["low", "medium", "high"], {
    error: "Please select a valid priority",
  }),

  owner: z.string().trim().min(1, {
    message: "Owner is required",
  }),

  description: z.string().optional(),
});
