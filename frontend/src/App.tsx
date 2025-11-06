import { useState } from "react";
import oscLogo from "./assets/osc-logo.png";
import githubLogo from "./assets/github-mark-white.svg";
import "./App.css";
import Timer from "./components/Timer";
import ToDoList from "./ToDoList";
import SettingsMenu from "./components/SettingsMenu";
import GooberMenu from "./components/GooberMenu";

function App() {
  const [count, setCount] = useState(0);

  // Current Players data
  const [currentXP, setXP] = useState(50);
  const [level, setLevel] = useState(9);
  const [money, setMoney] = useState(0);
  const [currentHealth, setHealth] = useState(50);

  // had to add because bootstrap defaults to light mode
  document.documentElement.setAttribute("data-bs-theme", "dark");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        <a href="https://ufosc.org/projects/" target="_blank">
          <img src={oscLogo} className="logo" alt="OSC logo" />
        </a>
        <a href="https://github.com/ufosc/Studygatchi" target="_blank">
          <img src={githubLogo} className="logo github" alt="GitHub logo" />
        </a>
      </div>
      <h1>Welcome to StudyGatchi!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Welcome to the Studygatchi Project!</p>
      </div>
      <Timer />
      <ToDoList />
      <div style={{ padding: 20 }}>
        <SettingsMenu />
      </div>
      <GooberMenu
        setXP={setXP}
        setLevel={setLevel}
        setMoney={setMoney}
        setHealth={setHealth}
        currentXP={currentXP}
        level={level}
        money={money}
        currentHealth={currentHealth}
      />
      <p className="read-the-docs">Click on the OSC link to get to OSC!</p>
      <p className="read-the-docs">
        Click on the Github Link to get to this project's GitHub repository!
      </p>
    </div>
  );
}

export default App;
