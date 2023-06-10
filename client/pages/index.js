// import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

const Index = ({ courses }) => {
// const Index = () => {
  // const [courses, setCourses] = useState([]);

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     const { data } = await axios.get("/api/courses");
  //     setCourses(data);
  //   };
  //   fetchCourses();
  // }, []);

  return (
    <>
      <center>
      <h1 className="jumbotron text-center bg-primary square">
        Youtemy Open Academy
      </h1>
      </center>
      <center>
      <h1>
      Amplía tus oportunidades profesionales
      </h1>
      <p className="col-md-10 text-justify">
          Tanto si trabajas en el segmento del aprendizaje automático o 
          de las finanzas como si deseas desarrollar tu carrera en ciencias de datos o desarrollo web, 
          Python es una de las habilidades más importantes que puedes aprender. 
          La sencilla sintaxis de Python es especialmente adecuada para equipos de escritorio, web y 
          Tanto si trabajas en el segmento del aprendizaje automático o 
          de las finanzas como si deseas desarrollar tu carrera en ciencias de datos o desarrollo web, 
          Python es una de las habilidades más importantes que puedes aprender. 
          La sencilla sintaxis de Python es especialmente adecuada para equipos de escritorio, web y
          Python es una de las habilidades más importantes que puedes aprender. 
          La sencilla sintaxis de Python es especialmente adecuada para equipos de escritorio, web y
          </p>
      </center>
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              {/* <pre>{JSON.stringify(course, null, 4)}</pre>  */}
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

export default Index;
