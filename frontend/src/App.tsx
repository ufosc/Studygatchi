import "./App.css";
import { useEffect, useState } from "react";
import SettingsMenu from "./components/SettingsMenu";
import NavBar from "./components/NavBar"; //
import Timer from "./components/Timer";
import ToDoList from "./ToDoList";
import GooberMenu from "./components/GooberMenu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from './components/ThemeProvider';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // had to add because bootstrap defaults to light mode
  document.documentElement.setAttribute("data-bs-theme", "dark");

  // Current Players data
  const [currentXP] = useState(50);
  const [level] = useState(9);
  const [money] = useState(0);
  const [currentHealth, setHealth] = useState(50);

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage?.local) return;

    chrome.storage.local.get<{ gooberHealth?: number }>("gooberHealth").then((state) => {
      if (typeof state.gooberHealth === "number") {
        setHealth(Math.max(0, state.gooberHealth));
      }
    });

    const handleDamage = (message: { type?: string; health?: number }) => {
      if (message.type === "GOOBER_DAMAGED" && typeof message.health === "number") {
        setHealth(Math.max(0, message.health));
      }
    };

    chrome.runtime.onMessage.addListener(handleDamage);
    return () => chrome.runtime.onMessage.removeListener(handleDamage);
  }, []);

  return (
    <ThemeProvider>
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
            currentXP={currentXP}
            level={level}
            money={money}
            currentHealth={currentHealth}
          />
          <Routes>
            <Route path="/settings" element={<SettingsMenu />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/todo" element={<ToDoList />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
