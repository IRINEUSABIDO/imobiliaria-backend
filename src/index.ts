import fastify from "fastify";
import type { FastifyRequest, FastifyReply } from "fastify"
import cors from "@fastify/cors"
import { prisma } from "../lib/prisma";

const app = fastify()

app.register(cors, { origin: "*" })

type CreateUserBody = {
	name: string;
	email: string;
};

app.get("/users", (req: FastifyRequest, reply: FastifyReply) => {
	async function getUsers() {
		const users = await prisma.user.findMany()
		reply.status(200).send(users);
	}
	getUsers()
		.then(async () => {
			await prisma.$disconnect();
		})
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(2);
		});
})

app.post<{ Body: CreateUserBody }>("/createUser", (req, reply) => {
	async function createUser() {
		const { name, email } = req.body
		const user = await prisma.user.create({
			data: {
				name: name,
				email: email
			}
		})
		reply.status(200).send(`User: ${name}, with ${email} created`)
	}
	createUser().then(async () => {
		await prisma.$disconnect();
	})
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(2);
		});

})

// app.get(
// 	"/",
// 	(request: FastifyRequest, reply: FastifyReply) => {
// 		async function main() {
// 			// Create a new user with a post
// 			const user = await prisma.user.create({
// 				data: {
// 					name: "Alice",
// 					email: "alice1234@prisma.io",
// 				},
// 			});
// 			console.log("Created user:", user);
// 			const allUsers = await prisma.user.findMany();
// 			console.log("All users:", JSON.stringify(allUsers, null, 2));
// 		}
// 
// 		main()
// 			.then(async () => {
// 				await prisma.$disconnect();
// 			})
// 			.catch(async (e) => {
// 				console.error(e);
// 				await prisma.$disconnect();
// 				process.exit(2);
// 			});
// 
// 		const message = {
// 			name: "patapim",
// 			Password: "123"
// 		}
// 		reply.status(200).send(message)
// 	}
// )

await app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
	console.log("server running on port 3333")
}).catch(error => {
	console.log(error)
	process.exit(1)
})
