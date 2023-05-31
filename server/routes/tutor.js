import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { makeTutor, getAccountStatus  } from "../controllers/tutor";

router.post("/make-tutor", requireSignin, makeTutor);
router.post("/get-account-status", requireSignin, getAccountStatus);

module.exports = router;
