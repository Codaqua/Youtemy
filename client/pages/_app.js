// import TopNav from "../components/TopNav";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "antd/dist/antd.css";
// import "../public/css/styles.css";

// // TODO: PENDIENTE DESCOMENTAR Y SOLUCIONAR ERROR
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { Provider } from "../context";


// function MyApp({ Component, pageProps }) {
//   return (
//     <Provider>
//     {/* TODO: toast position */}
//     {/* // TODO: PENDIENTE DESCOMENTAR Y SOLUCIONAR ERROR */}
//       <ToastContainer position="top-center" />
//       <TopNav />
//       <Component {...pageProps} />
//     </Provider>
//   );
// }

// export default MyApp;


import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import dynamic from 'next/dynamic';
import "react-toastify/dist/ReactToastify.css";


// Dynamic import with no SSR
const DynamicToastContainer = dynamic(() => import('react-toastify').then((mod) => mod.ToastContainer), { ssr: false });


import { Provider } from "../context";

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <DynamicToastContainer position="top-center" />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
