import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import fastifyMultipart from "@fastify/multipart"; // Plugin necessário
import { createPropertyJsonSchema, authHeaderSchema } from "./property.schema";
import {
  createPropertyJsonHandler,
  createPropertyMultipartHandler,
} from "./property.controller";

export async function propertyRoutes(app: FastifyInstance) {
  // Registra o multipart localmente (ou pode ser no index.ts)
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // Limite de 10MB imposto pelo Fastify
      files: 5, // Limita a 5 arquivos
    },
  });

  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // ROTA 2: Aceita Multipart Form Data (Dados + Binários)
  typedApp.post(
    "/properties/multipart",
    {
      schema: {
        headers: authHeaderSchema,
        // No Multipart, a validação do corpo é feita no Controller por causa da natureza do Stream
      },
    },
    createPropertyMultipartHandler,
  );
}
