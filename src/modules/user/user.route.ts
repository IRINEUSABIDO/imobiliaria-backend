import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createUserSchema } from "./user.schema";
import { createUserHandler } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/users",
    {
      schema: {
        body: createUserSchema,
      },
    },
    createUserHandler,
  );
}
