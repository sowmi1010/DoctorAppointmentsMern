import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";
import { createDoctor, stats, listUsers } from "../controllers/admin.controller.js";


const router = Router();

router.get("/stats", authMiddleware, roleMiddleware(ROLES.ADMIN), stats);
router.get("/users", authMiddleware, roleMiddleware(ROLES.ADMIN), listUsers);
router.post(
    "/doctors",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    createDoctor
);

export default router;
