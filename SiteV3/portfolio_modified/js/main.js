const DEFAULT_DATA = {
    content: {
        fr: {
            "hero-eyebrow": "GAME DEVELOPER / PROGRAMMER",
            "hero-title": "Je donne vie aux\nmondes virtuels.",
            "hero-text": "Placeholder — Présentation courte de ton profil, de ta façon de développer et de ce qui te passionne dans le jeu vidéo.",
            "hero-project": "PROJECT NAME",
            "hero-card-label": "01 / CURRENT PROJECT",
            "hero-card-title": "PROJECT NAME",
            "about-intro": "Placeholder — Une phrase forte qui résume ton profil de développeur de jeux vidéo.",
            "about-text": "Placeholder — Présente ici ton parcours, ta formation, tes expériences et ta manière de travailler.",
            "about-image-placeholder": "PHOTO\nPLACEHOLDER",
            "stat-1-value": "02+",
            "stat-1-label": "Années d'études",
            "stat-2-value": "10+",
            "stat-2-label": "Projets",
            "stat-3-value": "∞",
            "stat-3-label": "Idées",
            "contact-title": "Un projet en tête ?\nParlons-en.",
            "contact-text": "Placeholder — Quelques lignes pour inviter les recruteurs ou studios à te contacter."
        },
        en: {
            "hero-eyebrow": "GAME DEVELOPER / PROGRAMMER",
            "hero-title": "I bring virtual\nworlds to life.",
            "hero-text": "Placeholder — A short introduction to your profile, your development approach and what drives you in game development.",
            "hero-project": "PROJECT NAME",
            "hero-card-label": "01 / CURRENT PROJECT",
            "hero-card-title": "PROJECT NAME",
            "about-intro": "Placeholder — A strong sentence that summarizes your game developer profile.",
            "about-text": "Placeholder — Introduce your background, education, experience and the way you work.",
            "about-image-placeholder": "PHOTO\nPLACEHOLDER",
            "stat-1-value": "02+",
            "stat-1-label": "Years of study",
            "stat-2-value": "10+",
            "stat-2-label": "Projects",
            "stat-3-value": "∞",
            "stat-3-label": "Ideas",
            "contact-title": "Have a project in mind?\nLet's talk.",
            "contact-text": "Placeholder — A few lines inviting recruiters or studios to get in touch."
        }
    },
    common: {
        "contact-email": "placeholder@example.com",
        "github-url": "#",
        "linkedin-url": "#",
        "hero-card-image": "",
        "about-image": ""
    },
    skills: [
        { name: {fr:"C++", en:"C++"}, description: {fr:"Programmation gameplay, architecture et systèmes.", en:"Gameplay programming, architecture and systems."}, level: 90 },
        { name: {fr:"C# / Unity", en:"C# / Unity"}, description: {fr:"Gameplay, outils, UI, systèmes et prototypage.", en:"Gameplay, tools, UI, systems and prototyping."}, level: 92 },
        { name: {fr:"SFML", en:"SFML"}, description: {fr:"Création de jeux 2D et programmation bas niveau.", en:"2D game development and low-level programming."}, level: 82 },
        { name: {fr:"Tools & Systems", en:"Tools & Systems"}, description: {fr:"Création d'outils, éditeurs et systèmes personnalisés.", en:"Custom tools, editors and systems."}, level: 78 }
    ],
    projects: [
        { title: {fr:"Project Alpha", en:"Project Alpha"}, category: {fr:"UNITY / C#", en:"UNITY / C#"}, description: {fr:"Placeholder — Description de ton premier projet.", en:"Placeholder — Description of your first project."}, link: "#", image: "" },
        { title: {fr:"Project Beta", en:"Project Beta"}, category: {fr:"C++ / SFML", en:"C++ / SFML"}, description: {fr:"Placeholder — Description de ton deuxième projet.", en:"Placeholder — Description of your second project."}, link: "#", image: "" },
        { title: {fr:"Project Gamma", en:"Project Gamma"}, category: {fr:"GAMEPLAY", en:"GAMEPLAY"}, description: {fr:"Placeholder — Description de ton troisième projet.", en:"Placeholder — Description of your third project."}, link: "#", image: "" },
        { title: {fr:"Project Delta", en:"Project Delta"}, category: {fr:"TOOLS", en:"TOOLS"}, description: {fr:"Placeholder — Description de ton quatrième projet.", en:"Placeholder — Description of your fourth project."}, link: "#", image: "" }
    ]
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeBilingual(value, fallback = "") {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return { fr: value.fr ?? fallback, en: value.en ?? value.fr ?? fallback };
    }
    return { fr: value ?? fallback, en: value ?? fallback };
}

