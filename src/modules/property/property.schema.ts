import { z } from "zod";

// Schema comum de dados do imóvel
export const propertyCoreSchema = z.object({
  title: z.string().min(5, "O título deve ter no mínimo 5 caracteres"),
  description: z.string().min(10, "Forneça uma descrição detalhada"),
  price: z.number().positive("O preço deve ser maior que zero"),
  address: z.string().min(5, "Endereço obrigatório"),
  latitude: z.number(),
  longitude: z.number(),
  propertyType: z.enum(["CASA", "APARTAMENTO"]),
  transactionType: z.enum(["VENDA", "ALUGUEL"]),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  area: z.number().positive(),
  garages: z.number().int().nonnegative(),
  amenities: z.array(z.string()).default([]),
});

// Schema para validação do cabeçalho (Autenticação Simples)
export const authHeaderSchema = z.object({
  "x-user-id": z.string().uuid("ID de usuário inválido ou não fornecido"),
});

export type PropertyCoreData = z.infer<typeof propertyCoreSchema>;
