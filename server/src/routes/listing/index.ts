import { Router } from "express";
import { addListing } from "../../controllers/listing/add";
import { getListings } from "../../controllers/listing/list";
import upload from "../../middlewares/multer";

const listingRouter = Router();

listingRouter.get("/", getListings);
listingRouter.post("/", upload.array("images", 4), addListing);

export default listingRouter;
