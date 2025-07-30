import React, { useState } from 'react';
import './AuthorizationModal.css';

const AuthorizationModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    authorizationType: 'None', // initially 'None'
    authType: 'Custom',
    header: '',
    apiKey: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (

  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Authorization</h2>
        </div>

        <div className="modal-body">
          {/* Authorization Type Buttons */}
          <div className="form-group">
            <label className="form-label">Authorization Type</label>
            <div className="auth-type-buttons">
              <button
                className={`auth-btn ${formData.authorizationType === 'None' ? 'active' : ''}`}
                onClick={() =>
                  setFormData({
                    authorizationType: 'None',
                    authType: 'Custom',
                    header: '',
                    apiKey: ''
                  })
                }
              >
                None
              </button>
              <button
                className={`auth-btn ${formData.authorizationType === 'API-Key' ? 'active' : ''}`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    authorizationType: 'API-Key',
                    authType: 'Basic', // default to Basic
                    header: '',
                    apiKey: ''
                  })
                }
              >
                API-Key
              </button>
            </div>
          </div>

          {/* Show Auth Type only when API-Key is selected */}
          {formData.authorizationType === 'API-Key' && (
            <div className="form-group">
              <label className="form-label">Auth Type</label>
              <div className="auth-type-buttons">
                <button
                  className={`auth-btn ${formData.authType === 'Basic' ? 'active' : ''}`}
                  onClick={() => handleInputChange('authType', 'Basic')}
                >
                  Basic
                </button>
                <button
                  className={`auth-btn ${formData.authType === 'Bearer' ? 'active' : ''}`}
                  onClick={() => handleInputChange('authType', 'Bearer')}
                >
                  Bearer
                </button>
                <button
                  className={`auth-btn ${formData.authType === 'Custom' ? 'active' : ''}`}
                  onClick={() => handleInputChange('authType', 'Custom')}
                >
                  Custom
                </button>
              </div>
            </div>
          )}

          {/* Show Header only when Auth Type is Custom */}
          {formData.authorizationType === 'API-Key' && formData.authType === 'Custom' && (
            <div className="form-group">
              <label className="form-label">Header *</label>
              <input
                type="text"
                value={formData.header}
                onChange={(e) => handleInputChange('header', e.target.value)}
                placeholder="Please enter"
                className="form-input"
              />
            </div>
          )}

          {/* Show API Key input only when API-Key is selected */}
          {formData.authorizationType === 'API-Key' && (
            <div className="form-group">
              <label className="form-label">API Key *</label>
              <input
                type="text"
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                className="form-input"
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationModal;
