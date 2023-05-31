import { useState, useEffect, useContext  } from "react";
import { Menu } from "antd";
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
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const { Item, SubMenu, ItemGroup  } = Menu;

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
    toast(data.message);
    router.push("/login");
  };
  
  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<HomeOutlined />}
      >
        <Link href="/">
          Home
        </Link>
      </Item>

      {user && user.role && user.role.includes("Tutor") ? (
        <Item
          key="/tutor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/tutor/course/create">
            Create a Course
          </Link>
        </Item>
      ) : (
        <Item
          key="/user/become-tutor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-tutor">
            Become Tutor
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login">
              Login
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register">
              Sign up
            </Link>
          </Item>
        </>
      )}

{/* TODO , Submenu to display it */}
{/* TODO , cambiar CoffeeOutLined , ver las referencias */}
      {user !== null && (
        <SubMenu
          key="/submenu-user"
          icon={<CoffeeOutlined />}
          title={user && user.name }
          className="ml-auto"
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user">
                Dashboard
              </Link>
            </Item>
            <Item key="/logout" onClick={logout}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
