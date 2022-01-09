import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, LabelCallData } from '../../components';

const USER_ID = '24b456';

const headers = {
  'Content-Type': 'application/json',
  user_id: USER_ID,
};

function Labels() {
  const [callData, setCallData] = useState([]);
  useEffect(() => {
    axios
      .get('https://damp-garden-93707.herokuapp.com/getcalllist', {
        headers,
      })
      .then(res => {
        setCallData(res.data.data.call_data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  return (
    <>
      <Navbar />
      {!!callData.length && <LabelCallData data={callData} />}
    </>
  );
}

export default Labels;
