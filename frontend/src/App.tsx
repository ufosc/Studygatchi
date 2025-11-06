import "./App.css";
import SettingsMenu from "./components/SettingsMenu";
import NavBar from "./components/NavBar"; //
import Home from "./components/Home";
import Timer from "./components/Timer";
import ToDoList from "./ToDoList";
import SettingsMenu from "./components/SettingsMenu";
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
          <Route path="/todo" element={<ToDoList />} />
          <Route path="*" element={<Home />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
