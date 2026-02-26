import { Router } from "express";
import { create, list, remove } from "../controllers/slot.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// public list slots (patient can view)
router.get("/", list);

// doctor create/delete slots
router.post("/", authMiddleware, roleMiddleware(ROLES.DOCTOR), create);
router.delete("/:id", authMiddleware, roleMiddleware(ROLES.DOCTOR), remove);

export default router;