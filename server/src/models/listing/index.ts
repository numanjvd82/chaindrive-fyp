import { addListing } from "./add";
import { availableRentals } from "./availableRentals";
import { deleteListing } from "./delete";
import { editListing } from "./edit";
import { getById } from "./getById";
import { list } from "./list";

export const listingModel = {
  add: addListing,
  list: list,
  getById,
  delete: deleteListing,
  edit: editListing,
  availableRentals: availableRentals,
};
