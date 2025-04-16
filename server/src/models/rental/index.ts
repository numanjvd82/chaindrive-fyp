import { completeRentalFromOwner } from "./completeRentalFromOwner";
import { completeRentalFromRenter } from "./completeRentalFromRenter";
import { createRental } from "./create";
import { getbyId } from "./getbyId";

export const rentalModel = {
  getbyId,
  add: createRental,
  completeFromOwner: completeRentalFromOwner,
  completeFromRenter: completeRentalFromRenter,
};
