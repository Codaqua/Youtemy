import { useState, useEffect } from "react";
import axios from "axios";
import TutorRoute from "../../../../components/routes/TutorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const { Item } = List;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    uploading: false,
    university: "",
    degree: "",
    year: "",
    subject: "",
    loading: false,
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");


  // state for lessons update
  const [visible, setVisible] = useState(false);
  // const [current, setCurrent] = useState({});
  const [current, setCurrent] = useState({ videos: [] });

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });
    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("IMAGE UPLOADED", data);
        // set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast("Image upload failed. Try later.", {
          autoClose: 500 // 5 seconds
        });
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      // console.log(values);
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast("Image upload failed. Try later.", {
        autoClose: 500 // 5 seconds
      });
    }
  };

  const handleCancel = () => {
    // Attempt to go back to the previous page
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history is present, navigate to the fallback URL
      router.push('/tutor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values);
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast("Course updated!", {
        autoClose: 500 // 5 seconds
      });
      // TODO: REDIRECT TO TUTOR DASHBOARD
      // router.push("/tutor");
      handleCancel();
    } catch (err) {
      toast(err.response.data, {
        autoClose: 500 // 5 seconds
      });
    }
  };

  const handleDrag = (e, index) => {
    // console.log("ON DRAG => ", index);
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    // console.log("ON DROP => ", index);
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; // clicked/dragged item to re-order
    allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    setValues({ ...values, lessons: [...allLessons] });
    // save the new lessons order in db
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    // console.log("LESSONS REARRANGED RES => ", data);
    toast("Lessons rearranged successfully", {
      autoClose: 500 // 5 seconds
    });
  };

  // Delete lesson
  const handleDelete = async (index) => {
    // TODO : implement confirmation modal
    //  https://ant.design/components/modal
    const answer = window.confirm("Are you sure you want to delete?");
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    // console.log("removed", removed[0]._id);
    setValues({ ...values, lessons: allLessons });
    // send request to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    console.log("LESSON DELETED =>", data);
  };

  /**
   * lesson update functions
   */

  const extractVideoId = (url) => {
    if(!url) return null;
    
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    if (hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  
    if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v');
      }
  
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/')[2];
      }
  
      if (urlObj.pathname.startsWith('/v/')) {
        return urlObj.pathname.split('/')[2];
      }
    }
    
    return null; // return null if the format is not recognized
  };

  // const buildYouTubeUrl = (videoId) => `https://www.youtube.com/watch?v=${videoId}`;
  const buildYouTubeUrl = (videoId) => `https://img.youtube.com/vi/${videoId}/0.jpg`;

  const addUrlField = () => {
    setCurrent({ ...current, videos: [...current.videos, ''], });
  };


  const handleRemoveVideo = async (index) => {
    const videoUrl = current.videos[index];
    try {
      // const response = await axios.put(`/api/course/${slug}/${current._id}/${current.videos[index]}`);
      console.log("handleRemoveVideo try");
      console.log("slug",`${slug}`);
      console.log("current._id", `${current._id}`);
      console.log("videoUrl", `${videoUrl}`);
      
      const response = await axios.put(`/api/course/${slug}/${current._id}/${videoUrl}`);
      console.log('Video removed', response);
      setCurrent({ ...current, videos: current.videos.filter((v, i) => i !== index) });
    } catch (error) {
      console.log("handleRemoveVideo try");
      console.log(error);
    }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
   
    try {
      console.log("handleUpdateLesson try", `${slug}, ${values._id}, ${current._id}`);

      const { data } = await axios.put(
        `/api/course/lesson/${slug}/${current._id}`,
        current
      );

      setVisible(false);
      // update lessons
      if (data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === current._id);
        arr[index] = current;
        setValues({ ...values, lessons: arr });
        toast("Lesson updated", {
          autoClose: 500 // 5 seconds
        });
        // setCourse(data);
      }
    } catch (err) {
        toast("Lesson update failed", {
          autoClose: 500 // 5 seconds
        });
    }
  };

  

  return ( 
    <TutorRoute>
      <h1 className="jumbotron text-center square">Update Course</h1>
        {/* {JSON.stringify(values)} */}
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          editPage={true}
          buildYouTubeUrl={buildYouTubeUrl}
          // videoUrl={buildYouTubeUrl(current)} // replace videoId with the actual id from the data
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
      <hr />
      {/* <pre>{JSON.stringify(image, null, 4)}</pre> */}

      <hr />

      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >

              <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={`${index + 1}. ${item.title}`}
                ></Item.Meta>

                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger float-right"
                />

              </Item>
            )}
          ></List>
        </div>
      </div>
      
      <Modal
        title="Update lesson"
        centered
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        {/* <pre>{JSON.stringify(current, null, 4)}</pre> */}
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleUpdateLesson={handleUpdateLesson}
          addUrlField={addUrlField}
          // handleUrlChange={handleUrlChange}
          // removeUrlField={removeUrlField}
          // uploading={uploading}
          handleRemoveVideo={handleRemoveVideo}
          extractVideoId={extractVideoId}
          buildYouTubeUrl={buildYouTubeUrl}
  />
      </Modal>


    </TutorRoute>
  );
};

export default CourseEdit;
