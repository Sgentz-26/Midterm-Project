import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage"; // Import your Homepage component
import "./App.css"; // Keep or replace with your main styling

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes for your app */}
          <Route path="/" element={<Homepage />} />
          {/* Add other routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
