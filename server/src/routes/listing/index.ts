import { Router } from "express";
import { addListing } from "../../controllers/listing/add";
import { availableRentals } from "../../controllers/listing/availableRentals";
import { delteListing } from "../../controllers/listing/delete";
import { editListing } from "../../controllers/listing/edit";
import { getListingById } from "../../controllers/listing/getById";
import { getListings } from "../../controllers/listing/list";
import upload from "../../middlewares/multer";

const listingRouter = Router();

listingRouter.get("/", getListings);
listingRouter.get("/available", availableRentals);
listingRouter.get("/:id", getListingById);
listingRouter.post("/", upload.array("images", 4), addListing);
listingRouter.delete("/:id", delteListing);
listingRouter.patch("/:id", upload.array("images", 4), editListing);

export default listingRouter;
