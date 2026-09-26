/* =====================================================
   TASKFLOW
   JavaScript Fundamentals
   DOM + Events + Forms + Validation + localStorage
   ===================================================== */


/* ================= VARIABLES ================= */

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");

const taskModal = document.getElementById("taskModal");
const deleteModal = document.getElementById("deleteModal");

const openAddTask = document.getElementById("openAddTask");
const openAddTask2 = document.getElementById("openAddTask2");
const emptyAddTask = document.getElementById("emptyAddTask");

const closeModal = document.getElementById("closeModal");
const cancelTask = document.getElementById("cancelTask");

const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const searchInput = document.getElementById("searchInput");
const sortTasks = document.getElementById("sortTasks");

const modalTitle = document.getElementById("modalTitle");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressPercent = document.getElementById("progressPercent");
const heroProgress = document.getElementById("heroProgress");

const emptyState = document.getElementById("emptyState");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* ================= APP STATE ================= */

let tasks = [];

let currentFilter = "all";

let editingTaskId = null;

let deletingTaskId = null;


/* ================= LOCAL STORAGE ================= */

const savedTasks =
    localStorage.getItem("taskflowTasks");


if (savedTasks) {

    tasks = JSON.parse(savedTasks);

}


/* ================= SAVE DATA ================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* ================= OPEN ADD MODAL ================= */

function openTaskModal() {

    editingTaskId = null;

    modalTitle.textContent = "Create New Task";

    taskForm.reset();

    removeErrors();

    taskModal.classList.add("active");

}


openAddTask.addEventListener(
    "click",
    openTaskModal
);


openAddTask2.addEventListener(
    "click",
    openTaskModal
);


emptyAddTask.addEventListener(
    "click",
    openTaskModal
);


/* ================= CLOSE MODAL ================= */

function closeTaskModal() {

    taskModal.classList.remove("active");

    taskForm.reset();

    removeErrors();

    editingTaskId = null;

}


closeModal.addEventListener(
    "click",
    closeTaskModal
);


cancelTask.addEventListener(
    "click",
    closeTaskModal
);


/* ================= REMOVE ERRORS ================= */

function removeErrors() {

    const groups =
        document.querySelectorAll(".form-group");

    groups.forEach(function(group) {

        group.classList.remove("error");

    });

}


/* ================= FORM VALIDATION ================= */

function validateForm() {

    let valid = true;


    if (taskTitle.value.trim() === "") {

        taskTitle.parentElement.classList.add("error");

        valid = false;

    } else {

        taskTitle.parentElement.classList.remove("error");

    }


    if (taskDate.value === "") {

        taskDate.parentElement.classList.add("error");

        valid = false;

    } else {

        taskDate.parentElement.classList.remove("error");

    }


    return valid;

}


/* ================= ADD / EDIT TASK ================= */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    if (!validateForm()) {

        return;

    }


    const title =
        taskTitle.value.trim();

    const description =
        taskDescription.value.trim();

    const date =
        taskDate.value;

    const priority =
        taskPriority.value;


    /* EDIT */

    if (editingTaskId !== null) {

        const task =
            tasks.find(function(item) {

                return item.id === editingTaskId;

            });


        if (task) {

            task.title = title;

            task.description = description;

            task.date = date;

            task.priority = priority;

        }

    }


    /* ADD */

    else {

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            date: date,

            priority: priority,

            completed: false

        };


        tasks.push(newTask);

    }


    saveTasks();

    displayTasks();

    closeTaskModal();

});


/* ================= DISPLAY TASKS ================= */

