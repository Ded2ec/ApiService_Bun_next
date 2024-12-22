import { Elysia } from "elysia";
import { UserController } from "./controllers/UserController";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { DeviceController } from "./controllers/DeviceController";

const app = new Elysia()
.use(swagger())
.use(cors())
.use(jwt({
  name: "jwt",
  secret: "secret",
})).get("/", () => "Hello Elysia")
.post("/api/user/singin", UserController.signIn)
.put("/api/user/update", UserController.update)
.get("/api/user/list", UserController.list)
.post("/api/user/create", UserController.create)
.put("/api/user/updateUser/:id", UserController.updateUser)
//device
.post("/api/device/create", DeviceController.create)
.get("/api/device/list", DeviceController.list)
.put("/api/device/update/:id", DeviceController.update)
.delete("/api/device/remove/:id", DeviceController.remove)
.listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
