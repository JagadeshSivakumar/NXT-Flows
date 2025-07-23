import React, { useState } from "react";
import { Play, Copy, Expand, Home, Code, Flag, CheckCircle } from "lucide-react";
import { CgOptions } from "react-icons/cg";
import { GoVerified } from "react-icons/go";
import "./Maincontent.css";

const MainContent = ({ selectedFlow }) => {
  const [activeTab, setActiveTab] = useState("run-once");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [detailTab, setDetailTab] = useState("result");

  const data = {
    "sys.user_id": "7c23f049-ed47-4138-837e-6527b23119f4",
    "sys.app_id": "9ba50e48-73c6-4615-b282-99a92404b573",
    "sys.workflow_id": "05dedaad-105b-484e-8089-071b60880766",
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard");
  };

  const handleExpand = () => {
    alert("Expand view clicked");
  };

  const steps = [
    {
      id: 'start',
      name: 'START',
      icon: <Home className="step-icon" />,
      duration: '67.463 ms',
      status: 'success'
    },
    {
      id: 'code',
      name: 'CODE',
      icon: <Code className="step-icon" />,
      duration: '96.533 ms',
      status: 'success'
    },
    {
      id: 'end',
      name: 'END',
      icon: <Flag className="step-icon" />,
      duration: '26.847 ms',
      status: 'success'
    }
  ];
 
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'status-success';
      case 'error':
        return 'status-error';
      default:
        return 'status-default';
    }
  };
 
  const getIconBgColor = (step) => {
    if (step.name === 'START') return 'icon-start';
    if (step.name === 'CODE') return 'icon-code';
    if (step.name === 'END') return 'icon-end';
    return 'icon-default';
  };

  const renderJsonLines = (jsonObj) => {
    return Object.entries(jsonObj).map(([key, value], index) => (
      <div className="workflow-code-line" key={index}>
        <div className="line-number">{index + 1}</div>
        <div className="code-line">
          <span className="json-key">"{key}"</span>
          <span className="json-punctuation">:</span>
          <span className="json-value">"{value}"</span>
          <span className="json-punctuation">,</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="main-content">
      <div className="content-area">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="workflow-header">
            <div className="workflow-info">
              <div className="workflow-icon">{selectedFlow.icon}</div>
              <h2>{selectedFlow.name}</h2>
            </div>
            <div className="workflow-menu">
              <CgOptions />
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "run-once" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("run-once");
                setSelectedHistoryItem(null);
              }}
            >
              Run Once
            </button>
            <button
              className={`tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "run-once" && (
              <div className="controls">
                <button className="clear-button">Clear</button>
                <button className="execute-button">
                  <Play size={16} fill="white" />
                  Execute
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <div className="history-content">
                <div className="history-list">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className="history-item"
                      onClick={() =>
                        setSelectedHistoryItem({
                          status: "passed",
                          timestamp: `2025-07-01 10:0${index}:00`,
                        })
                      }
                    >
                      <div className="history-top">
                        <GoVerified />
                        <span>Test Run: 2025-07-01 10:0{index}:00</span>
                      </div>
                      <span className="status success">Dify · 3 days ago</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {selectedHistoryItem ? (
            <div className="test-details">
              <div className="test-details-header">
                <h1 className="test-details-title">
                  Test Run ({selectedHistoryItem.timestamp})
                </h1>
                <div className="test-details-tabs">
                  {["result", "detail", "tracing"].map((tab) => (
                    <button
                      key={tab}
                      className={`tab-button ${
                        detailTab === tab ? "active" : ""
                      }`}
                      onClick={() => setDetailTab(tab)}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="test-details-content">
                {detailTab === "result" && (
                  <div className="test-result">
                    <div
                      className={`test-result-icon ${selectedHistoryItem.status}`}
                    >
                      {selectedHistoryItem.status === "passed" ? "✓" : "✗"}
                    </div>
                    <div className="test-result-message">
                      Test {selectedHistoryItem.status} successfully
                    </div>
                    <div className="test-result-time">
                      Run completed at {selectedHistoryItem.timestamp}
                    </div>
                  </div>
                )}

                {detailTab === "detail" && (
                  <div className="detail-content">
                    <div className="status-card">
                      <div className="status-item">
                        <div className="status-label">Status</div>
                        <div className="status-value success">● SUCCESS</div>
                      </div>
                      <div className="status-item">
                        <div className="status-label">Elapsed Time</div>
                        <div className="status-value">0.140s</div>
                      </div>
                      <div className="status-item">
                        <div className="status-label">Total Tokens</div>
                        <div className="status-value">0 Tokens</div>
                      </div>
                    </div>

                    {/* INPUT */}
                    <div className="workflow-card">
                      <div className="workflow-headerr">
                        <span className="workflow-title">INPUT</span>
                        <div className="workflow-actions">
                          <button
                            className="workflow-action-btn"
                            onClick={() =>
                              handleCopy(JSON.stringify(data, null, 2))
                            }
                          >
                            <Copy className="workflow-icon" />
                          </button>
                          <button
                            className="workflow-action-btn"
                            onClick={handleExpand}
                          >
                            <Expand className="workflow-icon" />
                          </button>
                        </div>
                      </div>
                      <div className="workflow-content">
                        <div className="workflow-code">
                          <div className="workflow-code-container">
                            {renderJsonLines(data)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* OUTPUT */}
                    <div className="workflow-card">
                      <div className="workflow-headerr">
                        <span className="workflow-title">OUTPUT</span>
                        <div className="workflow-actions">
                          <button
                            className="workflow-action-btn"
                            onClick={() => handleCopy("{}")}
                          >
                            <Copy className="workflow-icon" />
                          </button>
                          <button
                            className="workflow-action-btn"
                            onClick={handleExpand}
                          >
                            <Expand className="workflow-icon" />
                          </button>
                        </div>
                      </div>
                      <div className="workflow-content">
                        <div className="workflow-code workflow-output-content">
                          <div className="workflow-code-container">
                            <div className="workflow-line-numbers">1</div>
                            <div className="workflow-json-punctuation">
                              {"{}"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === "tracing" && (
                  <div className="steps-container">
                    {steps.map((step) => (
                      <div key={step.id} className="step-row">
                        <div className="step-left">
                          <button className="expand-button">
                            <svg className="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                          </button>
                          
                          <div className={`step-icon-container ${getIconBgColor(step)}`}>
                            {step.icon}
                          </div>
                          
                          <span className="step-name">{step.name}</span>
                        </div>
 
                        <div className="step-right">
                          <span className="duration">
                            {step.duration}
                          </span>
                          <CheckCircle className={`status-icon ${getStatusColor(step.status)}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="output-container">
              <div className="json-white-container">
                <div className="process-header">
                  <div className="workflow-iconn">✓</div>
                  <span className="workflow-title">Workflow Process</span>
                </div>
                <div className="json-output-section">
                  <div className="json-box">
                    <div className="section-header">
                      <span className="section-title">JSON OUTPUT</span>
                      <div className="header-actions">
                        <button
                          className="copy-btn"
                          title="Copy"
                          onClick={() => handleCopy("{}")}
                        >
                          📋
                        </button>
                        <button
                          className="expand-btn"
                          title="Expand"
                          onClick={handleExpand}
                        >
                          ⤢
                        </button>
                      </div>
                    </div>
                    <div className="json-content">
                      <div className="json-code">
                        <span className="json-brace">{"{}"}</span>
                      </div>
                    </div>
                    <div className="json-placeholder" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;