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
    <>
      {state.user === null ? (
        <div className="margin-side">
          <center>
            <h1 className="jumbotron text-center bg-primary square">
              Youtemy Open Academy
            </h1>
          </center>
          <div className="margin-side-extra">
            <center>
              <header class="header">
                <h4 class="header__title">If you want to learn, don't waste time searching. Just Learn!</h4>
              </header>
            </center>
            <section class="intro">
              <p class="intro__text">
                Hey Students! 💡 Have you ever found yourselves buried in the
                chaos of YouTube, looking for that one video that can help you
                understand your lessons? Say goodbye to those days!{" "}
                <strong>Youtemy</strong> is your new buddy, bringing you the
                coolest and most relevant educational videos, all in one place!
                🚀
              </p>
              <p class="intro__text">
                What makes <strong>Youtemy wicked awesome?</strong> Your
                super-smart teachers have picked out the best YouTube videos
                that fit right into what you're studying. So, instead of digging
                through the interwebs, you’ll have everything served up on a
                silver platter! 🍽️
              </p>
              <p class="intro__text">
                Here’s how to kick things off: Use the four rad filters at the
                top. <strong>Just tell Youtemy what you're studying</strong>,
                and BAM! - it's like magic, the videos you need will be right in
                front of you. 🔮 So, what are you waiting for? <strong>Dive in and let
                the learning extravaganza begin!</strong> 🎓
              </p>
            </section>
          </div>
        </div>
      ) : null}
      <div className="container-fluid container-centered footer">
        <div className="block-content">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} isLoggedIn={false} />
          ))}
        </div>
      </div>

    </>
  );
};

export default Index;
