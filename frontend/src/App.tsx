import "./App.css";
import { useState } from "react";
import SettingsMenu from "./components/SettingsMenu";
import NavBar from "./components/NavBar"; //
import Home from "./components/Home";
import Timer from "./components/Timer";
import ToDoList from "./ToDoList";
import RenderGooberMenu from "./RenderGooberMenu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  // had to add because bootstrap defaults to light mode
  document.documentElement.setAttribute("data-bs-theme", "dark");

  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <NavBar />
        </div>
        
        <Routes>
          <Route path="/" element={<><RenderGooberMenu /><Home /></>} />
          <Route path="/settings" element={<SettingsMenu />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/todo" element={<ToDoList />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
