import { Select } from "antd";
import { useContext } from "react";
import { Context } from "../../context";

const { Option } = Select;

const Filter = ({ filterType, options }) => {
    const { state, dispatch } = useContext(Context);
  
    const handleFilterChange = (value) => {
      dispatch({
        type: "UPDATE_FILTERS",
        payload: { ...state.filters, [filterType]: value },
      });
    };
  
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder={`Select ${filterType}`}
        optionFilterProp="children"
        onChange={handleFilterChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {options.map((option, index) => (
          <Option key={index} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    );
  };
  
  export default Filter;