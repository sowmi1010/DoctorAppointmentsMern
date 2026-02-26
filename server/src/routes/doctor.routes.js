import { Router } from "express";
import { list, getOne, createProfile, getMyDoctorProfile, updateMyDoctorProfile } from "../controllers/doctor.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// public
router.get("/", list);
router.get("/:id", getOne);

// doctor only
router.post("/me/profile", authMiddleware, roleMiddleware(ROLES.DOCTOR), createProfile);
router.get("/me/profile", authMiddleware, roleMiddleware(ROLES.DOCTOR), getMyDoctorProfile);
router.put("/me/profile", authMiddleware, roleMiddleware(ROLES.DOCTOR), updateMyDoctorProfile);

export default router;