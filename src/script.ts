import { prisma } from "../lib/prisma";

async function main() {
	// Create a new user with a post
	const user = await prisma.user.create({
		data: {
			name: "Alice",
			email: "alice@prisma.io",
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

//import fastify from 'fastify'
//import { PrismaPg } from '@prisma/adapter-pg'
//import { PrismaClient } from '../generated/client'
//
//const adapter = new PrismaPg({
//  connectionString: process.env.DATABASE_URL,
//})
//const prisma = new PrismaClient({ adapter })
//const app = fastify()
//
//app.get('/feed', async (req, res) => {
//  const posts = await prisma.post.findMany({
//    where: { published: true },
//    include: { author: true },
//  })
//  res.json(posts)
//})
//
//app.post('/post', async (req, res) => {
//  const { title, content, authorEmail } = req.body
//  const post = await prisma.post.create({
//    data: { title, content, published: false, author: { connect: { email: authorEmail } } },
//  })
//  res.json(post)
//})
//
//app.listen(3000)



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


