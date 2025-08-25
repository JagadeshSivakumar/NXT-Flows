
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onFlowSelect }) => {
  const flows = [
    {
      id: 1,
      name: 'sampletry',
      icon: '🤖',
      description: 'A sample workflow for testing and demonstration purposes. This flow processes basic data transformations.'
    },
    {
      id: 2,
      name: 'multipefry',
      icon: '🔄',
      description: 'A multi-step workflow that handles complex data processing with multiple validation stages.'
    },
    {
      id: 3,
      name: 'api flowstry',
      icon: '🌐',
      description: 'An API-focused workflow that manages external service integrations and data synchronization.'
    }
  ];

  const [selectedFlow, setSelectedFlow] = useState(flows[0]);

  const handleFlowSelect = (flow) => {
    setSelectedFlow(flow);
    onFlowSelect(flow);
  };

  return (
    <div className="sidebar" >
      <div className="sidebar-header">
        <h3>PROJECTS</h3>
        <div style={{marginLeft:"60px"}}>
        <button className="add-button">+</button></div>
      </div>
      
      {flows.map((flow) => (
        <div 
          key={flow.id}
          className={`flow-item ${selectedFlow.id === flow.id ? 'active' : ''}`}
          onClick={() => handleFlowSelect(flow)}
        >
          <div className="flow-icon">{flow.icon}</div>
          <span>{flow.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