function displayTasks() {

    taskList.innerHTML = "";


    let visibleTasks = [];


    /* FILTER */

    if (currentFilter === "all") {

        visibleTasks = tasks;

    }

    else if (currentFilter === "pending") {

        visibleTasks =
            tasks.filter(function(task) {

                return task.completed === false;

            });

    }

    else if (currentFilter === "completed") {

        visibleTasks =
            tasks.filter(function(task) {

                return task.completed === true;

            });

    }


    /* SEARCH */

    const search =
        searchInput.value.toLowerCase();


    visibleTasks =
        visibleTasks.filter(function(task) {

            return task.title
                .toLowerCase()
                .includes(search);

        });


    /* SORT */

    if (sortTasks.value === "newest") {

        visibleTasks.sort(function(a, b) {

            return b.id - a.id;

        });

    }

    else if (sortTasks.value === "oldest") {

        visibleTasks.sort(function(a, b) {

            return a.id - b.id;

        });

    }

    else if (sortTasks.value === "priority") {

        const priorityValue = {

            high: 1,
            medium: 2,
            low: 3

        };


        visibleTasks.sort(function(a, b) {

            return priorityValue[a.priority] -
                   priorityValue[b.priority];

        });

    }


    /* EMPTY STATE */

    if (visibleTasks.length === 0) {

        emptyState.style.display = "block";

    }

    else {

        emptyState.style.display = "none";

    }


    /* CREATE TASK CARDS */

    visibleTasks.forEach(function(task) {

        const card =
            document.createElement("article");

        card.classList.add("task-card");


        /* CHECKBOX */

        const checkBoxArea =
            document.createElement("div");

        checkBoxArea.classList.add("task-check");


        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.classList.add("task-checkbox");

        checkbox.checked = task.completed;


        const customCheckbox =
            document.createElement("span");

        customCheckbox.classList.add(
            "custom-checkbox"
        );


        checkBoxArea.appendChild(checkbox);

        checkBoxArea.appendChild(customCheckbox);


        /* CONTENT */

        const content =
            document.createElement("div");

        content.classList.add("task-content");


        const top =
            document.createElement("div");

        top.classList.add("task-top");


        const title =
            document.createElement("h3");

        title.textContent = task.title;


        const priority =
            document.createElement("span");

        priority.classList.add(
            "priority",
            task.priority
        );


        priority.textContent =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1);


        top.appendChild(title);

        top.appendChild(priority);


        const description =
            document.createElement("p");

        description.textContent =
            task.description ||
            "No description added.";


        const meta =
            document.createElement("div");

        meta.classList.add("task-meta");


        const date =
            document.createElement("span");

        date.textContent =
            "📅 " + task.date;


        const status =
            document.createElement("span");


        if (task.completed) {

            status.textContent =
                "✓ Completed";

            status.classList.add(
                "completed-status"
            );

        }

        else {

            status.textContent =
                "◷ Pending";

        }


        meta.appendChild(date);

        meta.appendChild(status);


        content.appendChild(top);

        content.appendChild(description);

        content.appendChild(meta);


        /* ACTIONS */

        const actions =
            document.createElement("div");

        actions.classList.add("task-actions");


        const editButton =
            document.createElement("button");

        editButton.classList.add(
            "action-btn",
            "edit-btn"
        );

        editButton.textContent = "✎";


        const deleteButton =
            document.createElement("button");

        deleteButton.classList.add(
            "action-btn",
            "delete-btn"
        );

        deleteButton.textContent = "🗑";


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        /* ADD CARD */

        card.appendChild(checkBoxArea);

        card.appendChild(content);

        card.appendChild(actions);

        taskList.appendChild(card);


        /* COMPLETE */

        checkbox.addEventListener(
            "change",
            function() {

                task.completed =
                    checkbox.checked;

                saveTasks();

                displayTasks();

            }
        );


        /* EDIT */

        editButton.addEventListener(
            "click",
            function() {

                editTask(task.id);

            }
        );


        /* DELETE */

        deleteButton.addEventListener(
            "click",
            function() {

                openDeleteModal(task.id);

            }
        );

    });


    updateStatistics();

}


/* ================= EDIT TASK ================= */

function editTask(id) {

    const task =
        tasks.find(function(item) {

            return item.id === id;

        });


    if (task) {

        editingTaskId = id;

        modalTitle.textContent =
            "Edit Task";


        taskTitle.value =
            task.title;

        taskDescription.value =
            task.description;

        taskDate.value =
            task.date;

        taskPriority.value =
            task.priority;


        removeErrors();

        taskModal.classList.add("active");

    }

}


/* ================= DELETE MODAL ================= */

function openDeleteModal(id) {

    deletingTaskId = id;

    deleteModal.classList.add("active");

}


cancelDelete.addEventListener(
    "click",
    function() {

        deleteModal.classList.remove("active");

        deletingTaskId = null;

    }
);


/* ================= CONFIRM DELETE ================= */

confirmDelete.addEventListener(
    "click",
    function() {

        tasks =
            tasks.filter(function(task) {

                return task.id !== deletingTaskId;

            });


        saveTasks();

        displayTasks();

        deleteModal.classList.remove("active");

        deletingTaskId = null;

    }
);


/* ================= FILTER ================= */

filterButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            filterButtons.forEach(
                function(item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add("active");


            currentFilter =
                button.dataset.filter;


            displayTasks();

        }
    );

});


/* ================= SEARCH ================= */

searchInput.addEventListener(
    "input",
    function() {

        displayTasks();

    }
);


/* ================= SORT ================= */

sortTasks.addEventListener(
    "change",
    function() {

        displayTasks();

    }
);


/* ================= KEYBOARD EVENT ================= */

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            searchInput.value = "";

            displayTasks();

        }

    }
);


/* ================= UPDATE STATISTICS ================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed === true;

        }).length;


    const pending =
        total - completed;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

    progressPercent.textContent =
        percentage + "%";

    heroProgress.textContent =
        percentage + "%";

}


/* ================= CLOSE OUTSIDE MODAL ================= */

taskModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === taskModal
        ) {

            closeTaskModal();

        }

    }
);


/* ================= INITIALIZE ================= */

displayTasks();

updateStatistics();