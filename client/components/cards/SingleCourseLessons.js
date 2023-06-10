import { List, Checkbox } from "antd";
const { Item } = List;

const SingleCourseLessons = ({
  lessons,
  setActiveLesson,
  activeLesson,
}) => {
  return (
    <div className="lesson-list">
      {lessons && <h4>{lessons.length} Lessons</h4>}
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
              title={`${index + 1}. ${item.title}`}
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
  
//   return (
//     <div className="container align-left">
//       <div className="row">
//         <div className="col lesson-list">
//           {lessons && <h4>{lessons.length} Lessons</h4>}
//           <hr />
//           <pre>{JSON.stringify(lessons, null, 4)}</pre>
//           <List
//             itemLayout="horizontal"
//             dataSource={lessons}
//             renderItem={(item, index) => (
//               <Item>
//                 <Item.Meta
//                   avatar={
//                     <Checkbox className="custom-checkbox" />
//                   }
//                   title={`${index + 1}. ${item.title}`}
//                 />
//                 {item.video && item.video !== null && item.free_preview && (
//                   <span
//                     className="text-primary pointer"
//                     onClick={() => {
//                       setPreview(item.video.Location);
//                       setShowModal(!showModal);
//                     }}
//                   >
//                     Preview
//                   </span>
//                 )}
//               </Item>
//             )}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };