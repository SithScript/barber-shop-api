import { Router } from "express";
import { CategoryRepository } from "../repositories/category.repository.js";
import { CategoryController } from "../controllers/category.controller.js";

const router = Router(); //Rota das categorias

const categoryRepository = new CategoryRepository();
const categoryController = new CategoryController(categoryRepository);

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.remove);

export default router;