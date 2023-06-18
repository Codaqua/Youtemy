import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Context } from "../../context";

const UserNav = () => {
  const [current, setCurrent] = useState("");

  // Access the user data from context
  const { state } = useContext(Context);
  const { user } = state;

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <Link
        href="/user"
        className={`nav-link ${current === "/user" && "active"}`}
      >
        Student Dashboard
      </Link>

      <Link href="/">
        <div className={`nav-link ${current === "/" && "active"}`}>Home</div>
      </Link>

      {/* Conditionally render the "Become Tutor" link */}
      {!(user && user.role && user.role.includes("Tutor")) && (
        <Link
          href="/user/become-tutor"
          className={`nav-link ${current === "/user/become-tutor" && "active"}`}
        >
          Become Tutor
        </Link>
      )}
    </div>
  );
};

export default UserNav;
