import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import CreateProjectModal from "../Modal/CreateProjectModal";

const Sidebar = ({ onFlowSelect }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch existing projects when Sidebar loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ token here
        if (!token) {
          alert("No token provided");
          return;
        }

        const res = await fetch("http://192.168.1.137:4000/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const data = await res.json();

        // ✅ Backend returns an array (your example)
        let projectList = [];
        if (Array.isArray(data)) {
          projectList = data;
        } else if (data.projects && Array.isArray(data.projects)) {
          projectList = data.projects;
        } else if (data._id) {
          projectList = [data]; // single object → wrap in array
        }

        setProjects(projectList);

        // auto-select first project
        if (projectList.length > 0) {
          setSelectedProject(projectList[0]);
          onFlowSelect && onFlowSelect(projectList[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // fallback
      }
    };

    fetchProjects();
  }, [onFlowSelect]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    onFlowSelect && onFlowSelect(project);
  };

  // ✅ When new project is created
  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
    setSelectedProject(newProject);
    onFlowSelect && onFlowSelect(newProject);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>PROJECTS</h3>
        <button className="add-buttons" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="no-projects">No projects available</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id || project.id}
            className={`flow-item ${
              selectedProject?._id === project._id ? "active" : ""
            }`}
            onClick={() => handleProjectSelect(project)}
          >
            <div className="flow-icon"></div>
            <span>{project.name}</span>
          </div>
        ))
      )}

      {/* ✅ Modal with callback */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Sidebar;
