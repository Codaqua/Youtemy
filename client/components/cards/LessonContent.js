// ////////////////////////////////////////////////////////////

// import ReactMarkdown from "react-markdown";

// const LessonContent = ({ lesson }) => {
//     return (
//         <div>
//             <h4>{lesson.title}</h4>
//             <ReactMarkdown>{lesson.content}</ReactMarkdown>
//             {lesson.videos && lesson.videos.length > 0 ? (
//                 lesson.videos.map((videoId, index) => (
//                 <div key={index} className="video-container">
//                     <iframe
//                     width="100%"
//                     src={`https://www.youtube.com/embed/${videoId}`}
//                     // frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     ></iframe>
//                 </div>
//                 ))
//             ) : (
//                 <p className="no-videos">Sorry!! There is no video available for this lesson :( </p>
//             )}
       
//         </div>
//     );
//   };
  
//   export default LessonContent;

  /////////////////////////////////////////////////////////////////////////////
// LAST VERSION THAT WORKED
//   import React, { useState, useEffect } from "react";
//   import axios from "axios";
//   import ReactMarkdown from "react-markdown";
  
//   const LessonContent = ({ lesson }) => {
//     const [videoData, setVideoData] = useState([]);
  
//     useEffect(() => {
//       if (lesson.videos && lesson.videos.length > 0) {
//         const fetchVideoData = async () => {
//           const promises = lesson.videos.map((videoId) =>
//             axios.get(`/api/youtube/${videoId}`)
//           );
//           const results = await Promise.all(promises);
//           const embedHtmls = results.map(
//             (result) => result.data.items[0].player.embedHtml
//           );
//           setVideoData(embedHtmls);
//         };
//         fetchVideoData();
//       }
//     }, [lesson.videos]);
  
//     return (
//       <div>
//         <h4>{lesson.title}</h4>
//         <ReactMarkdown>{lesson.content}</ReactMarkdown>
//         {lesson.videos && lesson.videos.length > 0 ? (
//           videoData.map((embedHtml, index) => (
//             <div
//               key={index}
//               className="video-container"
//               dangerouslySetInnerHTML={{ __html: embedHtml }}
//             />
//           ))
//         ) : (
//           <p className="no-videos">
//             Sorry!! There is no video available for this lesson :(
//           </p>
//         )}
//       </div>
//     );
//   };
  
//   export default LessonContent;


  /////////////////////////////////////////////////////////////////////////////
// LAST LAST THAT WORKED

// import React, { useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";

// const LessonContent = ({ lesson }) => {
// const players = useRef([]);

// useEffect(() => {
//     // Clean up the old player instances if any
//     players.current.forEach((player) => player.destroy());
//     players.current = [];

//     const onYouTubeIframeAPIReady = () => {
//         if (lesson.videos && lesson.videos.length > 0) {
//             lesson.videos.forEach((videoId, index) => {
//             players.current[index] = new window.YT.Player(`player-${index}`, {
//                 videoId,
//                 events: {
//                 onStateChange: (event) => {
//                     onPlayerStateChange(event, index);
//                 },
//                 },
//             });
//             });
//         }
//         };

//         if (!window.YT) {
//         const tag = document.createElement("script");
//         tag.src = "https://www.youtube.com/iframe_api";
//         window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
//         const firstScriptTag = document.getElementsByTagName("script")[0];
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//         } else {
//         onYouTubeIframeAPIReady();
//         }

//         // Clean up the player instances when the component is unmounted or the lesson changes
//         return () => {
//         players.current.forEach((player) => player.destroy());
//         players.current = [];
//         };
//     }, [lesson]);

//     const onPlayerStateChange = (event, index) => {
//         if (event.data === window.YT.PlayerState.PLAYING) {
//         const interval = setInterval(() => {
//             const currentTime = players.current[index].getCurrentTime();
//             const minutes = Math.floor(currentTime / 60);
//             const seconds = Math.floor(currentTime % 60);
//             console.log(`Video ${index + 1}: ${minutes}m ${seconds}s`);
//         }, 1000);
//         event.target.interval = interval;
//         } else {
//         clearInterval(event.target.interval);
//         }
//     };

