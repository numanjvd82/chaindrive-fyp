import { cancelRental } from "./cancelRental";
import { completeRentalFromOwner } from "./completeRentalFromOwner";
import { completeRentalFromRenter } from "./completeRentalFromRenter";
import { confirmRental } from "./confirmRental";
import { createRental } from "./create";
import { getbyId } from "./getbyId";
import { listRentals } from "./list";

export const rentalModel = {
  getbyId,
  add: createRental,
  confirm: confirmRental,
  list: listRentals,
  completeFromOwner: completeRentalFromOwner,
  completeFromRenter: completeRentalFromRenter,
  cancel: cancelRental,
};
