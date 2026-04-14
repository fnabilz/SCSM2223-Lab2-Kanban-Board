// ── STATE ────────────────────────────────────────────── 
let tasks  = [
    {id: 101, title: "Develop UI", description: "Develop simple UI for user navigation", dueDate: new Date(), priority: "High"},
];   // each entry: { id, title, content } 
let nextId = 1;

// ELEMENT REFERENCES
const taskCounterSpan   = document.querySelector(".task-counter");
const gridList          = document.querySelector(".grid")
const cardList          = document.querySelector("ul");
const select            = document.getElementById("priority-select");

const taskModal         = document.querySelector(".task-modal");
const modalTitle        = taskModal.querySelector(".task-title");
const modalDesc         = taskModal.querySelector(".task-description");
const modalDate         = taskModal.querySelector(".task-date");
const modalPriority     = taskModal.querySelector(".task-priority");


// ── DOM REFERENCES ──────────────────────────────────── 
function updateTaskCounter() { 
    const count = tasks.length; 
    taskCounterSpan.textContent = count; 
} 

function createTaskCard(taskObj) {
    const li = document.createElement("li");
    li.classList.add("card");
    li.setAttribute("data-id", taskObj.id);

    const title = document.createElement("h3");
    title.classList.add("card-title");
    title.textContent = taskObj.title;

    const description = document.createElement('p');
    description.classList.add("card-description");
    description.textContent = taskObj.description;

    const priorityBadge = document.createElement('span');
    priorityBadge.classList.add("card-priority");
    priorityBadge.textContent = taskObj.priority;

    const dueDate = document.createElement('time');
    dueDate.classList.add("card-date");
    dueDate.textContent = taskObj.dueDate.toLocaleDateString();

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.setAttribute("data-action", "edit");
    editButton.setAttribute("data-id", taskObj.taskId);
    editButton.classList.add('edit-button');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute("data-action", "delete");
    deleteButton.setAttribute("data-id", taskObj.taskId);
    deleteButton.classList.add('delete-button');

    // 4. Assemble everything into the <li>
    li.append(title, description, priorityBadge, dueDate, editButton, deleteButton);

    return li;
}

function addTask(columnId, taskObj) {
    // 1. Find the column by its ID (e.g., 'todo-column' or 'doing-column')
    const column = document.getElementById(columnId);
    if (!column) return; // Safety check

    const taskList = column.querySelector('ul');

    // 3. Create the card using our previous helper function
    const taskCard = createTaskCard(taskObj);

    // 4. Append (add) the card to the list
    taskList.appendChild(taskCard);

    tasks.push(taskObj);

    updateTaskCounter();
}

function deleteTask(taskId) {
    const taskCard = document.getElementById(taskId);

    taskCard.classList.add("fade-out");
    taskCard.remove();

    updateTaskCounter();
}

function editTask(taskId) {
    const taskData = tasks[taskId];

    modalTitle.textContent = taskData.title;
    modalDesc.textContent = taskData.description;
    modalDate.textContent = taskData.dueDate;
    modalPriority.textContent = taskData.priority;
    taskModal.classList.add("is-hidden", false);
}

function updateTask(taskId, updatedData) {
    const taskData = tasks[taskId];

    taskData.title = updatedData.title;
    taskData.description = updatedData.description;
    taskData.priority = updatedData.priority;
    taskData.dueDate = updatedData.dueData;

    const taskCard = document.getElementById(taskId);
    const cardTitle = taskCard.getElementById("card-title");
    cardTitle.textContent = taskData.title;
    
    const cardDesc = taskCard.getElementById("card-description");
    cardDesc.textContent = taskData.description;

    const cardPriority = taskCard.getElementById("card-priority");
    cardPriority.textContent = taskData.priority;

    const cardDate = taskCard.getElementById("card-date");
    cardDate.textContent = taskData.dueDate.toLocaleDateString();
}

function init() { 
    tasks.forEach((taskObj) => {
        addTask("todo", taskObj);
    });

    cardList.addEventListener("click", function(event) {
        const button = event.target;
        const action = button.getAttribute("data-action");
        const taskId = button.getAttribute("data-id");

        if (action == "delete")
            deleteTask(taskId);
        elseif (action == "edit")
            editTask(taskId);
    })

    gridList.addEventListener("click", function(event){
        const button = event.target;
        const id = button.getAttribute("id");
        const parent = button.parentElement;
        const parentId = parent.getAttribute("id")

        if (id == "addTaskButton")
            addTask(parentId, {id: 102, title: "Develop UI", description: "Develop simple UI for user navigation", dueDate: new Date(), priority: "High"})
            
            
    })

    taskModal.addEventListener("click", function(event) {
        const button = event.target;
        const id = button.getAttribute("id");

        if (id == "saveButton")
            updateTask()
    })

    select.addEventListener('change', function() {
        // 1. Remove any existing priority classes
        select.classList.remove('bg-high', 'bg-medium', 'bg-low');

        // 2. Get the current value
        const val = select.value;

        // 3. Add the class that matches the value
        if (val === 'high') {
            select.classList.add('bg-high');
        } else if (val === 'medium') {
            select.classList.add('bg-medium');
        } else if (val === 'low') {
            select.classList.add('bg-low');
        }
    });
} 

init();   // ← call init when the page loads