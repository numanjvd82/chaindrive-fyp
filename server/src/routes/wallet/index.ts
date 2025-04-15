import { Router } from "express";
import { listWallet } from "../../controllers/wallet/listWallet";
import { storeWallet } from "../../controllers/wallet/storeWallet";

const walletRouter = Router();

walletRouter.get("/", listWallet);
walletRouter.post("/add", storeWallet);

export default walletRouter;
