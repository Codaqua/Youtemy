import { useState, useEffect } from "react";
import Link from "next/link";

const UserNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <Link href="/user">
        <div className={`nav-link ${current === "/user" && "active"}`}>
          Dashboard
        </div>
      </Link>
    </div>
  );
};

export default UserNav;