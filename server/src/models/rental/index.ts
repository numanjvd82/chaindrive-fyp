import { completeRentalFromOwner } from "./completeRentalFromOwner";
import { completeRentalFromRenter } from "./completeRentalFromRenter";
import { confirmRental } from "./confirmRental";
import { createRental } from "./create";
import { getbyId } from "./getbyId";

export const rentalModel = {
  getbyId,
  add: createRental,
  confirm: confirmRental,
  completeFromOwner: completeRentalFromOwner,
  completeFromRenter: completeRentalFromRenter,
};
