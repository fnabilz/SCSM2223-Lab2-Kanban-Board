// ── STATE ────────────────────────────────────────────── 
let tasks  = [];   // each entry: { id, title, content } 
let currentTaskId = 0;

// ELEMENT REFERENCES
const taskCounterSpan   = document.querySelector(".task-counter");
const gridList          = document.querySelector(".grid")
const cardList          = document.querySelector("ul");
const select            = document.getElementById("priority-select");

const taskModal         = document.querySelector(".task-modal");
const modalTitle        = taskModal.querySelector("#title-input");
const modalDesc         = taskModal.querySelector("#description-input");
const modalDate         = taskModal.querySelector("#date-input");
const modalPriority     = taskModal.querySelector("#priority-input");

const priorityBanner = {
    Low: "bg-low",
    Medium: "bg-medium",
    High: "bg-high",
}

function updateTaskCounter() { 
    const count = tasks.length; 
    taskCounterSpan.textContent = count; 
} 

function createTaskCard(taskObj) {
    // this is html element
    const li = document.createElement("li");
    li.classList.add("task-card");
    li.setAttribute("data-id", taskObj.id);

    const title = document.createElement("h3");
    title.classList.add("card-title");
    title.textContent = taskObj.title;

    const div = document.createElement("div")

    const description = document.createElement('p');
    description.classList.add("card-description");
    description.textContent = taskObj.description;

    const priorityBadge = document.createElement('span');
    const priorityClass = priorityBanner[taskObj.priority];
    priorityBadge.classList.add("card-priority", priorityClass);
    priorityBadge.textContent = taskObj.priority;

    const dueDate = document.createElement('time');
    dueDate.classList.add("card-date");
    dueDate.textContent = taskObj.dueDate.toLocaleDateString();

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.setAttribute("data-action", "edit");
    editButton.setAttribute("data-id", taskObj.id);
    editButton.classList.add('edit-button');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute("data-action", "delete");
    deleteButton.setAttribute("data-id", taskObj.id);
    deleteButton.classList.add('delete-button');

    

    // 4. Assemble everything into the <li>
    div.append(description, priorityBadge, dueDate);
    li.append(title, div, editButton, deleteButton);

    return li;
}

function addTask(columnId, taskObj) {
    // 1. Find the column by its ID (e.g., 'todo-column' or 'doing-column')
    const column = document.getElementById(columnId);
    if (!column) return; // Safety check

    const taskList = column.querySelector('ul');

    // 3. Create the card using our previous helper function
    currentTaskId = currentTaskId + 1;
    taskObj.id = currentTaskId
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
    const taskObj = tasks.find(obj => obj.id == taskId);

    modalTitle.textContent = taskObj.title;
    modalDesc.textContent = taskObj.description;
    modalDate.textContent = taskObj.dueDate;
    modalPriority.textContent = taskObj.priority;
    taskModal.classList.toggle("is-hidden", false);
}

function updateTask(taskId, updatedData) {
    const taskObj = tasks.find(obj => obj.id === taskId);

    taskObj.title = updatedData.title;
    taskObj.description = updatedData.description;
    taskObj.priority = updatedData.priority;
    taskObj.dueDate = updatedData.dueData;

    const taskCard = document.getElementById(taskId);
    const cardTitle = taskCard.getElementById("card-title");
    cardTitle.textContent = taskObj.title;
    
    const cardDesc = taskCard.getElementById("card-description");
    cardDesc.textContent = taskObj.description;

    const cardPriority = taskCard.getElementById("card-priority");
    cardPriority.textContent = taskObj.priority;

    const cardDate = taskCard.getElementById("card-date");
    cardDate.textContent = taskObj.dueDate.toLocaleDateString();
}

function init() { 
    addTask(
        "todo", 
        {
            title: "Develop UI", 
            description: "Develop simple UI for user navigation", 
            dueDate: new Date(), 
            priority: "High",
        }
    );

    cardList.addEventListener("click", function(event) {
        const button = event.target;
        const action = button.getAttribute("data-action");
        const taskId = button.getAttribute("data-id");

        if (action == "delete")
            deleteTask(taskId);
        else if (action == "edit")
            editTask(taskId);
    });

    gridList.addEventListener("click", function(event){
        const button = event.target;
        const id = button.getAttribute("id");
        const parent = button.parentElement;
        const parentId = parent.getAttribute("id")

        if (id == "addTaskButton")
            addTask(parentId, {id: 102, title: "Develop UI", description: "Develop simple UI for user navigation", dueDate: new Date(), priority: "High"})
            
            
    });

    taskModal.addEventListener("click", function(event) {
        const button = event.target;
        const id = button.getAttribute("id");

        if (id == "saveButton")
            updateTask()
    });

    select.addEventListener('change', function(event) {
        // 1. Remove any existing priority classes
        select.classList.remove('bg-high', 'bg-medium', 'bg-low');

        // 2. Get the current value
        const val = event.target.value;

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