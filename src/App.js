import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login/Login";
import Flows from "./components/pages/Flows/Flows";
import Exploreflow from "./components/pages/Exploreflow/Exploreflow";
import Studio from "./components/pages/Studio/Studio";
import Knowledge from "./components/pages/Knowledge/Knowledge";
import Settings from "./components/pages/Settings/Settings";
import FlowBuilder from "./components/pages/StudioNewBlank/StudioNewBlank";
import Signup from"./components/pages/Signup/Signup";
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
       <Route path="/Exploreflow" element={<Exploreflow />} />
        <Route path="/flows" element={<Flows />} />
        <Route path="/studio" element={<Studio />} />
       <Route path="/studio/:id" element={<FlowBuilder />} />

        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
