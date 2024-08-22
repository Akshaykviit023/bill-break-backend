import { Router } from "express";
import { userVerification } from "../middlewares/auth-middleware.js";
import { createGroup, deleteGroup, fetchGroup, joinGroup, showGroups } from "../controllers/group-controllers.js";

const groupRoutes = Router();

groupRoutes.post("/create-group", userVerification, createGroup);
groupRoutes.get("/show-groups", userVerification, showGroups);
groupRoutes.post("/delete-group", userVerification, deleteGroup);
groupRoutes.post("/join-group", userVerification, joinGroup);
groupRoutes.post("/fetch-group", userVerification, fetchGroup);

export default groupRoutes;