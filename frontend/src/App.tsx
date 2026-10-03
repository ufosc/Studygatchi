import "./App.css";
import { useRef, useState } from "react";
import SettingsMenu from "./components/SettingsMenu";
import NavBar from "./components/NavBar"; //
import Home from "./components/Home";
import Timer from "./components/Timer";
import ToDoList from "./ToDoList";
import GooberMenu from "./components/GooberMenu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  // had to add because bootstrap defaults to light mode
  document.documentElement.setAttribute("data-bs-theme", "dark");

  // Current Players data
  const [currentXP, setXP] = useState(50);
  const [level, setLevel] = useState(9);
  const [money, setMoney] = useState(0);
  const [currentHealth, setHealth] = useState(50);
  const TASK_REWARD = 10;
  const TASK_HP_RESTORE = 10;
  const rewardedTasks = useRef(new Set<string>());
  const handleTaskComplete = (task: string) => {
    if (rewardedTasks.current.has(task)) return;
    rewardedTasks.current.add(task);
    setMoney((currentMoney) => currentMoney + TASK_REWARD);
    setHealth((health) => Math.min(100, health + TASK_HP_RESTORE));
  };
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<SettingsMenu />} />
          <Route path="/timer" element={<Timer />} />
          <Route
            path="/todo"
            element={<ToDoList onTaskComplete={handleTaskComplete} />}
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
