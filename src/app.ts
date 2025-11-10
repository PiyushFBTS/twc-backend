import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import posRoutes from "./routes/pos.route";
import authRoutes from "./routes/auth.routes";
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// login
app.use("/api/auth", authRoutes);

// ✅ Routes
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pos", posRoutes);


export default app;
