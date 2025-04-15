import { Router } from "express";
import { completeFromOwner } from "../../controllers/rental/completeFromOwner";
import { completeFromRenter } from "../../controllers/rental/completeFromRenter";
import { createRental } from "../../controllers/rental/createRental";
import { getRentalById } from "../../controllers/rental/getRental";

const rentalRouter = Router();

rentalRouter.get("/:id", getRentalById);
rentalRouter.post("/", createRental);
rentalRouter.post("/complete/renter", completeFromRenter);
rentalRouter.post("/complete/owner", completeFromOwner);

export default rentalRouter;
