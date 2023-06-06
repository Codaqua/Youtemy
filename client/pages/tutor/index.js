import { useState, useEffect } from "react";
import axios from "axios";
import TutorRoute from "../../components/routes/TutorRoute";
import { Avatar } from "antd";
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

  // TODO: PENDIENTE CORREGIR STYLES INLINE IN THIS FILE
  // const myStyle = { marginTop: "-15px", fontSize: "10px" };
  const myStyle = { fontSize: "10px" };

  return (
    <TutorRoute>
      <h1 className="jumbotron text-center square">Tutor Dashboard</h1>
      {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}

      {courses &&
        courses.map((course) => (
          <div>
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
                      <p style={{ color: "red" }}> 
                        {/* TODO: STYLES INLINE */}
                      {/* <p style={{ marginTop: "-10px" }}> */}
                        {course.lessons.length} Lessons
                      </p>

                      {course.lessons.length < 5 ? (
                        <p style={myStyle} className="text-warning">
                          At least 5 lessons are required to publish a course
                        </p>
                      ) : course.published ? (
                        <p style={myStyle} className="text-success">
                          Your course is live in Yotemy
                        </p>
                      ) : (
                        <p style={myStyle} className="text-success">
                          Your course is ready to be published
                        </p>
                      )}
                    </div>

                    <div className="col-md-3 mt-3 text-center">
                      {course.published ? (
                        <div>
                          <CheckCircleOutlined className="h5 pointer text-success" />
                        </div>
                      ) : (
                        <div>
                          <CloseCircleOutlined className="h5 pointer text-warning" />
                        </div>
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
