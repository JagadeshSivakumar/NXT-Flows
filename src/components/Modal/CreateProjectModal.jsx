import React from "react";
import "./CreateProjectModal.css";

const CreateProjectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay">
      <div className="create-modal-container">
        <h2>Create From Blank</h2>

        <div className="create-modal-form-group">
          <label>Project Name</label>
          <input type="text" placeholder="Give your project a name" />
        </div>

        <div className="create-modal-form-group">
          <label>App Name & Icon</label>
          <input type="text" placeholder="Give your app a name" />
        </div>

        <div className="create-modal-form-group">
          <label>Description</label>
          <textarea placeholder="Enter the description of the app"></textarea>
        </div>

        <div className="create-modal-actions">
          <button className="create-modal-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="create-modal-create-btn">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
