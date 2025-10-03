import "App.css"
import {useState } from "react"

//make sure to fix import to only include
//relevant stuff in react



export default function ToDoList() {
    const [items, setItem] = useState(['Lock in time', 'God help me', 'Please']);
    const [newItem, setnewItem] = useState('')
    const addItem = (newItem: string)=> {
        setItem(prev => [...prev, newItem]);
    };

    const removeItem = (key: string) => {
        if (key == 'Lock in time') return;
        if (key == '') return;

        const updatedItems = items.filter(item => item !== key);
        
        // Update the state with the new array
        setItem(updatedItems);   
        setNewItem
    }


}


<h1> Goober To Do List </h1>
