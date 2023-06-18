import { List, Checkbox } from "antd";
const { Item } = List;
import { PlayCircleOutlined } from '@ant-design/icons';

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
              avatar={<PlayCircleOutlined  className="custom-checkbox" />}
              title={`${index + 1}. ${item.title.substring(0, 100)}`}
            />
          </Item>
        )}
      />
    </div>
  );
};
  
  export default SingleCourseLessons;
  
