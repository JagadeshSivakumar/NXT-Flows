import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Settings,
  Square,
  Layers,
  BookOpen,
  Plus,
} from "lucide-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({
  onNewApp,
  workspaces = [],
  currentWorkspace,
  handleWorkspaceSelect,
  onCreateWorkspace, // 🔹 New callback for creating workspace
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Flows");
  const [containers, setContainers] = useState([]);
  const [currentApp, setCurrentApp] = useState(null);
  const [showStudioDropdown, setShowStudioDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [isHoveringStudio, setIsHoveringStudio] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("containers");
    const parsed = stored ? JSON.parse(stored) : [];
    setContainers(parsed);

    // Set current app based on URL if we're in studio
    if (location.pathname.startsWith("/studio/")) {
      const appId = location.pathname.split("/")[2];
      const foundApp = parsed.find((app) => app.id.toString() === appId);
      if (foundApp) setCurrentApp(foundApp);
    }
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/studio")) setActiveTab("Studio");
    else if (path.startsWith("/Exploreflow")) setActiveTab("Flows");
    else if (path.startsWith("/knowledge")) setActiveTab("Knowledge");
    else if (path.startsWith("/settings")) setActiveTab("Settings");
    else setActiveTab("Flows");
  }, [location.pathname]);

  const handleAppSelect = (app) => {
    setCurrentApp(app);
    setShowStudioDropdown(false);
    navigate(`/studio/${app.id}`, { replace: true });
  };

  const handleNewApp = () => {
    setShowStudioDropdown(false);
    onNewApp?.();
  };

  const handleStudioClick = () => {
    if (isHoveringStudio && currentApp) {
      navigate(-1);
      setCurrentApp(null);
    } else {
      setActiveTab("Studio");
      navigate(currentApp ? `/studio/${currentApp.id}` : "/studio");
    }
  };

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <div className="logo">Flows</div>
        <div className="separator">/</div>

        {/* Workspace Selector */}
        <div className="workspace-selector-container">
          <div
            className="workspace-selector"
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
          >
            <div className="workspace-avatar">
              {currentWorkspace?.initial || "W"}
            </div>
            <span className="workspace-name">
              {currentWorkspace?.name || "Workspace"}
            </span>
            <FaChevronDown size={14} className="dropdown-arrow" />
          </div>

          {showWorkspaceDropdown && (
            <div className="workspace-dropdown">
              {/* Create Workspace option */}
              <div
                className="dropdown-item new-workspace"
                onClick={() => {
                  setShowWorkspaceDropdown(false);
                  onCreateWorkspace?.(); // 🔹 Call parent callback
                }}
                style={{fontSize:"13px"}}
              >
                
                Create Workspace
              </div>

              {/* Divider */}
              <div className="dropdown-divider" />

              {/* List of Workspaces */}
              {workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className={`dropdown-item ${
                      currentWorkspace?.id === workspace.id ? "active" : ""
                    }`}
                    onClick={() => {
                      handleWorkspaceSelect(workspace);
                      setShowWorkspaceDropdown(false);
                    }}
                  >
                    <div className="workspace-avatar"style={{fontSize:"13px"}}>{workspace.initial}</div>
                    <span>{workspace.name}</span>
                  </div>
                ))
              ) : (
                <div className="dropdown-item empty"style={{fontSize:"13px"}}>No workspaces found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <div
          className={`nav-item ${activeTab === "Flows" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Flows");
            navigate("/Exploreflow");
          }}
        >
          <Square size={16} />
          <span>Explore</span>
        </div>

        <div
          className={`nav-item studio-tab ${activeTab === "Studio" ? "active" : ""}`}
          onClick={handleStudioClick}
          onMouseEnter={() => setIsHoveringStudio(true)}
          onMouseLeave={() => setIsHoveringStudio(false)}
        >
          {isHoveringStudio && currentApp ? (
            <FaArrowLeftLong size={16} />
          ) : (
            <Layers size={16} />
          )}
          <span>Studio</span>
          {currentApp && <span className="slash">/</span>}
          {currentApp && <span className="app-name">{currentApp.name}</span>}

          <FaChevronDown
            className="dropdown-toggle-icon"
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              setShowStudioDropdown(!showStudioDropdown);
            }}
            style={{ cursor: "pointer", marginLeft: "4px" }}
          />

          {/* Studio Dropdown */}
          {showStudioDropdown && (
            <div className="studio-dropdown">
              {/* Create from Blank */}
              <div
                className="dropdown-item new-app"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewApp();
                }}
              >
                <Plus size={14} className="plus-icon" />
                Create from Blank
              </div>

              {/* Divider */}
              <div className="dropdown-divider" />

              {/* Existing apps */}
              {containers.map((container) => (
                <div
                  key={container.id}
                  className={`dropdown-item ${
                    currentApp?.id === container.id ? "active" : ""
                  }`}
                  onClick={() => handleAppSelect(container)}
                >
                  <Layers size={16} className="app-icon" />
                  <span>{container.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`nav-item ${activeTab === "Knowledge" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Knowledge");
            navigate("/knowledge");
          }}
        >
          <BookOpen size={16} />
          <span>Knowledge</span>
        </div>

        <div
          className={`nav-item ${activeTab === "Settings" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Settings");
            navigate("/settings");
          }}
        >
          <Settings size={16} />
          <span>Tools</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <div className="user-avatar">U</div>
      </div>
    </nav>
  );
};

export default Navbar;
