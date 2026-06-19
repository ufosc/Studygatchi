import { useState, useEffect, useContext } from "react";
import "./SettingsMenu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {ThemeContext} from "./ThemeProvider.tsx";

export default function SettingsMenu() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("SettingsMenu must be used within a ThemeProvider");
  }
  const {theme, setTheme, themes} = context;

  const [firstOption, setFirst] = useState(false);
  const [secondOption, setSecond] = useState(false);

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
          <text>Money</text>
        </text>
      </div>
      <div className="card-body">
        <h5 className="card-title">General</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="sampleCheckbox1"
            onClick={() => {
              firstOption ? setFirst(false) : setFirst(true);
            }}
          />
          <label className="form-check-label" htmlFor="sampleCheckbox1">
            This is set to {firstOption ? "true" : "false"}
          </label>
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="sampleCheckbox2"
            onClick={() => {
              secondOption ? setSecond(false) : setSecond(true);
            }}
          />
          <label className="form-check-label" htmlFor="sampleCheckbox2">
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
