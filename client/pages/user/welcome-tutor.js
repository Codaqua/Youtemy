import { useContext } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";

const WelcomeTutor = () => {
  const {
    state: { user },
  } = useContext(Context);

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">
        Welcome, {user ? user.name : "Loading"}!
      </h1>
      <p className="lead text-center">
        You're now a Tutor. You can start publishing your own courses.
      </p>
    </UserRoute>
  );
};

export default WelcomeTutor;