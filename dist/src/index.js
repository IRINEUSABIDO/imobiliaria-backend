import fastify from "fastify";
import cors from "@fastify/cors";
const app = fastify();
app.register(cors, { origin: "*" });
app.get("/", (request, reply) => {
    const message = {
        name: "patapim",
        Password: "123"
    };
    reply.status(200).send(message);
});
await app.listen({ port: 3333, host: "0.0.0.0" }).catch(error => {
    console.log(error);
    process.exit(1);
});
console.log("server running on port 3333");
