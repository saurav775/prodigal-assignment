import React from 'react';
import toTitleCase from '../../utils/toTitleCase';
import './CallDataTable.css';

function CallDataTable(props) {
  const { data } = props;
  const rows = Object.keys(data[0]);
  return (
    <div className="container">
      <div className="call-data-container">
        <div className="rows">
          {rows.map(row => (
            <div className="rows-heading" key={row}>
              {toTitleCase(row)}
            </div>
          ))}
        </div>
        {data.map(({ agent_id, call_id, call_time }) => (
          <div className="rows" key={call_id}>
            <div className="row-data">{agent_id}</div>
            <div className="row-data">{call_id}</div>
            <div className="row-data">{call_time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CallDataTable;
