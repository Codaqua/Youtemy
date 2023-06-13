import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Badge } from "antd";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import LessonContent from "../../components/cards/LessonContent";
import { Context } from "../../context";
import { toast } from "react-toastify";

const SingleCourse = ({ course }) => {
  // state
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});
  
  const router = useRouter();
  const { slug } = router.query;

 // context
 const {
  state: { user },
} = useContext(Context); 


useEffect(() => {
  if (course.lessons && course.lessons.length > 0) {
    setActiveLesson(course.lessons[0]);
  }
}, [course]);

useEffect(() => {
  if (user && course) checkEnrollment();
}, [user, course]);

const checkEnrollment = async () => {
  const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
  console.log("CHECK ENROLLMENT", data);
  setEnrolled(data);
};




const handleEnrollment = async (e) => {
  // console.log("handle enrollment");
  e.preventDefault();
  try {
    // check if user is logged in
    if (!user) router.push("/login");
    // check if already enrolled
    if (enrolled.status)
      return router.push(`/user/course/${enrolled.course.slug}`);
    setLoading(true);
    const { data } = await axios.post(`/api/enrollment/${course._id}`);
    toast(data.message);
    setLoading(false);
    router.push(`/user/course/${data.course.slug}`);
  } catch (err) {
    toast("Enrollment failed. Try again.");
    console.log(err);
    setLoading(false);
  }
};

  return (
    <div>
      <SingleCourseJumbotron 
        course={course} 
        handleEnrollment={handleEnrollment}
        user={user}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />

      <div className="container-fluid">
        <div className="row">
          {/* <div className="col-md-8 order-2 order-md-1"> */}
          <div className="col-md-9 content-container">
            {activeLesson && (
              <LessonContent lesson={activeLesson} />
            )}
          </div>
          {/* <div className="col-md-4 order-1 order-md-2"> */}
          <div className="col-md-3 lessons-container">
            {course.lessons && (
              <SingleCourseLessons
                lessons={course.lessons}
                activeLesson={activeLesson}
                setActiveLesson={setActiveLesson}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
