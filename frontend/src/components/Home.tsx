import { useState as _useState } from "react";
import oscLogo from "../assets/osc-logo.png";
import githubLogo from "../assets/github-mark-white.svg";
import CanvasFetcher from "./CanvasFetcher";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
    return (
        <div>
            <div>
                <a href="https://ufosc.org/projects/" target="_blank" rel="noreferrer">
                    <img src={oscLogo} className="logo" alt="OSC logo" />
                </a>
                <a href="https://github.com/ufosc/Studygatchi" target="_blank" rel="noreferrer">
                    <img src={githubLogo} className="logo github" alt="GitHub logo" />
                </a>
            </div>
            <h1>Welcome to StudyGatchi!</h1>

            <div className="card">
                <p>Welcome to the Studygatchi Project!</p>
                {/* We don't really need the counter so I just overwrote it
                 to show the JSON fetching working */}
                <CanvasFetcher />
            </div>

            <p className="read-the-docs">Click on the OSC link to get to OSC!</p>
            <p className="read-the-docs">
                Click on the Github Link to get to this project's GitHub repository!
            </p>
        </div>
    );
};

export default Home;