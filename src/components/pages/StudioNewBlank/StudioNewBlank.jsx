import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import AuthorizationModal from "../../Modal/AuthorizationModal";
import { FiCopy as CopyIcon, FiMaximize2 as MaximizeIcon, FiMinimize2 as MinimizeIcon } from 'react-icons/fi';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
} from "@xyflow/react";
import { FaPlusCircle } from "react-icons/fa";
import "@xyflow/react/dist/style.css";
import {  Copy} from "lucide-react";
import { TbSquareRoundedPlus } from "react-icons/tb";
import { FaPlay } from 'react-icons/fa';
import { FaSortDown } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { FaArrowPointer } from "react-icons/fa6";
import { FaRegHand } from "react-icons/fa6";
import { RiExportLine } from "react-icons/ri";
import { SlOrganization } from "react-icons/sl";
import { LuMaximize } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { Info, ChevronDown, Plus } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import {
  MdOutlineDataSaverOff,
  MdOutlineCode,
  MdOutlineLoop,
} from "react-icons/md";
import { VscLayoutMenubar } from "react-icons/vsc";
import { LuGitPullRequest } from "react-icons/lu";
import { GoDatabase } from "react-icons/go";
import { RiWebhookLine, RiTerminalFill } from "react-icons/ri";
import { TbTimelineEventText } from "react-icons/tb";
import { GrTrigger } from "react-icons/gr";
import { CgOptions } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import { BsAlphabetUppercase } from "react-icons/bs";
import { CiPlay1 } from "react-icons/ci";
import { RiMenuFold2Fill } from "react-icons/ri";
import { MdScheduleSend } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import { GoQuestion } from "react-icons/go";
import Navbar from "../../Navbar/Navbar";
import "./StudioNewBlank.css";
import { AiOutlineDelete } from "react-icons/ai";
import ImportCurlModal from "../../Modal/ImportCurlModal";

const menuItems = [
  { title: "Dashboard", icon: LuGitPullRequest, isActive: true },
  { title: "Requests", icon: MdOutlineCode, isActive: false },
  { title: "Database", icon: GoDatabase, isActive: false },
  { title: "Webhook", icon: RiWebhookLine, isActive: false },
];

const iconComponents = {
  LuGitPullRequest,
  MdOutlineCode,
  GoDatabase,
  TbTimelineEventText,
  GrTrigger,
  RiWebhookLine,
  MdOutlineDataSaverOff,
  RiTerminalFill,
  MdOutlineLoop,
};

