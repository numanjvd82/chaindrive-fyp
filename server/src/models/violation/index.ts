import { createViolation } from "./create";
import { deleteViolation } from "./delete";
import { getViolationById } from "./getById";
import { getViolationsByRentalId } from "./getByRentalId";
import { listViolations } from "./list";
import { updateViolation } from "./update";

export const violationModel = {
  create: createViolation,
  getById: getViolationById,
  getByRentalId: getViolationsByRentalId,
  list: listViolations,
  update: updateViolation,
  delete: deleteViolation,
};
