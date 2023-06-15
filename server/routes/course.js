import express from "express";

const router = express.Router();


// middleware
import { requireSignin, isTutor, isEnrolled } from "../middlewares";

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
    courses,
    checkEnrollment,
    enrollment,
    userCourses,
    markCompleted,
    markIncomplete,
    listCompleted,
    getCourses,
    updateCourses,
    
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


router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// enrollment
router.post("/enrollment/:courseId", requireSignin, enrollment);

router.get("/user-courses", requireSignin, userCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, read);

// mark completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);
router.post("/list-completed", requireSignin, listCompleted);

// router.post("/list-completed", requireSignin, listCompleted);

// router.get("/:videoId", getVideo);

// filter
router.post("/courses", getCourses);

router.put("/user/update-courses", requireSignin, updateCourses);

module.exports = router;
