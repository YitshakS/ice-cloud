import { Router } from "express";
import { create } from "../controllers/transactionsSqlController.js";
import { findAll } from "../controllers/transactionsSqlController.js";
import { findOne } from "../controllers/transactionsSqlController.js";
import { update } from "../controllers/transactionsSqlController.js";
import { deleteOne } from "../controllers/transactionsSqlController.js";
import { deleteAll } from "../controllers/transactionsSqlController.js";

const router = Router();

// Create a new transaction
router.post("/transactions", create);

// Retrieve all transactions
router.get("/transactions", findAll);

// Retrieve a single transaction with transactionId
router.get("/transactions/:transactionId", findOne);

// Update a transaction with transactionId
router.put("/transactions/:transactionId", update);

// Delete a transaction with transactionId
router.delete("/transactions/:transactionId", deleteOne);

// Delete all transactions
router.delete("/transactions", deleteAll);

export default router;
