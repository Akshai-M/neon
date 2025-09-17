'use client'
import React, { useEffect, useState, FormEvent } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch {
      // handle error
    }
    setLoading(false);
  }

  async function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });
      if (res.ok) {
        setNewTodo('');
        fetchTodos();
      }
    } finally {
      setLoading(false);
    }
  }

 

 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-6">Todo App</h1>
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 text-black"
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          Add
        </button>
      </form>
      <ul className="w-full max-w-md">
        {todos.length === 0 && <li className="text-center text-gray-500">No todos yet.</li>}
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-3 mb-2 shadow">
            <span
              className={`flex-1 cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
              onClick={() => toggleTodo(todo.id, todo.completed)}
            >
              {todo.title}
            </span>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
