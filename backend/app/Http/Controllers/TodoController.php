<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->todos()->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $todo = $request->user()->todos()->create($data);

        return response()->json($todo, 201);
    }

    public function show(Todo $todo)
    {
        $this->authorizeTodo($todo);
        return $todo;
    }

    public function update(Request $request, Todo $todo)
    {
        $this->authorizeTodo($todo);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
        ]);

        $todo->update($data);

        return $todo;
    }

    public function destroy(Todo $todo)
    {
        $this->authorizeTodo($todo);
        $todo->delete();

        return response()->json(null, 204);
    }

    protected function authorizeTodo(Todo $todo)
    {
        if ($todo->user_id !== auth()->id()) {
            abort(403);
        }
    }
}