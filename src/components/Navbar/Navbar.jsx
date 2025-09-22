import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Settings, Square, Layers, BookOpen } from "lucide-react";
import "./Navbar.css";

const Navbar = ({ onNewApp }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(""); // active tab
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  // Determine active tab from path
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/studio")) setActiveTab("Studio");
    else if (path.startsWith("/exploreflow")) setActiveTab("Explore");
    else if (path.startsWith("/knowledge")) setActiveTab("Knowledge");
    else if (path.startsWith("/tools")) setActiveTab("Tools");
    else setActiveTab(""); // default
  }, [location.pathname]);

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://192.168.1.137:4000/workspaces", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch workspaces");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.workspaces;
        const formatted = list.map((ws) => ({
          id: ws._id,
          name: ws.name || "Unnamed",
          initial: ws.name?.charAt(0).toUpperCase() || "W",
        }));
        setWorkspaces(formatted);
        if (!currentWorkspace && formatted.length > 0) {
          setCurrentWorkspace(formatted[0]);
        }
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleWorkspaceSelect = (workspace) => {
    setCurrentWorkspace(workspace);
    setShowWorkspaceDropdown(false);
  };

  const navTabs = [
    { id: "Explore", label: "Explore", icon: <Layers className="icon" />, path: "/exploreflow" },
    { id: "Studio", label: "Studio", icon: <Square className="icon" />, path: "/studio" },
    { id: "Knowledge", label: "Knowledge", icon: <BookOpen className="icon" />, path: "/knowledge" },
    { id: "Tools", label: "Tools", icon: <Settings className="icon" />, path: "/tools" },
  ];

  const handleNavClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
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
            <div className="workspace-avatar">{currentWorkspace?.initial || "W"}</div>
            <span className="workspace-name">{currentWorkspace?.name || "Workspace"}</span>
            <FaChevronDown className="dropdown-arrow" />
          </div>

          {showWorkspaceDropdown && (
            <div className="workspace-dropdown">
              <div
                className="dropdown-item new-workspace"
                onClick={() => {
                  setShowWorkspaceDropdown(false);
                  onNewApp?.();
                }}
              >
                Create Workspace
                <button className="add-buttons">+</button>
              </div>

              <div className="dropdown-divider" />

              {workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className={`dropdown-item ${
                      currentWorkspace?.id === workspace.id ? "active" : ""
                    }`}
                    onClick={() => handleWorkspaceSelect(workspace)}
                  >
                    <div className="workspace-avatar">{workspace.initial}</div>
                    <span>{workspace.name}</span>
                  </div>
                ))
              ) : (
                <div className="dropdown-item empty">No workspaces found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Section - Tabs */}
      <div className="navbar-center">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-buttonn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleNavClick(tab)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <div className="user-avatar">U</div>
      </div>
    </nav>
  );
};

export default Navbar;
