import { useState, useEffect } from "react";
import axios from "axios";
import TutorRoute from "../../components/routes/TutorRoute";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const TutorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get("/api/tutor-courses");
    setCourses(data);
  };

// ************* Carátula de los cursos del tutor *************

  // TODO: PENDIENTE CORREGIR STYLES INLINE IN THIS FILE
  // const myStyle = { marginTop: "-15px", fontSize: "10px" };
  const myStyle = { fontSize: "10px" };

  return (
    
    <TutorRoute>
      <h1 className="jumbotron text-center square">Tutor Dashboard</h1>
      {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}
 <h2>Courses you have created:</h2>
      {courses &&
        courses.map((course) => (
          <div  key={course._id}>
            <Link className="vertical-align" href={`/tutor/course/view/${course.slug}`} key={course._id} passHref>
              <div className="media pt-2 course-list" role="link" tabIndex={0}>
                <Avatar
                  className="square-avatar"
                  size={80}
                  src={course.image ? course.image.Location : "/course.png"}
                />
                <div className="media-body pl-2">
                  <div className="row">
                    <div className="col">
                      <h5 className="pt-2">{course.name}</h5>
                      <p className="blue"> 
                        {course.lessons.length} Lessons
                      </p>

                      {course.lessons.length < 5 ? (
                        <p className="red">
                          At least 2 lessons are required to publish a course
                        </p>
                      ) : course.published ? (
                        <p  className="text-success">
                          Your course is live in Yotemy
                        </p>
                      ) : (
                        <p className="text-success">
                          Your course is ready to be published
                        </p>
                      )}
                    </div>

                    <div className="col-md-3 mt-3 text-center">
                      {course.published ? (
                        <Tooltip title="Published">
                          <CheckCircleOutlined className="h5 pointer text-success" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Unpublished">
                          <CloseCircleOutlined className="h5 pointer text-warning" />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div> 
        ))}
    </TutorRoute>
  );
};

export default TutorIndex;
