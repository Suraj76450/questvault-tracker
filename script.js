const container = document.getElementById("container");
const solvedText = document.getElementById("solved");
const totalText = document.getElementById("total");
const remainingText = document.getElementById("remaining");
const statusText = document.getElementById("statusText");
const saveBtn = document.getElementById("saveBtn");
const continueBtn = document.getElementById("continueBtn");
const addBlocksBtn = document.getElementById("addBlocksBtn");
const removeBlocksBtn = document.getElementById("removeBlocksBtn");
const renameBtn = document.getElementById("renameBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const newFileBtn = document.getElementById("newFileBtn");
const jumpInput = document.getElementById("jumpInput");
const jumpBtn = document.getElementById("jumpBtn");
const markAllBtn = document.getElementById("markAllBtn");
const clearSolvedBtn = document.getElementById("clearSolvedBtn");
const projectList = document.getElementById("projectList");
const projectTitle = document.getElementById("projectTitle");
const emptyState = document.getElementById("emptyState");
const completionBurst = document.getElementById("completionBurst");

const projectsKey = "questVaultProjects";
const activeProjectKey = "questVaultActiveProject";
let boxes = {};

let projects = loadProjects();
let activeProjectName =
    localStorage.getItem(activeProjectKey) || Object.keys(projects)[0] || null;

if (!projects[activeProjectName]) {
    activeProjectName = Object.keys(projects)[0] || null;
}

let activeProject = activeProjectName ? projects[activeProjectName] : null;

newFileBtn.addEventListener("click", () => {
    createNewProject();
});

saveBtn.addEventListener("click", () => {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    saveProject("Saved " + activeProjectName);
});

continueBtn.addEventListener("click", () => {
    continueFromLastQuestion();
});

addBlocksBtn.addEventListener("click", () => {
    addBlocks();
});

removeBlocksBtn.addEventListener("click", () => {
    removeBlocks();
});

renameBtn.addEventListener("click", () => {
    renameProject();
});

nextBtn.addEventListener("click", () => {
    jumpToNextUnsolved();
});

jumpBtn.addEventListener("click", () => {
    jumpToQuestion(Number(jumpInput.value));
});

markAllBtn.addEventListener("click", () => {
    markAllSolved();
});

clearSolvedBtn.addEventListener("click", () => {
    clearSolved();
});

resetBtn.addEventListener("click", () => {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    if (!confirm("Reset only " + activeProjectName + "?")) {
        return;
    }

    activeProject.solvedQuestions = [];
    activeProject.lastQuestion = null;
    activeProject.totalQuestions = activeProject.totalQuestions || 100;
    saveProject(activeProjectName + " reset");
    renderActiveProject();
});

function loadProjects() {
    const savedProjects = JSON.parse(localStorage.getItem(projectsKey) || "null");

    if (savedProjects) {
        Object.keys(savedProjects).forEach(projectName => {
            savedProjects[projectName] = normalizeProject(savedProjects[projectName]);
        });

        return savedProjects;
    }

    const oldSolvedQuestions =
        JSON.parse(localStorage.getItem("solvedQuestions")) || [];
    const oldLastQuestion =
        Number(localStorage.getItem("lastQuestion")) || null;
    const oldSavedAt = localStorage.getItem("lastSavedAt");

    return {
        DSA: {
            solvedQuestions: oldSolvedQuestions,
            lastQuestion: oldLastQuestion,
            savedAt: oldSavedAt,
            totalQuestions: Math.max(100, oldSolvedQuestions.length)
        }
    };
}

function createNewProject() {
    const projectName = prompt("Enter file name, like SQL or DSA");

    if (!projectName) {
        return;
    }

    const cleanName = projectName.trim();

    if (!cleanName) {
        return;
    }

    if (projects[cleanName]) {
        switchProject(cleanName);
        return;
    }

    projects[cleanName] = {
        solvedQuestions: [],
        lastQuestion: null,
        savedAt: null,
        totalQuestions: 100
    };

    switchProject(cleanName);
    saveProject("Created " + cleanName);
}

function switchProject(projectName) {
    activeProjectName = projectName;
    activeProject = normalizeProject(projects[activeProjectName]);
    projects[activeProjectName] = activeProject;
    localStorage.setItem(activeProjectKey, activeProjectName);
    renderActiveProject();
}

function toggleQuestion(questionNumber) {
    const solvedQuestions = activeProject.solvedQuestions;
    const alreadySolved = solvedQuestions.includes(questionNumber);
    const wasComplete =
        activeProject.solvedQuestions.length === activeProject.totalQuestions;

    if (alreadySolved) {
        activeProject.solvedQuestions =
            solvedQuestions.filter(num => num !== questionNumber);
    } else {
        activeProject.solvedQuestions.push(questionNumber);
    }

    activeProject.lastQuestion = questionNumber;
    saveProject("Saved " + activeProjectName);
    renderActiveProject();

    if (!alreadySolved && boxes[questionNumber]) {
        boxes[questionNumber].classList.add("solved-pop");
    }

    if (!wasComplete &&
        activeProject.solvedQuestions.length === activeProject.totalQuestions) {
        showCompletionBurst();
    }
}

function addBlocks() {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    const amountText = prompt("How many blocks do you want to add?");
    const amount = Number(amountText);

    if (!Number.isInteger(amount) || amount <= 0) {
        alert("Please enter a valid number of blocks");
        return;
    }

    activeProject.totalQuestions += amount;
    saveProject("Added " + amount + " blocks to " + activeProjectName);
    renderActiveProject();
}

function removeBlocks() {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    const amountText = prompt("How many blocks do you want to remove?");
    const amount = Number(amountText);

    if (!Number.isInteger(amount) || amount <= 0) {
        alert("Please enter a valid number of blocks");
        return;
    }

    if (amount >= activeProject.totalQuestions) {
        alert("Keep at least 1 block in the file");
        return;
    }

    const newTotal = activeProject.totalQuestions - amount;

    activeProject.totalQuestions = newTotal;
    activeProject.solvedQuestions =
        activeProject.solvedQuestions.filter(num => num <= newTotal);

    if (activeProject.lastQuestion > newTotal) {
        activeProject.lastQuestion = null;
    }

    saveProject("Removed blocks");
    renderActiveProject();
}

function deleteProject(projectName) {
    if (!confirm("Delete " + projectName + " forever?")) {
        return;
    }

    delete projects[projectName];

    if (Object.keys(projects).length === 0) {
        activeProjectName = null;
        activeProject = null;
        localStorage.removeItem(activeProjectKey);
    } else if (projectName === activeProjectName) {
        activeProjectName = Object.keys(projects)[0];
        activeProject = projects[activeProjectName];
    }

    localStorage.setItem(projectsKey, JSON.stringify(projects));
    if (activeProjectName) {
        localStorage.setItem(activeProjectKey, activeProjectName);
    }
    renderActiveProject();
}

function saveProject(message) {
    activeProject.savedAt = new Date().toISOString();
    projects[activeProjectName] = activeProject;

    localStorage.setItem(projectsKey, JSON.stringify(projects));
    localStorage.setItem(activeProjectKey, activeProjectName);

    updateProjectList();
}

function renderActiveProject() {
    if (!activeProject) {
        renderEmptyState();
        return;
    }

    emptyState.classList.remove("show");
    renderBoxes();

    activeProject.solvedQuestions.forEach(questionNumber => {
        if (boxes[questionNumber]) {
            boxes[questionNumber].classList.add("completed");
        }
    });

    projectTitle.innerText = activeProjectName + " Tracker";
    updateStats();
    updateProjectList();
}

function updateStats() {
    if (!activeProject) {
        solvedText.innerText = 0;
        totalText.innerText = 0;
        remainingText.innerText = 0;
        statusText.innerText = "Empty";
        document.getElementById("percentage").innerText =
            "0% Completed";
        document.getElementById("progressBar").style.width =
            "0%";
        return;
    }

    const solved = activeProject.solvedQuestions.length;
    const total = activeProject.totalQuestions;
    const percent = Math.round((solved / total) * 100);

    solvedText.innerText = solved;
    totalText.innerText = total;
    remainingText.innerText = total - solved;
    statusText.innerText = percent === 100 ? "Complete" : "In Progress";

    document.getElementById("percentage").innerText =
        percent + "% Completed";
    document.getElementById("progressBar").style.width =
        percent + "%";
}

function continueFromLastQuestion() {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    const lastQuestion = activeProject.lastQuestion;

    if (!lastQuestion || !boxes[lastQuestion]) {
        alert("Choose a question in " + activeProjectName + " first");
        return;
    }

    Object.values(boxes).forEach(box => box.classList.remove("current"));
    boxes[lastQuestion].classList.add("current");
    boxes[lastQuestion].scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}

function updateProjectList() {
    projectList.innerHTML = "";

    Object.keys(projects).forEach(projectName => {
        const project = projects[projectName];
        const projectFile = document.createElement("div");
        const projectButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        const solvedCount = project.solvedQuestions.length;
        const totalCount = project.totalQuestions || 100;

        projectFile.className = "project-row";
        projectButton.className = "project-file";
        deleteButton.className = "delete-file";

        if (projectName === activeProjectName) {
            projectFile.classList.add("active");
        }

        projectButton.type = "button";
        const nameText = document.createElement("span");
        const progressText = document.createElement("small");

        nameText.innerText = projectName;
        progressText.innerText = solvedCount + "/" + totalCount + " solved";
        projectButton.appendChild(nameText);
        projectButton.appendChild(progressText);
        projectButton.addEventListener("click", () => {
            switchProject(projectName);
        });

        deleteButton.type = "button";
        deleteButton.innerText = "X";
        deleteButton.title = "Delete " + projectName;
        deleteButton.setAttribute("aria-label", "Delete " + projectName);
        deleteButton.addEventListener("click", () => {
            deleteProject(projectName);
        });

        projectFile.appendChild(projectButton);
        projectFile.appendChild(deleteButton);
        projectList.appendChild(projectFile);
    });
}

function renderBoxes() {
    container.innerHTML = "";
    boxes = {};

    for (let i = 1; i <= activeProject.totalQuestions; i++) {
        const box = document.createElement("div");

        box.classList.add("box");
        box.innerText = i;
        boxes[i] = box;

        box.addEventListener("click", () => {
            toggleQuestion(i);
        });

        container.appendChild(box);
    }
}

function renderEmptyState() {
    container.innerHTML = "";
    boxes = {};
    projectTitle.innerText = "No File Selected";
    emptyState.classList.add("show");
    updateStats();
    updateProjectList();
}

function showCompletionBurst() {
    completionBurst.classList.remove("show");
    void completionBurst.offsetWidth;
    completionBurst.classList.add("show");
}

function renameProject() {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    const newName = prompt("Enter new file name", activeProjectName);

    if (!newName) {
        return;
    }

    const cleanName = newName.trim();

    if (!cleanName || cleanName === activeProjectName) {
        return;
    }

    if (projects[cleanName]) {
        alert(cleanName + " already exists");
        return;
    }

    projects[cleanName] = activeProject;
    delete projects[activeProjectName];
    activeProjectName = cleanName;
    localStorage.setItem(projectsKey, JSON.stringify(projects));
    localStorage.setItem(activeProjectKey, activeProjectName);
    renderActiveProject();
}

function jumpToQuestion(questionNumber) {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    if (!Number.isInteger(questionNumber) ||
        questionNumber < 1 ||
        questionNumber > activeProject.totalQuestions) {
        alert("Enter a number from 1 to " + activeProject.totalQuestions);
        return;
    }

    highlightQuestion(questionNumber);
}

function jumpToNextUnsolved() {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    for (let i = 1; i <= activeProject.totalQuestions; i++) {
        if (!activeProject.solvedQuestions.includes(i)) {
            highlightQuestion(i);
            return;
        }
    }

    alert("Everything is solved in this file");
}

function markAllSolved() {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    activeProject.solvedQuestions = [];

    for (let i = 1; i <= activeProject.totalQuestions; i++) {
        activeProject.solvedQuestions.push(i);
    }

    activeProject.lastQuestion = activeProject.totalQuestions;
    saveProject("Marked all");
    renderActiveProject();
    showCompletionBurst();
}

function clearSolved() {
    if (!activeProject) {
        alert("Create a file first");
        return;
    }

    if (!confirm("Clear solved questions in " + activeProjectName + "?")) {
        return;
    }

    activeProject.solvedQuestions = [];
    activeProject.lastQuestion = null;
    saveProject("Cleared solved");
    renderActiveProject();
}

function highlightQuestion(questionNumber) {
    Object.values(boxes).forEach(box => box.classList.remove("current"));
    boxes[questionNumber].classList.add("current");
    boxes[questionNumber].scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function normalizeProject(project) {
    const solvedQuestions = project.solvedQuestions || [];
    const highestSolved = solvedQuestions.length > 0
        ? Math.max(...solvedQuestions)
        : 0;

    return {
        solvedQuestions,
        lastQuestion: project.lastQuestion || null,
        savedAt: project.savedAt || null,
        totalQuestions: Math.max(project.totalQuestions || 100, highestSolved)
    };
}

if (!localStorage.getItem(projectsKey)) {
    saveProject("Opened " + activeProjectName);
}

renderActiveProject();
