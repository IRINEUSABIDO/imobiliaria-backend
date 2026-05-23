import { FastifyInstance, FastifyReply } from "fastify";
import { FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import type { CreateUserBody } from "./types";

export async function userRoutes(app: FastifyInstance) {
	app.get("/users", async (req: FastifyRequest, reply: FastifyReply) => {
		const users = await prisma.user.findMany()
		reply.status(200).send(users);
	})

	app.post<{ Body: CreateUserBody }>("/createUser", async (req, reply) => {
		const { name, email } = req.body
		const user = await prisma.user.create({
			data: {
				name: name,
				email: email
			}
		})
		reply.status(200).send(`User: ${name}, with ${email} created`)

	})


}
