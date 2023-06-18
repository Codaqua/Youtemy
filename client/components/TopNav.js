import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { universities, degrees, years, subjects } from "../utils/data";

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
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import Filter from "./filters/Filter";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message, {
      autoClose: 500 // 5 seconds
    });
    router.push("/");
  };

  ////////////******************** */
  const handleFilterChange = async (filterType, selectedOption) => {
    try {
      const response = await axios.get("/filter-courses", {
        params: { [filterType]: selectedOption },
      });

      // Update the state with the filtered courses
      // Assuming you have a function or state for storing the courses displayed in the index page.
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };
  ////////////******************** */
  ////////////******************** */

  return (
    <Navbar
      collapseOnSelect
      expand="xl"
      bg="light"
      variant="light"
      className="d-flex navbar-expand-custom sticky-navbar"
    >
      {/* Left Block */}
      {/* Logo */}
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
      <Navbar.Collapse id="responsive-navbar-nav">
        {/* Center Block */}
        <Nav className="mx-auto center-block">
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

        {/* Right Block */}
        <Nav className="ml-auto">
          {/* {user && user.role && user.role.includes("Tutor") ? (
                    <Nav.Link href="/tutor/course/create">
                        <CarryOutOutlined />
                        Create a Course
                    </Nav.Link>
                ) : (user && (
                  <Nav.Link href="/user/become-tutor">
                      <TeamOutlined />
                      Become Tutor
                  </Nav.Link>
              ))} */}

          {/* *********** */}
          {user && user.role && user.role.includes("Tutor") ? (
            <Nav.Link href="/tutor/course/create">
              <ExperimentFilled className="icons minus-buttom-margin" />
              Create a Course
            </Nav.Link>
          ) : (
            user && (
              <>
                {/* <Nav.Link href="/user/become-tutor">
                    <TeamOutlined />
                    Become Tutor
                </Nav.Link> */}
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
            <NavDropdown className="nav-dropdown"
              title={
                <div className="icon-container">
                  <GitlabFilled className="icons minus-buttom-margin" />
                  <span className="minus-buttom-margin">{user.name}</span>
                </div>
              }
              id="collasible-nav-dropdown"
              menuAlign="right"
            >
              <NavDropdown.Item href="/user">Student Dashboard</NavDropdown.Item>

              {user && user.role && user.role.includes("Tutor") && (
                <>
                  <NavDropdown.Item href="/tutor">
                    Tutor Dashboard
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="/tutor/course/create">
                    Create a Course
                  </NavDropdown.Item> */}
                </>
              )}

              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

  // return (
  //   <div className="d-flex">
  //     {/* Left Block */}

  //     <div className="flex-grow-1">
  //       <Menu mode="horizontal" selectedKeys={[current]} className="mb-2">
  //         <Item
  //           key="/"
  //           onClick={(e) => setCurrent(e.key)}
  //           className="nav-item-no-underline"
  //         >
  //           <Link href="/">
  //             <img src="/Youtemy_logo.png" alt="Youtemy" width="100%" />
  //           </Link>
  //         </Item>
  //       </Menu>
  //     </div>

  //     {/* **************************** */}
  //     {/* Center Block */}
  //     <div className="flex-grow-1 d-flex justify-content-center">
  //       <Menu mode="horizontal" selectedKeys={[current]} className="mb-2">
  //         <Item key="university-filter">
  //           <Filter
  //             className="cursor-pointer"
  //             filterType="university"
  //             options={universities}
  //             onFilterChange={handleFilterChange}
  //           />
  //         </Item>
  //         <Item key="degree-filter">
  //           <Filter
  //             filterType="degree"
  //             options={degrees}
  //             onFilterChange={handleFilterChange}
  //           />
  //         </Item>
  //         <Item key="year-filter">
  //           <Filter
  //             filterType="year"
  //             options={years}
  //             onFilterChange={handleFilterChange}
  //           />
  //         </Item>
  //         <Item key="subject-filter">
  //           <Filter
  //             filterType="subject"
  //             options={subjects}
  //             onFilterChange={handleFilterChange}
  //           />
  //         </Item>
  //       </Menu>
  //     </div>

  //     {/* **************************** */}
  //     {/* Right Block */}
  //     <div className="flex-grow-1 d-flex justify-content-end">
  //       <Menu mode="horizontal" selectedKeys={[current]} className="mb-2">
  //         {user && user.role && user.role.includes("Tutor") ? (
  //           <Item
  //             key="/tutor/course/create"
  //             onClick={(e) => setCurrent(e.key)}
  //             icon={<CarryOutOutlined />}
  //           >
  //             <Link href="/tutor/course/create">Create a Course</Link>
  //           </Item>
  //         ) : (
  //           <Item
  //             key="/user/become-tutor"
  //             onClick={(e) => setCurrent(e.key)}
  //             icon={<TeamOutlined />}
  //           >
  //             <Link href="/user/become-tutor">Become Tutor</Link>
  //           </Item>
  //         )}

  //         {user === null && (
  //           <>
  //             <Item
  //               key="/login"
  //               onClick={(e) => setCurrent(e.key)}
  //               icon={<LoginOutlined />}
  //             >
  //               <Link href="/login">Login</Link>
  //             </Item>

  //             <Item
  //               key="/register"
  //               onClick={(e) => setCurrent(e.key)}
  //               icon={<UserAddOutlined />}
  //             >
  //               <Link href="/register">Sign up</Link>
  //             </Item>
  //           </>
  //         )}

  //         {/* TODO , Submenu to display it */}
  //         {/* TODO , cambiar CoffeeOutLined , ver las referencias */}

  //         {user && user.role && user.role.includes("Tutor") && (
  //           <Item
  //             key="/tutor"
  //             onClick={(e) => setCurrent(e.key)}
  //             icon={<TeamOutlined />}
  //             className="ml-auto"
  //           >
  //             <Link href="/tutor">Tutor</Link>
  //           </Item>
  //         )}

  //         {user !== null && (
  //           <SubMenu
  //             key="/submenu-user"
  //             icon={<CoffeeOutlined />}
  //             title={user && user.name}
  //             className="float-right"
  //           >
  //             {/* Cambio ml-auto por float-right */}
  //             <ItemGroup>
  //               <Item key="/user">
  //                 <Link href="/user">Dashboard</Link>
  //               </Item>
  //               <Item key="/logout" onClick={logout}>
  //                 Logout
  //               </Item>
  //             </ItemGroup>
  //           </SubMenu>
  //         )}
  //       </Menu>
  //     </div>
  //   </div>
  // );
};

export default TopNav;
