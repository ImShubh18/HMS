import express from "express";
import { addNewAdmin, login, patientRegister } from "../controllers/userController.js";

const router = express.Router();    
router.post("/patient/register",patientRegister);
router.post("/login",login);
router.post("/admin/addnewadmin",addNewAdmin);
export default router;