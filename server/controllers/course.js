import AWS from "aws-sdk";
import  nanoid from "nanoid";
import Course from "../models/course";
import Completed from "../models/completed";
import slugify from "slugify";
import User from "../models/user";


const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION1,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig); 

export const uploadImage = async (req, res) => {
  // console.log(req.body);
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "youtemy-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload to s3
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};


export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    // image params
    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    // send remove request to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  // console.log("CREATE COURSE", req.body);
  // return;
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send("Title is taken");

    const course = await new Course({
      slug: slugify(req.body.name),
      tutor: req.auth._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course create failed. Try again.");
  }
};

export const read = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("tutor", "_id name")
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const addLesson = async (req, res) => {
  try {
    const { slug, tutorId } = req.params;
    const { title, content, videos } = req.body;

    if (req.auth._id != tutorId) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: { lessons: { title, content, videos, slug: slugify(title) } },
      },
      { new: true }
    )
      .populate("tutor", "_id name")
      .exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};


export const update = async (req, res) => {
  try {
    const { slug } = req.params;
    // console.log(slug);
    const course = await Course.findOne({ slug }).exec();
    // console.log("COURSE FOUND => ", course);
    // TODO : NO PUSE course.tutor._id
    if (req.auth._id != course.tutor) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

 
export const removeLesson = async (req, res) => {
  const { slug, lessonId } = req.params;
  const course = await Course.findOne({ slug }).exec();
  if (req.auth._id != course.tutor) {
    return res.status(400).send("Unauthorized");
  }

  const deletedCourse = await Course.findByIdAndUpdate(course._id, {
    $pull: { lessons: { _id: lessonId } },
  }).exec();

  res.json({ ok: true });
};



export const removeVideo = async (req, res) => {
  try {
    const { slug, lessonId, videoUrl } = req.params;
 
    const course = await Course.findOne({ slug }).exec();

    if (req.auth._id != course.tutor._id || req.auth._id != course.tutor ) {
      return res.status(400).send("Unauthorized");
    }
  
    const updatedCourse = await Course.findOneAndUpdate(
      { 'lessons._id': lessonId, 'lessons.videos': videoUrl },
      { $pull: { 'lessons.$.videos': videoUrl } },
      { new: true }
    ).exec();
  
    console.log('updatedCourse:', updatedCourse);
  
    res.json(updatedCourse);
  } catch (err) {
    console.log("removeLesson", err);
    return res.status(400).send(err.message);
  }
};

export const updateLesson = async (req, res) => {
  try {
    // console.log("UPDATE LESSON", req.body);
    const { slug, courseId, lessonId, tutorId  } = req.params;
    const { _id, title, content, videos } = req.body;
    // find post
    // const courseFound = await Course.findById(courseId)
    const course = await Course.findOne({ slug })
    .select("tutor")
    .exec();
    // is owner?
   
    if (course.tutor._id != req.auth._id) {
      return res.status(400).send("Unauthorized");
    }
   
    const updated = await Course.updateOne(
      // { "lessons._id": lessonId },
      { "lessons._id": _id },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          'lessons.$.videos': videos,
        },
      },
      { new: true }
    ).exec();
    console.log("updated => ", updated);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Update lesson failed: ${err.message}`);
  }
};


export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("tutor").exec();

    if (course.tutor._id != req.auth._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Publish course failed");
  }
};

export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("tutor").exec();

    if (course.tutor._id != req.auth._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unpublish course failed");
  }
};


export const courses = async (req, res) => {
  const all = await Course.find({ published: true })
    .populate("tutor", "_id name")
    .exec();
  res.json(all);
};

export const checkEnrollment = async (req, res) => {
  const { courseId } = req.params;
  // find courses of the currently logged in user
  const user = await User.findById(req.auth._id).exec();
  // check if course id is found in user courses array
  let ids = [];
  let length = user.courses && user.courses.length;
  for (let i = 0; i < length; i++) {
    ids.push(user.courses[i].toString());
  }
  res.json({
    status: ids.includes(courseId),
    course: await Course.findById(courseId).exec(),
  });
};


export const enrollment = async (req, res) => {
  try {
    // check if course is already enrolled
    const course = await Course.findById(req.params.courseId).exec();
    // TODO: NO PUSE course.PAID
    // if (course.paid) return;
    console.log("the course", course);

    const result = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec();
    console.log(result);
    res.json({
      message: "Congratulations! You have successfully enrolled in this course.",
      course,
    });
  } catch (err) {
    console.log("Enrollment err", err);
    return res.status(400).send("Enrollment create failed");
  }
};


export const userCourses = async (req, res) => {
  const user = await User.findById(req.auth._id).exec();
  const courses = await Course.find({ _id: { $in: user.courses } })
    .populate("tutor", "_id name")
    .exec();
  res.json(courses);
};

export const markCompleted = async (req, res) => {
  const { courseId, lessonId } = req.body;
  // console.log(courseId, lessonId);
  // find if user with that course is already created
  const existing = await Completed.findOne({
    user: req.auth._id,
    course: courseId,
  }).exec();

  if (existing) {
    // update
    const updated = await Completed.findOneAndUpdate(
      {
        user: req.auth._id,
        course: courseId,
      },
      {
        $addToSet: { lessons: lessonId },
      }
    ).exec();
    res.json({ ok: true });
  } else {
    // create
    const created = await new Completed({
      user: req.auth._id,
      course: courseId,
      lessons: lessonId,
    }).save();
    res.json({ ok: true });
  }
};


// export const listCompleted = async (req, res) => {
//   const { courseId } = req.body;
  
//   // Fetch all completed lessons for a course
//   const completedLessons = await Completed.findOne({
//     user: req.auth._id,
//     course: courseId,
//   }).select('lessons').exec();

//   res.json(completedLessons ? completedLessons.lessons : []);
// };

export const listCompleted = async (req, res) => {
  try {
    const list = await Completed.findOne({
      user: req.auth._id,
      course: req.body.courseId,
    }).exec();
    list && res.json(list.lessons);
  } catch (err) {
    console.log(err);
  }
};



export const markIncomplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    const updated = await Completed.findOneAndUpdate(
      {
        user: req.auth._id,
        course: courseId,
      },
      {
        $pull: { lessons: lessonId },
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};


const { google } = require("googleapis");

exports.getVideo = async (req, res) => {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.REACT_APP_YOUTUBE_API_KEY,
    });

    const response = await youtube.videos.list({
      id: req.params.videoId,
      part: "player",
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching video details" });
  }
};



export const filterCourses = async (req, res) => {
  try {
      const { university, degree, year, subject } = req.query;
      let filter = {};

      if (university) {
          filter.university = university;
      }

      if (degree) {
          filter.degree = degree;
      }

      if (year) {
          filter.year = year;
      }

      if (subject) {
          filter.subject = subject;
      }

      const courses = await Course.find(filter).exec();

      res.json(courses);
  } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
  }
};

export const getCourses = async (req, res) => {
  console.log('Query to find courses 0:'); 
  try {
    // const filters = req.body;
    // const courses = await Course.find(filters);
    const filters = req.body;
    let query = {};

    for (let key in filters) {
      if (!filters[key].startsWith('All')) {
        query[key] = filters[key];
      }
    }
    console.log('Query to find courses:'); 
    console.log('Query to find courses:', query); 

    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) {
    console.error('Error in getCourses:', err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};


export const updateCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;

    // Update the courses array for the user
    await User.findByIdAndUpdate(
      req.auth._id,
      { courses: courseIds },
      { new: true }
    ).exec();

    res.json({ message: "Courses updated successfully." });
  } catch (err) {
    console.log("Update courses error", err);
    return res.status(400).send("Failed to update courses.");
  }
};