function normalizeData(raw) {
    const data = clone(DEFAULT_DATA);
    if (!raw || typeof raw !== "object") return data;

    // Migrate the previous single-language format automatically.
    if (raw.content && raw.content.fr) {
        data.content.fr = { ...data.content.fr, ...raw.content.fr };
        data.content.en = { ...data.content.en, ...raw.content.en };
    } else {
        const oldContentKeys = Object.keys(data.content.fr);
        oldContentKeys.forEach(key => {
            if (raw[key] !== undefined) {
                data.content.fr[key] = raw[key];
                data.content.en[key] = raw[key];
            }
        });
    }

    data.common = { ...data.common, ...(raw.common || {}) };
    ["contact-email", "github-url", "linkedin-url", "hero-card-image", "about-image"].forEach(key => {
        if (raw[key] !== undefined) data.common[key] = raw[key];
    });

    if (Array.isArray(raw.skills)) {
        data.skills = raw.skills.map((skill, i) => {
            const fallback = data.skills[i] || { name:{fr:"Nouvelle compétence",en:"New skill"}, description:{fr:"Description...",en:"Description..."}, level:75 };
            return {
                name: normalizeBilingual(skill.name, fallback.name.fr),
                description: normalizeBilingual(skill.description, fallback.description.fr),
                level: Number(skill.level) || 0
            };
        });
    }

    if (Array.isArray(raw.projects)) {
        data.projects = raw.projects.map((project, i) => {
            const fallback = data.projects[i] || { title:{fr:"Nouveau projet",en:"New project"}, category:{fr:"UNITY / C#",en:"UNITY / C#"}, description:{fr:"Description...",en:"Description..."}, link:"#", image:"" };
            return {
                title: normalizeBilingual(project.title, fallback.title.fr),
                category: normalizeBilingual(project.category, fallback.category.fr),
                description: normalizeBilingual(project.description, fallback.description.fr),
                link: project.link ?? "#",
                image: project.image ?? ""
            };
        });
    }
    return data;
}

function getData() {
    try {
        return normalizeData(JSON.parse(localStorage.getItem("portfolioData")));
    } catch {
        return clone(DEFAULT_DATA);
    }
}

function textFor(value, language) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value[language] ?? value.fr ?? value.en ?? "";
    }
    return value ?? "";
}

