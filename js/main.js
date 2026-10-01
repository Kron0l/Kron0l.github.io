let DATA = null;
let language = localStorage.getItem("language") || "fr";
const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

async function init() {
  DATA = await fetch(`./data/content.json?v=${Date.now()}`, { cache: "no-store" }).then(r => {
    if (!r.ok) throw new Error(`content.json: ${r.status}`);
    return r.json();
  });
  if (!DATA[language]) language = "fr";
  renderAll();
  $("language").addEventListener("click", () => {
    language = language === "fr" ? "en" : "fr";
    localStorage.setItem("language", language);
    renderAll();
  });
  $("theme").addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  });
}

function setImage(id, url, placeholder) {
  const el = $(id);
  if (url) {
    el.style.backgroundImage = `url("${url}")`;
    el.innerHTML = "";
  } else {
    el.style.backgroundImage = "";
    el.innerHTML = `<span>${placeholder}</span>`;
  }
}

function renderAll() {
  const d = DATA[language];
  document.documentElement.lang = language;
  $("language").textContent = language === "fr" ? "EN" : "FR";
  renderNavigation(d);
  renderHero(d);
  renderAbout(d);
  renderSkills(d);
  renderProjects(d);
  renderContact(d);
}

function renderNavigation(d) {
  $("site-name").textContent = DATA.site.name;
  $("footer-name").textContent = DATA.site.name;
  const n = d.nav;
  $("nav").innerHTML = `<a href="#home">${esc(n.home)}</a><a href="#about">${esc(n.about)}</a><a href="#skills">${esc(n.skills)}</a><a href="#projects">${esc(n.projects)}</a><a href="#contact">${esc(n.contact)}</a>`;
}

function renderHero(d) {
  $("hero-eyebrow").textContent = d.hero.eyebrow;
  $("hero-title").textContent = d.hero.title;
  $("hero-text").textContent = d.hero.text;
  $("hero-primary").textContent = d.hero.primary;
  $("hero-secondary").textContent = d.hero.secondary;
  $("hero-card-label").textContent = d.hero.cardLabel;
  $("hero-card-title").textContent = d.hero.cardTitle;
  $("hero-card-text").textContent = d.hero.cardText;
  setImage("hero-image", DATA.images.hero, "GAME PROJECT<br>IMAGE");
}

function renderAbout(d) {
  $("about-eyebrow").textContent = d.about.eyebrow;
  $("about-title").textContent = d.about.title;
  $("about-lead").textContent = d.about.lead;
  $("about-text").textContent = d.about.text;

  setImage(
    "about-image",
    DATA.images.about,
    esc(d.about.imageCaption)
  );
}

function renderSkills(d) {
  $("skills-title").textContent = d.skillsTitle;
  $("skills-list").innerHTML = d.skills.map(skill => `
    <article class="skill">
      <h3>${esc(skill.name)}</h3>
      <p>${esc(skill.description)}</p>
      <div class="meter"><i style="width:${Math.max(0, Math.min(100, Number(skill.level) || 0))}%"></i></div>
    </article>`).join("");
}

function renderProjects(d) {
  $("projects-title").textContent = d.projectsTitle;
  $("projects-list").innerHTML = d.projects.map(project => `
    <article class="project">
      <div class="media placeholder"${project.image ? ` style="background-image:url('${esc(project.image)}')"` : ""}>${project.image ? "" : "<span>PROJECT IMAGE</span>"}</div>
      <div class="project-copy">
        <small>${esc(project.category)}</small>
        <h3>${esc(project.title)}</h3>
        <p>${esc(project.description)}</p>
        <a href="${esc(project.link || "#")}" target="_blank" rel="noopener">VIEW PROJECT →</a>
      </div>
    </article>`).join("");
}

function renderContact(d) {
  $("contact-eyebrow").textContent = d.contact.eyebrow;
  $("contact-title").textContent = d.contact.title;
  $("contact-text").textContent = d.contact.text;
  $("contact-button").textContent = d.contact.button;
  $("contact-button").href = `mailto:${DATA.site.email}`;
}

init().catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML("afterbegin", "<p style='padding:20px'>Impossible de charger data/content.json.</p>");
});
