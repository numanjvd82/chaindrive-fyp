import { addListing } from "./add";
import { deleteListing } from "./delete";
import { editListing } from "./edit";
import { list } from "./list";

export const listingModel = {
  add: addListing,
  list: list,
  delete: deleteListing,
  edit: editListing,
};
