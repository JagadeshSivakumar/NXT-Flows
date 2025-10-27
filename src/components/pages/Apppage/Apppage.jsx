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
import './Apppage.css'
import Navbar from "../../Navbar/Navbar";
import { FaRobot } from "react-icons/fa";

// Hardcoded data
const HARDCODED_WORKSPACES = [
  { _id: "ws1", name: "Development Team", description: "Main development workspace" },
  { _id: "ws2", name: "Design Projects", description: "All design related work" },
  { _id: "ws3", name: "Marketing", description: "Marketing campaigns and projects" }
];

const HARDCODED_PROJECTS = [
  {
    id: "proj1",
    name: "E-commerce Website",
    description: "Build online shopping platform",
    createdAt: "2024-01-15T10:30:00Z",
    workspaceId: "ws1"
  },
  {
    id: "proj2", 
    name: "Mobile App UI",
    description: "Design mobile application interface",
    createdAt: "2024-01-20T14:45:00Z",
    workspaceId: "ws2"
  },
  {
    id: "proj3",
    name: "Social Media Campaign",
    description: "Q2 marketing campaign planning",
    createdAt: "2024-02-01T09:15:00Z", 
    workspaceId: "ws3"
  },
  {
    id: "proj4",
    name: "API Integration",
    description: "Third-party API integration project",
    createdAt: "2024-02-05T11:20:00Z",
    workspaceId: "ws1"
  },
  {
    id: "proj5",
    name: "Brand Identity",
    description: "Company branding and logo design",
    createdAt: "2024-02-10T16:00:00Z",
    workspaceId: "ws2"
  }
];

// Create option component
const CreateOptionModified = ({ icon: Icon, title, onClick }) => (
  <button onClick={onClick} className="create-option-mod">
    <Icon className="option-icon-mod" />
    <span>{title}</span>
  </button>
);

