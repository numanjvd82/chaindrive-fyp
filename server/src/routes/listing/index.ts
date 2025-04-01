import { Router } from "express";
import { addListing } from "../../controllers/listing/add";
import { delteListing } from "../../controllers/listing/delete";
import { editListing } from "../../controllers/listing/edit";
import { getListings } from "../../controllers/listing/list";
import upload from "../../middlewares/multer";

const listingRouter = Router();

listingRouter.get("/", getListings);
listingRouter.post("/", upload.array("images", 4), addListing);
listingRouter.delete("/:id", delteListing);
listingRouter.patch("/:id", upload.array("images", 4), editListing);

export default listingRouter;
