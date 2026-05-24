import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";
import { CreateUserBody } from "./user.schema";

export async function createUser(body: CreateUserBody) {
  const { name, email, password, role, phone, avatarUrl } = body;
  const passwordHash = await bcrypt.hash(password, 11);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role, phone, avatarUrl },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
}
