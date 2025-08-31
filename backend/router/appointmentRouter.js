import express from "express";
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from "../controllers/appointmentController.js";
import {isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getappointments", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/update/:id", isAdminAuthenticated, deleteAppointment);


export default router;