const Apppage = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const workspaceIdFromQuery = searchParams.get("workspaceId");
  const projectIdFromQuery = searchParams.get("projectId");

  const finalWorkspaceId = workspaceIdFromQuery || projectIdFromQuery || projectId;

  const navigate = useNavigate();

  // Tabs & Filters
  const [activeTabMod, setActiveTabMod] = useState("all");
  const [searchQueryMod, setSearchQueryMod] = useState("");
  const [isTagsOpenMod, setIsTagsOpenMod] = useState(false);
  const [isCreatedByMeCheckedMod, setIsCreatedByMeCheckedMod] = useState(false);

  // Modals
  const [showCreateModalMod, setShowCreateModalMod] = useState(false);
  const [showCreateWorkspaceModalMod, setShowCreateWorkspaceModalMod] = useState(false);
  const [showDeleteModalMod, setShowDeleteModalMod] = useState(false);
  const [showEditModalMod, setShowEditModalMod] = useState(false);

  // Projects
  const [projectsMod, setProjectsMod] = useState(HARDCODED_PROJECTS);
  const [openMenuIdMod, setOpenMenuIdMod] = useState(null);
  const [deleteIdMod, setDeleteIdMod] = useState(null);
  const [editIdMod, setEditIdMod] = useState(null);
  const [editNameMod, setEditNameMod] = useState("");
  const [editDescriptionMod, setEditDescriptionMod] = useState("");

  // Workspace & Project Input Fields
  const [projectNameMod, setProjectNameMod] = useState("");
  const [projectDescriptionMod, setProjectDescriptionMod] = useState("");
  const [workspaceNameMod, setWorkspaceNameMod] = useState("");
  const [workspaceDescriptionMod, setWorkspaceDescriptionMod] = useState("");

  const [currentWorkspaceMod, setCurrentWorkspaceMod] = useState(HARDCODED_WORKSPACES[0]);
  const [availableWorkspacesMod, setAvailableWorkspacesMod] = useState(HARDCODED_WORKSPACES);

  const tagOptionsMod = ["Design", "Development", "Marketing", "Research", "Planning"];

  // Handlers
  const handleCreateProjectMod = async () => {
    if (!projectNameMod.trim()) {
      toast.error("Project name is required");
      return;
    }

    const newProject = {
      id: `proj${projectsMod.length + 1}`,
      name: projectNameMod,
      description: projectDescriptionMod || "New project",
      createdAt: new Date().toISOString(),
      workspaceId: currentWorkspaceMod?._id || "ws1"
    };

    setProjectsMod(prev => [...prev, newProject]);
    setProjectNameMod("");
    setProjectDescriptionMod("");
    setShowCreateModalMod(false);
    toast.success("Project created successfully!");
  };

  const handleDeleteProjectMod = async (id) => {
    setProjectsMod(prev => prev.filter(p => p.id !== id));
    setShowDeleteModalMod(false);
    setDeleteIdMod(null);
    toast.success("Project deleted successfully!");
  };

  const handleSaveEditMod = async () => {
    if (!editNameMod.trim()) {
      toast.error("Project name is required");
      return;
    }

    setProjectsMod(prev =>
      prev.map(p =>
        p.id === editIdMod ? { ...p, name: editNameMod, description: editDescriptionMod } : p
      )
    );
    setShowEditModalMod(false);
    setEditIdMod(null);
    toast.success("Project updated successfully!");
  };

  const handleProjectClickMod = (project) => {
    navigate(`/studionewblank/${project.id}`);
  };

  const filteredProjectsMod = projectsMod.filter(project =>
    project.name.toLowerCase().includes(searchQueryMod.toLowerCase())
  );

  const tabsMod = [
    { id: "all", label: "All", icon: <LayoutGrid className="icon-mod" /> },
    { id: "recent", label: "Recently Viewed", icon: <Clock className="icon-mod" /> },
    { id: "flows", label: "Shared Flows", icon: <Share2 className="icon-mod" /> },
    { id: "projects", label: "Shared Projects", icon: <FolderOpen className="icon-mod" /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isTagsOpenMod) setIsTagsOpenMod(false);
      if (openMenuIdMod) setOpenMenuIdMod(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isTagsOpenMod, openMenuIdMod]);

  return (
    <div className="app-mod">
      <Navbar
        onNewApp={() => setShowCreateWorkspaceModalMod(true)}
        onCreateProject={() => setShowCreateModalMod(true)}
      />
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 10000 }} />

      {/* Tabs & Search */}
      <div className="studio-container-mod">
        <div className="studio-inner-mod">
          <div className="studio-header-mod">
            <div className="left-section-mod">
              {tabsMod.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabMod(tab.id)}
                  className={`tab-button-mod ${activeTabMod === tab.id ? "active-mod" : ""}`}
                >
                  <span className="tab-icon-mod">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="right-section-mod">
              <div
                className="creator-checkbox-mod"
                onClick={() => setIsCreatedByMeCheckedMod(!isCreatedByMeCheckedMod)}
              >
                {isCreatedByMeCheckedMod ? (
                  <MdCheckBox className="icon-mod mr-2-mod" />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank className="icon-mod mr-2-mod" />
                )}
                <span>Created by me</span>
              </div>
              <div className="tag-dropdown-wrapper-mod">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTagsOpenMod(!isTagsOpenMod);
                  }} 
                  className="tag-btn-mod"
                >
                  <Tag className="icon-mod mr-2-mod" />
                  All Tags
                  <ChevronDown className={`icon-mod ml-2-mod ${isTagsOpenMod ? "rotate-mod" : ""}`} />
                </button>
                {isTagsOpenMod && (
                  <div className="tag-dropdown-mod">
                    <button className="tag-option-mod">All Tags</button>
                    {tagOptionsMod.map((tag) => (
                      <button key={tag} className="tag-option-mod">
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="search-wrapper-mod">
                <Search className="search-icon-mod" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQueryMod}
                  onChange={(e) => setSearchQueryMod(e.target.value)}
                  className="search-input-mod"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="content-grid-container-mod">
        <div className="content-grid-mod">
          <div className="grid-card-mod create-app-card-mod">
            <div className="index-header-mod">
              <h1 className="index-title-mod">CREATE APP</h1>
            </div>
            <div className="index-options-mod">
              <CreateOptionModified
                icon={File}
                title="Create from Blank"
                onClick={() => setShowCreateModalMod(true)}
              />
              <CreateOptionModified icon={FileText} title="Create from Template" onClick={() => {}} />
              <CreateOptionModified icon={Import} title="Import DSL file" onClick={() => {}} />
            </div>
          </div>

          {filteredProjectsMod.map((project) => (
            <div
              key={project.id}
              className="grid-card-mod container-card-mod"
              onClick={() => handleProjectClickMod(project)}
              style={{ cursor: "pointer" }}
            >
              <div className="container-content-mod">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <small className="created-at-mod">
                  Created on: {new Date(project.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="container-actions-mod" onClick={(e) => e.stopPropagation()}>
                <div className="dots-container-mod">
                  <button
                    className="dots-button-mod"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuIdMod(openMenuIdMod === project.id ? null : project.id);
                    }}
                  >
                    <HiOutlineDotsHorizontal className="dots-icon-mod" />
                  </button>
                </div>
                {openMenuIdMod === project.id && (
                  <div className="dropdown-menu-mod">
                    <button
                      className="menu-item-mod"
                      onClick={() => {
                        setEditIdMod(project.id);
                        setEditNameMod(project.name);
                        setEditDescriptionMod(project.description);
                        setShowEditModalMod(true);
                        setOpenMenuIdMod(null);
                      }}
                    >
                      Edit Info
                    </button>
                    <button
                      className="menu-item-mod"
                      onClick={() => {
                        setDeleteIdMod(project.id);
                        setShowDeleteModalMod(true);
                        setOpenMenuIdMod(null);
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

      

      {/* Create Project Modal */}
      {showCreateModalMod && (
        <div className="modal-overlay-mod">
          <div className="create-modal-mod">
            <button onClick={() => setShowCreateModalMod(false)} className="close-button-mod">
              <X className="icon-mod" />
            </button>
            <div className="modal-left-mod">
              <div className="modal-header-mod">
                <h3>Create New App</h3>
                {currentWorkspaceMod && (
                  <p className="workspace-info-mod">Workspace: {currentWorkspaceMod.name}</p>
                )}
              </div>
              <div className="modal-body-mod">
                <div className="form-group-mod">
                  <label className="modal-label-mod">App Name</label>
                  <div className="app-input-wrapper-mod">
                    <input
                      type="text"
                      placeholder="Give your App a name"
                      value={projectNameMod}
                      onChange={(e) => setProjectNameMod(e.target.value)}
                      className="modal-input-mod app-input-mod"
                    />
                    <div className="icon-box-mod">
                      <FaRobot className="app-icon-mod" />
                    </div>
                  </div>
                </div>
                <div className="form-group-mod">
                  <label className="modal-label-mod">Description</label>
                  <textarea
                    placeholder="Enter the description of the App"
                    className="modal-textarea-mod"
                    rows={4}
                    value={projectDescriptionMod}
                    onChange={(e) => setProjectDescriptionMod(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer-mod">
                <button onClick={() => setShowCreateModalMod(false)} className="cancel-button-mod">
                  Cancel
                </button>
                <button onClick={handleCreateProjectMod} className="create-button-mod">
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete & Edit Modals */}
      {showDeleteModalMod && (
        <div className="modal-overlay-mod">
          <div className="confirm-modal-mod">
            <div className="modal-content-mod">
              <h3 className="modal-title-mod">Delete this project?</h3>
              <p className="modal-message-mod">This action cannot be undone.</p>
            </div>
            <div className="modal-actions-mod">
              <button className="cancel-btn-mod" onClick={() => setShowDeleteModalMod(false)}>
                Cancel
              </button>
              <button
                className="confirm-btn-mod"
                onClick={() => deleteIdMod && handleDeleteProjectMod(deleteIdMod)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModalMod && (
        <div className="modal-overlay-mod">
          <div className="edit-modal-mod">
            <div className="modal-header-mod">
              <h3>Edit Project Info</h3>
              <button onClick={() => setShowEditModalMod(false)} className="close-button-mod">
                <X className="icon-mod" />
              </button>
            </div>
            <div className="modal-body-mod">
              <div className="form-group-mod">
                <label className="modal-label-mod">Project Name</label>
                <input
                  type="text"
                  className="modal-input-mod"
                  value={editNameMod}
                  onChange={(e) => setEditNameMod(e.target.value)}
                />
              </div>
              <div className="form-group-mod">
                <label className="modal-label-mod">Description</label>
                <textarea
                  className="modal-textarea-mod"
                  rows={4}
                  value={editDescriptionMod}
                  onChange={(e) => setEditDescriptionMod(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer-mod">
              <button onClick={() => setShowEditModalMod(false)} className="cancel-button-mod">
                Cancel
              </button>
              <button onClick={handleSaveEditMod} className="create-button-mod">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apppage;