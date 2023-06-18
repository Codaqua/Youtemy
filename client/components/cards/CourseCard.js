import { Card, Badge } from "antd";
import Link from "next/link";

const { Meta } = Card;

const CourseCard = ({ course, isLoggedIn }) => {
  console.log("this is course:", course);
  const {
    name,
    tutor,
    image,
    slug,
    university,
    degree,
    year,
    subject,
    lessons,
  } = course;

  const linkHref = isLoggedIn ? `/user/course/${slug}` : `/course/${slug}`;
  return (
    <Link href={linkHref}>
    
      <Card
        className="course-card full-width"
        cover={
          <img
            src={image ? image.Location : "/course.png"}
            alt={name}
            style={{ height: "200px", objectFit: "cover" }}
            className="p-1 course-image"
          />
        }
      >
        <div className="course-content">
        <h2 className="course-title font-weight-bold">
  {name.length > 30 ? `${name.substring(0, 30)}...` : name}
</h2>
          <p style={{ marginBottom: "0px" }}>{lessons.length} lessons</p>
          <p>Created by {tutor && tutor.name}</p>
          <div className="badges">
          <Badge
            count={university}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-2 mr-2"
          />
          <Badge
            count={degree}
            style={{ backgroundColor: "#448ff0" }}
            className="pb-2 mr-2"
          />
          <Badge
            count={year}
            style={{ backgroundColor: "#60ae00" }}
            className="pb-2 mr-2"
          />
          <Badge
            count={subject}
            style={{ backgroundColor: "#4838fb" }}
            className="pb-2 mr-2"
          />
          </div>
        </div>
      </Card>

    </Link>
  );
};

export default CourseCard;