const LeftPanel = ({ isCollapsed, isPartialExpand, toggleSidebar, onOptionsClick }) => {
  let sidebarClass = "project-sidebar";
  if (isCollapsed) sidebarClass += " collapsed";
  if (isPartialExpand) sidebarClass += " partial-expand";

  return (
    <div className={sidebarClass}>
      {isCollapsed ? (
        <div className="collapsed-sidebar-wrapper">
          <div className="collapsed-project-avatar">
            <BsAlphabetUppercase size={20} />
          </div>
          <div className="collapsed-options-icon" onClick={onOptionsClick}>
            <CgOptions size={20} />
          </div>
          <div className="collapsed-menu-icon" onClick={toggleSidebar}>
            <VscLayoutMenubar size={20} />
          </div>
        </div>
      ) : (
        <>
          <div className="sidebar-header">
            <div className="project-info">
              <div className="project-avatar">
                <BsAlphabetUppercase size={24} />
              </div>
              {!isCollapsed && (
                <div className="project-details">
                  <h2 className="project-name">sampletry</h2>
                  <p className="project-id">PROJECT1</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="project-options-icon">
                <CgOptions size={20} />
              </div>
            )}
          </div>
          <div className="sidebar-content">
            {menuItems.map((item) => (
              <div
                key={item.title}
                className={`menu-button ${item.isActive ? "active" : ""}`}
              >
                <item.icon className="menu-icon" />
                {(isPartialExpand || !isCollapsed) && <span>{item.title}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CustomNode = ({ data, selected }) => {
  const IconComponent = iconComponents[data.icon];
  const isSpecialNode = data.label === "Start" || data.label === "End";

  return (
    <div
      className={`rectangleNode ${selected ? "selected" : ""} ${
        isSpecialNode ? "special-node inline-node" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="customHandle" />
      {isSpecialNode ? (
        <div className="inline-content">
          {IconComponent && <IconComponent size={16} className="inline-icon" />}
          <span className="inline-label">{data.label}</span>
        </div>
      ) : (
        <>
          <div className="nodeIconColumn">
            {IconComponent && <IconComponent size={16} />}
          </div>
          <div className="nodeContentColumn">
            <div className="nodeLabelRow">{data.label}</div>
          </div>
        </>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="customHandle"
      />
    </div>
  );
};

const ConditionNode = ({ data, selected }) => (
  <div className={`conditionNode ${selected ? "selected" : ""}`}>
    <div className="conditionContent">
      <div className="conditionIcon">
        <MdOutlineLoop size={16} />
      </div>
      <div className="conditionText">
        <div className="conditionLabel">{data.label}</div>
      </div>
    </div>
    <Handle type="target" position={Position.Left} className="customHandle" />
    <Handle type="source" position={Position.Right} className="customHandle" />
  </div>
);

const nodeTypes = {
  custom: CustomNode,
  condition: ConditionNode,
};

const HeadersTable = ({ headers, onHeadersChange }) => {
  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    onHeadersChange(newHeaders);
  };

  const addNewRow = () => {
    const newHeaders = [...headers, { key: '', value: '' }];
    onHeadersChange(newHeaders);
  };

  const handleInputClick = (index) => {
    if (index === headers.length - 1) {
      addNewRow();
    }
  };

  const removeRow = (index) => {
    if (headers.length > 1) {
      const newHeaders = headers.filter((_, i) => i !== index);
      onHeadersChange(newHeaders);
    }
  };

  return (
    <div className="compact-headers-container">
      <div className="compact-headers-grid">
        <div className="compact-header">KEY</div>
        <div className="compact-header">VALUE</div>
        
        {headers.map((header, index) => (
          <React.Fragment key={index}>
            <div className="compact-key-input">
              <input
                type="text"
                placeholder="type '/' to insert variable"
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                onClick={() => handleInputClick(index)}
              />
            </div>
            <div className="compact-value-input">
              <input
                type="text"
                placeholder="type '/' to insert variable"
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                onClick={() => handleInputClick(index)}
              />
              {headers.length > 1 && (
                <button
                  className="compact-remove-btn"
                  onClick={() => removeRow(index)}
                  title="Remove row"
                >
                 <AiOutlineDelete size={15}/>
                </button>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ParamsTable = ({ params, onParamsChange }) => {
  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    onParamsChange(newParams);
  };

  const addNewRow = () => {
    const newParams = [...params, { key: '', value: '' }];
    onParamsChange(newParams);
  };

  const handleInputClick = (index) => {
    if (index === params.length - 1) {
      addNewRow();
    }
  };

  const removeRow = (index) => {
    if (params.length > 1) {
      const newParams = params.filter((_, i) => i !== index);
      onParamsChange(newParams);
    }
  };

  return (
    <div className="compact-params-container">
      <div className="compact-params-grid">
        <div className="compact-param">KEY</div>
        <div className="compact-param">VALUE</div>
        
        {params.map((param, index) => (
          <React.Fragment key={index}>
            <div className="compact-key-input">
              <input
                type="text"
                placeholder="type '/' to insert variable"
                value={param.key}
                onChange={(e) => updateParam(index, 'key', e.target.value)}
                onClick={() => handleInputClick(index)}
              />
            </div>
            <div className="compact-value-input">
              <input
                type="text"
                placeholder="type '/' to insert variable"
                value={param.value}
                onChange={(e) => updateParam(index, 'value', e.target.value)}
                onClick={() => handleInputClick(index)}
              />
              {params.length > 1 && (
                <button
                  className="compact-remove-btn"
                  onClick={() => removeRow(index)}
                  title="Remove row"
                >
                 <AiOutlineDelete size={15}/>
                </button>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
const HttpRequestForm = ({ onAddNextStep, requestData, updateRequestData }) => {
  const { method, url, headers, params } = requestData;
  const setMethod = (value) => updateRequestData('method', value);
  const setUrl = (value) => updateRequestData('url', value);
  const setHeaders = (value) => updateRequestData('headers', value);
  const setParams = (value) => updateRequestData('params', value);
  const [bodyType, setBodyType] = useState('none');
  const [formData, setFormData] = useState([{ key: '', type: 'text', value: '' }]);
const [urlEncodedData, setUrlEncodedData] = useState([{ key: '', value: '' }]);
  const [jsonBody, setJsonBody] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
const [rawBody, setRawBody] = useState(''); 
  const [sslVerify, setSslVerify] = useState(true);
  const [retryOnFailure, setRetryOnFailure] = useState(true);
  const [maxRetries, setMaxRetries] = useState(2);
  const [retryInterval, setRetryInterval] = useState(100);
  const [errorHandling, setErrorHandling] = useState('None');
  const [showTimeoutInput, setShowTimeoutInput] = useState(false);
  const [showOutputVariable, setShowOutputVariable] = useState(false);
const [showAuthorizationModal, setShowAuthorizationModal] = useState(false);
const [showImportCurlModal, setShowImportCurlModal] = useState(false);




  const toggleTimeoutInput = () => {
    setShowTimeoutInput(!showTimeoutInput);
  };

  const toggleOutputVariable = () => {
    setShowOutputVariable(prev => !prev);
  };
const updateFormData = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const addFormDataRow = () => {
    setFormData([...formData, { key: '', type: 'text', value: '' }]);
  };

 
  const removeFormDataRow = (index) => {
    if (formData.length > 1) {
      const newFormData = formData.filter((_, i) => i !== index);
      setFormData(newFormData);
    }
  };
    const updateUrlEncodedData = (index, field, value) => {
    const newData = [...urlEncodedData];
    newData[index][field] = value;
    setUrlEncodedData(newData);
  };

  const addUrlEncodedRow = () => {
    setUrlEncodedData([...urlEncodedData, { key: '', value: '' }]);
  };

  const removeUrlEncodedRow = (index) => {
    if (urlEncodedData.length > 1) {
      const newData = urlEncodedData.filter((_, i) => i !== index);
      setUrlEncodedData(newData);
    }
  };

  return (
    <div className="http-request-container">
      <div className="scrollable-content">
        <div className="section">
          <div className="section-header">
            <label className="section-label">API *</label>
            <div className="api-config">
              <span className="auth-info" onClick={() => setShowAuthorizationModal(true)}>
    🔒 Authorization
  </span>
     <span className="import-curl" onClick={() => setShowImportCurlModal(true)}>
  📥 Import from cURL
</span>
            </div>
          </div>
          <div className="api-input-row">
            <select className="method-select" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              placeholder="Enter URL, type '/' insert variable"
              className="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="section">
          <label className="section-label">HEADERS</label>
          <HeadersTable headers={headers} onHeadersChange={setHeaders} />
        </div>

        <div className="section">
          <label className="section-label">PARAMS</label>
          <ParamsTable params={params} onParamsChange={setParams} />
        </div>

        <div className="section">
  <label className="section-label">BODY *</label>
  <div className="body-options">
    <div className="radio-row">
      {['none', 'form-data', 'x-www-form-urlencoded'].map((type) => (
        <label key={type} className="radio-option">
          <input
            type="radio"
            name="bodyType"
            value={type}
            checked={bodyType === type}
            onChange={(e) => setBodyType(e.target.value)}
          />
          {type}
        </label>
      ))}
    </div>
    <div className="radio-row">
      {['JSON', 'raw', 'binary'].map((type) => (
        <label key={type} className="radio-option">
          <input
            type="radio"
            name="bodyType"
            value={type}
            checked={bodyType === type}
            onChange={(e) => setBodyType(e.target.value)}
          />
          {type}
        </label>
      ))}
    </div>
  </div>
  {/* Add this form-data table */}
  {bodyType === 'form-data' && (
    <div className="form-data-table-container">
      <div className="form-data-grid">
        <div className="form-data-header">KEY</div>
        <div className="form-data-header">TYPE</div>
        <div className="form-data-header">VALUE</div>
        
        {formData.map((row, index) => (
          <React.Fragment key={index}>
            <div className="form-data-key-input">
              <input
                type="text"
                placeholder="type '/' to insert variable"
                value={row.key}
                onChange={(e) => updateFormData(index, 'key', e.target.value)}
              />
            </div>
            <div className="form-data-type-select">
              <select
                value={row.type}
                onChange={(e) => updateFormData(index, 'type', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
            </div>
            <div className="form-data-value-input">
              <input
                type={row.type === 'file' ? 'file' : 'text'}
                placeholder={row.type === 'file' ? '' : "type '/' to insert variable"}
                value={row.type === 'file' ? '' : row.value}
                onChange={(e) => updateFormData(index, 'value', e.target.value)}
                onClick={(e) => {
                  // Add new row if this is the last row's value input
                  if (index === formData.length - 1) {
                    addFormDataRow();
                  }
                }}
              />
              <button
                className="form-data-remove-btn"
                onClick={() => removeFormDataRow(index)}
                title="Remove row"
              >
                <AiOutlineDelete size={15}/>
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )}
 
  {bodyType === 'x-www-form-urlencoded' && (
  <div className="form-data-table-container">
    <div className="form-data-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
      {/* Headers - only KEY and VALUE */}
      <div className="form-data-header">KEY</div>
      <div className="form-data-header">VALUE</div>
      
      {/* Rows */}
      {urlEncodedData.map((row, index) => (
        <React.Fragment key={index}>
          {/* Key input */}
          <div className="form-data-key-input">
            <input
              type="text"
              placeholder="type '/' to insert variable"
              value={row.key}
              onChange={(e) => updateUrlEncodedData(index, 'key', e.target.value)}
            />
          </div>
          
          {/* Value input */}
          <div className="form-data-value-input">
            <input
              type="text"
              placeholder="type '/' to insert variable"
              value={row.value}
              onChange={(e) => updateUrlEncodedData(index, 'value', e.target.value)}
              onClick={(e) => {
                // Add new row if this is the last row's value input
                if (index === urlEncodedData.length - 1) {
                  addUrlEncodedRow();
                }
              }}
            />
            <button
              className="form-data-remove-btn"
              onClick={() => removeUrlEncodedRow(index)}
              title="Remove row"
            >
              <AiOutlineDelete size={15}/>
            </button>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
)}
{bodyType === 'JSON' && (
  <div className="json-editor-container">
    <div className="json-editor-header">
      <div className="json-editor-label">JSON</div>
      <div className="json-editor-actions">
        <button 
          className="json-action-btn" 
          onClick={() => navigator.clipboard.writeText(jsonBody)}
          title="Copy JSON"
        >
          <CopyIcon size={16} />
        </button>
        <button 
          className="json-action-btn" 
          onClick={() => setIsMaximized(!isMaximized)}
          title={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? <MinimizeIcon size={16} /> : <MaximizeIcon size={16} />}
        </button>
      </div>
    </div>
    <span className="json-editor-hint">
      Write your prompt word here
    </span>
    <div
      className={`json-textarea ${isMaximized ? 'maximized' : ''}`}
      value={jsonBody}
      onChange={(e) => setJsonBody(e.target.value)}
    />
  </div>
)}
{bodyType === 'raw' && (
  <div className="raw-editor-container">
    <div className="raw-editor-header">
      <div className="raw-editor-label">RAW</div>
      <div className="raw-editor-actions">
        <button 
          className="raw-action-btn" 
          onClick={() => navigator.clipboard.writeText(rawBody)}
          title="Copy RAW"
        >
          <CopyIcon size={16} />
        </button>
        <button 
          className="raw-action-btn" 
          onClick={() => setIsMaximized(!isMaximized)}
          title={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? <MinimizeIcon size={16} /> : <MaximizeIcon size={16} />}
        </button>
      </div>
    </div>
    <span className="raw-editor-hint">
      Write your prompt word here
    </span>
    
  </div>
)}
{bodyType === 'binary' && (
  <div className="binary-editor-container">
    <div className="binary-editor-header">
     
      <span className="binary-editor-hint">
      Set Variable
    </span>
    
    
    </div>
  </div>
)}
</div>

        <div className="section">
          <div className="toggle-row">
            <label className="section-label">VERIFY SSL CERTIFICATE <GoQuestion size={15}/></label>
            <label className="toggle-switch">
              <input type="checkbox" checked={sslVerify} onChange={(e) => setSslVerify(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="section">
          <label className="section-label" onClick={toggleTimeoutInput}>
            TIMEOUT{' '}
            <span className={`toggle-icon ${showTimeoutInput ? 'rotated' : ''}`}>
              {showTimeoutInput ? <FaSortDown size={17} /> : <FaPlay size={8} />}
            </span>
          </label>
          {showTimeoutInput && (
            <div className="timeout-input-container">
              <label>Connection Timeout <span className="timeout-span">Enter connection timeout in seconds</span></label>
              <input type="number" className="timeout-input" placeholder="Enter timeout" />
              <label>Read Timeout <span className="timeout-span">Enter read timeout in seconds</span></label>
              <input type="number" className="timeout-input" placeholder="Enter timeout" />
              <label>Write Timeout <span className="timeout-span">Enter write timeout in seconds</span></label>
              <input type="number" className="timeout-input" placeholder="Enter timeout" />
            </div>
          )}
        </div>

        <div className="section">
          <label className="section-label" onClick={toggleOutputVariable}>
            OUTPUT VARIABLES
            <span className={`toggle-icon ${showOutputVariable ? 'rotated' : ''}`}>
              {showOutputVariable ? <FaSortDown size={17} /> : <FaPlay size={8} />}
            </span>
          </label>

          {showOutputVariable && (
            <div className="output-variables-container">
              <div className="output-variable">
                <label>body <span className="timeout-span">string</span></label>
                <div className="response-content">Response Content</div>
              </div>
              <div className="output-variable">
                <label>body <span className="timeout-span">string</span></label>
                <div className="response-content">Response Content</div>
              </div>
              <div className="output-variable">
                <label>body <span className="timeout-span">string</span></label>
                <div className="response-content">Response Content</div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <div className="toggle-row">
            <label className="section-label">RETRY ON FAILURE</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={retryOnFailure}
                onChange={(e) => setRetryOnFailure(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="retry-settings">
            <div className="setting-row">
              <label className="setting-label">MAX RETRIES</label>
              <div className="slider-group">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                  className="interval-slider"
                />
                <div className="value-display">
                  <span className="value-number">{maxRetries}</span>
                  <span className="unit-text">times</span>
                </div>
              </div>
            </div>

            <div className="setting-row">
              <label className="setting-label">RETRY INTERVAL</label>
              <div className="slider-group">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={retryInterval}
                  onChange={(e) => setRetryInterval(parseInt(e.target.value))}
                  className="interval-slider"
                />
                <div className="value-display">
                  <span className="value-number">{retryInterval}</span>
                  <span className="unit-text">ms</span>
                </div>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-label-with-info">
                <label className="setting-label">ERROR HANDLING</label>
                <Info size={14} className="info-icon" />
              </div>
              <div className="dropdown-wrapper">
                <select 
                  value={errorHandling}
                  onChange={(e) => setErrorHandling(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="None">None</option>
                  <option value="Log">Log</option>
                  <option value="Alert">Alert</option>
                  <option value="Retry">Retry</option>
                </select>
                <ChevronDown size={16} className="dropdown-arrow" />
              </div>
            </div>
          </div>

          <div className="next-step-section">
            <h3 className="next-step-title">NEXT STEP</h3>
            <p className="next-step-description">Add the next step in this workflow</p>
            
            <div className="add-step-row">
              <div className="workflow-icon">
                WF
              </div>
              <button className="add-btn">
                <Plus size={16} />
              </button>
              <span className="add-step-text" onClick={(e) => {
          e.stopPropagation();
          onAddNextStep(e);  // Call the handler here
        }}>SELECT NEXT STEP</span>
            </div>
          </div>
        </div>
        
      </div>

   <AuthorizationModal
  isOpen={showAuthorizationModal}
  onClose={() => setShowAuthorizationModal(false)}
  onSave={(data) => {
    console.log("Authorization saved:", data);
    // You can also update request headers here, if needed
  }}
/>
 {showImportCurlModal && (
  <ImportCurlModal
    isOpen={showImportCurlModal}
    onClose={() => setShowImportCurlModal(false)}
    onSave={(curlData) => {
      // Handle the imported cURL data
      console.log("Imported cURL:", curlData);
      setShowImportCurlModal(false);
    }}
  />
)}
   

    </div>

    
  );
};

const StudioNewBlank = ({
  selectedNode,
  setSelectedNode,
  isSidebarCollapsed,
  toggleSidebar,
  isPartialExpand,
   handleIconClick,
  handleTextClick,
  menuPosition,
  setMenuPosition,
  showConditionMenu,
  setShowConditionMenu
}) => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
 
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const [showFlowContainer, setShowFlowContainer] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      if (!["Start", "End"].includes(node.data.label)) setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );
      if (!data?.label) return;
      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `node-${Date.now()}`,
        type: "custom",
        position,
        data: { label: data.label, icon: data.icon, dot: data.dot || false },
        deletable: true,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  useEffect(() => {
    const stored = localStorage.getItem("containers");
    const parsed = stored ? JSON.parse(stored) : [];
    const found = parsed.find((c) => c.id.toString() === id.toString());
    setApp(found);
  }, [id]);

 
  const addConditionNode = (type) => {
    const position = screenToFlowPosition({ x: 250, y: 300 });
    const newNode = {
      id: `condition-${Date.now()}`,
      type: ["If/Else", "Iteration", "Loop", "Code", "HTTP Request"].includes(type)
        ? "condition"
        : "custom",
      position,
      data: {
        label: type,
        icon: type === "Start"
          ? "LuGitPullRequest"
          : type === "End"
          ? "MdOutlineCode"
          : type === "HTTP Request"
          ? "RiWebhookLine"
          : "MdOutlineLoop",
        condition: type === "If/Else" ? "Add condition..." : "",
      },
      deletable: type !== "Start" && type !== "End",
    };
    setNodes((nds) => [...nds, newNode]);
    setShowConditionMenu(false);
  };

  return (
    <div
      className={`flowDiagramWrapper ${
        isSidebarCollapsed ? "sidebar-hidden" : ""
      }`}
    >
      <div className="flowHeader">
        <div className="flowHeaderLeft" onClick={() => setShowFlowContainer(!showFlowContainer)}>
          <button className="flowHeaderButton">
            <FaArrowPointer size={16} />
          </button>
          <button className="flowHeaderButton">
            <span className="blueIcon"><CiPlay1 size={16} /></span>
            <span className="blueText">Run</span>
            <IoIosTimer size={16} />
            <FaArrowPointer size={16} />
          </button>
          <button className="flowHeaderButton">
            <MdScheduleSend size={16} />
            <span>Schedule</span>
          </button>
          <div className="publishContainer">
            <button className="flowHeaderButton publishButton">
              Publish <IoIosArrowDown />
            </button>
          </div>
          <button className="flowHeaderButton">
            <IoIosTimer size={16} />
          </button>
        </div>
        {showFlowContainer && (
          <div className={`flow-container-overlay ${selectedNode ? "shifted-left" : ""}`}>
            <div className="flow-container">
              <div className="flow-container-header">
                <h3>Flow Container</h3>
                <button 
                  className="close-flow-container" 
                  onClick={() => setShowFlowContainer(false)}
                >
                  <IoMdClose size={20} />
                </button>
              </div>
              <div className="flow-container-content">
                {/* Add your content here */}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        ref={reactFlowWrapper}
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{ flex: 1, height: "100%", position: "relative" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>

        <div className="flowSideMiniPanel">
          <div className="miniPanelRow">
            <FaPlusCircle size={16} />
          </div>
          <div className="miniPanelRow">
            <RiStickyNoteAddLine size={16} />
          </div>
          <div className="miniPanelRow">
            <FaArrowPointer size={16} />
          </div>
          <div className="miniPanelRow">
            <FaRegHand size={16} onClick={handleIconClick} />
          </div>
          <div className="miniPanelRow">
            <RiExportLine size={16} />
          </div>
          <div className="miniPanelRow">
            <SlOrganization size={16} />
          </div>
          <div className="miniPanelRow" onClick={toggleSidebar}>
            <LuMaximize
              size={16}
              style={{
                transform: isSidebarCollapsed
                  ? "rotate(0deg)"
                  : isPartialExpand
                  ? "rotate(90deg)"
                  : "rotate(180deg)",
              }}
            />
          </div>
        </div>

        {showConditionMenu && (
          <>
            <div
              className="conditionMenu"
              style={{
                position: "fixed",
                left: menuPosition.x + 40,
                top: menuPosition.y + 40,
                zIndex: 1000,
              }}
            >
              <div className="menuSearch">
                <CiSearch size={16} />
                <input type="text" placeholder="Search nodes..." />
              </div>
              <div className="menuSection">
                <div className="sectionLabel">Nodes</div>
                <div
                  className="menuItem"
                  onClick={() => addConditionNode("Start")}
                >
                  <MdOutlineCode size={16} />
                  <span>Start</span>
                </div>
                <div
                  className="menuItem"
                  onClick={() => addConditionNode("End")}
                >
                  <MdOutlineCode size={16} />
                  <span>End</span>
                </div>
              </div>
              <div className="menuSection">
                <div className="sectionLabel">Logic</div>
                {["If/Else", "Iteration", "Loop"].map((item) => (
                  <div
                    key={item}
                    className="menuItem"
                    onClick={() => addConditionNode(item)}
                  >
                    <MdOutlineLoop size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="menuSection">
                <div className="sectionLabel">Transform</div>
                <div
                  className="menuItem"
                  onClick={() => addConditionNode("Code")}
                >
                  <MdOutlineCode size={16} />
                  <span>Code</span>
                </div>
              </div>
              <div className="menuSection">
                <div className="sectionLabel">Utilities</div>
                <div
                  className="menuItem"
                  onClick={() => addConditionNode("HTTP Request")}
                >
                  <MdOutlineCode size={16} />
                  <span>HTTP Request</span>
                </div>
              </div>
            </div>
            <div
              className="menuOverlay"
              onClick={() => setShowConditionMenu(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};



const RightPanel = ({ selectedNode, onClose, handleTextClick }) => {
  const isHttpRequestNode = selectedNode?.data?.label === "HTTP Request";
  const nodeTitle = selectedNode?.data?.label || "Node Settings";
  const [activeTab, setActiveTab] = useState('SETTINGS');
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState({
    method: 'GET',
    url: '',
    headers: [{ key: '', value: '' }],
    params: [{ key: '', value: '' }]
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleRunRequest = async () => {
    if (!requestData.url) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const headersObj = {};
      requestData.headers.forEach(header => {
        if (header.key) headersObj[header.key] = header.value;
      });

      let urlWithParams = requestData.url;
      const paramsObj = {};
      requestData.params.forEach(param => {
        if (param.key) paramsObj[param.key] = param.value;
      });

      if (requestData.method === 'GET' && Object.keys(paramsObj).length > 0) {
        const queryString = new URLSearchParams(paramsObj).toString();
        urlWithParams = `${requestData.url}?${queryString}`;
      }

      const response = await fetch(urlWithParams, {
        method: requestData.method,
        headers: headersObj,
      });

      const data = await response.json();
      setResponseData({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        timestamp: new Date().toISOString()
      });
      setActiveTab('LAST RUN');
    } catch (err) {
      setError(err.message);
      setResponseData({
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestData = (field, value) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="rightPanel">
      <div className="panelHeader">
        <div className="header">
          <div className="header-left">
            <div className="iconn">
              {selectedNode?.data?.icon && 
                React.createElement(iconComponents[selectedNode.data.icon], { size: 18 })}
            </div>
            <span className="title">{nodeTitle}</span>
          </div>
          <div className="header-actions">
            <button 
              className="action-btn"
              onClick={handleRunRequest}
              disabled={isLoading}
            >
              {isLoading ? '...' : <CiPlay1 size={20} />}
            </button>
            <button className="action-btn"><TbSquareRoundedPlus size={20}/></button>
            <button className="action-btn"><BsThreeDots size={20}/></button>
            <button className="action-btn" onClick={onClose}>
              <IoMdClose size={20} />
            </button>
          </div>
        </div>

        <div className="description">
          <input 
            type="text" 
            placeholder="Add description..." 
            className="description-input" 
          />
        </div>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'SETTINGS' ? 'active' : ''}`}
            onClick={() => setActiveTab('SETTINGS')}
          >
            SETTINGS
          </button>
          <button 
            className={`tab ${activeTab === 'LAST RUN' ? 'active' : ''}`}
            onClick={() => setActiveTab('LAST RUN')}
          >
            LAST RUN
          </button>
        </div>
      </div>
      <div className="panelContent">
<div className="scrollabe-content">
      <div className="detail-content-renamed">
        {/* SETTINGS TAB CONTENT */}
       {activeTab === 'SETTINGS' && (
            isHttpRequestNode ? (
              <HttpRequestForm 
                onAddNextStep={handleTextClick}
                requestData={requestData}
                updateRequestData={updateRequestData}
              />
            ) : (
            <>
              <label className="label-renamed">Name</label>
              <input
                type="text"
                value={selectedNode?.data?.label || ""}
                className="textInput-renamed"
                readOnly
              />
            </>
          )
        )}

        {/* LAST RUN TAB CONTENT */}
        {activeTab === 'LAST RUN' && (
          <>
            {responseData ? (
              <>
                {/* Status Card */}
                <div className={`status-card-renamed ${
                  responseData.status >= 200 && responseData.status < 300 ? 'success-bg' : 'error-bg'
                }`}>
                  <div className="status-item-renamed">
                    <div className="status-label-renamed">Status</div>
                    <div className={`status-value-renamed ${
                      responseData.status >= 200 && responseData.status < 300 ? 'success' : 'error'
                    }`}>
                      ● {responseData.status >= 200 && responseData.status < 300 ? 'SUCCESS' : 'ERROR'}
                    </div>
                  </div>
                  <div className="status-item-renamed">
                    <div className="status-label-renamed">Status Code</div>
                    <div className="status-value-renamed">{responseData.status}</div>
                  </div>
                  <div className="status-item-renamed">
                    <div className="status-label-renamed">Timestamp</div>
                    <div className="status-value-renamed">
                      {new Date(responseData.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Request Section */}
                <div className="workflow-card-renamed">
                  <div className="workflow-headerr-renamed">
                    <span className="workflow-title-renamed">Input</span>
                    <div className="workflow-actions-renamed">
                      <button
                        className="workflow-action-btn-renamed"
                        onClick={() => handleCopy(JSON.stringify(requestData, null, 2))}
                      >
                        <Copy className="Icon-Copy" size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="workflow-content-renamed">
                    <div className="workflow-code-renamed">
                      <div className="workflow-code-container-renamed">
                        <pre>{JSON.stringify(requestData, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Section */}
                <div className="workflow-card-renamed">
                  <div className="workflow-headerr-renamed">
                    <span className="workflow-title-renamed">RESPONSE</span>
                    <div className="workflow-actions-renamed">
                      <button
                        className="workflow-action-btn-renamed"
                        onClick={() => handleCopy(JSON.stringify(responseData.data, null, 2))}
                      >
                        <Copy className="Icon-Copy" size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="workflow-content-renamed">
                    <div className="workflow-code-renamed workflow-output-content-renamed">
                      <div className="workflow-code-container-renamed">
                        <pre>{JSON.stringify(responseData.data, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Section */}
                <div className="workfloww-card-renamed">
                  <div className="workflow-headerr-renamed">
                    <span className="workflow-title-renamed">METADATA</span>
                  </div>
                  <div className="metadata-content">
                    <div className="metadata-row">
                      <span className="metadata-label">Status</span>
                      <span className="metadata-value success">
                        {responseData.status >= 200 && responseData.status < 300 ? 'SUCCESS' : 'ERROR'}
                      </span>
                    </div>
                    <div className="metadata-row">
                      <span className="metadata-label">Executor</span>
                      <span className="metadata-value">N/A</span>
                    </div>
                    <div className="metadata-row">
                      <span className="metadata-label">Start Time</span>
                      <span className="metadata-value">
                        {new Date(responseData.timestamp).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="metadata-row">
                      <span className="metadata-label">Elapsed Time</span>
                      <span className="metadata-value">0.084s</span>
                    </div>
                    <div className="metadata-row">
                      <span className="metadata-label">Total Tokens</span>
                      <span className="metadata-value">0 Tokens</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data-renamed">No request has been made yet</div>
            )}
          </>
        )}

        {/* Loading and Error States */}
        {isLoading && (
          <div className="loading-renamed">Loading...</div>
        )}

        {error && (
          <div className="error-message-renamed">Error: {error}</div>
        )}
      </div>
      </div>
      </div>
    </div>
  );
};


const OptionsPanel = ({ onClose }) => {
  return (
    <>
      <div className="options-panel-overlay" onClick={onClose} />
      <div className="options-panel">
        <div className="options-panel-content">
          <div className="app-header"></div>
        </div>
      </div>
    </>
  );
};

const FlowBuilder = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPartialExpand, setIsPartialExpand] = useState(false);
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
   const [showConditionMenu, setShowConditionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { id } = useParams();
  const [currentApp, setCurrentApp] = useState(null);
const handleIconClick = (event) => {
  const rect = event.target.getBoundingClientRect();
  setMenuPosition({ 
    x: rect.left, 
    y: rect.top - 150 
  });
  setShowConditionMenu(true);
};

const handleTextClick = (event) => {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  setMenuPosition({
    x: rect.left + rect.width/2 - 100,
    y: rect.top - 400
  });
  setShowConditionMenu(true);
};
  useEffect(() => {
    const stored = localStorage.getItem("containers");
    const parsed = stored ? JSON.parse(stored) : [];
    const found = parsed.find((c) => c.id.toString() === id.toString());
    setCurrentApp(found);
  }, [id]);

  const toggleSidebar = () => {
    if (isSidebarCollapsed) {
      setIsPartialExpand(true);
      setIsSidebarCollapsed(false);
    } else if (isPartialExpand) {
      setIsPartialExpand(false);
      setIsSidebarCollapsed(false);
    } else {
      setIsSidebarCollapsed(true);
      setIsPartialExpand(false);
    }
  };

  const handleAddNextStep = (event) => {
    // You can implement the logic for adding next step here
    // For now, we'll just log the event
    console.log("Add next step clicked", event);
  };

  return (
    <ReactFlowProvider>
      <div className="flowbuilder-wrapper">
        <Navbar />
        <div className="container">
          <LeftPanel
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            onOptionsClick={() => setShowOptionsPanel(true)}
            isPartialExpand={isPartialExpand}
          />
          {currentApp && (
            <StudioNewBlank
              key={currentApp.id}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              isSidebarCollapsed={isSidebarCollapsed}
              toggleSidebar={toggleSidebar}
              isPartialExpand={isPartialExpand}
              handleIconClick={handleIconClick}
        handleTextClick={handleTextClick}
        menuPosition={menuPosition}
        setMenuPosition={setMenuPosition}
        showConditionMenu={showConditionMenu}
        setShowConditionMenu={setShowConditionMenu}

            />
          )}
          {selectedNode && (
            <RightPanel
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
                handleTextClick={handleTextClick}
            />
          )}
          {showOptionsPanel && (
            <OptionsPanel onClose={() => setShowOptionsPanel(false)} />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowBuilder;