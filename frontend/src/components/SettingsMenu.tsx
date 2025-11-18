import { useState, useEffect } from "react";
import "./SettingsMenu.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SettingsMenu() {
  const themes = {
    pink: {bg: "#F2B8CF", text: "#4A2B33", card: "#F6D1E6"},
    green: {bg: "#C8EABB", text: "#2F3A2D", card: "#D4F5D0"},
    lightblue: {bg: "#9bd0ec", text: "#0F2B3A", card:"#C9ECF6"},
    white: {bg: "#E8E8E8", text: "#1A1A1A", card: "#d8d6d6"},
    black: {bg: "#383838", text: "#F5F5F5", card: "#2A2A2A"}
  };
  
  const [firstOption, setFirst] = useState(false);
  const [secondOption, setSecond] = useState(false);
  const [theme, setTheme] = useState(themes.black);

  useEffect(() => {
    document.documentElement.style.setProperty("--bg-color", theme.bg);
    document.documentElement.style.setProperty("--text-color", theme.text);
    document.documentElement.style.setProperty("--card-bg", theme.card);
  },[theme])
  
  return (
    <div className="card bCard" style={{ width: "400px" }}>
      <div
        className="card-header"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <button type="button" className="btn-close" aria-label="Close"></button>
        <text
          style={{
            fontSize: 12,
            marginTop: "auto",
            marginLeft: "auto",
          }}
        >
          <text style={{ paddingRight: 10 }}>Money</text>
          <text>Settings</text>
        </text>
      </div>
      <div className="card-body">
        <h5 className="card-title">General</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckDefault"
            onClick={() => {
              firstOption ? setFirst(false) : setFirst(true);
            }}
          />
          <label className="form-check-label" htmlFor="switchCheckDefault">
            This is set to {firstOption ? "true" : "false"}
          </label>
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckDefault"
            onClick={() => {
              secondOption ? setSecond(false) : setSecond(true);
            }}
          />
          <label className="form-check-label" htmlFor="switchCheckDefault">
            This is set to {secondOption ? "true" : "false"}
          </label>
        </div>
        <label htmlFor="range1" className="form-label">
          Example range
        </label>
        <input type="range" className="form-range" id="range1"></input>
        <h5 className="card-title" style={{ paddingTop: 10 }}>
          Themes
        </h5>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="themeChoice" type="button" style ={{backgroundColor: themes.pink.bg}}
            onClick={() => setTheme(themes.pink)}
          ></button>
          <button className="themeChoice" type="button" style ={{backgroundColor: themes.green.bg}}
             onClick={() => setTheme(themes.green)}
          ></button>
          <button className="themeChoice" type="button" style ={{backgroundColor: themes.lightblue.bg}}
             onClick={() =>  setTheme(themes.lightblue)}
          ></button>
          <button className="themeChoice" type="button" style ={{backgroundColor: themes.white.bg}}
             onClick={() => setTheme(themes.white)}
          ></button>
          <button className="themeChoice" type="button" style ={{backgroundColor: themes.black.bg}}
             onClick={() =>  setTheme(themes.black)}
          ></button>
        </div>
        <h5 className="card-title" style={{ paddingTop: 10 }}>
          Miscellaneous
        </h5>
      </div>
    </div>
  );
}
