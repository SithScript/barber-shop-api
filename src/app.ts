import express from "express";
import categoryRoutes from "./routes/category.routes.js";
import serviceRoutes from "./routes/service.routes.js"
import appointmentRoutes from "./routes/appointment.routes.js";

const app = express();

app.use(express.json());

app.use("/categories", categoryRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);

export default app;