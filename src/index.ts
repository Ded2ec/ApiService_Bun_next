import { Elysia } from "elysia";
import { UserController } from "./controllers/UserController";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
.use(swagger())
.use(cors())
.use(jwt({
  name: "jwt",
  secret: "secret",
})).get("/", () => "Hello Elysia")
.post("/api/user/singin", UserController.signIn)
.put("/api/user/update", UserController.update)
.listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
