/**
 *
 * Home
 *
 */

import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import makeSelectHome from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  Navbar,
  MultiSelectSearch,
  RangeSlider,
  CallDataTable,
} from '../../components';

import './Home.css';

export function Home() {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });

  const [selectedAgents, setSelectedAgents] = useState([]);
  const [range, setRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [callData, setCallData] = useState([]);

  const handleSearchClick = () => {
    setLoading(true);
    const data = {
      info: {
        filter_agent_list: selectedAgents,
        filter_time_range: range,
      },
    };
    axios
      .post('https://damp-garden-93707.herokuapp.com/getfilteredcalls', data)
      .then(res => {
        setLoading(false);
        setCallData(res.data.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="container">
          <div className="filter-btn-wrp">
            <div className="filters">
              <MultiSelectSearch
                getSelectedAgents={selectedAgentsData =>
                  setSelectedAgents(selectedAgentsData)
                }
              />
              <RangeSlider getRange={rangeData => setRange(rangeData)} />
            </div>
            <button
              type="button"
              className="btn-search"
              disabled={!selectedAgents.length || !range.length}
              onClick={handleSearchClick}
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
          {!!callData.length && <CallDataTable data={callData} />}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Home);
