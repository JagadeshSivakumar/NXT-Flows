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
import { useNavigate } from "react-router-dom";
import "./Studio.css";
import Navbar from "../../Navbar/Navbar";

const CreateOption = ({ icon: Icon, title, onClick }) => (
  <button onClick={onClick} className="create-option">
    <Icon className="option-icon" />
    <span>{title}</span>
  </button>
);

const Studio = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isCreatedByMeChecked, setIsCreatedByMeChecked] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [containerName, setContainerName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [containers, setContainers] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("containers");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const tagOptions = ["Design", "Development", "Marketing", "Research", "Planning"];

  useEffect(() => {
    localStorage.setItem("containers", JSON.stringify(containers));
  }, [containers]);

  const handleCreateContainer = () => {
    if (containerName.trim()) {
      const newContainer = {
        id: Date.now(),
        name: containerName,
        project: projectName,
        description: editDescription || "sample flow to test login flow",
        createdAt: new Date().toISOString(),
      };
      setContainers((prev) => [...prev, newContainer]);
      setContainerName("");
      setProjectName("");
      setEditDescription("");
      setShowCreateModal(false);
    }
  };

  const handleDeleteContainer = (id) => {
    setContainers((prev) => prev.filter((container) => container.id !== id));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleSaveEdit = () => {
    setContainers((prev) =>
      prev.map((container) =>
        container.id === editId
          ? { ...container, name: editName, description: editDescription }
          : container
      )
    );
    setShowEditModal(false);
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

      <div className="studio-container">
        <div className="studio-inner">
          <div className="studio-header">
            <div className="left-section">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-buttonn ${
                    activeTab === tab.id ? "active" : ""
                  }`}
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
                <button
                  onClick={() => setIsTagsOpen(!isTagsOpen)}
                  className="tag-btn"
                >
                  <Tag className="icon mr-2" />
                  All Tags
                  <ChevronDown
                    className={`icon ml-2 ${isTagsOpen ? "rotate" : ""}`}
                  />
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

      <div className="content-grid-container">
        <div className="content-grid">
          <div className="grid-card create-app-card">
            <div className="index-header">
              <h1 className="index-title">CREATE APP</h1>
            </div>
            <div className="index-options">
              <CreateOption
                icon={File}
                title="Create from Blank"
                onClick={() => setShowCreateModal(true)}
              />
              <CreateOption
                icon={FileText}
                title="Create from Template"
                onClick={() => {}}
              />
              <CreateOption
                icon={Import}
                title="Import DSL file"
                onClick={() => {}}
              />
            </div>
          </div>

          {containers.map((container) => (
            <div
              key={container.id}
              className="grid-card container-card"
              onClick={() => navigate(`/studio/${container.id}`)}
              onMouseLeave={() => setOpenMenuId(null)}
              style={{ cursor: "pointer" }}
            >
              <div className="container-content">
                <h3>{container.name}</h3>
                {container.project && (
                  <p className="project-name">Project: {container.project}</p>
                )}
                <p>{container.description}</p>
                <small className="created-at">
                  Created on: {new Date(container.createdAt).toLocaleString()}
                </small>
              </div>
              <div
                className="container-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="dots-container">
                  <button
                    className="dots-button"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === container.id ? null : container.id
                      )
                    }
                  >
                    <HiOutlineDotsHorizontal className="dots-icon" />
                  </button>
                </div>
                {openMenuId === container.id && (
                  <div className="dropdown-menu">
                    <button
                      className="menu-item"
                      onClick={() => {
                        setEditId(container.id);
                        setEditName(container.name);
                        setEditDescription(container.description);
                        setShowEditModal(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Edit Info
                    </button>
                    <button className="menu-item">Duplicate</button>
                    <button className="menu-item">Export DSL</button>
                    <button className="menu-item">Open in Explore</button>
                    <button
                      className="menu-item"
                      onClick={() => {
                        setDeleteId(container.id);
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

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-modal">
            <button
              onClick={() => setShowCreateModal(false)}
              className="close-button"
            >
              <X className="icon" />
            </button>
            <div className="modal-left">
              <div className="modal-header">
                <h3>Create From Blank</h3>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-label">Project Name</label>
                  <input
                    type="text"
                    placeholder="Give your project a name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="form-group">
                  <label className="modal-label">App Name</label>
                  <input
                    type="text"
                    placeholder="Give your app a name"
                    value={containerName}
                    onChange={(e) => setContainerName(e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="form-group">
                  <label className="modal-label">Description</label>
                  <textarea
                    placeholder="Enter the description of the app"
                    className="modal-textarea"
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContainer}
                  className="create-button"
                >
                  Create
                </button>
              </div>
            </div>
            <div className="modal-right"></div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-content">
              <h3 className="modal-title">Delete this app?</h3>
              <p className="modal-message">
                Deleting the app is irreversible. Users will no longer
                <br />
                be able to access your app, and all prompt
                <br />
                configurations and logs will be permanently
                <br />
                deleted.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  handleDeleteContainer(deleteId);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlayy">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit App Info</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="close-buttonn"
              >
                <X className="icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="modal-label">App Name</label>
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
              <button
                onClick={() => setShowEditModal(false)}
                className="cancel-button"
              >
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