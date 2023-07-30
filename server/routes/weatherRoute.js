import { Router } from "express";
import {
	loadWeather,
	loadStationsCoordinates,
} from "../controllers/weatherController.js";

const router = Router();

router.get("/loadWeather/:station_id/:date", loadWeather);
router.get("/loadStationsCoordinates", loadStationsCoordinates);

export default router;
