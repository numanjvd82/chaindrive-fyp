import { Router } from "express";
import { addListing } from "../../controllers/listing/add";
import upload from "../../middlewares/multer";

const listingRouter = Router();

listingRouter.post("/", upload.array("images", 4), addListing);

export default listingRouter;
