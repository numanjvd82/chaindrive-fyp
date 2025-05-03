import { createDevice } from "./create";
import { deleteDevice } from "./delete";
import { listDeviceById } from "./listById";

export const deviceModel = {
  add: createDevice,
  delete: deleteDevice,
  listById: listDeviceById,
};
