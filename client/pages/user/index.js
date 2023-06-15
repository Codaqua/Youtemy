import { useContext, useEffect, useState  } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar, Badge } from "antd";
import Link from "next/link";
import { SyncOutlined } from "@ant-design/icons";
import course from "../../../server/models/course";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user-courses");
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log("error 1: ", err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
        {loading && (
            <SyncOutlined
                spin
                className="d-flex justify-content-center display-1 text-danger p-5"
            />
        )}
        <h1 className="jumbotron text-center square">My Learning</h1>

        {/* Show list of courses */}
        <div className="d-flex flex-wrap course-card-container">
            {courses &&
                courses.map((course) => (
                    <div key={course._id} className="course-card">
                        <Link href={`/user/course/${course.slug}`}>
                                <img
                                    className="course-image"
                                    src={
                                        course.image
                                            ? course.image.Location
                                            : "/course.png"
                                    }
                                    alt="course"
                                />

                                <div className="course-content">
                                    <h5 className="course-title">
                                        {course.name}
                                    </h5>
                                    <p style={{ marginBottom: "0px" }}>
                                      {course.lessons.length} lessonsu
                                    </p>
                                    <p className="course-author">
                                        Created by {course.tutor.name}
                                    </p>
                                    <div className="course-details">
                                        
                                    <Badge
                                        count={course.university}
                                        style={{ backgroundColor: "#03a9f4" }}
                                        className="pb-2 mr-2"
                                    />
                                    <Badge
                                        count={course.degree}
                                        style={{ backgroundColor: "#03a9f4" }}
                                        className="pb-2 mr-2"
                                    />
                                    <Badge
                                        count={course.year}
                                        style={{ backgroundColor: "#03a9f4" }}
                                        className="pb-2 mr-2"
                                    />
                                    <Badge
                                        count={course.subject}
                                        style={{ backgroundColor: "#03a9f4" }}
                                        className="pb-2 mr-2"
                                    />

                                    </div>
                                </div>
                        </Link>
                    </div>
                ))}
        </div>
    </UserRoute>
);
};

export default UserIndex;