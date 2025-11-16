import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard({ user, logout }) {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to load todos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post('/todos', form);
    setForm({ title: '', description: '' });
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await api.put(`/todos/${todo.id}`, { completed: !todo.completed });
    fetchTodos();
  };

  const openEdit = (todo) => {
    setEditModal({
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
    });
  };

  const closeEdit = () => setEditModal(null);

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editModal.title.trim()) return;

    await api.put(`/todos/${editModal.id}`, {
      title: editModal.title,
      description: editModal.description,
    });

    closeEdit();
    fetchTodos();
  };

  const openDelete = (todo) => {
    setDeleteModal({
      id: todo.id,
      title: todo.title,
    });
  };

  const closeDelete = () => setDeleteModal(null);

  const confirmDelete = async () => {
    await api.delete(`/todos/${deleteModal.id}`);
    closeDelete();
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
        {/* Header */}
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
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">No todos yet.</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-start justify-between rounded bg-white p-4 shadow ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className={`font-semibold ${todo.completed ? 'line-through' : ''}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(todo)}
                    className="rounded bg-amber-600 px-3 py-1 text-sm text-white hover:bg-amber-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleComplete(todo)}
                    className={`rounded px-3 py-1 text-sm ${
                      todo.completed ? 'bg-gray-400 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {todo.completed ? 'Undo' : 'Done'}
                  </button>

                  <button
                    onClick={() => openDelete(todo)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Edit Todo</h2>

            <form onSubmit={saveEdit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={editModal.title}
                onChange={(e) =>
                  setEditModal({ ...editModal, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description (optional)"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
                value={editModal.description}
                onChange={(e) =>
                  setEditModal({ ...editModal, description: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-red-600">Delete Todo?</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete:
              <br />
              <strong className="text-lg">"{deleteModal.title}"</strong>
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeDelete}
                className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}