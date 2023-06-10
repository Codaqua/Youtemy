const LessonContent = ({ lesson }) => {
    return (
        <div>
            <h4>{lesson.title}</h4>
            <h4>{lesson.content }</h4>
            {lesson.videos && lesson.videos.length > 0 ? (
                lesson.videos.map((videoId, index) => (
                <div key={index} className="video-container">
                    <iframe
                    width="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    // frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </div>
                ))
            ) : (
                <p className="no-videos">Sorry!! There is no video available for this lesson :( </p>
            )}




            {/* <div className="video-container">
            {lesson.videos.map((videoId, index) => (
                <div key={index} className="mb-3">
                <iframe
                    width="100%"
                    // height="315"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
                </div>
            ))}
            </div> */}
        </div>
    );
  };
  
  export default LessonContent;