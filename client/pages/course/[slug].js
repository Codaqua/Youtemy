import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Badge } from "antd";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import LessonContent from "../../components/cards/LessonContent";

const SingleCourse = ({ course }) => {
  // state
const router = useRouter();
const { slug } = router.query;
const [activeLesson, setActiveLesson] = useState(null);

useEffect(() => {
  if (course.lessons && course.lessons.length > 0) {
    setActiveLesson(course.lessons[0]);
  }
}, [course]);

  return (
    <div>
      <SingleCourseJumbotron course={course} />

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
