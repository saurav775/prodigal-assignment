import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LabelCallData.css';

const USER_ID = '24b456';

const headers = {
  'Content-Type': 'application/json',
  user_id: USER_ID,
};

function LabelCallData(props) {
  const { data } = props;
  const [callData, setCallData] = useState(data);
  const [checked, setChecked] = useState(Array(callData.length).fill(false));
  const [newLabel, setNewLabel] = useState('');
  const [newAddedLabels, setNewAddedLabels] = useState([]);
  const [removedLabels, setRemovedLabels] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const atleastOneChecked = () => {
    for (let i = 0; i < checked.length; i++) {
      if (checked[i]) return true;
    }
    return false;
  };

  const getChecked = () => {
    const checkedLabels = [];
    for (let i = 0; i < checked.length; i++) {
      if (checked[i]) checkedLabels.push(callData[i].call_id);
    }
    return checkedLabels;
  };

  const handleNewLabelChange = event => {
    const { value } = event.target;
    setNewLabel(value);
  };

  const handleAddNewLabelClick = () => {
    const newAdded = [...newAddedLabels];
    if (!newAdded.includes(newLabel)) {
      newAdded.push(newLabel);
      setNewAddedLabels(newAdded);
    }
    setNewLabel('');
  };

  const handleRemove = (call_id, label) => {
    let callDataCopied = [...callData];
    let removedLabelsCopied = [...removedLabels];
    removedLabelsCopied.push(label);
    callDataCopied = callDataCopied.map((c, i) => {
      if (c.call_id === call_id) {
        const newLabels = [];
        c.label_id.forEach(lid => {
          if (lid !== label) {
            newLabels.push(lid);
          }
        });
        callDataCopied[i].label_id = newLabels;
      }
      return c;
    });
    setRemovedLabels(removedLabelsCopied);
    setCallData(callDataCopied);
  };

  useEffect(() => {
    if (checked.length && removedLabels.length) {
      let checkedCallData = callData.filter((c, i) => checked[i]);
      checkedCallData.forEach((checkedCalls, i) => {
        const newLabels = [];
        checkedCalls.label_id.forEach(labels => {
          if (!removedLabels.includes(labels)) {
            newLabels.push(labels);
          }
        });
        checkedCalls.label_id = newLabels;
      });
      let callDataCopied = [...callData];
      callDataCopied = callDataCopied.map(c => {
        const getCheckedCall = checkedCallData.filter(
          checkedCall => checkedCall.call_id === c.call_id,
        );
        if (getCheckedCall.length) {
          c.label_id = getCheckedCall[0].label_id;
        }
        return c;
      });
      setCallData(callDataCopied);
    }
  }, [removedLabels, checked]);

  const handleUpdateLabels = () => {
    setLoading(true);
    const labelOps = [];
    !!newAddedLabels.length &&
      newAddedLabels.forEach(newAdded => {
        labelOps.push({
          op: 'add',
          name: newAdded,
        });
      });
    !!removedLabels.length &&
      removedLabels.forEach(removedLabel => {
        labelOps.push({
          op: 'remove',
          name: removedLabel,
        });
      });
    const data = {
      operation: {
        callList: getChecked(),
        label_ops: labelOps,
      },
    };
    axios
      .post('https://damp-garden-93707.herokuapp.com/applyLabels', data, {
        headers,
      })
      .then(res => {
        if (res.data.status_code === 200) {
          window.location.reload();
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <div className="label-container">
      <div className="container">
        <div className="actions">
          <div className="add-wrapper">
            <input
              type="text"
              value={newLabel}
              onChange={handleNewLabelChange}
              placeholder="Add new label..."
            />
            <button type="button" onClick={handleAddNewLabelClick}>
              Add label
            </button>
            <div className="new-label-wrp">
              {!!newAddedLabels.length &&
                newAddedLabels.map((newAddedLabel, index) => (
                  <div
                    className="new-label-text"
                    key={`${newAddedLabel}${index}`}
                  >
                    {newAddedLabel}
                  </div>
                ))}
            </div>
          </div>
          <button
            type="button"
            className="btn-update"
            disabled={!atleastOneChecked()}
            onClick={handleUpdateLabels}
          >
            {loading ? '...' : 'Update Labels'}
          </button>
        </div>
        <div className="select-all-wrp">
          <input
            type="checkbox"
            onChange={handleSelectAllClick}
            checked={allChecked()}
          />
          Select All
        </div>
        {callData.map(({ label_id, call_id }, index) => (
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
                  {checked[index] && (
                    <span onClick={() => handleRemove(call_id, label)}>
                      &times;
                    </span>
                  )}
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
