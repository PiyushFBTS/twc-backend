"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const pos_route_1 = __importDefault(require("./routes/pos.route"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const userRole_routes_1 = __importDefault(require("./routes/userRole.routes"));
const app = (0, express_1.default)();
// ✅ Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// login
app.use("/api/auth", auth_routes_1.default);
// ✅ Routes
app.use("/api/orders", order_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/pos", pos_route_1.default);
//user
app.use("/api/user", user_routes_1.default);
// user role
app.use("/api/userRole", userRole_routes_1.default);
exports.default = app;
