import { Router } from "express";
import {
	loadSettlements,
	loadDistricts,
	loadSubDistricts,
	loadSettlementsNamesAndSubDistricts,
	loadCoordinates,
} from "../controllers/settlementsController.js";

const router = Router();
router.get("/loadSettlements", loadSettlements);
router.get("/loadDistricts", loadDistricts);
router.get("/loadSubDistricts", loadSubDistricts);
router.get(
	"/loadSettlementsNamesAndSubDistricts",
	loadSettlementsNamesAndSubDistricts
);
router.get("/loadCoordinates", loadCoordinates);

export default router;
