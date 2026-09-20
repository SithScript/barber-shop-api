import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const productRoutes = Router();
const productController = new ProductController();
//Rota dos produtos
productRoutes.get("/products", (req, res) => productController.list(req, res));
productRoutes.get("/products/:id", (req, res) => productController.getById(req, res));
productRoutes.post("/products", (req, res) => productController.create(req, res));
productRoutes.put("/products/:id", (req, res) => productController.update(req, res));
productRoutes.delete("/products/:id", (req, res) => productController.delete(req, res));

export { productRoutes };