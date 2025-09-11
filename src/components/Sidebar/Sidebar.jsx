import React, { useState } from 'react';
import './Sidebar.css';
import CreateProjectModal from '../Modal/CreateProjectModal';  // ✅ correct import

const Sidebar = ({ onFlowSelect }) => {
  const flows = [
    { id: 1, name: 'sampletry', icon: '🤖' },
    { id: 2, name: 'multipefry', icon: '🔄' },
    { id: 3, name: 'api flowstry', icon: '🌐' }
  ];

  const [selectedFlow, setSelectedFlow] = useState(flows[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFlowSelect = (flow) => {
    setSelectedFlow(flow);
    onFlowSelect(flow);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>PROJECTS</h3>
        <button
          className="add-buttons"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
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

      {/* ✅ Render Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
