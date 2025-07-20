import { Router } from "express";
import { createViolation } from "../../controllers/violation/createViolation";
import { getViolationsByRentalId } from "../../controllers/violation/getViolationsByRentalId";
import upload from "../../middlewares/multer";

const violationRouter = Router();

// GET /api/violations/rental/:rentalId - Get violations by rental ID
violationRouter.get("/:rentalId", getViolationsByRentalId);

// POST /api/violations - Create new violation (with photo upload support)
violationRouter.post("/", upload.array("photos", 4), createViolation);

export default violationRouter;
