import { useState, useEffect } from "react";
import Link from "next/link";

const TutorNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <Link href="/tutor" className={`nav-link ${current === "/tutor" && "active"}`}>
          Dashboard
      </Link>
      <Link href="/tutor/course/create" className={`nav-link ${
            current === "/tutor/course/create" && "active" }`}>
          Course Create
      </Link>
    </div>
  );
};

export default TutorNav;
