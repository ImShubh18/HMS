import express from "express";
import {
  addNewAdmin,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controllers/userController.js";

import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";
const router = express.Router();
router.post("/patient/register", patientRegister);
router.post("/login", login);
// router.post("/admin/addnewadmin", isAdminAuthenticated,addNewAdmin);
router.post("/admin/addnewadmin", addNewAdmin);
// this was the step done to add new admin
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
export default router;
