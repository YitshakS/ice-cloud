import { Router } from "express";
import {
	deleteOneTransaction,
	deleteTransactions,
	loadTransactions,
	saveOneTransaction,
	saveTransactions,
} from "../controllers/transactionsController.js";

const router = Router();
router.delete("/deleteOneTransaction/:transaction_id", deleteOneTransaction);
router.delete("/deleteTransactions", deleteTransactions);
router.get("/loadTransactions", loadTransactions);
router.post("/saveOneTransaction", saveOneTransaction);
router.post("/saveTransactions", saveTransactions);

export default router;