function applyData(data, language) {
    document.querySelectorAll("[data-content]").forEach(el => {
        const key = el.dataset.content;
        if (data.content?.[language]?.[key] !== undefined) {
            el.innerText = data.content[language][key];
        }
    });

    document.querySelectorAll("[data-content-href]").forEach(el => {
        const key = el.dataset.contentHref;
        if (data.common?.[key]) {
            el.href = key === "contact-email" ? `mailto:${data.common[key]}` : data.common[key];
            if (key === "contact-email") el.innerText = data.common[key];
        }
    });

    const heroTitle = document.querySelector("[data-content='hero-title']");
    if (heroTitle) {
        heroTitle.innerHTML = escapeHtml(data.content[language]["hero-title"]).replace(/\n/g, "<br>");
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

    const heroImage = document.querySelector(".game-card-image");
    if (heroImage) {
        heroImage.style.backgroundImage = data.common["hero-card-image"] ? `url("${escapeAttribute(data.common["hero-card-image"])}")` : "";
        heroImage.classList.toggle("has-custom-image", Boolean(data.common["hero-card-image"]));
        const placeholder = heroImage.querySelector("[data-card-placeholder]");
        if (placeholder) placeholder.innerText = "GAME\nART\nPLACEHOLDER";
    }

    const heroLabel = document.querySelector("[data-content='hero-card-label']");
    if (heroLabel) heroLabel.innerText = data.content[language]["hero-card-label"];
    const heroCardTitle = document.querySelector("[data-content='hero-card-title']");
    if (heroCardTitle) heroCardTitle.innerText = data.content[language]["hero-card-title"];

    const aboutImage = document.querySelector(".about-image");
    if (aboutImage) {
        aboutImage.style.backgroundImage = data.common["about-image"] ? `url("${escapeAttribute(data.common["about-image"])}")` : "";
        aboutImage.classList.toggle("has-custom-image", Boolean(data.common["about-image"]));
        const placeholder = aboutImage.querySelector("[data-content='about-image-placeholder']");
        if (placeholder) placeholder.innerText = data.content[language]["about-image-placeholder"];
    }

    renderSkills(data.skills || [], language);
    renderProjects(data.projects || [], language);
}

function renderSkills(skills, language) {
    const container = document.getElementById("skills-list");
    if (!container) return;
    container.innerHTML = skills.map((skill, i) => `
        <article class="skill-card">
            <span class="skill-index">${String(i + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(textFor(skill.name, language))}</h3>
            <p>${escapeHtml(textFor(skill.description, language))}</p>
            <div class="skill-line"><span style="width:${Number(skill.level) || 0}%"></span></div>
        </article>
    `).join("");
}

function renderProjects(projects, language) {
    const container = document.getElementById("projects-list");
    if (!container) return;
    container.innerHTML = projects.map(project => `
        <article class="project-card">
            <div class="project-image placeholder-image" ${project.image ? `style="background-image:url('${escapeAttribute(project.image)}');background-size:cover;background-position:center"` : ""}>
                ${project.image ? "" : "<span>PROJECT<br>IMAGE</span>"}
            </div>
            <div class="project-body">
                <span class="project-meta">${escapeHtml(textFor(project.category, language))}</span>
                <h3>${escapeHtml(textFor(project.title, language))}</h3>
                <p>${escapeHtml(textFor(project.description, language))}</p>
                <a class="project-link" href="${escapeAttribute(project.link || "#")}" target="_blank" rel="noopener">${language === "fr" ? "Voir le projet" : "View project"} ↗</a>
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
        "nav-home": "Accueil", "nav-about": "À propos", "nav-skills": "Compétences", "nav-projects": "Projets", "nav-contact": "Contact",
        "hero-project-button": "Voir mes projets", "hero-contact-button": "Me contacter", "about-eyebrow": "ABOUT ME", "about-title": "À propos",
        "skills-eyebrow": "ARSENAL", "skills-title": "Compétences", "projects-eyebrow": "SELECTED WORK", "projects-title": "Projets",
        "contact-eyebrow": "LET'S BUILD SOMETHING", "project-image-placeholder": "PROJECT NAME", "project-placeholder": "PROJECT IMAGE"
    },
    en: {
        "nav-home": "Home", "nav-about": "About", "nav-skills": "Skills", "nav-projects": "Projects", "nav-contact": "Contact",
        "hero-project-button": "View my projects", "hero-contact-button": "Contact me", "about-eyebrow": "ABOUT ME", "about-title": "About",
        "skills-eyebrow": "ARSENAL", "skills-title": "Skills", "projects-eyebrow": "SELECTED WORK", "projects-title": "Projects",
        "contact-eyebrow": "LET'S BUILD SOMETHING", "project-image-placeholder": "PROJECT NAME", "project-placeholder": "PROJECT IMAGE"
    }
};

function applyLanguage(language) {
    const translations = TRANSLATIONS[language] || TRANSLATIONS.fr;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[key] !== undefined) {
            const span = el.querySelector("span");
            if (span) el.childNodes[0].textContent = translations[key] + " ";
            else el.textContent = translations[key];
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
    const data = getData();
    let language = localStorage.getItem("portfolioLanguage") || "fr";
    applyData(data, language);
    document.getElementById("year").textContent = new Date().getFullYear();

    const savedTheme = localStorage.getItem("portfolioTheme") || "dark";
    applyTheme(savedTheme);
    applyLanguage(language);

    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
        applyTheme(nextTheme);
    });

    document.getElementById("language-toggle")?.addEventListener("click", () => {
        language = document.documentElement.lang === "fr" ? "en" : "fr";
        applyData(data, language);
        applyLanguage(language);
    });

    const menu = document.querySelector(".mobile-menu");
    const nav = document.querySelector(".main-nav");
    menu?.addEventListener("click", () => nav.classList.toggle("open"));
    nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
});
