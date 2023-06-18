
import TopNav from "../components/TopNav";
import Head from 'next/head';
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
       <Head>
       <title>Youtemy - Your Learning Hub</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicToastContainer position="top-center" />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
