import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Clock,
  Share2,
  FolderOpen,
  ChevronDown,
  Search,
  Tag,
  File,
  FileText,
  Import,
  X,
} from "lucide-react";
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Studio.css";
import Navbar from "../../Navbar/Navbar";
import { FaRobot } from "react-icons/fa";
import axios from "axios";
import { Background } from "@xyflow/react";

const API_URL = "http://192.168.1.137:4000";

// Workspace API
export const createWorkspace = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/workspaces`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating workspace:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// Project API Services
export const createProject = async (workspaceId, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/workspaces/${workspaceId}/projects`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating project:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateProject = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/projects/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const deleteProject = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// Create option component
const CreateOption = ({ icon: Icon, title, onClick }) => (
  <button onClick={onClick} className="create-option">
    <Icon className="option-icon" />
    <span>{title}</span>
  </button>
);

const Studio = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const workspaceIdFromQuery = searchParams.get("workspaceId");
  const projectIdFromQuery = searchParams.get("projectId");

  // Priority: workspaceId query > projectId query > URL param
  const finalWorkspaceId = workspaceIdFromQuery || projectIdFromQuery || projectId;

  const navigate = useNavigate();

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isCreatedByMeChecked, setIsCreatedByMeChecked] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Projects
  const [projects, setProjects] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Workspace & Project Input Fields
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");

  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);

  const tagOptions = ["Design", "Development", "Marketing", "Research", "Planning"];

  // Fetch available workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/workspaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableWorkspaces(response.data);
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      }
    };
    fetchWorkspaces();
  }, []);

  // Fetch current workspace details - ONLY if finalWorkspaceId exists
  useEffect(() => {
    const fetchCurrentWorkspace = async () => {
      if (finalWorkspaceId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/workspaces/${finalWorkspaceId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentWorkspace(response.data);
        } catch (error) {
          console.error("Failed to fetch current workspace:", error);
        }
      } else {
        setCurrentWorkspace(null);
      }
    };
    fetchCurrentWorkspace();
  }, [finalWorkspaceId]);

  // Fetch projects for the selected workspace - ONLY if finalWorkspaceId exists
  useEffect(() => {
    if (finalWorkspaceId) {
      fetchProjects();
    } else {
      // If no workspace ID, clear projects or fetch all projects without workspace filter
      fetchAllProjects();
    }
  }, [finalWorkspaceId]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${API_URL}/projects?workspaceId=${finalWorkspaceId}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = response.data.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description || "No description",
        createdAt: item.createdAt,
        workspaceId: item.workspaceId,
      }));

      setProjects(formatted);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      // Don't show toast for workspace not found errors on page load
      if (error.response?.status !== 400) {
        toast.error(error.response?.data?.message || "Failed to fetch projects");
      }
    }
  };

  const fetchAllProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${API_URL}/projects`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = response.data.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description || "No description",
        createdAt: item.createdAt,
        workspaceId: item.workspaceId,
      }));

      setProjects(formatted);
    } catch (error) {
      console.error("Failed to fetch all projects:", error);
    }
  };

  // Handlers - FIXED: Added workspace validation
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    // FIX: Check if we have a valid workspace ID
    let workspaceIdToUse = finalWorkspaceId;
    
    // If no workspace ID from URL/params, use the first available workspace
    if (!workspaceIdToUse && availableWorkspaces.length > 0) {
      workspaceIdToUse = availableWorkspaces[0]._id;
    }
    
    if (!workspaceIdToUse) {
      toast.error("Please create a workspace first");
      return;
    }

    try {
      const payload = {
        name: projectName,
        description: projectDescription || "New project",
      };

      // FIX: Use the validated workspace ID
      const result = await createProject(workspaceIdToUse, payload);

      setProjects((prev) => [
        ...prev,
        {
          id: result._id,
          name: result.name,
          description: result.description,
          createdAt: result.createdAt,
          workspaceId: result.workspaceId,
        },
      ]);

      setProjectName("");
      setProjectDescription("");
      setShowCreateModal(false);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Create project error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to create project");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setShowDeleteModal(false);
      setDeleteId(null);
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await updateProject(editId, { name: editName, description: editDescription });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editId ? { ...p, name: editName, description: editDescription } : p
        )
      );
      setShowEditModal(false);
      setEditId(null);
      toast.success("Project updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update project");
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/Apppage/${project.id}`);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "all", label: "All", icon: <LayoutGrid className="icon" /> },
    { id: "recent", label: "Recently Viewed", icon: <Clock className="icon" /> },
    { id: "flows", label: "Shared Flows", icon: <Share2 className="icon" /> },
    { id: "projects", label: "Shared Projects", icon: <FolderOpen className="icon" /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isTagsOpen) setIsTagsOpen(false);
      if (openMenuId) setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isTagsOpen, openMenuId]);

  return (
    <div className="app">
      <Navbar
        onNewApp={() => setShowCreateWorkspaceModal(true)}
        onCreateProject={() => setShowCreateModal(true)}
      />
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 10000 }} />

      {/* Tabs & Search */}
      <div className="studio-container">
        <div className="studio-inner">
          <div className="studio-header">
            <div className="left-section">
               {tabs.map((tab) => (
  <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className={`tab-buttonn ${activeTab === tab.id ? "active" : ""}`}
  >
    <span className="tab-icon">
      {React.cloneElement(tab.icon, {
        color: activeTab === tab.id ? "#1d4ed8" : "#000",
      })}
    </span>
    {tab.label}
  </button>
))}
            </div>
            <div className="right-section">
              <div
                className="creator-checkbox"
                onClick={() => setIsCreatedByMeChecked(!isCreatedByMeChecked)}
              >
                {isCreatedByMeChecked ? (
                  <MdCheckBox className="icon mr-2" />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank className="icon mr-2" />
                )}
                <span>Created by me</span>
              </div>
              {/* <div className="tag-dropdown-wrapper">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTagsOpen(!isTagsOpen);
                  }} 
                  className="tag-btn"
                >
                  <Tag className="icon mr-2" />
                  All Tags
                  <ChevronDown className={`icon ml-2 ${isTagsOpen ? "rotate" : ""}`} />
                </button>
                {isTagsOpen && (
                  <div className="tag-dropdown">
                    <button className="tag-option">All Tags</button>
                    {tagOptions.map((tag) => (
                      <button key={tag} className="tag-option">
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div> */}
              <div className="search-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="content-grid-container">
        <div className="content-grid">
          <div className="grid-card create-app-card">
            <div className="index-header">
              <h1 className="index-title">CREATE PROJECT</h1>
            </div>
            <div className="index-options">
              <button
              className="add-buttons"
                icon={File}
                title="Create from Blank"
                onClick={() => setShowCreateModal(true)} style={{width:"230px"}}
              >+ Create Project</button>
            </div>
          </div>

          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="grid-card container-card"
              onClick={() => handleProjectClick(project)}
              style={{ cursor: "pointer" }}
            >
              <div className="container-content">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <small className="created-at">
                  Created on: {new Date(project.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="container-actions" onClick={(e) => e.stopPropagation()}>
                <div className="dots-container">
                  <button
                    className="dots-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === project.id ? null : project.id);
                    }}
                  >
                    <HiOutlineDotsHorizontal className="dots-icon" />
                  </button>
                </div>
                {openMenuId === project.id && (
                  <div className="dropdown-menu">
                    <button
                      className="menu-item"
                      onClick={() => {
                        setEditId(project.id);
                        setEditName(project.name);
                        setEditDescription(project.description);
                        setShowEditModal(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Edit Info
                    </button>
                    <button
                      className="menu-item"
                      onClick={() => {
                        setDeleteId(project.id);
                        setShowDeleteModal(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateWorkspaceModal && (
        <div className="modal-overlay">
          <div className="create-modal">
            <button
              onClick={() => setShowCreateWorkspaceModal(false)}
              className="close-button"
            >
              <X className="icon" />
            </button>
            <div className="modal-left">
              <div className="modal-header">
                <h3>Create New Workspace</h3>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-label">Workspace Name</label>
                  <div className="app-input-wrapper">
                    <input
                      type="text"
                      placeholder="Give your workspace a name"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="modal-input app-input"
                    />
                    <div className="icon-box">
                      <FaRobot className="app-icon" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="modal-label">Description</label>
                  <textarea
                    placeholder="Enter the description of the workspace"
                    className="modal-textarea"
                    rows={4}
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setShowCreateWorkspaceModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!workspaceName.trim()) {
                      toast.error("Workspace name is required");
                      return;
                    }

                    try {
                      const payload = {
                        name: workspaceName,
                        description: workspaceDescription || "New workspace",
                      };

                      const result = await createWorkspace(payload);

                      setWorkspaceName("");
                      setWorkspaceDescription("");
                      setShowCreateWorkspaceModal(false);
                      toast.success("Workspace created successfully!");
                      
                      // Optionally navigate to the new workspace
                      navigate(`/studio?workspaceId=${result._id}`);
                    } catch (error) {
                      toast.error(error.message || "Failed to create workspace");
                    }
                  }}
                  className="create-button"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-modal">
            <button onClick={() => setShowCreateModal(false)} className="close-button">
              <X className="icon" />
            </button>
            <div className="modal-left">
              <div className="modal-header">
                <h3>Create New Project</h3>
                {currentWorkspace && (
                  <p className="workspace-info">Workspace: {currentWorkspace.name}</p>
                )}
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-label">Project Name</label>
                  <div className="app-input-wrapper">
                    <input
                      type="text"
                      placeholder="Give your project a name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="modal-input app-input"
                    />
                    <div className="icon-box">
                      <FaRobot className="app-icon" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="modal-label">Description</label>
                  <textarea
                    placeholder="Enter the description of the project"
                    className="modal-textarea"
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowCreateModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={handleCreateProject} className="create-button">
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete & Edit Modals */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-content">
              <h3 className="modal-title">Delete this project?</h3>
              <p className="modal-message">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => deleteId && handleDeleteProject(deleteId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit Project Info</h3>
              <button onClick={() => setShowEditModal(false)} className="close-button">
                <X className="icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="modal-label">Project Name</label>
                <input
                  type="text"
                  className="modal-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="modal-label">Description</label>
                <textarea
                  className="modal-textarea"
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditModal(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="create-button">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studio;