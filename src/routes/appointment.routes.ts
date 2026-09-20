import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller.js";

const appointmentRoutes = Router();
const appointmentController = new AppointmentController();

appointmentRoutes.get("/appointments", (req, res) => appointmentController.list(req, res));
appointmentRoutes.post("/appointments", (req, res) => appointmentController.create(req, res));

export { appointmentRoutes };