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

/* ======================
   ✅ API SERVICES
====================== */
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

export const getProjects = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

/* ======================
   ✅ CREATE OPTION BUTTON
====================== */
const CreateOption = ({ icon: Icon, title, onClick }) => (
  <button onClick={onClick} className="create-option">
    <Icon className="option-icon" />
    <span>{title}</span>
  </button>
);

const Studio = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isCreatedByMeChecked, setIsCreatedByMeChecked] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");

  const [projects, setProjects] = useState([]);

  const tagOptions = ["Design", "Development", "Marketing", "Research", "Planning"];

  /* ======================
     ✅ FETCH PROJECTS
  ====================== */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const result = await getProjects();
      const formatted = result.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description || "No description",
        createdAt: p.createdAt,
      }));
      setProjects(formatted);
    } catch (error) {
      toast.error(error.message || "Failed to fetch projects");
    }
  };

  /* ======================
     ✅ CREATE WORKSPACE
  ====================== */
  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return;
    try {
      const payload = {
        name: workspaceName,
        description: workspaceDescription || "New workspace",
        projectId,
      };
      await createWorkspace(payload);

      setWorkspaceName("");
      setWorkspaceDescription("");
      setShowCreateModal(false);
      toast.success("Workspace created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create workspace");
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

      {/* Tabs + Search */}
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

              {/* Tag Dropdown */}
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

              {/* Search */}
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

      {/* Create Workspace Card */}
      <div className="content-grid-container">
        <div className="content-grid">
          <div className="grid-card create-app-card">
            <div className="index-header">
              <h1 className="index-title">CREATE WORKSPACE</h1>
            </div>
            <div className="index-options">
              <CreateOption
                icon={File}
                title="Create from Blank"
                onClick={() => setShowCreateModal(true)}
              />
              <CreateOption icon={FileText} title="Create from Template" onClick={() => {}} />
              <CreateOption icon={Import} title="Import DSL file" onClick={() => {}} />
            </div>
          </div>
          {/* Project Grid */}
      
        
        
          {projects.map((p) => (
            <div
              key={p.id}
              className="grid-card container-card"
              onClick={() => navigate(`/studionewblank/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="container-content">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <small className="created-at">
                  Created on: {new Date(p.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
        
        
     

      </div>

      
      {/* Create Workspace Modal */}
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
    </div>
  );
};

export default Studio;
