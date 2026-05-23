import fastify from "fastify";
import cors from "@fastify/cors"
import { userRoutes } from "./user";

const app = fastify()

app.register(cors, { origin: "*" })
await app.register(userRoutes)


await app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
	console.log("server running on port 3333")
}).catch(error => {
	console.log(error)
	process.exit(1)
})
