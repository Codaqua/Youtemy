import express from "express";

const router = express.Router();

// middleware
import { requireSignin, isTutor } from "../middlewares";

// controllers
import { uploadImage, removeImage, create } from "../controllers/course";

// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isTutor, create);

module.exports = router;
