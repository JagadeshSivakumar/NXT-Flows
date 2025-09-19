import React, { useState } from "react";
import "./CreateProjectModal.css";

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
const handleCreate = async () => {
  if (!appName.trim()) {
    alert("App Name is required!");
    return;
  }

  setLoading(true);
  try {
    const token = localStorage.getItem("token"); // ✅ read token from storage

    const response = await fetch("http://192.168.1.137:4000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ attach token
      },
      body: JSON.stringify({
        name: appName,
        description: description,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      onProjectCreated(data);
      onClose();
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    alert("Failed to create project.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="create-modal-overlay">
      <div className="create-modal-container">
        <h2>Create From Blank</h2>

        <div className="create-modal-form-group">
          <label>App Name & Icon</label>
          <input
            type="text"
            placeholder="Give your app a name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
        </div>

        <div className="create-modal-form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter the description of the app"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="create-modal-actions">
          <button className="create-modal-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="create-modal-create-btn"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