//     return (
//         <div>
//         <h4>{lesson.title}</h4>
//         <ReactMarkdown>{lesson.content}</ReactMarkdown>
//         {lesson.videos && lesson.videos.length > 0 ? (
//             lesson.videos.map((videoId, index) => (
//             <div key={index} style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: 10 }}>
//                 <div id={`player-${index}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
//                 <iframe
//                     src={`https://www.youtube.com/embed/${videoId}`}
//                     allow="autoplay; encrypted-media"
//                     allowFullScreen
//                     style={{ width: "100%", height: "100%" }}
//                 />
//                 </div>
//             </div>
//             ))
//         ) : (
//             <p className="no-videos">
//             Sorry!! There is no video available for this lesson :(
//             </p>
//         )}
//         </div>
//     );
// };

// export default LessonContent;

/////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const LessonContent = ({ lesson }) => {
    const [videoTitles, setVideoTitles] = useState([]);

    useEffect(() => {
        if (lesson.videos && lesson.videos.length > 0) {
            const fetchVideoTitles = async () => {
                try {
                    const videoIds = lesson.videos.join(",");
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${apiKey}`);
                    console.log("response fetch: ", response);
                    const data = await response.json();
                    console.log("data fetch: ", data);
                    const titles = data.items.map(item => item.snippet.title);
                    setVideoTitles(titles);
                } catch (error) {
                    console.error('Failed to fetch video titles', error);
                }
            };
            fetchVideoTitles();
        }
    }, [lesson]);

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 0,
        },
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            const interval = setInterval(() => {
                const currentTime = event.target.getCurrentTime();
                const minutes = Math.floor(currentTime / 60);
                const seconds = Math.floor(currentTime % 60);
                console.log(`Video is at ${minutes}m ${seconds}s`);
            }, 1000);
            event.target.interval = interval;
        } else {
            clearInterval(event.target.interval);
        }
    };

    return (
        <div>
            <h4>{lesson.title}</h4>

            
            {lesson.videos && lesson.videos.length > 0 ? (
                lesson.videos.map((videoId, index) => (
                    <React.Fragment key={index}>
                        <div className="video-title">
                            {videoTitles[index] && <h5>{videoTitles[index]}</h5>}
                        </div>
                        <div key={index} className="video-container" style={{ marginBottom: '3rem' }}>
                        {/* <div className="video-title">
                            {videoTitles[index] && <h5>{videoTitles[index]}</h5>}
                        </div> */}
                                               
                        <div className='video-youtube'>
                        <YouTube
                            videoId={videoId}
                            opts={opts}
                            onStateChange={onPlayerStateChange}
                        />

                        </div>
                    </div>
                    </React.Fragment>
                ))
            ) : (
                <p className="no-videos">Sorry!! There is no video available for this lesson :( </p>
            )}
        </div>
    );   
};

export default LessonContent;



  /////////////////////////////////////////////////////////////////////////////
//   import React, { useState, useEffect } from "react";
//   import ReactMarkdown from "react-markdown";
  
//   const LessonContent = ({ lesson }) => {
//     const [videoData, setVideoData] = useState(null);
//     const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  
//     useEffect(() => {
//       if (lesson.videos && lesson.videos.length > 0) {
//         // Fetch the first video details from YouTube API
//         const videoId = lesson.videos[0];
//         fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=player&key=${apiKey}`)
//           .then(response => response.json())
//           .then(data => {
//             if (data.items && data.items.length > 0) {
//               setVideoData(data.items[0].player);
//             }
//           })
//           .catch(error => console.error("Error fetching video data:", error));
//       }
//     }, [lesson.videos, apiKey]);
  
//     return (
//       <div>
//         <h4>{lesson.title}</h4>
//         <ReactMarkdown>{lesson.content}</ReactMarkdown>
//         {videoData ? (
//           <div className="video-container" dangerouslySetInnerHTML={{ __html: videoData.embedHtml }} />
//         ) : (
//           <p className="no-videos">Sorry!! There is no video available for this lesson :( </p>
//         )}
//       </div>
//     );
//   };
  
//   export default LessonContent;


  /////////////////////////////////////////////////////////////////////////////

    //    {/* <div className="video-container">
    //         {lesson.videos.map((videoId, index) => (
    //             <div key={index} className="mb-3">
    //             <iframe
    //                 width="100%"
    //                 // height="315"
    //                 height="315"
    //                 src={`https://www.youtube.com/embed/${videoId}`}
    //                 frameBorder="0"
    //                 allowFullScreen
    //             ></iframe>
    //             </div>
    //         ))}
    //         </div> */}