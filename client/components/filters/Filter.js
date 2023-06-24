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
    // console.log('Updated Filters:', updatedFilters); 
      dispatch({
        type: "UPDATE_FILTERS",
        payload: { ...state.filters, [filterType]: value },
      });
    };
  
    return (
      <div className="filter-container">
              <label htmlFor={`filter-${filterType}`} className="hidden-label">
        {filterType}
      </label>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder={`Select ${filterType}`}
        optionFilterProp="children"
        onChange={handleFilterChange}
        className="filter-style"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        id={`filter-${filterType}`}
        aria-label={filterType}
      >
        {/* <Option value="all">All</Option> */}
        {options.map((option, index) => (
          <Option key={index} value={option} className="filter-style-2">
            {option}
          </Option>
        ))}
      </Select>
          </div>
    );
  };
  
  export default Filter;