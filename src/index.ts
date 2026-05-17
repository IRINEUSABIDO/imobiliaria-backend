import fastify from "fastify";
import type { FastifyRequest, FastifyReply } from "fastify"
import cors from "@fastify/cors"
import { prisma } from "../lib/prisma";

const app = fastify()

app.register(cors, { origin: "*" })

app.get(
	"/",
	(request: FastifyRequest, reply: FastifyReply) => {
		async function main() {
			// Create a new user with a post
			const user = await prisma.user.create({
				data: {
					name: "Alice",
					email: "alice123@prisma.io",
				},
			});
			console.log("Created user:", user);
		}

		main()
			.then(async () => {
				await prisma.$disconnect();
			})
			.catch(async (e) => {
				console.error(e);
				await prisma.$disconnect();
				process.exit(2);
			});

		const message = {
			name: "patapim",
			Password: "123"
		}
		reply.status(200).send(message)
	}
)

await app.listen({ port: 3333, host: "0.0.0.0" }).catch(error => {
	console.log(error)
	process.exit(1)
})
console.log("server running on port 3333")
