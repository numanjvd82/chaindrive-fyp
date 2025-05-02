import { Router } from "express";
import { createDeviceController } from "../../controllers/device/createDevice";
import { deleteDeviceController } from "../../controllers/device/deleteDevice";
import { listDeviceByIdController } from "../../controllers/device/listDeviceById";

const deviceRouter = Router();

deviceRouter.post("/", createDeviceController);
deviceRouter.delete("/:deviceId", deleteDeviceController);
deviceRouter.get("/", listDeviceByIdController);

export default deviceRouter;
