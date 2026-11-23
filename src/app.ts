import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

const app = express();

app.use(express.json());

// Rota raiz redireciona para a documentação do Swagger
app.get("/", (req, res) => {
    res.redirect("/api-docs");
});

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
app.use("/categories", categoryRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);

export default app;
