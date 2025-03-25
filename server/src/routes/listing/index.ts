import { Router } from "express";
import { addListing } from "../../controllers/listing/add";
import { delteListing } from "../../controllers/listing/delete";
import { getListings } from "../../controllers/listing/list";
import upload from "../../middlewares/multer";

const listingRouter = Router();

listingRouter.get("/", getListings);
listingRouter.post("/", upload.array("images", 4), addListing);
listingRouter.delete("/:id", delteListing);

export default listingRouter;
