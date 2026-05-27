import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createPropertyHandler } from "./property.controller";
import { getPropertiesHandler } from "./property.controller";
import { getPropertiesQuerySchema } from "./property.schema";

export async function propertyRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  app.post("/properties", createPropertyHandler);

  typedApp.get(
    "/properties",
    {
      schema: {
        querystring: getPropertiesQuerySchema,
      },
    },
    getPropertiesHandler,
  );
}
