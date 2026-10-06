// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = { search: '', status: 'all', category: 'all', priority: 'all' };

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskCategoryInput = document.getElementById('task-category');
const taskPriorityInput = document.getElementById('task-priority');
const taskDueDateInput = document.getElementById('task-due-date');

const taskList = document.getElementById('task-list');
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');

const themeToggleBtn = document.getElementById('theme-toggle');
const themeText = document.getElementById('theme-text');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  updateStats();
  
  // Theme check
  if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    if (themeText) themeText.textContent = 'Light Mode';
  }
});

// Event: Add Task
if (taskForm) {
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const category = taskCategoryInput.value;
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value;

    if (!title || !category || !priority || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      category,
      priority,
      dueDate,
      completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskForm.reset();
  });
}

// Save to LocalStorage and Render UI
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  updateStats();
}

// Update Counters
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  if (totalTasksEl) totalTasksEl.textContent = total;
  if (completedTasksEl) completedTasksEl.textContent = completed;
  if (pendingTasksEl) pendingTasksEl.textContent = pending;
}

// Render Tasks based on Filters
function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(currentFilter.search.toLowerCase());
    const matchesStatus = currentFilter.status === 'all' ? true :
                          currentFilter.status === 'completed' ? task.completed : !task.completed;
    const matchesCategory = currentFilter.category === 'all' || task.category === currentFilter.category;
    const matchesPriority = currentFilter.priority === 'all' || task.priority === currentFilter.priority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p style="text-align: center; color: gray; margin-top: 10px;">No tasks found.</p>';
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div>
        <span class="task-text">${task.title}</span>
        <div class="task-details">
          <span><i class="fa-solid fa-folder"></i> ${task.category}</span>
          <span><i class="fa-solid fa-flag"></i> ${task.priority}</span>
          <span><i class="fa-solid fa-calendar"></i> ${task.dueDate}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-complete" onclick="toggleTask(${task.id})">
          <i class="fa-solid ${task.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
        </button>
        <button class="btn-edit" onclick="editTask(${task.id})"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-delete" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Functions for inline HTML click events
window.toggleTask = function(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveAndRender();
};

window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
};

window.editTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = prompt("Edit Task Title:", task.title);
  if (newTitle !== null && newTitle.trim() !== "") {
    task.title = newTitle.trim();
    saveAndRender();
  }
};

// Filter Event Listeners
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentFilter.search = e.target.value;
    renderTasks();
  });
}

if (filterStatus) {
  filterStatus.addEventListener('change', (e) => {
    currentFilter.status = e.target.value;
    renderTasks();
  });
}

if (filterCategory) {
  filterCategory.addEventListener('change', (e) => {
    currentFilter.category = e.target.value;
    renderTasks();
  });
}

if (filterPriority) {
  filterPriority.addEventListener('change', (e) => {
    currentFilter.priority = e.target.value;
    renderTasks();
  });
}

// Dark Mode Toggle
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      if (themeText) themeText.textContent = 'Dark Mode';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      if (themeText) themeText.textContent = 'Light Mode';
    }
  });
}
