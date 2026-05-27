import { prisma } from "../../utils/prisma";
import type { CreatePropertyBody } from "./property.schema";
import type { GetPropertiesQuery } from "./property.schema";

export async function getProperties(query: GetPropertiesQuery) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        address: true,
        latitude: true,
        longitude: true,
        photo: true,
        propertyType: true,
        transactionType: true,
        status: true,
        isFeatured: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        garages: true,
        amenities: true,
        viewsCount: true,
        ownerId: true,
        brokerId: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        // photo NÃO incluso para resposta leve
      },
    }),
    prisma.property.count(),
  ]);

  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createProperty(
  data: CreatePropertyBody,
  photoBase64: string,
) {
  const property = await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price.toString(), // Decimal espera string
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      photo: photoBase64, // string base64
      propertyType: data.propertyType,
      transactionType: data.transactionType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area.toString(),
      garages: data.garages,
      amenities: data.amenities,
      ownerId: data.ownerId,
      brokerId: data.brokerId,
    },
    select: {
      id: true,
      title: true,
      price: true,
      address: true,
      propertyType: true,
      transactionType: true,
      status: true,
      createdAt: true,
    },
  });

  return property;
}
