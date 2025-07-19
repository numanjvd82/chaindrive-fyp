import { createViolation } from "./create";
import { getViolationsByRentalId } from "./getByRentalId";

export const violationModel = {
  create: createViolation,
  getByRentalId: getViolationsByRentalId,
};
