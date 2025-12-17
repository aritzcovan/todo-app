# Todo App

A simple todo application with a Node.js/Express backend and a responsive frontend.

## Features

- Add new todos
- Mark todos as completed/incomplete with a checkbox
- Delete todos
- Persistent storage in `todos.json`
- Responsive design
- Beautiful gradient UI

## Todo Data Structure

Each todo includes:
- `id`: Unique identifier (timestamp-based)
- `name`: Todo description
- `isComplete`: Boolean flag for completion status
- `createDate`: ISO timestamp when the todo was created

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

Then open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo (mark complete/incomplete)
- `DELETE /api/todos/:id` - Delete a todo
