import React, { useState } from 'react';
import './LabelCallData.css';

function LabelCallData(props) {
  const { data } = props;
  const [checked, setChecked] = useState(Array(data.length).fill(false));
  const handleChange = index => {
    let checkedList = [...checked];
    checkedList = checkedList.map((checkedItem, i) =>
      i === index ? !checkedItem : checkedItem,
    );
    setChecked(checkedList);
  };
  const handleSelectAllClick = () => {
    let checkedList = [...checked];
    checkedList = checkedList.map(() => true);
    setChecked(checkedList);
  };
  const allChecked = () => {
    for (let i = 0; i < checked.length; i++) {
      if (!checked[i]) return false;
    }
    return true;
  };

  return (
    <div className="label-container">
      <div className="container">
        <div className="select-all-wrp">
          <input
            type="checkbox"
            onChange={handleSelectAllClick}
            checked={allChecked()}
          />
          Select All
        </div>
        {data.map(({ label_id, call_id }, index) => (
          <div key={call_id} className="label-check-wrp">
            <input
              type="checkbox"
              value={call_id}
              onChange={() => handleChange(index)}
              name={call_id}
              checked={checked[index]}
            />
            <div className="labels-wrp">
              {label_id.map(label => (
                <div className="label-item" key={`${call_id}${label}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LabelCallData;
