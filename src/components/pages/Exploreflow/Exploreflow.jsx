import React, { useState } from 'react';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import { ThumbsUp, Search } from 'lucide-react'; // ✅ Import missing icons

import './Exploreflow.css';

const Exploreflow = () => {
  const [activeCategory, setActiveCategory] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlow, setSelectedFlow] = useState({
    id: 1,
    name: 'sampletry',
    icon: '🤖',
    description: 'A sample workflow for testing and demonstration purposes. This flow processes basic data transformations.'
  });

  const handleFlowSelect = (flow) => {
    setSelectedFlow(flow);
  };

  const categories = [
    { id: 'recent', label: 'Recent', icon: ThumbsUp },
    { id: '', label: 'AI Coding' },
    { id: 'customer-service', label: 'Customer Service & Operations' },
    // { id: 'data-analysis', label: 'Data Analysis' },
    // { id: 'graphic-design', label: 'Graphic Design' },
    // { id: 'knowledge-retrieval', label: 'Knowledge Retrieval' },
    // { id: 'marketing', label: 'Marketing' },
    // { id: 'research', label: 'Research' },
    // { id: 'utilities', label: 'Utilities' },
  ];

  return (
    <div className="app">
      <Navbar />
      <div className="app-body">
        <Sidebar onFlowSelect={handleFlowSelect} />
        <div className="explore-apps">
          <div className="explore-apps-container">
            {/* Header */}
            <div className="explore-apps-header">
              <h1 className="explore-apps-title">Explore Apps</h1>
              <p className="explore-apps-subtitle">
                Use these template apps instantly or customize your own apps based on the templates.
              </p>
            </div>

            {/* Categories and Search */}
            <div className="explore-apps-controls">
              <div className="controls-wrapper">
                {/* Category Buttons */}
                <div className="category-filters">
                  {categories.map((category) => {
                    const isActive = activeCategory === category.id;
                    const IconComponent = category.icon;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`category-button ${isActive ? 'active' : 'inactive'}`}
                      >
                        {IconComponent && (
                          <IconComponent className="category-icon" />
                        )}
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search Input */}
                <div className="search-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exploreflow;
