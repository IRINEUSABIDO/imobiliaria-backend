import fastify from "fastify";
import cors from "@fastify/cors";
const app = fastify();
app.register(cors, { origin: "*" });
app.get("/", (request, reply) => {
    reply.send("patapim");
});
await app.listen({ port: 3333, host: "0.0.0.0" }).catch(error => {
    console.log(error);
    process.exit(1);
});
console.log("server running on port 3333");
//# sourceMappingURL=index.js.map