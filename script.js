// Get references to the input box and the list container from the HTML
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

/**
 * Adds a new task to the list.
 * Performs validation to ensure the task is not empty.
 */
function addTask() {
    // Basic validation to prevent adding empty tasks
    if (inputBox.value.trim() === '') {
        alert("You must write something!");
        return; // Stop the function if input is empty
    }

    // Create the list item (li) element
    let li = document.createElement("li");
    let taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.innerHTML = inputBox.value;
    li.appendChild(taskText);

    // Create a container for edit and delete buttons
    let controls = document.createElement("div");
    controls.className = "controls";

    // Create Edit button (span)
    let editSpan = document.createElement("span");
    editSpan.innerHTML = "\u270E"; // Unicode for Pencil icon
    editSpan.className = "edit-btn";
    controls.appendChild(editSpan);

    // Create Delete button (span)
    let deleteSpan = document.createElement("span");
    deleteSpan.innerHTML = "\u00d7"; // Unicode for Cross icon
    deleteSpan.className = "delete-btn";
    controls.appendChild(deleteSpan);
    
    li.appendChild(controls);
    listContainer.appendChild(li);

    // Clear the input box after adding a task
    inputBox.value = "";
    saveData(); // Save the new list to local storage
}

/**
 * Handles clicks on the list container to manage tasks.
 * Uses event delegation for better performance.
 */
listContainer.addEventListener("click", function(e) {
    const targetElement = e.target;
    const li = targetElement.closest('li'); // Find the parent list item

    if (!li) return; // Exit if the click was not inside a list item

    if (targetElement.classList.contains('delete-btn')) {
        // Logic to delete a task
        li.remove();
        saveData();
    } else if (targetElement.classList.contains('edit-btn')) {
        // Logic to edit a task
        const taskTextSpan = li.querySelector(".task-text");
        const newText = prompt("Edit your task:", taskTextSpan.innerHTML);
        // Update task only if user provides a non-empty value
        if (newText !== null && newText.trim() !== "") {
            taskTextSpan.innerHTML = newText.trim();
            saveData();
        }
    } else {
        // Logic to mark a task as completed/incomplete
        li.classList.toggle("checked");
        saveData();
    }
}, false);

/**
 * Saves the current state of the to-do list to the browser's local storage.
 */
function saveData() {
    const tasks = [];
    // Iterate over all list items to build an array of task objects
    listContainer.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").innerHTML,
            checked: li.classList.contains("checked")
        });
    });
    // Store the array as a JSON string in local storage
    localStorage.setItem("todoListData", JSON.stringify(tasks));
}

/**
 * Loads tasks from local storage and displays them on the page.
 * This ensures tasks persist even after a page refresh.
 */
function showTasks() {
    const data = localStorage.getItem("todoListData");
    if (data) {
        const tasks = JSON.parse(data);
        tasks.forEach(task => {
            // Create and display each task from the stored data
            let li = document.createElement("li");
            let taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.innerHTML = task.text;
            li.appendChild(taskText);

            if (task.checked) {
                li.classList.add("checked");
            }

            let controls = document.createElement("div");
            controls.className = "controls";

            let editSpan = document.createElement("span");
            editSpan.innerHTML = "\u270E";
            editSpan.className = "edit-btn";
            controls.appendChild(editSpan);

            let deleteSpan = document.createElement("span");
            deleteSpan.innerHTML = "\u00d7";
            deleteSpan.className = "delete-btn";
            controls.appendChild(deleteSpan);

            li.appendChild(controls);
            listContainer.appendChild(li);
        });
    }
}

// Load any existing tasks from local storage when the page loads
showTasks();
