import { Router } from "express";
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { AppointmentController } from "../controllers/appointment.controller.js";
import { ServiceRepository } from "../repositories/service.repository.js";

const router = Router(); //Rota dos agendamentos

const appointmentRepository = new AppointmentRepository();
const serviceRepository = new ServiceRepository();
const appointmentController = new AppointmentController(appointmentRepository, serviceRepository);

router.get("/", appointmentController.getAll);
router.get("/:id", appointmentController.getById);
router.post("/", appointmentController.create);
router.patch("/:id/status", appointmentController.updateStatus);
router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.remove);

export default router;