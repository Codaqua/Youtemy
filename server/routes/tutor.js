import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { makeTutor } from "../controllers/tutor";

router.post("/make-tutor", requireSignin, makeTutor);

module.exports = router;
