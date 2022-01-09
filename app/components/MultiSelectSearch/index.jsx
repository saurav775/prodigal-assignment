import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MultiSelectSearch.css';

function MultiSelectSearch() {
  const [agents, setAgents] = useState([]);
  const [agentName, setAgentName] = useState('');
  const [formError, setFormError] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [dropdownIsOpen, setDropdown] = useState(false);

  useEffect(() => {
    axios
      .get('https://damp-garden-93707.herokuapp.com/getlistofagents')
      .then(agentsList => {
        setAgents(agentsList.data.data.listofagents);
      })
      .catch(err => {
        setFormError(true);
        console.error(err);
      });
  }, []);

  //filtering agents as per agent name input value
  useEffect(() => {
    if (!agentName) setFilteredAgents([]);
    else {
      if (agents.length) {
        let filterAgents = agents.filter(agent =>
          agent.toLowerCase().startsWith(agentName.toLowerCase()),
        );
        filterAgents = filterAgents.filter(
          filterAgent => !selectedAgents.includes(filterAgent),
        );
        setFilteredAgents(filterAgents);
        setDropdown(true);
      }
    }
  }, [agentName]);

  const handleChange = event => {
    const { value } = event.target;
    setAgentName(value);
  };

  const handleFilteredAgentsClick = (event, filterAgent) => {
    let selected = [...selectedAgents];
    if (selected.includes(filterAgent)) {
      // filtering if already existed
      selected = selected.filter(
        selectedAgent => selectedAgent !== filterAgent,
      );
    } else {
      selected.push(filterAgent);
    }
    setSelectedAgents(selected);
    setDropdown(false);
    setAgentName('');
  };

  const handleRemoveSelected = (event, selectedAgent) => {
    let selected = [...selectedAgents];
    selected = selected.filter(s => s !== selectedAgent);
    setSelectedAgents(selected);
  };

  return (
    <div className="multiselect-wrp">
      {formError ? (
        'Something went wrong... Please check console errors for details.'
      ) : (
        <>
          <div className="input-wrp">
            <input
              type="text"
              value={agentName}
              placeholder="Search Agents..."
              onChange={handleChange}
            />
            <i className="fa fa-search" />
          </div>
          {!!filteredAgents.length && dropdownIsOpen && (
            <div className="dropdown-container">
              <ul className="options-wrp">
                {filteredAgents.map(filterAgent => (
                  <li
                    onClick={e => handleFilteredAgentsClick(e, filterAgent)}
                    key={filterAgent}
                  >
                    {filterAgent}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="selected-agent-wrp">
            {!!selectedAgents.length &&
              selectedAgents.map(selectedAgent => (
                <div className="selected-agent" key={selectedAgent}>
                  {selectedAgent}
                  <div onClick={e => handleRemoveSelected(e, selectedAgent)}>
                    &times;
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MultiSelectSearch;
