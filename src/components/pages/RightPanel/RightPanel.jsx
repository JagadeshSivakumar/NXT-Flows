import React, { useState } from 'react';
import './RightPanel.css';

const IfCondition = () => {
  const [steps, setSteps] = useState([
    {
      id: '1',
      type: 'condition',
      title: 'IF/ELSE',
      description: 'Add description...',
      conditions: [],
      actions: { if: [], else: [] }
    }
  ]);

  const addCondition = (stepId) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { ...step, conditions: [...(step.conditions || []), 'New Condition'] }
        : step
    ));
  };

  const addAction = (stepId, branch) => {
    setSteps(steps.map(step => 
      step.id === stepId && step.actions
        ? { 
            ...step, 
            actions: { 
              ...step.actions, 
              [branch]: [...step.actions[branch], 'SELECT NEXT STEP'] 
            }
          }
        : step
    ));
  };

  return (
    <div className="workflow-container">
      <div className="workflow-wrapper">
        {/* Header */}
        <div className="workflow-header">
          <div className="header-left">
            <div className="header-icon">
              <span>IF</span>
            </div>
            <h1>IF/ELSE</h1>
          </div>
          <div className="header-actions">
            <button className="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
            </button>
            <button className="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
            <button className="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="description-section">
          <input 
            type="text" 
            placeholder="Add description..." 
            className="description-input"
          />
        </div>

        {/* Tabs */}
        <div className="tabs-section">
          <button className="tab active">SETTINGS</button>
          <button className="tab">LAST RUN</button>
        </div>

        {/* Workflow Steps */}
        <div className="steps-container">
          {steps.map((step) => (
            <div key={step.id} className="step-group">
              {/* IF Section */}
              <div className="card">
                <div className="card-content">
                  <div className="section-header">
                    <div className="section-badge if-badge">IF</div>
                    <button 
                      className="add-condition-btn"
                      onClick={() => addCondition(step.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Condition
                    </button>
                  </div>

                  <div className="elif-section">
                    <button className="elif-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      ELIF
                    </button>
                  </div>
                </div>
              </div>

              {/* ELSE Section */}
              <div className="card">
                <div className="card-content">
                  <div className="section-badge else-badge">ELSE</div>
                  <p className="else-description">
                    Used to define the logic that should be executed when the if condition is not met.
                  </p>
                </div>
              </div>

              {/* Next Step Section */}
              <div className="card">
                <div className="card-content">
                  <div className="next-step-header">
                    <h3>NEXT STEP</h3>
                    <p>Add the next step in this workflow</p>
                  </div>

                  <div className="branches-container">
                    {/* IF Branch */}
                    <div className="branch-row">
                      <div className="branch-icon if-icon">IF</div>
                      <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                      <button 
                        className="select-step-btn"
                        onClick={() => addAction(step.id, 'if')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        SELECT NEXT STEP
                      </button>
                    </div>

                    {/* ELSE Branch */}
                    <div className="branch-row">
                      <div className="branch-icon else-icon">ELSE</div>
                      <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                      <button 
                        className="select-step-btn"
                        onClick={() => addAction(step.id, 'else')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        SELECT NEXT STEP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IfCondition;
