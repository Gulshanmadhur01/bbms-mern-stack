import express from "express";
import { 
  searchByLocation, 
  getBloodAvailability,
  getFacilityDirectory,
  getCampSchedule,
  registerCampRequest
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/location", searchByLocation);
router.get("/availability", getBloodAvailability);
router.get("/directory", getFacilityDirectory);
router.get("/camps", getCampSchedule);
router.post("/register-camp", registerCampRequest);

export default router;
