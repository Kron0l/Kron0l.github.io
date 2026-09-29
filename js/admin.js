const DEFAULT_DATA = {
    "hero-eyebrow": "GAME DEVELOPER / PROGRAMMER",
    "hero-title": "Je donne vie aux\nmondes virtuels.",
    "hero-text": "Placeholder — Présentation courte de ton profil, de ta façon de développer et de ce qui te passionne dans le jeu vidéo.",
    "hero-project": "PROJECT NAME",
    "about-intro": "Placeholder — Une phrase forte qui résume ton profil de développeur de jeux vidéo.",
    "about-text": "Placeholder — Présente ici ton parcours, ta formation, tes expériences et ta manière de travailler.",
    "stat-1-value": "02+",
    "stat-1-label": "Années d'études",
    "stat-2-value": "10+",
    "stat-2-label": "Projets",
    "stat-3-value": "∞",
    "stat-3-label": "Idées",
    "contact-title": "Un projet en tête ?\nParlons-en.",
    "contact-text": "Placeholder — Quelques lignes pour inviter les recruteurs ou studios à te contacter.",
    "contact-email": "placeholder@example.com",
    "github-url": "#",
    "linkedin-url": "#",
    skills: [
        { name: "C++", description: "Programmation gameplay, architecture et systèmes.", level: 90 },
        { name: "C# / Unity", description: "Gameplay, outils, UI, systèmes et prototypage.", level: 92 },
        { name: "SFML", description: "Création de jeux 2D et programmation bas niveau.", level: 82 },
        { name: "Tools & Systems", description: "Création d'outils, éditeurs et systèmes personnalisés.", level: 78 }
    ],
    projects: [
        { title: "Project Alpha", category: "UNITY / C#", description: "Placeholder — Description de ton premier projet.", link: "#", image: "" },
        { title: "Project Beta", category: "C++ / SFML", description: "Placeholder — Description de ton deuxième projet.", link: "#", image: "" }
    ]
};

let data = loadData();

function loadData() {
    try {
        const saved = JSON.parse(localStorage.getItem("portfolioData"));
        return saved ? { ...DEFAULT_DATA, ...saved } : structuredClone(DEFAULT_DATA);
    } catch {
        return structuredClone(DEFAULT_DATA);
    }
}

function saveData() {
    localStorage.setItem("portfolioData", JSON.stringify(data));
    showSaveMessage();
}

function showSaveMessage() {
    const msg = document.getElementById("save-message");
    msg.style.display = "block";
    setTimeout(() => msg.style.display = "none", 2200);
}

function fillFields() {
    document.querySelectorAll("[data-field]").forEach(field => {
        const key = field.dataset.field;
        field.value = data[key] ?? "";
    });
}

function readFields() {
    document.querySelectorAll("[data-field]").forEach(field => {
        data[field.dataset.field] = field.value;
    });
}

function renderSkillsEditor() {
    const container = document.getElementById("skills-editor");
    container.innerHTML = "";

    data.skills.forEach((skill, index) => {
        const card = document.createElement("div");
        card.className = "editor-card";
        card.innerHTML = `
            <div class="editor-card-header">
                <strong>COMPÉTENCE ${String(index + 1).padStart(2, "0")}</strong>
                <button class="delete-button" type="button">Supprimer</button>
            </div>
            <div class="editor-grid">
                <div class="field">
                    <label>Nom</label>
                    <input data-key="name" value="${escapeAttribute(skill.name)}">
                </div>
                <div class="field">
                    <label>Niveau (%)</label>
                    <input data-key="level" type="number" min="0" max="100" value="${skill.level}">
                </div>
                <div class="field full">
                    <label>Description</label>
                    <textarea data-key="description" rows="3">${escapeHtml(skill.description)}</textarea>
                </div>
            </div>
        `;

        card.querySelectorAll("[data-key]").forEach(input => {
            input.addEventListener("input", () => {
                data.skills[index][input.dataset.key] = input.type === "number" ? Number(input.value) : input.value;
            });
        });

        card.querySelector(".delete-button").addEventListener("click", () => {
            data.skills.splice(index, 1);
            renderSkillsEditor();
        });

        container.appendChild(card);
    });
}

function renderProjectsEditor() {
    const container = document.getElementById("projects-editor");
    container.innerHTML = "";

    data.projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.className = "editor-card";
        card.innerHTML = `
            <div class="editor-card-header">
                <strong>PROJET ${String(index + 1).padStart(2, "0")}</strong>
                <button class="delete-button" type="button">Supprimer</button>
            </div>
            <div class="editor-grid">
                <div class="field">
                    <label>Nom</label>
                    <input data-key="title" value="${escapeAttribute(project.title)}">
                </div>
                <div class="field">
                    <label>Catégorie / technologies</label>
                    <input data-key="category" value="${escapeAttribute(project.category)}">
                </div>
                <div class="field full">
                    <label>Description</label>
                    <textarea data-key="description" rows="3">${escapeHtml(project.description)}</textarea>
                </div>
                <div class="field">
                    <label>Lien</label>
                    <input data-key="link" value="${escapeAttribute(project.link)}">
                </div>
                <div class="field">
                    <label>URL de l'image</label>
                    <input data-key="image" value="${escapeAttribute(project.image)}">
                </div>
            </div>
        `;

        card.querySelectorAll("[data-key]").forEach(input => {
            input.addEventListener("input", () => {
                data.projects[index][input.dataset.key] = input.value;
            });
        });

        card.querySelector(".delete-button").addEventListener("click", () => {
            data.projects.splice(index, 1);
            renderProjectsEditor();
        });

        container.appendChild(card);
    });
}

function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}
function escapeAttribute(value = "") { return escapeHtml(value); }

function showAdmin() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("admin-app").classList.remove("hidden");
    fillFields();
    renderSkillsEditor();
    renderProjectsEditor();
}

document.addEventListener("DOMContentLoaded", () => {
    const loggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
    if (loggedIn) showAdmin();

    document.getElementById("login-form").addEventListener("submit", event => {
        event.preventDefault();
        const password = document.getElementById("admin-password").value;

        if (password === "admin123") {
            sessionStorage.setItem("adminLoggedIn", "true");
            showAdmin();
        } else {
            document.getElementById("login-error").textContent = "Mot de passe incorrect.";
        }
    });

    document.getElementById("save-button").addEventListener("click", () => {
        readFields();
        saveData();
    });

    document.getElementById("reset-button").addEventListener("click", () => {
        if (!confirm("Réinitialiser toutes les données du portfolio ?")) return;
        data = structuredClone(DEFAULT_DATA);
        localStorage.removeItem("portfolioData");
        fillFields();
        renderSkillsEditor();
        renderProjectsEditor();
        showSaveMessage();
    });

    document.getElementById("logout-button").addEventListener("click", () => {
        sessionStorage.removeItem("adminLoggedIn");
        location.reload();
    });

    document.getElementById("add-skill").addEventListener("click", () => {
        data.skills.push({ name: "Nouvelle compétence", description: "Description...", level: 75 });
        renderSkillsEditor();
    });

    document.getElementById("add-project").addEventListener("click", () => {
        data.projects.push({ title: "Nouveau projet", category: "UNITY / C#", description: "Description...", link: "#", image: "" });
        renderProjectsEditor();
    });
});
