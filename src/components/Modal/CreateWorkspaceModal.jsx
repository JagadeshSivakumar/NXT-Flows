import React, { useState } from "react";
import "./CreateWorkspaceModal.css";

const CreateWorkspaceModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, description });
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="cwm-overlay">
      <div className="cwm-container">
        <h2 className="cwm-title">Create New Workspace</h2>

        <form onSubmit={handleSubmit}>
          <label className="cwm-label">Workspace Name</label>
          <input
            type="text"
            placeholder="Give your workspace a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="cwm-input"
          />

          <label className="cwm-label">Description</label>
          <textarea
            placeholder="Enter the description of the workspace"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="cwm-textarea"
          />

          <div className="cwm-actions">
            <button type="button" onClick={onClose} className="cwm-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="cwm-btn-create">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
