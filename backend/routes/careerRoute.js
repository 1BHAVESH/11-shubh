import express from "express";
import { createCareer, getJobs, updateCareer } from "../controller/CarrerControlller.js";

const router = express.Router();

router.get("/", getJobs)
router.post("/create-job", createCareer);
router.put("/:id", updateCareer)

export default router;
