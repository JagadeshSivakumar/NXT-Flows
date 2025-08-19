// TimerPopup.jsx
import React from "react";
import "./TimerPopup.css";

const TimerPopup = ({ onClose }) => {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-container"
        onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
      >
        {/* Header */}
        <div className="drawer-header">
          <h3>Timer Settings</h3>
          <button className="drawer-close" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          <p>Here you can add your Timer configuration content.</p>
          <p>(Right-side drawer design same as your video)</p>
        </div>
      </div>
    </div>
  );
};

export default TimerPopup;
