import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const productRoutes = Router();
const productController = new ProductController();

productRoutes.get("/products", (req, res) => productController.list(req, res));
productRoutes.post("/products", (req, res) => productController.create(req, res));

export { productRoutes };