import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["CLIENTE", "PROPRIETARIO", "CORRETOR"]),
  phone: z.string(),
  avatarUrl: z.url("URL inválida").optional(),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
