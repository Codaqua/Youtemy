import SingleCourse from "../../pages/course/[slug]";
import { Badge, Modal, Button } from "antd";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";


const SingleCourseJumbotron = ({
  course,
  loading,
  user,
  handleEnrollment,
  enrolled,
  setEnrolled,
}) => {
  // destructure
  const { name, tutor, description, university, degree, year, subject, image, lessons, createdAt, updatedAt } = course;

  return (
    <div className="jumbotron bg-primary square">
      {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
      <div className="row">

        <div className="col-md-4">
          {/* // TODO : ADD POINTER
          // className="pointer" */}
          {/* show image preview */}
          
          {/* styles.css */}
          <div className="image-container">
            {lessons[0].video && lessons[0].video.Location ? (
              <img
                src={image ? image.Location : "/course.png"}
                alt={name}
                onClick={() => setPreview(lessons[0].video.Location)}
              />
            ) : (
              <img
                src={image ? image.Location : "/course.png"}
                alt={name}
              />
            )}
          </div>
            {/* enroll button */}
          {/* <p>
            Show enroll button
          </p> */}

        </div>


        <div className="col-md-8">
          {/* title */}
          <h1 className="text-light font-weight-bold">{name}</h1>
          {/* author */}
          <p className="lead">
            {/* // TODO : Apply in rest of the cases to avoid undefined */}
            {tutor ? `Created by ${tutor.name}` : 'No Author'}
          </p>  
          {/* university */}
          <Badge
            count={university}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-4 mr-2"
          />
          {/* degree */}
          <Badge  
            count={degree}
            style={{ backgroundColor: "#03a9f4" }}  
            className="pb-4 mr-2" 
          />
          {/* year */}
          <Badge
            count={year}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-4 mr-2"
          />

          {/* subject */}
          <Badge
            count={subject}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-4 mr-2"
          />
          

      
          {/* description */}
          <p>
            {description && description.substring(0, 160)}...
          </p>
          {/* createdAt */}  {/* updatedAt */}
          <p className="text-light">
            Created: {new Date(createdAt).toLocaleDateString()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     
            Last updated: {new Date(updatedAt).toLocaleDateString()}
          </p>

          {/* enroll button */}
          {loading ? (
            <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <Button
              className="mb-3 mt-3 button-enroll"
              type="danger"
              block
              shape="round"
              icon={<SafetyOutlined />}
              size="large"
              disabled={loading}
              onClick={handleEnrollment}
            >
              {user
                ? enrolled.status
                  ? "Go to course"
                  : "Enroll"
                : "Login to enroll"}
            </Button>
          )}

        </div>       
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
