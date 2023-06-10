import { Button } from "antd";

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  handleUrlChange,
  addUrlField,
  uploading,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          placeholder="Title"
          autoFocus
          required
        />

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Content"
        ></textarea>

        {values.videos.map((videoUrl, index) => (
          <div key={index} className="mb-2">
            <input
              type="url"
              className="form-control"
              onChange={(e) => handleUrlChange(e, index)}
              value={videoUrl}
              placeholder="YouTube URL"
              required
            />
          </div>
        ))}

        <Button className="btn btn-outline-dark btn-block mt-2" onClick={addUrlField}>+ Add another video to this lesson</Button>


        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
 