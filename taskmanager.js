// ── STATE ────────────────────────────────────────────── 
let tasks  = [];   // each entry: { id, title, content } 
let totalTask = 0;
let currentTaskId = 0;
let currentColumnId = "";

// ELEMENT REFERENCES
const taskCounterSpan   = document.querySelector(".task-counter");
const gridList          = document.querySelector(".grid")
const cardList          = document.querySelector("ul");
const selectList        = document.querySelectorAll("select");
const titleList         = document.querySelectorAll(".card-title");
const titleInputList    = document.querySelectorAll(".card-title-input")

const taskModal         = document.querySelector(".task-modal");
const modalTitle        = taskModal.querySelector("#title-input");
const modalDesc         = taskModal.querySelector("#description-input");
const modalDate         = taskModal.querySelector("#date-input");
const modalPriority     = taskModal.querySelector("#priority-input");

const priorityBanner = {
    "low": {label: "Low", class: "bg-low"},
    "medium": {label: "Medium", class: "bg-medium"},
    "high": {label: "High", class: "bg-high"},
}

function updateTaskCounter() { 
    taskCounterSpan.textContent = totalTask; 
} 

function createTaskCard(taskObj) {
    // this is html element
    const li = document.createElement("li");
    li.classList.add("task-card");
    li.setAttribute("data-id", taskObj.id);

    const title = document.createElement("h3");
    title.classList.add("card-title");
    title.textContent = taskObj.title;
    const titleInput = document.createElement("input");
    titleInput.classList.add("card-title-input");
    titleInput.style.display = "none";

    const div = document.createElement("div")

    const description = document.createElement('p');
    description.classList.add("card-description");
    description.textContent = taskObj.description;

    const priorityBadge = document.createElement('span');
    const priorityClass = priorityBanner[taskObj.priority].class;
    priorityBadge.classList.add("card-priority", priorityClass);
    priorityBadge.textContent = priorityBanner[taskObj.priority].label;

    const dueDate = document.createElement('time');
    dueDate.classList.add("card-date");
    dueDate.textContent = `Due: ${taskObj.dueDate}`;

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
    li.append(title, titleInput, div, editButton, deleteButton);

    return li;
}

