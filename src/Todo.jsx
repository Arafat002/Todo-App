import React, { useState, useEffect } from "react";
import "./TodoApp.css";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // Default sorting by name

  useEffect(() => {
    // Load TODOs from local storage when the component mounts.
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []); // Empty dependency array to run only on initial mount

  useEffect(() => {
    // Save TODOs to local storage whenever the todos state changes.
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: inputValue }]);
      setInputValue("");
    }
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const editTodo = (id, newText) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updatedTodos);
  };

  const sortedTodos = [...todos];

  if (sortBy === "name") {
    sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortBy === "lastEdited") {
    sortedTodos.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp in descending order
  }

  const filteredTodos = sortedTodos.filter((todo) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main">
      <h1 className="header">Todo App</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new TODO"
      />
      <button className="add" onClick={addTodo}>
        Add New Task!
      </button>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
      />
      <select
        className="sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="lastEdited">Sort by Last Edited</option>
      </select>
      <ul className="todos">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-list">
            <span>{todo.text}</span>
            <button
              className="edit"
              onClick={() =>
                editTodo(todo.id, prompt("Edit your task:", todo.text))
              }
            >
              Edit
            </button>
            <button className="delete" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
