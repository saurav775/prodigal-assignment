import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RangeSlider.css';

function RangeSlider(props) {
  const { getRange } = props;
  const [range, setRange] = useState({});
  const [formError, setFormError] = useState(false);
  const [rangeValue, setRangeValue] = useState(10);
  useEffect(() => {
    axios
      .get('https://damp-garden-93707.herokuapp.com/getdurationrange')
      .then(rangeResponse => {
        const rangeData = rangeResponse.data.data;
        setRange({ min: rangeData.minimum, max: rangeData.maximum });
        getRange([rangeData.minimum, 10]);
      })
      .catch(err => {
        console.error(err);
        setFormError(true);
      });
  }, []);

  const handleRangeChange = event => {
    const { value } = event.target;
    setRangeValue(value);
    getRange([range.min, parseInt(value)]);
  };
  return (
    <div className="range-slider-wrp">
      {formError ? (
        'Something went wrong... Please check console errors for details.'
      ) : (
        <>
          <label>Call Duration</label>
          <div className="range-value-wrp">
            <input
              type="range"
              min={range.min || 0}
              max={range.max || Number.MAX_SAFE_INTEGER}
              value={rangeValue}
              className="range-slider"
              onChange={handleRangeChange}
            />
            {rangeValue}
          </div>
        </>
      )}
    </div>
  );
}

export default RangeSlider;
