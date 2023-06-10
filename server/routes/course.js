import express from "express";

const router = express.Router();

// middleware
import { requireSignin, isTutor } from "../middlewares";

// controllers
import { 
    uploadImage, 
    removeImage, 
    create, 
    update, 
    read, 
    addLesson, 
    removeLesson, 
    removeVideo, 
    updateLesson, 
    publishCourse,
    unpublishCourse,
    courses
} from "../controllers/course";


router.get("/courses", courses);

// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isTutor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", read);

router.post("/course/lesson/:slug/:tutorId", requireSignin, addLesson);
// lessons
// add lessons
router.post("/course/lesson/:courseId", requireSignin, addLesson);


// publish unpublish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);


// delete
router.put("/course/:slug/:lessonId", requireSignin, removeLesson);
// router.post("/course/:courseId/:lessonId", requireSignin, removeLesson);

// update
router.put("/course/lesson/:slug/:lessonId", requireSignin, updateLesson);
// router.put("/course/lesson/:courseId/:lessonId", requireSignin, updateLesson);
// router.put("/course/:slug/:lessonId", requireSignin, updateLesson);

// remove video
router.put("/course/:slug/:lessonId/:videoUrl", requireSignin, removeVideo);








module.exports = router;
