import {useState } from "react"
import "./App.css";

//make sure to fix import to only include
//relevant stuff in react



export default function ToDoList() {
    const [items, setItem] = useState(['Lock in time', 'Read Chapters 2-3', 'Write new Draft']);
    const [newItem, setNewItem] = useState('')
    const [checkedItems, checkIt] = useState(() => {
        return items.reduce((acc: Record<string, boolean>, item: string) => {
        acc[item] = false; 
        return acc;
    }, {});
    });
    const addItem = (event: { preventDefault: () => void; })=> {
        event.preventDefault();
        if (newItem == '') return;
        setItem(prev => [...prev, newItem]);
        setNewItem(''); 
    };

    const checkItem = (item: string) => {
        checkIt(prevState => ({...prevState, [item]: !prevState[item]}));
    }

    const removeItem = (key: string) => {
        if (key === 'Lock in time' || key === '') return;
        const updatedItems = items.filter(item => item !== key);
        
        // Update the state with the new array
        setItem(updatedItems);
        setNewItem('')   
    }


return (
    <div>
        <div className="todolist-logo">
            <h1> Goober To Do List </h1>
        </div>
    <form className="Add-item" onSubmit={addItem}>
        <input type="text"
                value = {newItem}
                onChange={e => {
                    console.log('Typing:', e.target.value); // <-- Add this log
                    setNewItem(e.target.value);
                }}
                />
        <button className="todolist-addItem" type="submit">Add</button>
    </form>
        <ul style={{
            maxWidth: '400px',
            margin: '0 auto',
            listStyleType: 'none',
            padding: 0
        }}>
        {items.map((item, index) => (
            <li key={index} className="todolist-item">
                <div className="wrapper">
                    <input
                    type = "checkbox"
                    id={`checkbox-${index}`}
                    name = {item}
                    value = {item}
                    checked={checkedItems[item]}
                    onChange={() => checkItem(item)}
                    /> 
                    <label htmlFor={`checkbox-${index}`}>{item}</label>
                </div>
                <button className="todolist-trashbutton" onClick={() => removeItem(item)}>Del</button>
            </li>
        ))}
    </ul>
    </div>
)

}



