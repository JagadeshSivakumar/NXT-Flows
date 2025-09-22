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
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Studio.css";
import Navbar from "../../Navbar/Navbar";
import { FaRobot } from "react-icons/fa";
import axios from "axios";

const API_URL = "http://192.168.1.137:4000";

// ✅ Workspace API Services
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

export const getWorkspacesByProject = async (projectId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/workspaces?projectId=${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching workspaces:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateWorkspace = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/workspaces/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating workspace:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const deleteWorkspace = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/workspaces/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting workspace:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// ✅ Create option component
const CreateOption = ({ icon: Icon, title, onClick }) => (
  <button onClick={onClick} className="create-option">
    <Icon className="option-icon" />
    <span>{title}</span>
  </button>
);

const Studio = () => {
  const { projectId } = useParams(); // ✅ Get projectId from URL
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isCreatedByMeChecked, setIsCreatedByMeChecked] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const tagOptions = ["Design", "Development", "Marketing", "Research", "Planning"];

  useEffect(() => {
    fetchWorkspaces();
  }, [projectId]); // fetch whenever projectId changes

  const fetchWorkspaces = async () => {
    try {
      const result = await getWorkspacesByProject(projectId);
      const formatted = result.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description || "No description",
        createdAt: item.createdAt,
      }));
      setWorkspaces(formatted);
    } catch (error) {
      toast.error(error.message || "Failed to fetch workspaces");
    }
  };

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return;

    try {
      const payload = {
        name: workspaceName,
        description: workspaceDescription || "New workspace",
        projectId, // link workspace to current project
      };
      const result = await createWorkspace(payload);

      setWorkspaces((prev) => [
        ...prev,
        {
          id: result._id,
          name: result.name,
          description: result.description,
          createdAt: result.createdAt,
        },
      ]);

      setWorkspaceName("");
      setWorkspaceDescription("");
      setShowCreateModal(false);
      toast.success("Workspace created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create workspace");
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await deleteWorkspace(id);
      setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
      setShowDeleteModal(false);
      setDeleteId(null);
      toast.success("Workspace deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete workspace");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        name: editName,
        description: editDescription,
      };
      await updateWorkspace(editId, payload);
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.id === editId ? { ...ws, name: editName, description: editDescription } : ws
        )
      );
      setShowEditModal(false);
      toast.success("Workspace updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update workspace");
    }
  };

  const tabs = [
    { id: "all", label: "All", icon: <LayoutGrid className="icon" /> },
    { id: "recent", label: "Recently Viewed", icon: <Clock className="icon" /> },
    { id: "flows", label: "Shared Flows", icon: <Share2 className="icon" /> },
    { id: "projects", label: "Shared Projects", icon: <FolderOpen className="icon" /> },
  ];

  return (
    <div className="app">
      <Navbar onNewApp={() => setShowCreateModal(true)} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Tabs and Search */}
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
                  <span className="tab-icon">{tab.icon}</span>
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
              <div className="tag-dropdown-wrapper">
                <button onClick={() => setIsTagsOpen(!isTagsOpen)} className="tag-btn">
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
              </div>
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

      {/* Workspace Grid */}
      <div className="content-grid-container">
        <div className="content-grid">
          <div className="grid-card create-app-card">
            <div className="index-header">
              <h1 className="index-title">CREATE WORKSPACE</h1>
            </div>
            <div className="index-options">
              <CreateOption icon={File} title="Create from Blank" onClick={() => setShowCreateModal(true)} />
              <CreateOption icon={FileText} title="Create from Template" onClick={() => {}} />
              <CreateOption icon={Import} title="Import DSL file" onClick={() => {}} />
            </div>
          </div>

          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="grid-card container-card"
              onClick={() => navigate(`/studionewblank/${ws.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="container-content">
                <h3>{ws.name}</h3>
                <p>{ws.description}</p>
                <small className="created-at">
                  Created on: {new Date(ws.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="container-actions" onClick={(e) => e.stopPropagation()}>
                <div className="dots-container">
                  <button
                    className="dots-button"
                    onClick={() => setOpenMenuId(openMenuId === ws.id ? null : ws.id)}
                  >
                    <HiOutlineDotsHorizontal className="dots-icon" />
                  </button>
                </div>
                {openMenuId === ws.id && (
                  <div className="dropdown-menu">
                    <button
                      className="menu-item"
                      onClick={() => {
                        setEditId(ws.id);
                        setEditName(ws.name);
                        setEditDescription(ws.description);
                        setShowEditModal(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Edit Info
                    </button>
                    <button
                      className="menu-item"
                      onClick={() => {
                        setDeleteId(ws.id);
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-modal">
            <button onClick={() => setShowCreateModal(false)} className="close-button">
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
                <button onClick={() => setShowCreateModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={handleCreateWorkspace} className="create-button">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-content">
              <h3 className="modal-title">Delete this workspace?</h3>
              <p className="modal-message">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  if (deleteId) handleDeleteWorkspace(deleteId);
                  else toast.error("Invalid workspace ID");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlayy">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit Workspace Info</h3>
              <button onClick={() => setShowEditModal(false)} className="close-buttonn">
                <X className="icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="modal-label">Workspace Name</label>
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
              <button
                onClick={() => {
                  if (editId) handleSaveEdit();
                  else toast.error("Invalid workspace ID");
                }}
                className="create-button"
              >
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
