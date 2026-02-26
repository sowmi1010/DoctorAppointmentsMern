import { Router } from "express";
import { book, cancel, reschedule, myAppointments, doctorAppointments } from "../controllers/appointment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// patient book
router.post("/", authMiddleware, roleMiddleware(ROLES.PATIENT), book);

// patient/admin actions
router.put("/:id/cancel", authMiddleware, cancel);
router.put("/:id/reschedule", authMiddleware, reschedule);

// my appointments (patient/admin)
router.get("/my", authMiddleware, myAppointments);

// doctor appointments
router.get("/doctor/me", authMiddleware, roleMiddleware(ROLES.DOCTOR), doctorAppointments);

export default router;