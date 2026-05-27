import { FastifyRequest, FastifyReply } from "fastify";
import { createPropertySchema } from "./property.schema";
import { createProperty } from "./property.service";
import { getPropertiesQuerySchema } from "./property.schema";
import { getProperties } from "./property.service";

export async function getPropertiesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = getPropertiesQuerySchema.safeParse(request.query);
  if (!parsed.success) {
    return reply.status(400).send({
      error: "Parâmetros de consulta inválidos",
      details: parsed.error.flatten(),
    });
  }

  const result = await getProperties(parsed.data);
  return reply.send(result);
}

export async function createPropertyHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parts = request.parts();
  let photoBuffer: Buffer | null = null;
  const fields: Record<string, string> = {};

  for await (const part of parts) {
    if (part.type === "file") {
      if (part.fieldname === "photo") {
        const chunks: Buffer[] = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        photoBuffer = Buffer.concat(chunks);
      }
    } else {
      fields[part.fieldname] = part.value as string;
    }
  }

  // Monta objeto para validação
  const body = {
    title: fields.title,
    description: fields.description,
    price: Number(fields.price),
    address: fields.address,
    latitude: Number(fields.latitude),
    longitude: Number(fields.longitude),
    propertyType: fields.propertyType,
    transactionType: fields.transactionType,
    bedrooms: Number(fields.bedrooms),
    bathrooms: Number(fields.bathrooms),
    area: Number(fields.area),
    garages: Number(fields.garages),
    amenities: fields.amenities ? JSON.parse(fields.amenities) : [],
    ownerId: fields.ownerId,
    brokerId: fields.brokerId || undefined,
  };

  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) {
    return reply.status(400).send({
      error: "Dados inválidos",
      details: parsed.error.flatten(),
    });
  }

  if (!photoBuffer) {
    return reply.status(400).send({ error: "A foto é obrigatória." });
  }

  const photoBase64 = photoBuffer.toString("base64");

  const property = await createProperty(parsed.data, photoBase64);
  return reply.status(201).send(property);
}
