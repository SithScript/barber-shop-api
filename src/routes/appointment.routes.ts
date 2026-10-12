import { Router } from "express";
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { AppointmentController } from "../controllers/appointment.controller.js";

const router = Router(); //Rota dos agendamentos

const appointmentRepository = new AppointmentRepository();
const appointmentController = new AppointmentController(appointmentRepository);

router.get("/", appointmentController.getAll);
router.get("/:id", appointmentController.getById);
router.post("/", appointmentController.create);
router.patch("/:id/status", appointmentController.updateStatus);
router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.remove);

export default router;