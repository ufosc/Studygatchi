import { useNavigate } from "react-router-dom";
//import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";

const NavBar = () => {
    const navigate = useNavigate();
    const handleSettingsClick = () => {
        navigate('/settings');
    }
    const handleTimerClick = () => {
        navigate('/timer');
    }
    const handleHomeClick = () => {
        navigate('/');
    }
    const handleToDo = () => {
        navigate('/todo');
    }
    return (
        <div className="navbar">
            <button onClick={handleHomeClick}>Home</button>
            <button onClick={handleSettingsClick}>Settings</button>
            <button onClick={handleTimerClick}>Timer</button>
            <button onClick={handleToDo}>To Do</button>
        </div>
        
    )
}

export default NavBar;