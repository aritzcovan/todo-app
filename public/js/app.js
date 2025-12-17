// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadTodos();
  addBtn.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
  themeToggle.addEventListener('click', toggleTheme);
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  
  if (isDark) {
    document.body.classList.add('dark-mode');
    themeToggle.querySelector('.theme-icon').textContent = '☀️';
  } else {
    themeToggle.querySelector('.theme-icon').textContent = '🌙';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
}

// Load todos from server
async function loadTodos() {
  try {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    renderTodos(todos);
  } catch (error) {
    console.error('Error loading todos:', error);
  }
}

// Render todos
function renderTodos(todos) {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.isComplete ? 'completed' : ''}`;
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.isComplete ? 'checked' : ''}
        data-id="${todo.id}"
      >
      <span class="todo-text">${escapeHtml(todo.name)}</span>
      <span class="todo-date">${formatDate(todo.createDate)}</span>
      <button class="btn btn-delete" data-id="${todo.id}">Delete</button>
    `;

    // Add event listeners
    const checkbox = li.querySelector('.todo-checkbox');
    const deleteBtn = li.querySelector('.btn-delete');

    checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    todoList.appendChild(li);
  });
}

// Add a new todo
async function addTodo() {
  const name = todoInput.value.trim();

  if (!name) {
    alert('Please enter a todo');
    return;
  }

  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    todoInput.value = '';
    todoInput.focus();
    loadTodos();
  } catch (error) {
    console.error('Error adding todo:', error);
    alert('Error adding todo');
  }
}

// Toggle todo completion status
async function toggleTodo(id, isComplete) {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isComplete })
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    loadTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
    alert('Error updating todo');
  }
}

// Delete a todo
async function deleteTodo(id) {
  if (!confirm('Are you sure you want to delete this todo?')) {
    return;
  }

  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    loadTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Error deleting todo');
  }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Utility: Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
