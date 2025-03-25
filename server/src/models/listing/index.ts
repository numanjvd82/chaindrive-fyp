import { addListing } from "./add";
import { deleteListing } from "./delete";
import { list } from "./list";

export const listingModel = {
  add: addListing,
  list: list,
  delete: deleteListing,
  // edit: editListing,
};
