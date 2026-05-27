import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { userRoutes } from "./modules/user/user.route";
import { propertyRoutes } from "./modules/property/property.route";

const app = fastify({ logger: true });

app.register(cors, { origin: "*" });

app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite rígido de 10MB por arquivo
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes);
app.register(propertyRoutes);

await app
  .listen({ port: 3333, host: "0.0.0.0" })
  .then(() => {
    console.log("server running on port 3333");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
