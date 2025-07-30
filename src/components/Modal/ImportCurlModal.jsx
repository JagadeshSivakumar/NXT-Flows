import React, { useState } from 'react';
import './ImportCurlModal.css';

const ImportCurlModal = ({ isOpen, onClose, onSave }) => {
  const [curlString, setCurlString] = useState('');

  const handleSave = () => {
    onSave(curlString);
    onClose();
  };

  const handleCancel = () => {
    setCurlString('');
    onClose();
  };



  return (
      <div className="curl-modal-overlay" onClick={onClose}>
      <div className="curl-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="curl-modal-header">
          <h2 className="curl-modal-title">Import from cURL</h2>
        </div>
        
        <div className="curl-modal-body">
          <div className="curl-textarea-container">
            <textarea
              value={curlString}
              onChange={(e) => setCurlString(e.target.value)}
              placeholder="Paste cURL string here"
              className="curl-textarea"
              rows={8}
            />
          </div>
        </div>

        <div className="curl-modal-footer">
          <button className="curl-btn curl-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="curl-btn curl-btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportCurlModal;