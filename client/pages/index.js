// import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";
// ***************************
import { useEffect, useState, useContext } from "react";
import { Context } from "../context";

const Index = () => {
  const { state } = useContext(Context);
  const [courses, setCourses] = useState([]);
  console.log("This is the content of State to modify:", state);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch the CSRF token
        const { data: csrfData } = await axios.get("/api/csrf-token");
        const csrfToken = csrfData.csrfToken;

        // Fetch courses with CSRF token in headers
        const { data } = await axios.post("/api/courses", state.filters, {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        });
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [state.filters]);

  return (
    //     <>
    //       <center>
    //       <h1 className="jumbotron text-center bg-primary square">
    //         Youtemy Open Academy
    //       </h1>
    //       </center>
    //       <center>
    //       <h1>
    //       Amplía tus oportunidades profesionales
    //       </h1>
    //       <p className="col-md-10 text-justify">
    //           Tanto si trabajas en el segmento del aprendizaje automático o
    //           de las finanzas como si deseas desarrollar tu carrera en ciencias de datos o desarrollo web,
    //           Python es una de las habilidades más importantes que puedes aprender.
    //           La sencilla sintaxis de Python es especialmente adecuada para equipos de escritorio, web y
    //           Tanto si trabajas en el segmento del aprendizaje automático o
    //           de las finanzas como si deseas desarrollar tu carrera en ciencias de datos o desarrollo web,
    //           Python es una de las habilidades más importantes que puedes aprender.
    //           La sencilla sintaxis de Python es especialmente adecuada para equipos de escritorio, web y
    //           Python es una de las habilidades más importantes que puedes aprender.
    //           La sencilla sintaxis de Python es especialmente adecuada para equipos de escritorio, web y
    //           </p>
    //       </center>
    //       <div className="container-fluid">
    //         <div className="row">
    //           {courses.map((course) => (
    //             <div key={course._id} className="col-md-4">
    //               {/* <pre>{JSON.stringify(course, null, 4)}</pre>  */}
    //               <CourseCard course={course} />
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </>
    //   );
    // };

    <>
      {state.user === null ? (
        <>
          <center>
            <h1 className="jumbotron text-center bg-primary square">
              Youtemy Open Academy
            </h1>
          </center>
          <center>
            <h1>Amplía tus oportunidades profesionales</h1>
            <p className="col-md-10 text-justify">
              Tanto si trabajas en el segmento del aprendizaje automático o de
              las finanzas como si deseas desarrollar tu carrera en ciencias de
              datos o desarrollo web, Python es una de las habilidades más
              importantes que puedes aprender. La sencilla sintaxis de Python es
              especialmente adecuada para equipos de escritorio, web y Tanto si
              trabajas en el segmento del aprendizaje automático o de las
              finanzas como si deseas desarrollar tu carrera en ciencias de
              datos o desarrollo web, Python es una de las habilidades más
              importantes que puedes aprender. La sencilla sintaxis de Python es
              especialmente adecuada para equipos de escritorio, web y Python es
              una de las habilidades más importantes que puedes aprender. La
              sencilla sintaxis de Python es especialmente adecuada para equipos
              de escritorio, web y
            </p>
          </center>
        </>
      ) : null}
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
