const grid = document.getElementById("projectGrid");
const diaryToggle = document.getElementById("diaryToggle");

let workProjects = [];
let diaryProjects = [];
let showingDiary = false;


/* YOUTUBE */

function getYouTubeId(url) {
    if (!url) return null;

    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    return match ? match[1] : null;
}


/* PROJECTS */

function renderProjects(projects, diary = false) {
    grid.innerHTML = "";

    if (!projects.length) {
        grid.innerHTML = `
            <div class="loading">
                Nothing here yet.
            </div>
        `;
        return;
    }

    projects.forEach((project, index) => {
        const card = document.createElement("article");
        card.className = "project";
        card.style.animationDelay = `${index * 70}ms`;

        const preview = document.createElement("div");
        preview.className = "project-preview";

        if (project.video) {
            const id = getYouTubeId(project.video);

            if (id) {
                preview.style.setProperty(
                    "--thumb",
                    `url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")`
                );

                preview.addEventListener("click", () => {
                    if (preview.querySelector("iframe")) return;

                    const iframe = document.createElement("iframe");

                    iframe.src =
                        `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

                    iframe.title =
                        project.title || "Project video";

                    iframe.allow =
                        "autoplay; encrypted-media; picture-in-picture";

                    iframe.allowFullscreen = true;
                    iframe.loading = "lazy";

                    preview.appendChild(iframe);
                });
            } else {
                preview.classList.add("no-video");
            }
        } else {
            preview.classList.add("no-video");
        }

        const info = document.createElement("div");
        info.className = "project-info";

        const title = document.createElement("div");
        title.className = "project-name";
        title.textContent = project.title || "Untitled";

        info.appendChild(title);

        if (diary && project.date) {
            const date = document.createElement("div");
            date.className = "diary-date";
            date.textContent = project.date;
            info.appendChild(date);
        }

        if (project.description) {
            const description = document.createElement("div");
            description.className = "project-type";
            description.textContent = project.description;
            info.appendChild(description);
        }

        card.appendChild(preview);
        card.appendChild(info);
        grid.appendChild(card);
    });
}


/* LOAD JSON */

async function loadJSON(file) {
    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`Could not load ${file}`);
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
}


async function loadProjects() {
    try {
        workProjects = await loadJSON("work.json");
    } catch (error) {
        console.error(error);
        workProjects = [];
    }

    try {
        diaryProjects = await loadJSON("diary.json");
    } catch (error) {
        console.error(error);
        diaryProjects = [];
    }

    renderProjects(workProjects);
}


/* DIARY */

function updateDiaryButton() {
    const text = diaryToggle.querySelector("span");
    const arrow = diaryToggle.querySelector("b");

    if (showingDiary) {
        text.textContent = "Back to my work";
        arrow.textContent = "←";
    } else {
        text.textContent = "View dev diary";
        arrow.textContent = "→";
    }
}


function toggleDiary() {
    showingDiary = !showingDiary;

    grid.classList.add("fade-out");

    setTimeout(() => {
        renderProjects(
            showingDiary ? diaryProjects : workProjects,
            showingDiary
        );

        updateDiaryButton();
        grid.classList.remove("fade-out");
    }, 220);
}


diaryToggle.addEventListener("click", toggleDiary);


/* NAV */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const target = document.querySelector(
            link.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


/* HEADER */

const header = document.querySelector(".header");

let previousScroll = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 40) {
        header.style.borderBottomColor =
            "rgba(255,255,255,.07)";
    } else {
        header.style.borderBottomColor =
            "transparent";
    }

    previousScroll = currentScroll;
}, { passive: true });


/* START */

updateDiaryButton();
loadProjects();
