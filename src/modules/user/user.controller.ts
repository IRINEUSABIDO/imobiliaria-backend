import { prisma } from "../../utils/prisma";
import { CreateUserBody } from "./user.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { createUser } from "./user.service";

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply,
) {
  const body = request.body;

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    return reply.status(410).send({ message: "E-mail já está em uso." });
  }

  try {
    const user = await createUser(body);
    return reply.status(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.status(500).send(e);
  }
}
