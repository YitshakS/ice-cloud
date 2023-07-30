import { Router } from "express";
import { loadDate } from "../controllers/dateController.js";

const router = Router();

router.get("/loadDate/:date", loadDate);

export default router;
