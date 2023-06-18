import { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
  SketchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router"; // import useRouter

const BecomeTutor = () => {
  // state
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const router = useRouter(); // initialize router

  const becomeTutor = () => {
    // console.log("become tutor *************** ");
    setLoading(true);
    axios
      .post("/api/make-tutor")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          router.push("/user/welcome-tutor"); // use router.push to navigate
          let updatedUser = { ...user, role: "Tutor" };
          dispatch({
            type: "LOGIN",
            payload: updatedUser,
          });

          // Update user role in the local storage
          window.localStorage.setItem("user", JSON.stringify(updatedUser));

          // Fetch updated account status
          fetchAccountStatus();
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        toast("Becoming tutor failed. Try again.");
        setLoading(false);
      });
  };

  const fetchAccountStatus = () => {
    axios
      .post("/api/get-account-status")
      .then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        window.localStorage.setItem("user", JSON.stringify(res.data));
        // console.log("Values of ", res);
        // window.location.href = "/tutor";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">Become Tutor</h1>
      {/* **************************************************************** */}
      <div className="margin-side-extra">
        <center>
          <header class="header">
            <h4 class="header__title">
              Bring your knowledge to the world with Youtemy
            </h4>
          </header>
        </center>

        <section class="intro">
          <p class="intro__text">
            Enlightening minds is a noble endeavour, and with{" "}
            <strong>Youtemy</strong>, you, as a tutor, can seamlessly craft
            courses that integrate pertinent YouTube videos to complement and
            enrich your subject matter. No more will your students have to trawl
            through endless, potentially questionable videos. Your insight
            ensures they receive the best supplementary material, hand-picked by
            you, to augment their learning journey.
          </p>
          <p class="intro__text">
            To commence your path as a Youtemy tutor, simply click the 'Become a
            Tutor' button below. Upon approval, you'll be granted tutor
            privileges and can start creating your very own courses.
          </p>

          <p class="intro__text">
            Initiate a course by clicking on 'Create a Course' by your user
            profile or within the 'Tutor Dashboard'. Fill out the basic
            information, and you're ready to start adding lessons. For each
            lesson, input a title, an optional descriptive content, and the URLs
            of the video or videos you wish to include. You can add as many
            videos as you deem necessary per lesson.
          </p>
          <p class="intro__text">
            Your courses can be tweaked and tailored as you see fit through the
            'Edit the Course' button. Reorder lessons with a simple
            drag-and-drop action. Please remember, a course should have at least
            two lessons, with each lesson containing a minimum of one video.
            Once you’re satisfied, hit the 'Publish the Course' button and voilà
            – your course is live for all to benefit from.
          </p>
          <p class="intro__text">
            By becoming a Tutor in Youtemy, you are enriching the lives of
            students, empowering them to optimise their learning process and
            academic performance. Without your invaluable contributions, this
            mission would not be possible.
          </p>
          <p className="margin-bottom">
            <strong>
              Thank you for your dedication and for making Youtemy a beacon of
              educational excellence!{" "}
            </strong>
          </p>
          <center>
            <div className="col-3">
              <Button
                className="mb-6 mt-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SketchOutlined />}
                size="large"
                onClick={becomeTutor}
                disabled={
                  (user && user.role && user.role.includes("Tutor")) || loading
                }
              >
                {loading ? "Processing..." : "\u00A0Become a Tutor"}
              </Button>
            </div>
          </center>
        </section>
      </div>
    </UserRoute>
  );
};

export default BecomeTutor;
