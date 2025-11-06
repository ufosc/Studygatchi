import { useState } from "react";
import oscLogo from "../assets/osc-logo.png";
import githubLogo from "../assets/github-mark-white.svg";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";


const Home = () => {
    const [count, setCount] = useState(0);
    
      // had to add because bootstrap defaults to light mode

    return (
        <div>  
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
            <p className="read-the-docs">Click on the OSC link to get to OSC!</p>
            <p className="read-the-docs">
                Click on the Github Link to get to this project's GitHub repository!
            </p>
        </div>
    )
}

export default Home;