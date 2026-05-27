import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres"),
  description: z.string().min(20, "Descrição deve ter no mínimo 20 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
  address: z.string().min(5, "Endereço muito curto"),
  latitude: z.number().min(-90).max(90, "Latitude inválida"),
  longitude: z.number().min(-180).max(180, "Longitude inválida"),
  propertyType: z.enum(["CASA", "APARTAMENTO"]),
  transactionType: z.enum(["VENDA", "ALUGUEL"]),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  area: z.number().positive("Área deve ser positiva"),
  garages: z.number().int().min(0),
  amenities: z.array(z.string()).default([]),
  ownerId: z.uuid("ID do proprietário inválido"),
  brokerId: z.uuid().optional(),
});

export const getPropertiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetPropertiesQuery = z.infer<typeof getPropertiesQuerySchema>;
export type CreatePropertyBody = z.infer<typeof createPropertySchema>;
