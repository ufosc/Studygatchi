import { useState } from "react";
import "./SettingsMenu.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SettingsMenu() {
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
          <div
            className="themeChoice"
            style={{ backgroundColor: "#ff8d8d" }}
          ></div>
          <div className="themeChoice"></div>
          <div className="themeChoice"></div>
        </div>
        <h5 className="card-title" style={{ paddingTop: 10 }}>
          Miscellaneous
        </h5>
      </div>
    </div>
  );
}
