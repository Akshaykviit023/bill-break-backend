import { Router } from "express";
import { getImageData } from "../controllers/image-controller.js";

import multer from "multer";

const upload = multer({ dest: "uploads/" }); 


const imageDataRoutes = Router();

imageDataRoutes.post("/", upload.single("image"), getImageData);

export default imageDataRoutes;