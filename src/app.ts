import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../frontend")));

// Rota raiz redireciona para a documentação do Swagger
// app.get("/", (req, res) => {
//     res.redirect("/api-docs");
// });

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
app.use("/categories", categoryRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);

export default app;
