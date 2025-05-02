// script.js
let addToDoButton = document.getElementById('addToDo');
let toDoContainer = document.getElementById('toDoContainer');
let inputField = document.getElementById('inputField');
let clearButton = document.getElementById('clearButton');
let deleteIcon = "🗑️";

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        const textElement = item.querySelector('.todo-text');
        tasks.push({
            text: textElement.innerText,
            completed: textElement.style.textDecoration === "line-through"
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks'));
    if (saved) {
        saved.forEach(item => createTask(item.text, item.completed));
    }
}

// Create a single task element
function createTask(text, completed = false) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    const textElement = document.createElement('span');
    textElement.innerText = text;
    textElement.classList.add('todo-text');

    const trashElement = document.createElement('span');
    trashElement.innerText = deleteIcon;
    trashElement.classList.add('trash-icon');

    if (completed) {
        textElement.style.textDecoration = "line-through";
        textElement.style.color = "red";
    }

    todoItem.appendChild(textElement);
    todoItem.appendChild(trashElement);
    toDoContainer.appendChild(todoItem);

    textElement.addEventListener('click', () => {
        textElement.style.textDecoration = "line-through";
        textElement.style.color = "red";
        saveTasks();
    });

    trashElement.addEventListener('click', (event) => {
        toDoContainer.removeChild(todoItem);
        saveTasks();
        event.stopPropagation();
    });

    todoItem.addEventListener('dblclick', () => {
        toDoContainer.removeChild(todoItem);
        saveTasks();
    });
}

// Add new task
addToDoButton.addEventListener('click', function () {
    if (inputField.value.trim() !== "") {
        createTask(inputField.value);
        inputField.value = "";
        saveTasks();
    }
});

// Clear all tasks
clearButton.addEventListener('click', function () {
    toDoContainer.innerHTML = "";
    localStorage.removeItem('tasks');
});

// Language switching
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

document.getElementById('languageSelect').addEventListener('change', function () {
    changeLanguage(this.value);
});

function changeLanguage(lang) {
    const texts = {
        en: {
            title: "To Do List",
            placeholder: "Add a Task",
            addButton: "Add",
            clearButton: "Clear All",
            instruction1: "Click on a task to mark it as completed.",
            instruction2: "Click on the trash icon to delete a task."
        },
        ar: {
            title: "قائمة المهام",
            placeholder: "أضف مهمة",
            addButton: "أضف",
            clearButton: "مسح الكل",
            instruction1: "انقر على المهمة لتعليمها كمكتملة.",
            instruction2: "انقر على أيقونة المهملات لحذف المهمة."
        },
        he: {
            title: "רשימת משימות",
            placeholder: "הוסף משימה",
            addButton: "הוסף",
            clearButton: "נקה הכל",
            instruction1: "לחץ על משימה לסמן אותה כהושלמה.",
            instruction2: "לחץ על אייקון הפח למחוק משימה."
        }
    };

    document.querySelector('h1').innerText = texts[lang].title;
    document.getElementById('inputField').placeholder = texts[lang].placeholder;
    document.getElementById('addButtonText').innerText = texts[lang].addButton;
    document.getElementById('clearButton').innerText = texts[lang].clearButton;

    const instructionParagraphs = document.querySelectorAll('#instructions p');
    instructionParagraphs[0].innerText = texts[lang].instruction1;
    instructionParagraphs[1].innerText = texts[lang].instruction2;
}

// Load tasks on startup
window.addEventListener('DOMContentLoaded', loadTasks);
