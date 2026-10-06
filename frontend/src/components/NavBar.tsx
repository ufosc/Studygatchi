import { useNavigate } from "react-router-dom";
//import { useState } from 'react';


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
        <div>
            <button className="studygatchi-button" onClick={handleHomeClick}>Home</button>
            <button className="studygatchi-button" onClick={handleSettingsClick}>Settings</button>
            <button className="studygatchi-button" onClick={handleTimerClick}>Timer</button>
            <button className="studygatchi-button" onClick={handleToDo}>To Do</button>
        </div>
        
    )
}

export default NavBar;