import { Router } from "express";
import { userVerification } from "../middlewares/auth-middleware.js";
import { addExpense, fetchBills, fetchMembers, fetchPaidBy } from "../controllers/bill-controllers.js";

const billRoutes = Router();

billRoutes.post("/fetch-members", userVerification, fetchMembers);
billRoutes.post("/addExpense", userVerification, addExpense);
billRoutes.post("/fetchBills", userVerification, fetchBills);
billRoutes.post("/fetchPaidBy", userVerification, fetchPaidBy);

export default billRoutes;