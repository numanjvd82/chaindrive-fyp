import { createViolation } from "./create";
import { getViolationById } from "./getById";
import { listViolations } from "./list";
import { getViolationsByRentalId } from "./getByRentalId";
import { getViolationByRentalAndUser } from "./checkExisting";

export const violationModel = {
  create: createViolation,
  getByRentalId: getViolationsByRentalId,
};
