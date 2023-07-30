import { Router } from "express";
import {
	loadFlavors,
	deleteFlavors,
	saveFlavors,
} from "../controllers/flavorsController.js";

const router = Router();
router.get("/loadFlavors", loadFlavors);
router.delete("/deleteFlavors", deleteFlavors);
router.post("/saveFlavors", saveFlavors);

export default router;
