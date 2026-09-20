import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";

const categoryRoutes = Router();
const categoryController = new CategoryController();
//Rota das categorias
categoryRoutes.get("/categories", (req, res) => categoryController.list(req, res));
categoryRoutes.get("/categories/:id", (req, res) => categoryController.getById(req, res));
categoryRoutes.post("/categories", (req, res) => categoryController.create(req, res));
categoryRoutes.put("/categories/:id", (req, res) => categoryController.update(req, res));
categoryRoutes.delete("/categories/:id", (req, res) => categoryController.delete(req, res));

export { categoryRoutes };