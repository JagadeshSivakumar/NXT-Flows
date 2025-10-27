import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Settings, Square, Layers, BookOpen, Plus } from "lucide-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import "./Navbar.css";
import CreateWorkspaceModal from "../Modal/CreateWorkspaceModal";
import axios from "axios";

const API_URL = "http://192.168.1.137:4000";

// Workspace API Services - Updated to use correct endpoints
const getWorkspaces = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/workspaces`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching workspaces:",
      error.response?.data || error.message
    );
    return [];
  }
};

const getProjects = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching projects:",
      error.response?.data || error.message
    );
    return [];
  }
};

const getWorkspaceById = async (workspaceId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching workspace:",
      error.response?.data || error.message
    );
    return null;
  }
};

const Navbar = ({ onNewApp, onCreateWorkspace }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("Flows");
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [containers, setContainers] = useState([]);
  const [currentApp, setCurrentApp] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [showStudioDropdown, setShowStudioDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [isHoveringStudio, setIsHoveringStudio] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Check if we're on the studionewblank page
  const isStudioNewBlankPage = location.pathname.startsWith("/studionewblank/");

  // Load all workspaces for navbar dropdown
  useEffect(() => {
    const loadWorkspaces = async () => {
      const result = await getWorkspaces();
      const formatted = result.map((item) => ({
        id: item._id,
        name: item.name,
        initial: item.name.charAt(0).toUpperCase(),
      }));
      setWorkspaces(formatted);
    };

    const loadProjects = async () => {
      const result = await getProjects();
      const formatted = result.map((item) => ({
        id: item._id,
        name: item.name,
        initial: item.name.charAt(0).toUpperCase(),
      }));
      setProjects(formatted);
    };

    loadWorkspaces();
    loadProjects();
  }, []);

  // Detect current workspace from URL
  useEffect(() => {
    const path = location.pathname;
    const workspaceIdFromParams = searchParams.get("workspaceId");
    let workspaceId = null;

    if (path.startsWith("/studionewblank/") || path.startsWith("/studio/")) {
      workspaceId = path.split("/")[2];
    } else if (workspaceIdFromParams) {
      workspaceId = workspaceIdFromParams;
    }

    if (workspaceId) {
      const workspace = workspaces.find(
        (ws) => ws.id === workspaceId || ws._id === workspaceId
      );
      if (workspace) {
        setCurrentWorkspace(workspace);
      } else {
        getWorkspaceById(workspaceId).then((res) => {
          if (res) {
            setCurrentWorkspace({
              id: res._id,
              name: res.name,
              initial: res.name.charAt(0).toUpperCase(),
            });
          }
        });
      }
    } else {
      setCurrentWorkspace(null);
    }
  }, [location.pathname, searchParams, workspaces]);

  // Detect current app and project
  useEffect(() => {
    const stored = localStorage.getItem("containers");
    const parsed = stored ? JSON.parse(stored) : [];
    setContainers(parsed);

    if (location.pathname.startsWith("/studio/")) {
      const appId = location.pathname.split("/")[2];
      const foundApp = parsed.find((app) => app.id.toString() === appId);
      setCurrentApp(foundApp || null);
      setCurrentProject(null);
    } else if (location.pathname.startsWith("/studionewblank/")) {
      const workspaceId = location.pathname.split("/")[2];
      // Try to find project by workspace ID
      const foundProject = projects.find(
        (project) => project.id === workspaceId
      );
      setCurrentProject(foundProject || null);
      setCurrentApp(null);
    } else {
      setCurrentApp(null);
      setCurrentProject(null);
    }
  }, [location.pathname, projects]);

  // Active tab
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/studio") || path.startsWith("/studionewblank")) {
      setActiveTab("Studio");
    } else if (path.startsWith("/Exploreflow")) {
      setActiveTab("Flows");
    } else if (path.startsWith("/knowledge")) {
      setActiveTab("Knowledge");
    } else if (path.startsWith("/settings")) {
      setActiveTab("Settings");
    } else {
      setActiveTab("Flows");
    }
  }, [location.pathname]);

  const handleAppSelect = (app) => {
    setCurrentApp(app);
    setShowStudioDropdown(false);
    navigate(`/studio/${app.id}`);
  };

  const handleNewApp = () => {
    setShowStudioDropdown(false);
    onNewApp?.();
  };

  // Updated to navigate to studio with workspaceId parameter
  const handleWorkspaceSelect = (workspace) => {
    setCurrentWorkspace(workspace);
    setShowWorkspaceDropdown(false);
    navigate(`/studio?workspaceId=${workspace.id}`);
  };

  const handleStudioWorkspaceSelect = (workspace) => {
    setCurrentWorkspace(workspace);
    setShowStudioDropdown(false);
    navigate(`/studionewblank/${workspace.id}`);
  };

  const handleStudioClick = () => {
    if (
      isHoveringStudio &&
      (currentApp || currentWorkspace || currentProject)
    ) {
      navigate("/studio");
      setCurrentApp(null);
      setCurrentProject(null);
    } else {
      setActiveTab("Studio");
      if (currentApp) navigate(`/studio/${currentApp.id}`);
      else if (currentWorkspace)
        navigate(`/studio?workspaceId=${currentWorkspace.id}`);
      else navigate("/studio");
    }
  };

  const handleCreateWorkspace = async (data) => {
    try {
      if (onCreateWorkspace) await onCreateWorkspace(data);
      const result = await getWorkspaces();
      const formatted = result.map((item) => ({
        id: item._id,
        name: item.name,
        initial: item.name.charAt(0).toUpperCase(),
      }));
      setWorkspaces(formatted);
      setIsWorkspaceModalOpen(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
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
             onBlur={() => setShowWorkspaceDropdown(false)}
             tabIndex={0}
          >
            <div className="workspace-avatar">
              {currentWorkspace?.initial || "W"}
            </div>
            <span className="workspace-name">
              {currentWorkspace?.name || "Workspace"}
            </span>
            <FaChevronDown size={12} />
          </div>

          {showWorkspaceDropdown && (
            <div className="workspace-dropdown">
              <div
                className="dropdown-item new-workspace"
                onClick={() => {
                  setShowWorkspaceDropdown(false);
                  onNewApp?.(); // Trigger Studio's create modal
                }}
              >
                Create Workspace <button className="add-buttons">+</button>
              </div>

              <div className="dropdown-divider" />
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="dropdown-item"
                  onClick={() => handleWorkspaceSelect(workspace)}
                >
                  <div className="workspace-avatar">{workspace.initial}</div>
                  <span>{workspace.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Section */}
     <div className="navbar-center">
  { (location.pathname.startsWith("/studio/") ||
     location.pathname.startsWith("/studionewblank/")) && (
    <div
      className={`nav-item studio-tab ${
        activeTab === "Studio" ? "active" : ""
      }`}
      onClick={handleStudioClick}
      onMouseEnter={() => setIsHoveringStudio(true)}
      onMouseLeave={() => setIsHoveringStudio(false)}
    >
      {isHoveringStudio &&
      (currentApp || currentWorkspace || currentProject) ? (
        <FaArrowLeftLong size={16} />
      ) : (
        <Layers size={16} />
      )}
      <span>Studio</span>

      {/* Show project name when on studionewblank */}
      {isStudioNewBlankPage && currentProject && (
        <>
          <span className="slash">/</span>
          <span className="app-name">{currentProject.name}</span>
        </>
      )}

      {/* Show app name when on studio page */}
      {!isStudioNewBlankPage && currentApp && (
        <>
          <span className="slash">/</span>
          <span className="app-name">{currentApp.name}</span>
        </>
      )}

      {/* <FaChevronDown
        size={14}
        onClick={(e) => {
          e.stopPropagation();
          setShowStudioDropdown(!showStudioDropdown);
        }}
        style={{ cursor: "pointer", marginLeft: "4px" }}
      /> */}
      {/* {showStudioDropdown && (
        <div className="studio-dropdown">
          <div className="dropdown-item new-app" onClick={handleNewApp}>
            <Plus size={14} /> Create from Blank
          </div>

          {projects.length > 0 && (
            <>
              <div className="dropdown-divider" />
              <div className="dropdown-section-header">Projects</div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="dropdown-item"
                  onClick={() => handleStudioWorkspaceSelect(project)}
                >
                  <Layers size={16} />
                  <span>{project.name}</span>
                </div>
              ))}
            </>
          )}

          {workspaces.length === 0 &&
            projects.length === 0 &&
            containers.length === 0 && (
              <div className="dropdown-item empty">
                No workspaces, projects, or apps found
              </div>
            )}
        </div>
      )} */}
    </div>
  )}
</div>


      {/* Right Section */}
      <div className="navbar-right">
        <div className="user-avatar">U</div>
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </nav>
  );
};

export default Navbar;
