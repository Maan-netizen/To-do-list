// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the essential HTML elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');

    /**
     * Loads tasks from the browser's local storage when the page loads.
     */
    function loadTasks() {
        // Retrieve tasks or initialize an empty array if none are found
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTaskElement(task.text, task.isCompleted));
        updateEmptyState();
    }

    /**
     * Saves the current list of tasks to the browser's local storage.
     */
    function saveTasks() {
        const tasks = [];
        // Iterate over each task item in the list
        document.querySelectorAll('.task-item').forEach(taskElement => {
            tasks.push({
                text: taskElement.querySelector('.task-text').textContent,
                isCompleted: taskElement.querySelector('.task-text').classList.contains('completed')
            });
        });
        // Store the tasks array as a JSON string
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Creates and adds a new task element to the DOM.
     * @param {string} taskText - The text content of the task.
     * @param {boolean} isCompleted - The completion status of the task.
     */
    function createTaskElement(taskText, isCompleted = false) {
        // Create the main container for the task item
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-all duration-300';

        // Create the left side container (checkbox and text)
        const leftSide = document.createElement('div');
        leftSide.className = 'flex items-center gap-3 min-w-0'; // min-w-0 prevents overflow issues

        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
        checkbox.className = 'h-5 w-5 rounded text-blue-500 focus:ring-blue-500 border-gray-300 cursor-pointer';
        checkbox.addEventListener('change', () => {
            taskTextSpan.classList.toggle('completed', checkbox.checked);
            saveTasks();
        });

        // Create the task text span
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = taskText;
        taskTextSpan.className = 'task-text break-all'; // `break-all` helps wrap long text
        if (isCompleted) {
            taskTextSpan.classList.add('completed');
        }

        leftSide.appendChild(checkbox);
        leftSide.appendChild(taskTextSpan);

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
        deleteButton.className = 'text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0'; // `flex-shrink-0` prevents the button from shrinking
        deleteButton.addEventListener('click', () => {
            taskItem.classList.add('opacity-0', 'scale-90'); // Animate out
            setTimeout(() => {
                taskItem.remove();
                saveTasks();
                updateEmptyState();
            }, 300); // Wait for animation to finish
        });
        
        // Assemble the task item
        taskItem.appendChild(leftSide);
        taskItem.appendChild(deleteButton);
        todoList.appendChild(taskItem);
    }

    /**
     * Shows or hides the "empty state" message based on whether there are tasks.
     */
    function updateEmptyState() {
        if (todoList.children.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

    // Event listener for the form submission to add a new task
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the page from reloading
        const taskText = todoInput.value.trim();
        if (taskText !== '') {
            createTaskElement(taskText);
            saveTasks();
            updateEmptyState();
            todoInput.value = '';
            todoInput.focus();
        }
});

    // Initial load of tasks from local storage
    loadTasks();
});