import { Router } from "express";
import {
	loadBranches,
	deleteBranches,
	saveBranches,
} from "../controllers/branchesController.js";

const router = Router();
router.get("/loadBranches", loadBranches);
router.delete("/deleteBranches", deleteBranches);
router.post("/saveBranches", saveBranches);

export default router;
