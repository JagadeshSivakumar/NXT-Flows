import React, { useState,useEffect, useRef, useCallback } from "react";

import { useParams } from "react-router-dom";
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
import { RiStickyNoteAddLine } from "react-icons/ri";
import { FaArrowPointer } from "react-icons/fa6";
import { FaRegHand } from "react-icons/fa6";
import { RiExportLine } from "react-icons/ri";
import { SlOrganization } from "react-icons/sl";
import { LuMaximize } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
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
import Navbar from "../../Navbar/Navbar";
import "./StudioNewBlank.css";
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

const LeftPanel = ({ isCollapsed, isPartialExpand, toggleSidebar,onOptionsClick  }) => {
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
          {/* Add onClick handler here */}
          <div className="collapsed-options-icon" onClick={onOptionsClick}>
            <CgOptions size={20} />
          </div>
          {/* Menu icon at the bottom */}
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
              {!isCollapsed  && (
                <div className="project-details">
                  <h2 className="project-name">sampletry</h2>
                  <p className="project-id">PROJECT1</p>
                </div>
              )}
            </div>
            {!isCollapsed  && (
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
const StudioNewBlank = ({
  selectedNode,
  setSelectedNode,
  isSidebarCollapsed,
  toggleSidebar,
  isPartialExpand,
}) => {
const { id } = useParams();
  const [app, setApp] = useState(null);

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showConditionMenu, setShowConditionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
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
  const handlePlusClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.top - 150 });
    setShowConditionMenu(true);
  };
 
  const addConditionNode = (type) => {
    const position = screenToFlowPosition({ x: 250, y: 300 });
    const newNode = {
      id: `condition-${Date.now()}`,
      type: ["If/Else", "Iteration", "Loop", "Code"].includes(type)
        ? "condition"
        : "custom",
      position,
      data: {
        label: type,
        icon:
          type === "Start"
            ? "LuGitPullRequest"
            : type === "End"
            ? "MdOutlineCode"
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
  <div className="flowHeaderLeft"  onClick={() => setShowFlowContainer(!showFlowContainer)}>
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
      <button 
        className="flowHeaderButton publishButton"
      
      >
        Publish <IoIosArrowDown />
      </button>
      
    </div>
     <button className="flowHeaderButton">
      <IoIosTimer size={16} />
     
    </button>
  </div>
  {/* <div className="flowHeaderRight">
    <div className="savedStatus">Saved 3 min ago</div>
  </div> */}
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
            <FaRegHand size={16} onClick={handlePlusClick} />
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

const RightPanel = ({ selectedNode, onClose }) => (
  <div className="rightPanel">
    <div className="panelHeader">
      <button className="closePanelBtn" onClick={onClose}>
        <IoMdClose size={20} />
      </button>
      <div className="tabs">
        <button className="tabBtn activeTab">General</button>
        <button className="tabBtn">Security</button>
      </div>
    </div>
    <div className="tabContent">
      <label className="label">Name</label>
      <input
        type="text"
        value={selectedNode?.data?.label || ""}
        className="textInput"
        readOnly
      />
    </div>
  </div>
);
const OptionsPanel = ({ onClose }) => {
  return (
    <>
      <div className="options-panel-overlay" onClick={onClose} />
      <div className="options-panel ">
        <div className="options-panel-content">
        <div className="app-header">
          
        </div>

        

       

      
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
  const { id } = useParams();
  const [currentApp, setCurrentApp] = useState(null);

  // Load app data when ID changes
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
              key={currentApp.id} // Important: key forces re-render
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              isSidebarCollapsed={isSidebarCollapsed}
              toggleSidebar={toggleSidebar}
              isPartialExpand={isPartialExpand}
            />
          )}
          {selectedNode && (
            <RightPanel
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
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
