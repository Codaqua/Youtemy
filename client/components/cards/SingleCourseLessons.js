import { List, Checkbox } from "antd";
const { Item } = List;

const SingleCourseLessons = ({
  lessons,
  setActiveLesson,
  activeLesson,
}) => { 
  return (
    <div className="lesson-list">
      {lessons && <h4>{lessons.length} Lessonsa</h4>}
      <hr /> 
      <List
        itemLayout="horizontal"
        dataSource={lessons}
        renderItem={(item, index) => (
          <Item
            onClick={() => setActiveLesson(item)}
            className={`lesson-item ${
              item === activeLesson ? "active-lesson" : ""
            }`}
          >
            <Item.Meta
              avatar={<Checkbox className="custom-checkbox" />}
              title={`${index + 1}. ${item.title.substring(0, 100)}`}
            />
          </Item>
        )}
      />
      {/* <style jsx>{`
        .lesson-item { 
          cursor: pointer;
        }
        .active-lesson {
          background-color: #f8f9fa;
        }
      `}</style> */}
    </div>
  );
};
  
  export default SingleCourseLessons;
  
