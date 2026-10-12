import { Router } from "express";
import { ServiceRepository } from "../repositories/service.repository.js";
import { ServiceController } from "../controllers/service.controller.js";

const router = Router(); //Rota dos serviços

const serviceRepository = new ServiceRepository();
const serviceController = new ServiceController(serviceRepository);

router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getById);
router.post("/", serviceController.create);
router.put("/:id", serviceController.update);
router.delete("/:id", serviceController.remove);

export default router;