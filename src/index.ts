import { Elysia } from "elysia";
import { UserController } from "./controllers/UserController";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { DeviceController } from "./controllers/DeviceController";
import { DepartmentController } from "./controllers/DepartmentController";
import { SectionController } from "./controllers/SecConTroller";
import { RepairRecordController } from "./controllers/RepairRecordController";

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
.delete("/api/user/remove/:id", UserController.remove)
.get("/api/user/checkUsername/:username", UserController.checkUsername)
.get("/api/user/listEngineer", UserController.listEngineer)



//department
.get("/api/department/list", DepartmentController.list)

//repair record
.get("/api/repairRecord/list", RepairRecordController.list)
.post("/api/repairRecord/create", RepairRecordController.create)
.get("/api/repairRecord/checkDeviceSerial/:deviceSerial", RepairRecordController.checkDeviceSerial)
.put("/api/repairRecord/update/:id", RepairRecordController.update)
.delete("/api/repairRecord/remove/:id", RepairRecordController.remove)
.put("/api/repairRecord/updateStatus/:id", RepairRecordController.updateStatus)

//section
.get("/api/section/listByDepartment/:departmentId", SectionController.listByDepartment)

//device
.post("/api/device/create", DeviceController.create)
.get("/api/device/list", DeviceController.list)
.put("/api/device/update/:id", DeviceController.update)
.delete("/api/device/remove/:id", DeviceController.remove)
.listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
