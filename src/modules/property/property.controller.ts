import { FastifyRequest, FastifyReply } from "fastify";
import {
  createPropertyWithUrls,
  createPropertyWithFiles,
} from "./property.service";
import { CreatePropertyJsonBody, propertyCoreSchema } from "./property.schema";

// Tratamento centralizado de erros do Service
function handleServiceError(error: any, reply: FastifyReply) {
  const msg = error.message as string;
  if (msg.startsWith("UNAUTHORIZED"))
    return reply.status(401).send({ message: msg.split(": ")[1] });
  if (msg.startsWith("FORBIDDEN"))
    return reply.status(403).send({ message: msg.split(": ")[1] });
  if (msg.startsWith("BAD_REQUEST"))
    return reply.status(400).send({ message: msg.split(": ")[1] });

  console.error(error);
  return reply.status(500).send({ message: "Erro interno no servidor." });
}

// Controller: Cenário 1 (URLs)
export async function createPropertyJsonHandler(
  req: FastifyRequest<{
    Body: CreatePropertyJsonBody;
    Headers: { "x-user-id": string };
  }>,
  reply: FastifyReply,
) {
  try {
    const ownerId = req.headers["x-user-id"];
    const property = await createPropertyWithUrls(ownerId, req.body);
    return reply.status(201).send(property);
  } catch (error: any) {
    return handleServiceError(error, reply);
  }
}

// Controller: Cenário 2 (Multipart)
export async function createPropertyMultipartHandler(
  req: FastifyRequest<{ Headers: { "x-user-id": string } }>,
  reply: FastifyReply,
) {
  try {
    const ownerId = req.headers["x-user-id"];
    const parts = req.parts();

    let propertyData: any = {};
    const imageBuffers: Buffer[] = [];

    // Iterando pelo Multipart stream
    for await (const part of parts) {
      if (part.type === "file") {
        // Validação de tamanho (ex: 10MB) limitando no buffer
        const buffer = await part.toBuffer();
        if (buffer.length > 10 * 1024 * 1024) {
          return reply
            .status(400)
            .send({ message: `Arquivo ${part.filename} excede 10MB.` });
        }
        imageBuffers.push(buffer);
      } else {
        // Campos de texto vindo do form-data
        // Convertendo strings numéricas e booleanas
        const value = part.value as string;
        if (
          [
            "price",
            "latitude",
            "longitude",
            "bedrooms",
            "bathrooms",
            "area",
            "garages",
          ].includes(part.fieldname)
        ) {
          propertyData[part.fieldname] = Number(value);
        } else if (part.fieldname === "amenities") {
          // Assumindo envio como string separada por vírgula no form-data
          propertyData[part.fieldname] = value.split(",").map((s) => s.trim());
        } else {
          propertyData[part.fieldname] = value;
        }
      }
    }

    // Validação manual Zod para os dados extraídos do form-data
    const parsedData = propertyCoreSchema.parse(propertyData);

    const property = await createPropertyWithFiles(
      ownerId,
      parsedData,
      imageBuffers,
    );
    return reply.status(201).send(property);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return reply
        .status(400)
        .send({ message: "Erro de validação", errors: error.errors });
    }
    return handleServiceError(error, reply);
  }
}
