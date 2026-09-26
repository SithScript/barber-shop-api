import { Router } from "express";
import appointmentController from "../controllers/appointment.controller.js";

const router = Router(); //Rota dos agendamentos

router.get("/", appointmentController.getAll);
router.get("/:id", appointmentController.getById);
router.post("/", appointmentController.create);
router.patch("/:id/status", appointmentController.updateStatus);
router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.remove);

export default router;