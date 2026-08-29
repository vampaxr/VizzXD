const projectGrid = document.getElementById("projects");

const fallbackProjects = [
  {
    title: "Custom Events",
    type: "Events",
    number: "01"
  },
  {
    title: "Server Plugins",
    type: "Plugins",
    number: "02"
  },
  {
    title: "Community Projects",
    type: "Custom",
    number: "03"
  },
  {
    title: "More Soon",
    type: "In Development",
    number: "04"
  }
];


function createProject(project, index) {

  const card = document.createElement("article");

  card.className = "project";

  const image = document.createElement("div");

  image.className = "project-image";

  image.dataset.number =
    project.number || String(index + 1).padStart(2, "0");

  if (project.image) {
    image.style.backgroundImage =
      `url("${project.image}")`;

    image.style.backgroundSize = "cover";
    image.style.backgroundPosition = "center";

    image.style.setProperty(
      "--project-image",
      `url("${project.image}")`
    );
  }

  const info = document.createElement("div");

  info.className = "project-info";

  const text = document.createElement("div");

  const title = document.createElement("div");

  title.className = "project-title";

  title.textContent =
    project.title || "Untitled";

  const type = document.createElement("div");

  type.className = "project-type";

  type.textContent =
    project.type || "Project";

  text.appendChild(title);
  text.appendChild(type);

  const arrow = document.createElement("div");

  arrow.className = "project-arrow";

  arrow.textContent = "↗";

  info.appendChild(text);
  info.appendChild(arrow);

  card.appendChild(image);
  card.appendChild(info);

  return card;
}


function renderProjects(projects) {

  if (!projectGrid) return;

  projectGrid.innerHTML = "";

  projects.forEach((project, index) => {
    projectGrid.appendChild(
      createProject(project, index)
    );
  });
}


async function loadProjects() {

  try {

    const response =
      await fetch("work.json");

    if (!response.ok) {
      throw new Error("work.json not found");
    }

    const projects =
      await response.json();

    if (!Array.isArray(projects) || !projects.length) {
      throw new Error("No projects");
    }

    renderProjects(projects);

  } catch (error) {

    console.log(
      "Using default projects:",
      error.message
    );

    renderProjects(
      fallbackProjects
    );
  }
}


loadProjects();


/* SMALL SCROLL EFFECT */

const heroTitle =
  document.querySelector(".title-wrap");

window.addEventListener(
  "scroll",
  () => {

    if (!heroTitle) return;

    const amount =
      Math.min(window.scrollY * .12, 80);

    heroTitle.style.transform =
      `translateY(${amount}px)`;

  },
  { passive: true }
);
