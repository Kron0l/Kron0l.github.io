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
        { title: "Project Beta", category: "C++ / SFML", description: "Placeholder — Description de ton deuxième projet.", link: "#", image: "" },
        { title: "Project Gamma", category: "GAMEPLAY", description: "Placeholder — Description de ton troisième projet.", link: "#", image: "" },
        { title: "Project Delta", category: "TOOLS", description: "Placeholder — Description de ton quatrième projet.", link: "#", image: "" }
    ]
};

function getData() {
    try {
        const saved = JSON.parse(localStorage.getItem("portfolioData"));
        return saved ? { ...DEFAULT_DATA, ...saved } : DEFAULT_DATA;
    } catch {
        return DEFAULT_DATA;
    }
}

function applyData(data) {
    document.querySelectorAll("[data-content]").forEach(el => {
        const key = el.dataset.content;
        if (data[key] !== undefined) el.innerText = data[key];
    });

    document.querySelectorAll("[data-content-href]").forEach(el => {
        const key = el.dataset.contentHref;
        if (data[key]) {
            el.href = key === "contact-email" ? `mailto:${data[key]}` : data[key];
            if (key === "contact-email") el.innerText = data[key];
        }
    });

    const heroTitle = document.querySelector("[data-content='hero-title']");
    if (heroTitle) {
        heroTitle.innerHTML = escapeHtml(data["hero-title"]).replace(/\n/g, "<br>");
        const parts = heroTitle.querySelectorAll("br");
        if (parts.length) {
            const last = heroTitle.lastChild;
            if (last && last.nodeType === Node.TEXT_NODE) {
                const wrapper = document.createElement("span");
                wrapper.textContent = last.textContent;
                last.replaceWith(wrapper);
            }
        }
    }

    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
}

function renderSkills(skills) {
    const container = document.getElementById("skills-list");
    if (!container) return;
    container.innerHTML = skills.map((skill, i) => `
        <article class="skill-card">
            <span class="skill-index">${String(i + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(skill.name)}</h3>
            <p>${escapeHtml(skill.description)}</p>
            <div class="skill-line"><span style="width:${Number(skill.level) || 0}%"></span></div>
        </article>
    `).join("");
}

function renderProjects(projects) {
    const container = document.getElementById("projects-list");
    if (!container) return;
    container.innerHTML = projects.map(project => `
        <article class="project-card">
            <div class="project-image placeholder-image" ${project.image ? `style="background-image:url('${escapeAttribute(project.image)}');background-size:cover;background-position:center"` : ""}>
                ${project.image ? "" : "<span>PROJECT<br>IMAGE</span>"}
            </div>
            <div class="project-body">
                <span class="project-meta">${escapeHtml(project.category)}</span>
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description)}</p>
                <a class="project-link" href="${escapeAttribute(project.link || "#")}" target="_blank" rel="noopener">Voir le projet ↗</a>
            </div>
        </article>
    `).join("");
}

function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}
function escapeAttribute(value = "") { return escapeHtml(value); }


const TRANSLATIONS = {
    fr: {
        "nav-home": "Accueil",
        "nav-about": "À propos",
        "nav-skills": "Compétences",
        "nav-projects": "Projets",
        "nav-contact": "Contact",
        "hero-project-button": "Voir mes projets",
        "hero-contact-button": "Me contacter",
        "about-eyebrow": "ABOUT ME",
        "about-title": "À propos",
        "skills-eyebrow": "ARSENAL",
        "skills-title": "Compétences",
        "projects-eyebrow": "SELECTED WORK",
        "projects-title": "Projets",
        "contact-eyebrow": "LET'S BUILD SOMETHING",
        "project-image-placeholder": "PROJECT NAME",
        "project-placeholder": "PROJECT IMAGE"
    },
    en: {
        "nav-home": "Home",
        "nav-about": "About",
        "nav-skills": "Skills",
        "nav-projects": "Projects",
        "nav-contact": "Contact",
        "hero-project-button": "View my projects",
        "hero-contact-button": "Contact me",
        "about-eyebrow": "ABOUT ME",
        "about-title": "About",
        "skills-eyebrow": "ARSENAL",
        "skills-title": "Skills",
        "projects-eyebrow": "SELECTED WORK",
        "projects-title": "Projects",
        "contact-eyebrow": "LET'S BUILD SOMETHING",
        "project-image-placeholder": "PROJECT NAME",
        "project-placeholder": "PROJECT IMAGE"
    }
};

function applyLanguage(language) {
    const translations = TRANSLATIONS[language] || TRANSLATIONS.fr;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[key] !== undefined) {
            const span = el.querySelector("span");
            if (span) {
                el.childNodes[0].textContent = translations[key] + " ";
            } else {
                el.textContent = translations[key];
            }
        }
    });

    const label = document.getElementById("language-label");
    if (label) label.textContent = language === "fr" ? "EN" : "FR";

    localStorage.setItem("portfolioLanguage", language);
}

function applyTheme(theme) {
    const light = theme === "light";
    document.body.classList.toggle("light-theme", light);

    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = light ? "☀" : "☾";

    localStorage.setItem("portfolioTheme", theme);
}

document.addEventListener("DOMContentLoaded", () => {
    applyData(getData());
    document.getElementById("year").textContent = new Date().getFullYear();

    const savedTheme = localStorage.getItem("portfolioTheme") || "dark";
    const savedLanguage = localStorage.getItem("portfolioLanguage") || "fr";
    applyTheme(savedTheme);
    applyLanguage(savedLanguage);

    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
        applyTheme(nextTheme);
    });

    document.getElementById("language-toggle")?.addEventListener("click", () => {
        const nextLanguage = document.documentElement.lang === "fr" ? "en" : "fr";
        applyLanguage(nextLanguage);
    });

    const menu = document.querySelector(".mobile-menu");
    const nav = document.querySelector(".main-nav");
    menu?.addEventListener("click", () => nav.classList.toggle("open"));
    nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
});
