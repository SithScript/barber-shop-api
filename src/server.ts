import express from "express";
import { categoryRoutes } from "./routes/category.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { appointmentRoutes } from "./routes/appointment.routes.js";

const app = express();
const PORT = 3001;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());
app.use(appointmentRoutes);

// Rota de Health Check
app.get("/health", (req, res) => {
    return res.json({ status: "OK", message: "API da Barbearia rodando!" });
});

// Registrar rotas de categorias
app.use(categoryRoutes);
app.use(productRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});