function getDate(today) {
    const year = today.getFullYear();
  
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function addTask(columnId, taskObj) {
    const column = document.getElementById(columnId); // "todo", "inprogress", "done"
    if (!column) return; // Safety check

    const taskList = column.querySelector('ul');
    taskObj.id = tasks.length + 1;
    taskObj.columnId = columnId;
    const taskCard = createTaskCard(taskObj);

    taskList.appendChild(taskCard);
    tasks.push(taskObj);
    totalTask = totalTask + 1;

    updateTaskCounter();
}

function deleteTask(taskId) {
    const taskCard = document.querySelector(`[data-id="${taskId}"]`);
    if (taskCard == null) return;
    taskCard.classList.add("fade-out");
    taskCard.remove();

    totalTask = totalTask - 1;
    updateTaskCounter();
}

function editTask(taskId) {
    const taskObj = tasks.find(obj => obj.id == taskId);
    currentTaskId = taskId;

    modalTitle.value = taskObj.title;
    modalDesc.value = taskObj.description;
    modalDate.value = taskObj.dueDate;
    modalPriority.value = taskObj.priority;
    const priorityClass = priorityBanner[taskObj.priority].class;
    modalPriority.classList.add(priorityClass);

    taskModal.classList.remove("is-hidden");
}

function updateTask(taskId, updatedData) {
    const taskObj = tasks.find(obj => obj.id == taskId);
    if (taskObj == null) return;

    taskObj.title = updatedData.title;
    taskObj.description = updatedData.description;
    taskObj.priority = updatedData.priority;
    taskObj.dueDate = updatedData.dueDate;

    const taskCard = document.querySelector(`[data-id="${taskId}"]`);
    const cardTitle = taskCard.querySelector(".card-title");
    cardTitle.textContent = taskObj.title;
    
    const cardDesc = taskCard.querySelector(".card-description");
    cardDesc.textContent = taskObj.description;

    const cardPriority = taskCard.querySelector(".card-priority");
    cardPriority.textContent = priorityBanner[taskObj.priority].label;
    cardPriority.classList.remove('bg-high', 'bg-medium', 'bg-low');
    cardPriority.classList.add(priorityBanner[taskObj.priority].class);

    const cardDate = taskCard.querySelector(".card-date");
    cardDate.textContent = `Due: ${taskObj.dueDate}`;

    taskModal.classList.add("is-hidden");
}

function toggleCard(priority) {
    tasks.forEach(taskObj => {
        const taskCard = document.querySelector(`[data-id="${taskObj.id}"]`);
        if (taskCard == null) return;
        if (priority == "all")
            taskCard.classList.toggle("is-hidden", false);
        else if (taskObj.priority === priority)
            taskCard.classList.toggle("is-hidden", false);
        else
            taskCard.classList.toggle("is-hidden", true);
    })
}

function init() { 
    addTask(
        "todo", 
        {
            title: "Develop UI", 
            description: "Develop simple UI for user navigation", 
            dueDate: getDate(new Date()), 
            priority: "high",
        }
    );
    addTask(
        "inprogress", 
        {
            title: "Develop UI 2", 
            description: "Develop simple UI for user navigation 2", 
            dueDate: getDate(new Date()), 
            priority: "low",
        }
    );
    addTask(
        "inprogress", 
        {
            title: "Develop UI 3", 
            description: "Develop simple UI for user navigation 3", 
            dueDate: getDate(new Date()), 
            priority: "low",
        }
    );
    addTask(
        "done", 
        {
            title: "Develop UI 4", 
            description: "Develop simple UI for user navigation 4", 
            dueDate: getDate(new Date()), 
            priority: "medium",
        }
    );
    addTask(
        "done", 
        {
            title: "Develop UI 5", 
            description: "Develop simple UI for user navigation 5", 
            dueDate: getDate(new Date()), 
            priority: "low",
        }
    );

    gridList.addEventListener("click", function(event){
        const button = event.target;
        const id = button.getAttribute("id");
        const parent = button.parentElement;
        const parentId = parent.getAttribute("id")

        if (id == "addTaskButton") {
            currentColumnId = parentId;
            modalTitle.value = "";
            modalDesc.value = "";
            modalDate.value = "";
            modalPriority.value = "";
            taskModal.classList.remove("is-hidden");
        }
        else if (id == "clearButton") {
            tasks.forEach(taskObj => {
                if (taskObj.columnId === "done") {
                   deleteTask(taskObj.id);
                }
            })
        }
        else {
            const action = button.getAttribute("data-action");
            const taskId = button.getAttribute("data-id");

            if (action == "delete")
                deleteTask(taskId);
            else if (action == "edit")
                editTask(taskId);
        }
    });

    gridList.addEventListener("dblclick", function(event){
        const title = event.target;
        if (title.classList.contains("card-title")) {
            const parent = title.parentElement;
            const titleInput = parent.querySelector(".card-title-input");

            title.style.display = "none";
            titleInput.style.display = "block";
        }
    });

    gridList.addEventListener('keydown', function(event) {
      
        if (!event.target.classList.contains('card-title-input'))
            return; // Stops the function immediately

        if (event.key === 'Enter') {
            const parent = event.target.parentElement;
            const taskId = parent.getAttribute("data-id");
            const taskObj = tasks.find(obj => obj.id == taskId);
            const titleInput = parent.querySelector(".card-title-input");
            const title = parent.querySelector(".card-title");
            if (titleInput.value !== "") {
                taskObj.title = titleInput.value;
                updateTask(taskId, taskObj);

                title.style.display = "block";
                event.target.style.display = "none";
            }
            else {
                title.style.display = "block";
                event.target.style.display = "none";
            }
        }
    });

    gridList.addEventListener('focusout', function(event) {
        if (!event.target.classList.contains('card-title-input'))
            return; // Stops the function immediately

        const parent = event.target.parentElement;
        const taskId = parent.getAttribute("data-id");
        const taskObj = tasks.find(obj => obj.id == taskId);
        const title = parent.querySelector(".card-title");
        
        if (event.target.value !== "") {
          
            taskObj.title = event.target.value;
            updateTask(taskId, taskObj);

            title.style.display = "block";
            event.target.style.display = "none";
        }
        else {
            event.target.value = taskObj.title;
            title.style.display = "block";
            event.target.style.display = "none";
        }
    });

    taskModal.addEventListener("click", function(event) {
        const button = event.target;
        const id = button.getAttribute("id");

        if (id == "saveButton") {
            if (currentTaskId > 0) {
                updateTask(currentTaskId, {
                    title: modalTitle.value,
                    description: modalDesc.value,
                    priority: modalPriority.value,
                    dueDate: modalDate.value,
                });
            }
            else {
                addTask(currentColumnId, {
                    title: modalTitle.value,
                    description: modalDesc.value,
                    priority: modalPriority.value,
                    dueDate: modalDate.value,
                });
                taskModal.classList.add("is-hidden");
            }
        }
        else if (id == "cancelButton") {
            taskModal.classList.add("is-hidden");
            currentTaskId = 0;
        }
    });

    selectList.forEach(select => select.addEventListener('change', function(event) {
        // 1. Remove any existing priority classes
        select.classList.remove('bg-high', 'bg-medium', 'bg-low');

        // 2. Get the current value
        const val = event.target.value;

        // 3. Add the class that matches the value
        if (val == 'high')
            select.classList.add('bg-high');
        else if (val == 'medium') 
            select.classList.add('bg-medium');
        else if (val == 'low') 
            select.classList.add('bg-low');
        else 
            select.classList.remove('bg-high', 'bg-medium', 'bg-low');
    
        if (select.id == "priority-select")
            toggleCard(val);
    }));
} 

init();   // ← call init when the page loads