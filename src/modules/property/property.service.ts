import { prisma } from "../../utils/prisma";
import { PropertyCoreData } from "./property.schema";

/**
 * Valida a "autenticação simples" verificando se o usuário existe e é PROPRIETARIO
 */
async function validateOwner(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("UNAUTHORIZED: Usuário não encontrado.");
  }

  if (user.role !== "PROPRIETARIO") {
    throw new Error("FORBIDDEN: Apenas proprietários podem anunciar imóveis.");
  }

  return user;
}

/**
 * Criação via Multipart (Processamento de binários)
 */
export async function createPropertyWithFiles(
  ownerId: string,
  data: PropertyCoreData,
  imageBuffers: Buffer[],
) {
  await validateOwner(ownerId);

  if (imageBuffers.length > 5) {
    throw new Error("BAD_REQUEST: Permitido no máximo 5 fotos.");
  }

  // MOCK: Aqui você faria o upload dos buffers para AWS S3, Cloudinary, etc.
  // Exemplo simulado de retorno de URLs após upload:
  const uploadedUrls = imageBuffers.map(
    (_, index) =>
      `https://storage.swifthome.com/mock-upload-${Date.now()}-${index}.jpg`,
  );

  const property = await prisma.property.create({
    data: {
      ...data,
      photos: uploadedUrls,
      ownerId,
      status: "RASCUNHO",
    },
  });

  return property;
}
