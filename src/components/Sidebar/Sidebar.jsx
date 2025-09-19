import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import CreateProjectModal from "../Modal/CreateProjectModal";

const Sidebar = ({ onFlowSelect }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://192.168.1.137:4000/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        let projectList = [];

        if (Array.isArray(data)) {
          projectList = data;
        } else if (data.projects && Array.isArray(data.projects)) {
          projectList = data.projects;
        } else if (data._id) {
          projectList = [data];
        }

        setProjects(projectList);
        if (projectList.length > 0) setSelectedProject(projectList[0]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    onFlowSelect(project);

    // 👇 Navigate to Studio with projectId
    navigate(`/studio/${project._id}`);
  };

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
    setSelectedProject(newProject);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>PROJECTS</h3>
        <button className="add-buttons" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      </div>

      {Array.isArray(projects) &&
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
        ))}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Sidebar;
