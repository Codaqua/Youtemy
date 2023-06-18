import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { universities, degrees, years, subjects } from "../utils/data";
import { useRouter } from "next/router";

import Link from "next/link";
// TODO : ICONS
import {
  HomeOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
  ExperimentOutlined,
  PlayCircleFilled,
  GitlabFilled,
  CrownFilled,
  ReadFilled,
  RobotFilled,
  ExperimentFilled,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";

import { toast } from "react-toastify";

import Filter from "./filters/Filter";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();
  const showFilters = router.pathname === "/";

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message, {
      autoClose: 500, // 5 seconds
    });
    router.push("/");
  };

  const handleFilterChange = async (filterType, selectedOption) => {
    try {
      const response = await axios.get("/filter-courses", {
        params: { [filterType]: selectedOption },
      });

      // Update the state with the filtered courses
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };
  // ***********************************************************
  return (
    <Navbar
      collapseOnSelect
      expand="xl"
      bg="light"
      variant="light"
      className="navbar-expand-custom sticky-navbar"
    >
      {/* Left Block */}
      <Navbar.Brand href="/" className="mr-0">
        <img
          src="/Youtemy_logo.png"
          alt="Youtemy"
          height="35"
          className="logo"
        />
      </Navbar.Brand>

      {/* Hamburger Menu */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      {/* Navbar content */}
      {/* Navbar content */}
      <Navbar.Collapse id="responsive-navbar-nav">
        <div className="d-flex flex-column flex-xl-row w-100 aligned-center">
          {/* Center Block */}
          <div
            className={`flex-grow-1 text-center ${
              showFilters ? "" : "invisible"
            }`}
          >
            <Nav className="justify-content-center">
              <Nav.Item>
                <Filter
                  className="nav-link"
                  filterType="university"
                  options={universities}
                  onFilterChange={handleFilterChange}
                />
              </Nav.Item>
              <Nav.Item>
                <Filter
                  className="nav-link"
                  filterType="degree"
                  options={degrees}
                  onFilterChange={handleFilterChange}
                />
              </Nav.Item>
              <Nav.Item>
                <Filter
                  className="nav-link"
                  filterType="year"
                  options={years}
                  onFilterChange={handleFilterChange}
                />
              </Nav.Item>
              <Nav.Item>
                <Filter
                  className="nav-link"
                  filterType="subject"
                  options={subjects}
                  onFilterChange={handleFilterChange}
                />
              </Nav.Item>
            </Nav>
          </div>

          {/* Right Block */}
          <Nav className="ml-auto">
            {user && user.role && user.role.includes("Tutor") ? (
              <Nav.Link href="/tutor/course/create">
                <ExperimentFilled className="icons minus-buttom-margin" />
                Create a Course
              </Nav.Link>
            ) : (
              user && (
                <>
                  <Nav.Link href="/user/">
                    <ReadFilled className="icons minus-buttom-margin" />
                    My Learning
                  </Nav.Link>
                </>
              )
            )}

            {user === null && (
              <>
                <Nav.Link href="/login">
                  <RobotFilled className="icons" />
                  Login
                </Nav.Link>
                <Nav.Link href="/register">
                  <UserAddOutlined className="icons" />
                  Sign up
                </Nav.Link>
              </>
            )}

            {user !== null && (
              <NavDropdown
                className="nav-dropdown"
                title={
                  <div className="icon-container">
                    <GitlabFilled className="icons minus-buttom-margin" />
                    <span className="minus-buttom-margin">{user.name}</span>
                  </div>
                }
                id="collasible-nav-dropdown"
                menuAlign="right"
              >
                <NavDropdown.Item href="/user">
                  Student Dashboard
                </NavDropdown.Item>

                {user && user.role && user.role.includes("Tutor") && (
                  <>
                    <NavDropdown.Item href="/tutor">
                      Tutor Dashboard
                    </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNav;
