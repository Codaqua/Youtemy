import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Badge } from "antd";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
// import LessonContent from "../../components/cards/LessonContent";

const SingleCourse = ({ course }) => {
  // state
const router = useRouter();
const { slug } = router.query;

  return (
    <div className="bluex">
      <SingleCourseJumbotron
        course={course}
      />

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
        />
      )}
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
