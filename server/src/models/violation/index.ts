import { createViolation } from "./create";
import { getViolationById } from "./getById";
import { listViolations } from "./list";

export const violationModel = {
  create: createViolation,
  getById: getViolationById,
  list: listViolations,
};
