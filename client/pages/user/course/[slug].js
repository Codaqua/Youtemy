import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { List, Checkbox } from "antd";
import LessonContent from "../../../components/cards/LessonContent";
import ReactMarkdown from "react-markdown";
import { PlayCircleOutlined, CheckCircleFilled, MinusCircleFilled } from "@ant-design/icons";

// *******************************************************
// *******************************************************
// *******************************************************
// *******************************************************
// *******************************************************

const { Item } = List;

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

  // useEffect(() => {
  //   if (course) loadCompletedLessons();
  // }, [course]);

  useEffect(() => {
    if (course && slug) loadCompletedLessons();
  }, [course, slug]);

  // const loadCourse = async () => {
  //   const { data } = await axios.get(`/api/user/course/${slug}`);
  //   setCourse(data);
  
  //   // find first uncompleted lesson
  //   for (let i = 0; i < data.lessons.length; i++) {
  //     if (!completedLessons.includes(data.lessons[i]._id)) {
  //       setClicked(i);
  //       setActiveLesson(data.lessons[i]);
  //       break;
  //     }
  //   }
  // };
  
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
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    console.log("COMPLETED LESSONS => ", data);
    setCompletedLessons(data);
  };

 
  // const markCompleted = async (lessonId) => {
  //   console.log("Mark as completed => ", lessonId);
  //   const { data } = await axios.post(`/api/mark-completed`, {
  //     courseId: course._id,
  //     lessonId: course.lessons[clicked]._id,
  //   });
  //   console.log(data);
  //   setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  // };
  const markCompleted = async (lessonId) => {
    console.log("Mark as completed => ", lessonId);
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId,
    });
    console.log(data);
    loadCourse();
  };
  
  const markIncompleted = async (lessonId) => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId,
      });
      console.log(data);
      loadCourse();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentRoute>
      <div className="row margin-sides-0">

        {/* Column A */}
        <div className="col col-md-39">
          {activeLesson && (
            <LessonContent lesson={activeLesson} />
          )}
        </div>

        {/* Column B */}
        <div className="col-md-3 lessons-container">
          <div className="lesson-list">
            {course.lessons && <h4>{course.lessons.length} Lessons</h4>}
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
                  {/* <Item.Meta
                    avatar={<Checkbox className="custom-checkbox" />}
                    title={`${index + 1}. ${lesson.title.substring(0, 100)}`}
                  /> */}
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

