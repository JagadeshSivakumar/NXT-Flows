import React, { useState } from 'react';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import { ThumbsUp, Search } from 'lucide-react';
import './Exploreflow.css';

const Exploreflow = () => {
  const [activeCategory, setActiveCategory] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlow, setSelectedFlow] = useState({
    id: 1,
    name: 'sampletry',
    icon: '🤖',
    description:
      'A sample workflow for testing and demonstration purposes. This flow processes basic data transformations.',
  });

  const handleFlowSelect = (flow) => {
    setSelectedFlow(flow);
  };

 // ✅ Apps data grouped by category
  const appsByCategory = {
    recent: [
       { id: 1, title: "DeepResearch", type: "Chatflow", description: "AI-powered research workflow that executes iterative searches to create reports." },
    { id: 2, title: "File Translator", type: "Workflow", description: "Upload documents and translate them instantly into any language." },
    { id: 3, title: "Meeting Minutes Generator", type: "Chatbot", description: "Summarize meeting notes and decisions into clear structured reports." },
    { id: 4, title: "Sentiment Analyzer", type: "Workflow", description: "Detect sentiment of customer feedback with JSON formatted results." },
    { id: 5, title: "Quick Copywriter", type: "Chatflow", description: "Convert URLs into multiple platform-ready social media captions." },
    { id: 6, title: "Blog SEO Optimizer", type: "Workflow", description: "Retrieve web content and generate optimized blog drafts." },
    { id: 7, title: "Customer Review Classifier", type: "Workflow", description: "Classify reviews into categories for business insights." },
    { id: 8, title: "Research Agent", type: "Chatflow", description: "Iterative research bot with reasoning and sources until complete." },
    { id: 9, title: "Memory Assistant", type: "Chatflow", description: "Personalized assistant that remembers user context and tasks." },
    { id: 10, title: "Logo Designer", type: "Agent", description: "Generate SVG-based logos using AI creativity." },
    { id: 11, title: "Investment Copilot", type: "Agent", description: "Analyze stock data and provide investment insights." },
    { id: 12, title: "Web Scraper Summarizer", type: "Workflow", description: "Scrape and summarize content from any webpage." },
    { id: 13, title: "Translation Enhancer", type: "Workflow", description: "Enhance machine-translated text for fluency and readability." },
    { id: 14, title: "Minutes-to-Insights", type: "Chatbot", description: "Turn meeting notes into key decisions and action points." },
    { id: 15, title: "Cross-Platform Writer", type: "Chatflow", description: "One input, multiple platform content (Twitter, Threads, LinkedIn)." },
    { id: 16, title: "AI Survey Analyzer", type: "Workflow", description: "Batch process survey responses and group insights." },
    { id: 17, title: "Market Trends Finder", type: "Agent", description: "Pull data to identify business market shifts." },
    { id: 18, title: "Text Refinery", type: "Workflow", description: "Polish technical text and rewrite in professional style." },
    { id: 19, title: "Feedback Tracker", type: "Chatflow", description: "Track customer complaints and satisfaction trends." },
    { id: 20, title: "Strategic Advisor", type: "Chatbot", description: "Get strategic consulting advice with market data." },
    ],
    'ai-coding': [
      {
        id: 4,
        title: 'Code Interpreter',
        description: 'Clarifies syntax and semantics of your code step by step.',
        type: 'Chatbot',
      },
      {
        id: 5,
        title: 'Code Converter',
        description:
          'Convert code snippets between multiple programming languages easily.',
        type: 'Completion',
      },
      {
        id: 6,
        title: 'SQL Creator',
        description:
          'Write SQL queries from natural language input and schema.',
        type: 'Agent',
      },
    ],
    'customer-service': [
      {
        id: 7,
        title: 'Patient Intake Chatbot',
        description: 'Collect patient data via interactive chatbot sessions.',
        type: 'Chatflow',
      },
    ],
    'customer-service': [
    {
      id: 7,
      title: 'Meeting Minutes and Summary',
      description:
        'Generate meeting minutes automatically with structured summaries.',
      type: 'Chatbot',
    },
    {
      id: 8,
      title: 'Patient Intake Chatbot',
      description:
        'Build a customer service chatbot for patient intake via interactive sessions.',
      type: 'Chatflow',
    },
    {
      id: 9,
      title: 'Customer Review Analysis Workflow',
      description:
        'Utilize LLMs to classify customer reviews and forward them into internal systems.',
      type: 'Workflow',
    },
    {
      id: 10,
      title: 'Sentiment Analysis',
      description:
        'Batch sentiment analysis of text with classification and JSON output.',
      type: 'Workflow',
    },
  ],
  };


  const categories = [
    { id: 'recent', label: 'Recent', icon: ThumbsUp },
    { id: 'ai-coding', label: 'AI Coding' },
    { id: 'customer-service', label: 'Customer Service & Operations' },
  ];

  // ✅ Pick apps of active category
  const activeApps = appsByCategory[activeCategory] || [];

  // ✅ Filter by search
  const filteredApps = activeApps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Use these template apps instantly or customize your own apps
                based on the templates.
              </p>
            </div>

            {/* Categories and Search */}
            <div className="explore-apps-controls">
              <div className="controls-wrapper">
                <div className="category-filters">
                  {categories.map((category) => {
                    const isActive = activeCategory === category.id;
                    const IconComponent = category.icon;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`category-button ${isActive ? 'active' : 'inactive'
                          }`}
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

            {/* ✅ Show Recent Apps Grid only when "Recent" is active */}
            {activeCategory === 'recent' && (
              <div className="apps-grid">
                {filteredApps.map((app) => (
                  <div key={app.id} className="app-card">
                    <h3 className="app-title">{app.title}</h3>
                    <span className="app-type">{app.type}</span>
                    <p className="app-description">{app.description}</p>
                    {/* Hidden button - only shows on hover */}
                    <button className="add-button">+ Add to Workspace</button>

                  </div>
                ))}
              </div>
            )}
              {/* ✅ Show Ai Coding Grid only when "Ai Codingt" is active */}
             {activeCategory === 'ai-coding' && (
              <div className="apps-grid">
                {filteredApps.map((app) => (
                  <div key={app.id} className="app-card">
                    <h3 className="app-title">{app.title}</h3>
                    <span className="app-type">{app.type}</span>
                    <p className="app-description">{app.description}</p>
                    {/* Hidden button - only shows on hover */}
                    <button className="add-button">+ Add to Workspace</button>

                  </div>
                ))}
              </div>
            )}
             {/* ✅ Show Customer Service & Operatons Grid only when "Customer Service & Operatons" is active */}
             {activeCategory === 'customer-service' && (
              <div className="apps-grid">
                {filteredApps.map((app) => (
                  <div key={app.id} className="app-card">
                    <h3 className="app-title">{app.title}</h3>
                    <span className="app-type">{app.type}</span>
                    <p className="app-description">{app.description}</p>
                    {/* Hidden button - only shows on hover */}
                    <button className="add-button">+ Add to Workspace</button>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exploreflow;
