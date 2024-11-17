// Get DOM elements
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskPriority = document.getElementById('task-priority');
const taskCategory = document.getElementById('task-category');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const completedTasksText = document.getElementById('completed-tasks');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');
const clearCompletedBtn = document.getElementById('clear-completed');
const toggleThemeBtn = document.getElementById('toggle-theme');

// Task list and theme data
let tasks = [];
let currentTheme = 'light'; // Default theme

// Task class to manage task properties
class Task {
    constructor(name, date, priority, category) {
        this.name = name;
        this.date = date;
        this.priority = priority;
        this.category = category;
        this.completed = false;
    }
}

// Add task to list
function addTask() {
    const taskName = taskInput.value.trim();
    const taskDueDate = taskDate.value;
    const taskPriorityValue = taskPriority.value;
    const taskCategoryValue = taskCategory.value;

    if (taskName) {
        const newTask = new Task(taskName, taskDueDate, taskPriorityValue, taskCategoryValue);
        tasks.push(newTask);
        renderTasks();
        taskInput.value = '';
        taskDate.value = '';
    }
}

// Render tasks on the screen
function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = filterTasks();

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', task.priority);
        if (task.completed) taskItem.classList.add('completed');

        taskItem.innerHTML = `
            <div>
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-name="${task.name}">
                <h3>${task.name}</h3>
                <p>${task.category} - ${task.date ? task.date : 'No due date'}</p>
            </div>
            <div>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Handle task completion
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', (e) => toggleComplete(e, task));

        // Handle task deletion
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task));

        taskList.appendChild(taskItem);
    });

    updateStats();
}

// Toggle task completion
function toggleComplete(e, task) {
    task.completed = e.target.checked;
    renderTasks();
}

// Delete task
function deleteTask(task) {
    tasks = tasks.filter(t => t !== task);
    renderTasks();
}

// Update task statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    completedTasksText.textContent = `Completed: ${completionPercentage}%`;
}

// Filter tasks based on selected category and priority
function filterTasks() {
    const filteredByCategory = tasks.filter(task => 
        filterCategory.value === 'all' || task.category === filterCategory.value
    );
    
    const filteredByPriority = filteredByCategory.filter(task => 
        filterPriority.value === 'all' || task.priority === filterPriority.value
    );

    return filteredByPriority;
}

// Handle theme toggle
function toggleTheme() {
    if (currentTheme === 'light') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        currentTheme = 'dark';
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        currentTheme = 'light';
    }
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
filterCategory.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
});
toggleThemeBtn.addEventListener('click', toggleTheme);

// Initial rendering of tasks
renderTasks();
