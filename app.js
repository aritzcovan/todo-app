const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

const todosFile = path.join(__dirname, 'todos.json');

// Helper function to read todos
function readTodos() {
  try {
    if (fs.existsSync(todosFile)) {
      const data = fs.readFileSync(todosFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
}

// Helper function to write todos
function writeTodos(todos) {
  try {
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error('Error writing todos:', error);
  }
}

// GET all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST a new todo
app.post('/api/todos', (req, res) => {
  const { name } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Todo name is required' });
  }

  const todos = readTodos();
  const newTodo = {
    id: Date.now().toString(),
    name: name.trim(),
    isComplete: false,
    createDate: new Date().toISOString()
  };

  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

// PUT update a todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { isComplete, name } = req.body;

  const todos = readTodos();
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (isComplete !== undefined) {
    todo.isComplete = isComplete;
  }
  if (name !== undefined) {
    todo.name = name;
  }

  writeTodos(todos);
  res.json(todo);
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  const todos = readTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(index, 1);
  writeTodos(todos);
  res.json(deletedTodo[0]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Todo app server running at http://localhost:${PORT}`);
});
