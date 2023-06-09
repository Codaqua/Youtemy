import { Button } from "antd";


const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  handleUrlChange,
  addUrlField,
  removeUrlField,
  handleRemoveVideo,
  uploading,
  extractVideoId,
  buildYouTubeUrl,
}) => {

  return (
    <div className="container pt-3">
      {/* {JSON.stringify(current)} */}
      <form onSubmit={handleUpdateLesson}>
      <input 
          type="text"
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          placeholder="Title"
          autoFocus
          required
        />

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
          placeholder="Content"
        ></textarea> 

        {/* {current.videos.map((videoUrl, index) => (
          <div key={index} className="mb-2">
            <input
              type="url"
              className="form-control"
              onChange={(e) => handleUrlChange(e, index)}
              value={videoUrl}
              placeholder="YouTube URL"
              required
            />
            <Button className="btn btn-outline-danger btn-sm mt-2" onClick={() => removeUrlField(index)}>- Remove this video</Button>
          </div>
        ))} */}


        {current.videos && current.videos.map((videoUrl, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              className="form-control"
              // onChange={(e) => handleUrlChange(e, index)}
              onChange={(e) => {
                const videoId = extractVideoId(e.target.value);
                if (videoId) {
                  const updatedVideos = [...current.videos];
                  updatedVideos[index] = videoId;
                  setCurrent({ ...current, videos: updatedVideos });
              }
            }}
              value={videoUrl}
              placeholder="YouTube URL"
              required
            />
            {videoUrl && (
              <img 
                // src={`https://img.youtube.com/vi/${extractVideoId(videoUrl)}/0.jpg`}
                // src={`https://img.youtube.com/vi/${buildYouTubeUrl(videoUrl)}/default.jpg`}
                // src={`https://img.youtube.com/vi/${videoUrl}/0.jpg`}
                src={buildYouTubeUrl(videoUrl)}
                alt="YouTube Thumbnail"
                className="img-thumbnail mt-2"
              />
            )}
            <Button className="btn btn-outline-danger btn-sm mt-2" onClick={() => handleRemoveVideo(index)}>- Remove this video</Button>
            
          </div>
        ))}

        <Button className="btn btn-outline-dark btn-block mt-2" onClick={addUrlField}>+ Add another video to this lesson</Button>



        <Button
          onClick={handleUpdateLesson}
          className="col mt-3"
          size="large"
          type="primary"
          // TODO : DISABLE UPLOADING
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default UpdateLessonForm;
