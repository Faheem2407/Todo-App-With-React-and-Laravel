import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard({ user, logout }) {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await api.get('/todos');
    setTodos(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/todos', form);
    setForm({ title: '', description: '' });
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await api.put(`/todos/${todo.id}`, { completed: !todo.completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    fetchTodos();
  };

  const handleLogout = async () => {
    await api.post('/logout');
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My To-Dos</h1>
          <button onClick={handleLogout} className="text-red-600 hover:underline">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded bg-white p-4 shadow">
          <input
            type="text"
            placeholder="Title"
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description (optional)"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Add Todo
          </button>
        </form>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start justify-between rounded bg-white p-4 shadow ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div>
                <h3 className={`font-semibold ${todo.completed ? 'line-through' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && <p className="mt-1 text-sm text-gray-600">{todo.description}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleComplete(todo)}
                  className={`rounded px-3 py-1 text-sm ${
                    todo.completed ? 'bg-gray-400 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {todo.completed ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}