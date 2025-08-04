import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import './NoteWidget.css';

const NoteWidget = ({ onClose, position, onPositionChange }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [note, setNote] = useState('');
  const [size, setSize] = useState({ width: 320, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef(null);
  const resizeRef = useRef(null);
  const headerRef = useRef(null);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(250, startWidth + (e.clientX - startX));
      const newHeight = Math.max(150, startHeight + (e.clientY - startY));
      
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleHeaderMouseDown = (e) => {
    if (e.target !== headerRef.current) return;
    
    setIsDragging(true);
    const rect = widgetRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!isMaximized) {
        onPositionChange({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized, onPositionChange]);

  return (
    <div 
      ref={widgetRef}
      className={`note-widget ${isMaximized ? 'maximized' : ''} ${isResizing ? 'resizing' : ''}`}
      style={isMaximized ? {} : { 
        width: `${size.width}px`, 
        height: `${size.height}px`,
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10
      }}
    >
      {/* Header with maximize/minimize and close buttons */}
     

      {/* Note content area */}
      <div className="note-content">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note..."
          className="note-textarea"
        />
        
        {/* Brand label */}
        <div className="note-brand">
          <span className="brand-text">NXT Flows</span>
        </div>
      </div>

      {/* Resize handle - only show when not maximized */}
      {!isMaximized && (
        <div
          ref={resizeRef}
          className="resize-handle"
          onMouseDown={handleMouseDown}
        >
          {/* L-shaped resize handle */}
          <div className="resize-icon-container">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="resize-icon"
            >
              {/* Horizontal line */}
              <line x1="4" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1" />
              {/* Vertical line */}
              <line x1="11" y1="4" x2="11" y2="11" stroke="currentColor" strokeWidth="1" />
              {/* Corner dot */}
              <circle cx="11" cy="11" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteWidget;