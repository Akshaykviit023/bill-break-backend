import { Router } from "express";
import { userLogin, userSignup } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";

const userRoutes = Router();

userRoutes.post("/signup",validate(signupValidator) , userSignup);

userRoutes.post("/login",validate(loginValidator) , userLogin);

export default userRoutes;