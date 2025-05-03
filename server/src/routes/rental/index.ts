import { Router } from "express";
import { cancelRental } from "../../controllers/rental/cancelRental";
import { completeFromOwner } from "../../controllers/rental/completeFromOwner";
import { completeFromRenter } from "../../controllers/rental/completeFromRenter";
import { confirmRentalFromOwner } from "../../controllers/rental/confirmRentalFromOwner";
import { createRental } from "../../controllers/rental/createRental";
import { getRentalById } from "../../controllers/rental/getRental";
import { listRentals } from "../../controllers/rental/listRentals";

const rentalRouter = Router();

rentalRouter.get("/", listRentals);
rentalRouter.get("/:id", getRentalById);
rentalRouter.post("/confirm", confirmRentalFromOwner);
rentalRouter.post("/", createRental);
rentalRouter.patch("/complete/renter", completeFromRenter);
rentalRouter.patch("/complete/owner", completeFromOwner);
rentalRouter.patch("/cancel", cancelRental);

export default rentalRouter;
