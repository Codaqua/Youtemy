import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { List, Checkbox, Button, Modal } from "antd";
import LessonContent from "../../../components/cards/LessonContent";
import ReactMarkdown from "react-markdown";
import { PlayCircleOutlined, 
  CheckCircleFilled, 
  MinusCircleFilled, 
  LoadingOutlined, 
  SafetyOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const { Item } = List;

// ****************** new imports ******************
const { confirm } = Modal;

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  // force state update
  const [updateState, setUpdateState] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course && slug) loadCompletedLessons();
  }, [course, slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
    
    // find first uncompleted lesson
    for (let i = 0; i < data.lessons.length; i++) {
      if (!completedLessons.includes(data.lessons[i]._id)) {
        setClicked(i);
        setActiveLesson(data.lessons[i]);
        break;
      }
    }
  };

  const loadCompletedLessons = async () => {
    try {
        const { data } = await axios.post(`/api/list-completed`, {
            courseId: course._id,
        });
        console.log("COMPLETED LESSONS => ", data);
        setCompletedLessons(data);

        // Find the first lesson that is not completed
        for (let i = 0; i < course.lessons.length; i++) {
            if (!data.includes(course.lessons[i]._id)) {
                setClicked(i);
                setActiveLesson(course.lessons[i]);
                break;
            }
        }
    } catch (err) {
        console.log(err);
    }
  };

  const markCompleted = async (lessonId) => {
    console.log("Mark as completed => ", lessonId);
    try {
        const { data } = await axios.post(`/api/mark-completed`, {
            courseId: course._id,
            lessonId,
        });
        console.log(data);

        // Refresh the list of completed lessons
        const updatedCompletedLessons = await loadCompletedLessons();

        // Find the next uncompleted lesson
        let nextUncompletedIndex = -1;
        for (let i = 0; i < course.lessons.length; i++) {
            if (!updatedCompletedLessons.includes(course.lessons[i]._id) && course.lessons[i]._id !== lessonId) {
                nextUncompletedIndex = i;
                break;
            }
        }

        // Set the next uncompleted lesson as the active lesson
        if (nextUncompletedIndex !== -1) {
            setClicked(nextUncompletedIndex);
            setActiveLesson(course.lessons[nextUncompletedIndex]);
        }

    } catch (err) {
        console.log(err);
    }
  };
  
  const markIncompleted = async (lessonId) => {
    try {
        const { data } = await axios.post(`/api/mark-incomplete`, {
            courseId: course._id,
            lessonId,
        });
        console.log(data);

        // Update the completedLessons state
        setCompletedLessons((prevCompletedLessons) =>
            prevCompletedLessons.filter((id) => id !== lessonId)
        );
    } catch (err) {
        console.log(err);
    }
  };

  const removeCourse = async () => {
    confirm({
      title: "Do you want to remove this course?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          // First, get all the courses of the user
          const { data: userCourses } = await axios.get(`/api/user-courses`);

          // Filter out the course you want to remove
          const updatedCourses = userCourses.filter(
            (userCourse) => userCourse._id !== course._id
          );

          // Now, send the updated list of course ids to the server
          await axios.put(`/api/user/update-courses`, {
            courseIds: updatedCourses.map((updatedCourse) => updatedCourse._id),
          });

          // Redirect the user
          return router.push("/user");
        } catch (error) {
          console.log(error);
        }
      },
      onCancel() {},
    });
};


  return (
    <StudentRoute>
      <div className="row margin-sides-0">
      {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {/* Column A */}
        <div className="col col-md-39">
          {activeLesson && (
            // <LessonContent lesson={activeLesson} />
            <LessonContent lesson={activeLesson} courseName={course.name} markLessonCompleted={() => markCompleted(activeLesson._id)} />
          )}
        </div>

        {/* Column B */}
        <div className="col-md-3 lessons-container">
          <div className="lesson-list">
            <div className="d-flex align-items-center justify-content-between">
              <h4>{course.lessons.length} Lessons</h4>
              <Button
                className="mt-1"
                type="danger"
                shape="round"
                icon={<DeleteOutlined />}
                size="large"
                onClick={removeCourse}
              >
                Delete Course
              </Button>
            </div>
            <hr />
            <List
              itemLayout="horizontal"
              dataSource={course.lessons}
              renderItem={(lesson, index) => (
                <Item
                  onClick={() => {
                    setClicked(index);
                    setActiveLesson(lesson);
                  }}
                  className={`lesson-item ${lesson === activeLesson ? "active-lesson" : ""}`}
                >
                  <Item.Meta
                    avatar={
                      <Checkbox
                        className="custom-checkbox"
                        checked={completedLessons.includes(lesson._id)}
                        onChange={() => {
                          if (completedLessons.includes(lesson._id)) {
                            markIncompleted(lesson._id);
                          } else {
                            markCompleted(lesson._id);
                          }
                        }}
                      />
                    }
                    title={`${index + 1}. ${lesson.title.substring(0, 100)}`}
                  />
                </Item>
              )}
            />
          </div>
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;


// <h1>{JSON.stringify(course, null, 4)}</h1>
{/* <h1>{JSON.stringify(router.query.slug, null, 4)}</h1> */}

