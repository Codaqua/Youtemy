import { Card, Badge } from "antd";
import Link from "next/link";


const { Meta } = Card;

const CourseCard = ({ course }) => {
  console.log('this is course:', course);
  const { name, tutor, image, slug, university, degree, year, subject } = course;
  return (
    <Link href={`/course/${slug}`}>  
        <Card
          className="mb-4"
          cover={
            <img
              src={image.Location}
              alt={name}
              style={{ height: "200px", objectFit: "cover" }}
              className="p-1"
            />
          }
        >
          <h2 className="font-weight-bold">{name}</h2>
          <p>by {tutor.name}</p>
          <Badge
            count={university}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-2 mr-2"
          /> 
            <Badge
            count={degree}
            style={{ backgroundColor: "blue" }}
            className="pb-2 mr-2"
          /> 
            <Badge
            count={year}
            style={{ backgroundColor: "red" }}
            className="pb-2 mr-2"
          /> 
            <Badge
            count={subject}
            style={{ backgroundColor: "grey" }}
            className="pb-2 mr-2"
          /> 

        </Card>
    </Link>
  );
};

export default CourseCard;
