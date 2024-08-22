import { Router } from "express";
import imageDataRoutes from "./imageDataRoutes.js";
import userRoutes from "./user-routes.js";
import { userVerification } from "../middlewares/auth-middleware.js";
import groupRoutes from "./group-routes.js";
import billRoutes from "./bill-routes.js";

const appRouter = Router();

appRouter.use("/imageData",userVerification , imageDataRoutes);
appRouter.use("/user", userRoutes);
appRouter.use("/groups", userVerification , groupRoutes);
appRouter.use("/bills", userVerification, billRoutes);

export default appRouter;