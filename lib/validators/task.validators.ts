import { z } from "zod";

export const taskStatusSchema = z.enum(["pending", "done"]);

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  status: taskStatusSchema.optional()
});

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional()
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    status: taskStatusSchema.optional()
  })
  .refine((val) => Object.keys(val).length > 0, {
    message: "Envie ao menos um campo para atualizar."
  });

