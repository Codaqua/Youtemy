import { useReducer, createContext, useEffect } from "react";

// initial state
const intialState = {
  user: null,
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
    default:
      return state;
  }
};

// context provider
// everything that is wrapped inside the provider (_app) will have access to the state and dispatch (children props)
const Provider = ({ children }) => {
  //use reducer hook
  const [state, dispatch] = useReducer(rootReducer, intialState);

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };