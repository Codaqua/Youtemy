import { useRouter } from 'next/router';
import { universities as university, degrees as degree, years as year, subjects as subject } from '../../utils/data';


import { Select, Button, Avatar, Badge } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {

  const router = useRouter(); // Use the useRouter hook

  const handleCancel = () => {
    // Attempt to go back to the previous page
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history is present, navigate to the fallback URL
      router.push('/tutor');
    }
  };


  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="form-group col-md">
              <Select
                style={{ width: "100%" }}
                size="large"
                value={values.university || undefined}
                placeholder="Select a University"
                onChange={(v) => setValues({ ...values, university: v })}
              >
                {university.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="form-group col-md">
              <Select
                style={{ width: "100%" }}
                size="large"
                value={values.degree || undefined}
                placeholder="Select a Degree"
                onChange={(v) => setValues({ ...values, degree: v })}
              >
                {degree.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="form-group col-md-1">
              <Select
                style={{ width: "100%" }}
                size="large"
                value={values.year || undefined}
                placeholder="Select a Year"
                onChange={(v) => setValues({ ...values, year: v })}
              >
                {year.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="form-group col-md">
              <Select
                style={{ width: "100%" }}
                size="large"
                value={values.subject || undefined}
                placeholder="Select a Subject"
                onChange={(v) => setValues({ ...values, subject: v })}
              >
                {subject.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* ********* */}

          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              cols="7"
              rows="7"
              value={values.description}
              placeholder="Course Description"
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-left">
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>

            {preview && (
              <Badge count="X" onClick={handleImageRemove} className="pointer">
                <Avatar width={200} src={preview} />
              </Badge>
            )}

            {editPage && values.image && (
              <Avatar width={200} src={values.image.Location} />
            )}

          </div>

          <div className="row">
            <div className="col d-flex justify-content-center">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary "
                loading={values.loading}
                type="primary"
                size="large"
                shape="round"
              >
                {values.loading ? "Saving..." : "Save & Continue"}
              </Button>
              <Button
                onClick={handleCancel}
                className="btn"
                style={{ backgroundColor: 'orange', marginLeft: '20px' }}
                type="primary"
                size="large"
                shape="round"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
