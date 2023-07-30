import { Router } from "express";
import { loadML, deleteML, saveML } from "../controllers/mlController.js";

const router = Router();
router.get("/loadML/:transaction", loadML);
router.delete("/deleteML", deleteML);
router.post("/saveML", saveML);

export default router;
