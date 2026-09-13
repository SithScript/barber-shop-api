import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get("/categories", (req, res) => categoryController.list(req, res));
categoryRoutes.post("/categories", (req, res) => categoryController.create(req, res));

export { categoryRoutes };