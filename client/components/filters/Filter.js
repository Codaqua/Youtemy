import { Select } from "antd";
import { useContext } from "react";
import { Context } from "../../context";

const { Option } = Select;

const Filter = ({ filterType, options }) => {
    const { state, dispatch } = useContext(Context);
  
    const handleFilterChange = (value) => {
    const updatedFilters = { ...state.filters };
    
    if (value === "all") {
      delete updatedFilters[filterType];
    } else {
      updatedFilters[filterType] = value;
    }
    console.log('Updated Filters:', updatedFilters); 
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
        {/* <Option value="all">All</Option> */}
        {options.map((option, index) => (
          <Option key={index} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    );
  };
  
  export default Filter;