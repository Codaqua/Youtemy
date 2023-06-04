import { Select, Button, Avatar } from "antd";

const { Option } = Select;

const university = ["UOC", "UPM", "UPB", "Oviedo", "UNED"];

const degree = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Geology", "Engineering", "Architecture", "Business", "Economics", "Law", "Medicine", "Nursing", "Pharmacy", "Psychology", "Education", "Philosophy", "History", "Geography", "Literature", "Languages", "Arts", "Music", "Sports", "Other"];

const year = ["1º", "2º", "3º", "4º", "5º", "6º", "Master", "Other"];

const subject = ["Algebra", "Analysis", "Geometry", "Statistics", "Probability", "Calculus", "Differential Equations", "Numerical Analysis", "Linear Algebra", "Discrete Mathematics", "Logic", "Topology", "Complex Analysis", "Functional Analysis", "Differential Geometry", "Algebraic Geometry", "Combinatorics", "Graph Theory", "Number Theory", "Set Theory", "Mathematical Physics", "Mathematical Chemistry", "Mathematical Biology", "Mathematical Economics", "Mathematical Finance", "Mathematical Psychology", "Mathematical Sociology", "Mathematical Statistics", "Mathematical Optimization", "Operations Research", "Game Theory", "Control Theory", "Information Theory", "Coding Theory", "Cryptography", "Mathematical Logic", "Mathematical Analysis", "Mathematical Modeling", "Mathematical Programming", "Mathematical Software", "Mathematical Education", "Other"];


const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
}) => {
  return (
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

        {preview && <Avatar width={200} src={preview} />}
      </div>

      <div className="row">
        <div className="col">
          <Button
            onClick={handleSubmit}
            disabled={values.loading || values.uploading}
            className="btn btn-primary"
            loading={values.loading}
            type="primary"
            size="large"
            shape="round"
          >
            {values.loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourseCreateForm;
