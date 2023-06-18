
import ReactMarkdown from "react-markdown";
import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const LessonContent = ({ lesson, courseName, markLessonCompleted, setNextLessonAsActive }) => {
    const [videoTitles, setVideoTitles] = useState([]);

    useEffect(() => {
        if (lesson.videos && lesson.videos.length > 0) {
            const fetchVideoTitles = async () => {
                try {
                    console.log("This is lesson: ", lesson);
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

    const onPlayerStateChange = (event, videoIndex) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            const interval = setInterval(() => {
                const currentTime = event.target.getCurrentTime();
                const totalTime = event.target.getDuration();
                const remainingTime = totalTime - currentTime;
                const minutes = Math.floor(currentTime / 60);
                const seconds = Math.floor(currentTime % 60);
                console.log(`Video is at ${minutes}m ${seconds}s`);
                console.log(`Remaining time is ${remainingTime}s`);

                if (remainingTime < 60 && videoIndex === lesson.videos.length - 1) {
                    console.log("Last video is about to end, marking as completed");
                    clearInterval(event.target.interval);
                    markLessonCompleted && markLessonCompleted();  
                    setNextLessonAsActive && setNextLessonAsActive();              
                }
            }, 1000);
            event.target.interval = interval;
        } else {
            clearInterval(event.target.interval);
        }
    };
 
    const isUserCoursePage = /^\/user\/course\/.+/.test(window.location.pathname);

    return (
        <div>
            {isUserCoursePage && courseName && (
                <center>
                    <h3 className="jumbotron text-center bg-primary square">{courseName}</h3>
                </center>
            )}
            <h4>{lesson.title}</h4>

            {/* <pre>{JSON.stringify(lesson, null, 4)}</pre> */}

            <div className="video-content">
                {/* here the lesson.content using the markdown */}
                {lesson.content && <ReactMarkdown>{lesson.content}</ReactMarkdown>}
            </div>
            {lesson.videos && lesson.videos.length > 0 ? (
                lesson.videos.map((videoId, index) => (
                    <React.Fragment key={index}>
                        <div className="video-title">
                            {videoTitles[index] && <h5>{videoTitles[index]}</h5>}
                        </div>
                        
                        <div key={index} className="video-container" style={{ marginBottom: '3rem' }}>  
                        <YouTube
                            videoId={videoId}
                            opts={opts}
                            // onStateChange={onPlayerStateChange}
                            onStateChange={(event) => onPlayerStateChange(event, index)}
                        />
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

