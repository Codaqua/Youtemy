import express from "express";

const router = express.Router();

// middleware
import { requireSignin, isTutor } from "../middlewares";

// controllers
import { uploadImage, removeImage, create, read, addLesson, update } from "../controllers/course";

// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isTutor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", read);

router.post("/course/lesson/:slug/:tutorId", requireSignin, addLesson);

module.exports = router;
