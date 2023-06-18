import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TutorRoute from "../../../../components/routes/TutorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  RightCircleFilled,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";

const CourseView = () => {
  const [course, setCourse] = useState({});

  // for lessons
  const [visible, setVisible] = useState(false);
  // TODO : PENDIENTE VER SI AÑADO MÁS STATES
  const [values, setValues] = useState({
    title: "",
    content: "",
    videos: [""],
  });
  // const [uploading, setUploading] = useState(false);
  // const [uploadButtonText, setUploadButtonText] = useState("Upload Video");

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  // FUNCTIONS FOR ADD LESSON
  const extractVideoId = (url) => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }

    if (hostname === "www.youtube.com" || hostname === "youtube.com") {
      if (urlObj.pathname === "/watch") {
        return urlObj.searchParams.get("v");
      }

      if (urlObj.pathname.startsWith("/embed/")) {
        return urlObj.pathname.split("/")[2];
      }

      if (urlObj.pathname.startsWith("/v/")) {
        return urlObj.pathname.split("/")[2];
      }
    }

    return null; // return null if the format is not recognized
  };

  const handleAddLesson = async (e) => {
    try {
      // TODO : ELIMINAR VIDEOS DUPLICADOS
      // const videoIds = values.videos.map(url => extractVideoId(url)); // convert URLs to videoIds
      const videoIdsSet = new Set(
        values.videos.map((url) => extractVideoId(url))
      );
      const videoIds = Array.from(videoIdsSet); // Convert Set back to an array

      // const { data } = await axios.post(
      //   `/api/course/lesson/${slug}/${course.tutor._id}`,
      //   values
      // );
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.tutor._id}`,
        { ...values, videos: videoIds } // replace URLs with videoIds
      );

      // console.log(data)
      setValues({ ...values, title: "", content: "", videos: [""] });
      setVisible(false);
      // TODO : PENDIENTE DE ELIMINAR
      // setUploadButtonText("Upload video");
      setCourse(data);
      toast("Lesson added", {
        autoClose: 500 // 5 seconds
      });
    } catch (err) {
      console.log(err);
      toast("Lesson add failed", {
        autoClose: 500 // 5 seconds
      });
    }
  };

  const handleUrlChange = (e, index) => {
    const updatedUrls = [...values.videos];
    updatedUrls[index] = e.target.value;
    setValues({ ...values, videos: updatedUrls });
  };

  const addUrlField = (e) => {
    e.preventDefault();
    setValues({ ...values, videos: [...values.videos, ""] });
  };

  // const handlePublish = async (e, courseId) => {
  //   try {
  //     let answer = window.confirm(
  //       "Once you publish your course, it will be live in Youtemy for students to enroll"
  //     );
  //     if (!answer) return;
  //     const { data } = await axios.put(`/api/course/publish/${courseId}`);
  //     setCourse(data);
  //     toast("Congrats! Your course is live");
  //   } catch (err) {
  //     toast("Course publish failed. Try again");
  //   }
  // };

  // const handleUnpublish = async (e, courseId) => {
  //   try {
  //     let answer = window.confirm(
  //       "Once you unpublish your course, it will no be available for students to enroll"
  //     );
  //     if (!answer) return;
  //     const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
  //     setCourse(data);
  //     toast("Your course is unpublished");
  //   } catch (err) {
  //     toast("Course unpublish failed. Try again");
  //   }
  // };

  const handlePublish = async (e, courseId) => {
    Modal.confirm({
      title: "Are you sure?",
      content:
        "Once you publish your course, it will be live in Youtemy for students to enroll",
      maskClosable: true,
      onOk: async () => {
        try {
          const { data } = await axios.put(`/api/course/publish/${courseId}`);
          setCourse(data);
          toast("Congrats! Your course is live", {
            autoClose: 500 // 5 seconds
          });
        } catch (err) {
          toast("Course publish failed. Try again", {
            autoClose: 500 // 5 seconds
          });
        }
      },
      onCancel() {
        // add some action on cancel if required
      },
    });
  };

  const handleUnpublish = async (e, courseId) => {
    Modal.confirm({
      title: "Are you sure?",
      content:
        "Once you unpublish your course, it will not be available for students to enroll",
      maskClosable: true,
      onOk: async () => {
        try {
          const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
          setCourse(data);
          toast("Your course is unpublished", {
            autoClose: 500 // 5 seconds
          });
        } catch (err) {
          toast("Course unpublish failed. Try again", {
            autoClose: 500 // 5 seconds
          });
        }
      },
      onCancel() {
        // add some action on cancel if required
      },
    });
  };

  {
    /* TODO : PENDIENTE LOS STYLES INLINE */
  }
  return (
    <TutorRoute>
      <div className="container-fluid pt-3">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                className="square-avatar"
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="media-body pl-2">
                <div className="row">
                  {/* TODO: change styles of each course slug page*/}
                  {/* <div className="col-9"> */}
                  <div className="col-9">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>

                  <div className="d-flex pt-4 info-edit-buttons">
                    <Tooltip title="Edit">
                      <button
                        className="custom-button green"
                        onClick={() =>
                          router.push(`/tutor/course/edit/${slug}`)
                        }
                      >
                        <EditOutlined className="icon" />
                        <span>&nbsp; Edit the course</span>
                      </button>
                    </Tooltip>

                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lessons required to publish">
                        <div className="custom-button orange">
                          <QuestionOutlined className="icon" />
                          <span>Min 5 lessons required to publish</span>
                        </div>
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title="Unpublish">
                        <button
                          className="custom-button soft-red"
                          onClick={(e) => handleUnpublish(e, course._id)}
                        >
                          <CloseOutlined className="icon" />
                          <span>Unpublish the course</span>
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Publish">
                        <button
                          className="custom-button orange"
                          onClick={(e) => handlePublish(e, course._id)}
                        >
                          <CheckOutlined className="icon" />
                          <span>&nbsp; Published the course</span>
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            {/* TODO: reducir espacio en el que se muestra el texto final 
            + añadir una línea informativa con 3 Markdown básicos */}
            <div className="row">
              <div className="col">
                <ReactMarkdown children={course.description} />
              </div>
            </div>

            <div className="row">
              {/* TODO : PENDIENTE STYLES */}
              <Button
                onClick={() => setVisible(true)}
                className="col-md-3  text-center d-flex justify-content-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
              >
                  &nbsp; Add Lessons
              </Button>
            </div>

            <br />

            <Modal
              title="+ Add a Lesson"
              centered
              // visible={visible}
              open={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                handleUrlChange={handleUrlChange}
                addUrlField={addUrlField}
                // uploadButtonText={uploadButtonText}
                // uploading={uploading}
                // handleVideo={handleVideo}
              />
            </Modal>

            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={
                          <div
                            style={{
                              background: "lightgray",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <RightCircleFilled style={{ fontSize: "20px" }} />
                          </div>
                        }
                        title={`${index + 1}. ${item.title}`}
                      />
                    </Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </TutorRoute>
  );
};

export default CourseView;
