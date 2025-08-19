import React from "react";
import "./PublishPopup.css";


const PublishPopup = ({ onClose }) => {
  return (
    <div className="publish-overlay" >
      <div className="publish-container">
        {/* Header */}
        <div className="publish-header">
          <h4>Current Draft Unpublished</h4>
          <button className="publish-close" onClick={onClose}>✖</button>
        </div>

        {/* Body */}
        <div className="publish-body">
          <p className="publish-status">Auto-Saved · a few seconds ago</p>
          <button className="publish-update">Publish Update</button>

          <div className="publish-options">
            <button disabled>Run App</button>
            <button disabled>Embed Into Site</button>
            <button disabled>Open in Explore</button>
            <button disabled>Access API Reference</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPopup;
