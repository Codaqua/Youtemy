import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// initial state
const intialState = {
  user: null,
  // *******************
  filters: {},
};

// create context
const Context = createContext();

// root reducer - update state, get data from the state
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    // *******************
    case "UPDATE_FILTERS":
      return { ...state, filters: action.payload };
    default:
      return state;
  }
};

// context provider

const Provider = ({ children }) => {
  //use reducer hook
  const [state, dispatch] = useReducer(rootReducer, intialState);

  // router
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  // Axios. Interceptors to handling expired toke / cookies
  axios.interceptors.response.use(
    function (response) {

      // to trigger
      return response;
    },
    function (error) {

      // to trigger
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("/401 error > logout");
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERR", err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      axios.defaults.headers.common["X-CSRF-Token"] = data.csrfToken;

    };
    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
