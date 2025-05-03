import { Router } from "express";
import { getDashboardBasicInfo } from "../../controllers/dashboard/getDashboardBasicInfo";

const dashboardRouter = Router();

dashboardRouter.get("/basic-info", getDashboardBasicInfo);

export default dashboardRouter;
