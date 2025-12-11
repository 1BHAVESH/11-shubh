import express from "express";
import { mailSend } from "../controller/mailSend.js";

const router = express.Router();

router.post("/send-email", mailSend);

export default router;
