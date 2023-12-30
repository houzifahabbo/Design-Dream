import express from "express";
import userRoutes from "./user.js";
import designerRoutes from "./designer.js";
import paymentRoutes from "./payment.js";
// import adminRoutes from "./admin.js";
import orderRoutes from "./order.js";
import ratingRoutes from "./rating.js";

const routes = express.Router();

routes.use("/user", userRoutes);
routes.use("/designer", designerRoutes);
routes.use("/payment", paymentRoutes);
// routes.use("/admin", adminRoutes);
routes.use("/order", orderRoutes);
routes.use("/rating", ratingRoutes);

export default routes;
