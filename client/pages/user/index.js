import { useContext, useEffect, useState  } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar, Badge } from "antd";
import Link from "next/link";
import { SyncOutlined } from "@ant-design/icons";
import course from "../../../server/models/course";
import CourseCard from "../../components/cards/CourseCard";

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
        <div className="container-fluid my-container-centered">
            <div className="block-content">
                {courses && courses.map((course) => (
                    <CourseCard key={course._id} course={course} isLoggedIn={true} />
                ))}
            </div>
        </div>
    </UserRoute>
  );
};

export default UserIndex;