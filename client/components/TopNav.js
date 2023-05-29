import { useState, useEffect, useContext  } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  HomeOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const { Item, SubMenu } = Menu;

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
          icon={<CoffeeOutlined />}
          title={user && user.name }
          className="ml-auto"
        >
          <Item onClick={logout} className="ml-auto">
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};



//   return (
//     <Menu mode="horizontal">
//       <Item
//         key="/"
//         onClick={(e) => setCurrent(e.key)}
//         icon={<HomeOutlined />}
//       >
//         <Link href="/">
//           Home
//         </Link>
//       </Item>

//       <Item
//         key="/login"
//         onClick={(e) => setCurrent(e.key)}
//         icon={<LoginOutlined />}
//       >
//         <Link href="/login">
//         Login
//         </Link>
//       </Item>

//       <Item
//         key="/register"
//         onClick={(e) => setCurrent(e.key)}
//         icon={<UserAddOutlined />}
//       >
//         <Link href="/register">
//         Sign up
//         </Link>
//       </Item>

//       <Item 
//         key="/logout"
//         onClick={logout} 
//         icon={<LogoutOutlined />} 
//         className="ml-auto"
//       >
//         Logout
//       </Item>

//     </Menu>
//   );
// };

export default TopNav;