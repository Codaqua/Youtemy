import { useState } from "react";
import axios from "axios";
import TutorRoute from "../../../components/routes/TutorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
// import user from "../../../../server/models/user";


const CourseCreate = () => {
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
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  // router
  const router = useRouter();

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
        // console.log("IMAGE UPLOADED", data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values);
      const { data } = await axios.post("/api/course", {
        ...values,
        image,
      });
      toast("Great! Now you can start adding lessons", {
        autoClose: 500 // 5 seconds
      });
      router.push("/tutor");
    } catch (err) {
      toast(err.response.data, {
        autoClose: 500 // 5 seconds
      });
    }
  };

  // ****** Formulario de creación de curso ******

  // TODO : PROPS que se pasan a CouserCreateForm
  return (
    <TutorRoute>
      <h1 className="jumbotron text-center square">Create Course</h1>
      <div className="pt-3 pb-3">
        <h1>FORMULARIO CREACIÓN DE CURSOS</h1>
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
      <hr />
      {/* <pre>{JSON.stringify(image, null, 4)}</pre> */}
    </TutorRoute>
  ); 
};

export default CourseCreate;
