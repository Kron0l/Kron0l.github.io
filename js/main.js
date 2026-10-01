
let DATA, language=localStorage.getItem("language")||"fr";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
async function init(){DATA=await fetch("./data/content.json",{cache:"no-store"}).then(r=>r.json());render();$("language").onclick=()=>{language=language==="fr"?"en":"fr";localStorage.setItem("language",language);render()};$("theme").onclick=()=>{let t=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=t;localStorage.setItem("theme",t)}}
function setImage(id,url,placeholder){let el=$(id);if(url){el.style.backgroundImage=`url("${url}")`;el.innerHTML=""}else{el.style.backgroundImage="";el.innerHTML=`<span>${placeholder}</span>`}}
function renderSkills(d) {
  const skillsTitle = $("skills-title");
  const skillsList = $("skills-list");

  skillsTitle.textContent = d.skillsTitle;
  skillsList.replaceChildren();

  d.skills.forEach(skill => {
    const article = document.createElement("article");
    article.className = "skill";

    const title = document.createElement("h3");
    title.textContent = skill.name;

    const description = document.createElement("p");
    description.textContent = skill.description;

    const meter = document.createElement("div");
    meter.className = "meter";
    const level = document.createElement("i");
    level.style.width = `${Math.max(0, Math.min(100, Number(skill.level) || 0))}%`;
    meter.appendChild(level);

    article.append(title, description, meter);
    skillsList.appendChild(article);
  });
}

function render(){let d=DATA[language],n=d.nav;$("language").textContent=language==="fr"?"EN":"FR";$("site-name").textContent=DATA.site.name;$("footer-name").textContent=DATA.site.name;$("nav").innerHTML=`<a href="#home">${n.home}</a><a href="#about">${n.about}</a><a href="#skills">${n.skills}</a><a href="#projects">${n.projects}</a><a href="#contact">${n.contact}</a>`;
["eyebrow","title","text"].forEach(k=>$("hero-"+k).textContent=d.hero[k]);$("hero-primary").textContent=d.hero.primary;$("hero-secondary").textContent=d.hero.secondary;$("hero-card-label").textContent=d.hero.cardLabel;$("hero-card-title").textContent=d.hero.cardTitle;$("hero-card-text").textContent=d.hero.cardText;setImage("hero-image",DATA.images.hero,"GAME PROJECT<br>IMAGE");
["eyebrow","title","lead","text"].forEach(k=>$("about-"+k).textContent=d.about[k]);$("about-image-caption").textContent=d.about.imageCaption;setImage("about-image",DATA.images.about,esc(d.about.imageCaption));
renderSkills(d);
$("projects-title").textContent=d.projectsTitle;$("projects-list").innerHTML=d.projects.map(p=>`<article class="project"><div class="media placeholder"${p.image?` style="background-image:url('${esc(p.image)}')"`:""}>${p.image?"":"<span>PROJECT IMAGE</span>"}</div><div class="project-copy"><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><a href="${esc(p.link||"#")}" target="_blank" rel="noopener">VIEW PROJECT →</a></div></article>`).join("");
$("contact-eyebrow").textContent=d.contact.eyebrow;$("contact-title").textContent=d.contact.title;$("contact-text").textContent=d.contact.text;$("contact-button").textContent=d.contact.button;$("contact-button").href="mailto:"+DATA.site.email}
init().catch(e=>document.body.insertAdjacentHTML("afterbegin","<p style='padding:20px'>Impossible de charger data/content.json. Lance le site via GitHub Pages ou un serveur local.</p>"));
