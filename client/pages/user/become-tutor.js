import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";
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
    console.log("become tutor *************** ");
    setLoading(true);
    axios
      .post("/api/make-tutor")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          router.push('/user/welcome-tutor'); // use router.push to navigate
          let updatedUser = { ...user, role: "Tutor" };
          dispatch({
            type: "LOGIN",
            payload: updatedUser,
          });
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        toast("Borrar onboarding failed. Try again.");
        setLoading(false);
      });
  };



  return (
    <>
      <h1 className="jumbotron text-center square">Become Tutor</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on Youtemy</h2>
              <p className="lead text-warning">
                Youtemy partners with stripe to transfer earnings to your bank
                account
              </p>

              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeTutor}
                disabled={
                  (user && user.role && user.role.includes("Tutor")) ||
                  loading
                }
              >
                {loading ? "Processing..." : "Payout Setup"}
              </Button>

              <p className="lead">
                You will be redirected to stripe to complete onboarding process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeTutor;
