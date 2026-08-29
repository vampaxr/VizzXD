"use strict";

const revealElements = document.querySelectorAll(".reveal");
const projectGrid = document.getElementById("projectGrid");
const diaryList = document.getElementById("diaryList");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

function getYouTubeId(url) {
    if (!url) {
        return null;
    }

    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    return match ? match[1] : null;
}


function getYouTubeThumbnail(url) {
    const id = getYouTubeId(url);

    if (!id) {
        return null;
    }

    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

async function loadProjects() {
    if (!projectGrid) {
        return;
    }

    try {
        const response = await fetch("work.json");

        if (!response.ok) {
            throw new Error("Failed to load work.json");
        }

        const projects = await response.json();

        if (!Array.isArray(projects)) {
            throw new Error("work.json must contain an array");
        }

        renderProjects(projects);

    } catch (error) {
        console.error(error);
        renderBuiltInProjects();
    }
}


function renderProjects(projects) {
    projectGrid.innerHTML = "";

    if (!projects.length) {
        renderBuiltInProjects();
        return;
    }

    projects.forEach((project, index) => {
        const article = document.createElement("article");
        article.className = "project reveal";

        const preview = document.createElement("div");
        preview.className = "project-preview";

        const projectArt = document.createElement("div");
        projectArt.className = "project-art";

        const artGrid = document.createElement("div");
        artGrid.className = "art-grid";

        const artText = document.createElement("div");
        artText.className = "art-text";
        artText.textContent = project.short || "MC";

        projectArt.appendChild(artGrid);
        projectArt.appendChild(artText);

        const thumbnail = getYouTubeThumbnail(project.video);

        if (project.image) {
            preview.style.backgroundImage =
                `url("${project.image}")`;

            preview.style.backgroundSize = "cover";
            preview.style.backgroundPosition = "center";
        } else if (thumbnail) {
            preview.style.backgroundImage =
                `url("${thumbnail}")`;

            preview.style.backgroundSize = "cover";
            preview.style.backgroundPosition = "center";
        }

        if (project.video && getYouTubeId(project.video)) {
            preview.dataset.video = project.video;
            preview.classList.add("has-video");
        }

        preview.appendChild(projectArt);

        const info = document.createElement("div");
        info.className = "project-info";

        const left = document.createElement("div");

        const number = document.createElement("div");
        number.className = "project-index";
        number.textContent = String(index + 1).padStart(3, "0");

        const title = document.createElement("div");
        title.className = "project-name";
        title.textContent = project.title || "Untitled";

        left.appendChild(number);
        left.appendChild(title);

        const description = document.createElement("div");
        description.className = "project-type";
        description.textContent = project.description || "";

        info.appendChild(left);
        info.appendChild(description);

        article.appendChild(preview);
        article.appendChild(info);

        projectGrid.appendChild(article);
    });

    setupVideos();
}

function renderBuiltInProjects() {
    const projects = [
        {
            title: "Minecraft Event",
            description: "A custom event made for players to compete and have fun.",
            short: "EVENT"
        },
        {
            title: "Server Plugin",
            description: "A custom plugin made to add new features to a server.",
            short: "PLUG"
        },
        {
            title: "SMP Project",
            description: "Custom features and ideas made for a Minecraft SMP.",
            short: "SMP"
        },
        {
            title: "More Projects",
            description: "More plugins and projects will be added here.",
            short: "DEV"
        }
    ];

    if (!projectGrid) {
        return;
    }

    projectGrid.innerHTML = "";

    projects.forEach((project, index) => {
        const article = document.createElement("article");
        article.className = "project reveal visible";

        const preview = document.createElement("div");
        preview.className = "project-preview";

        const projectArt = document.createElement("div");
        projectArt.className = "project-art";

        const artGrid = document.createElement("div");
        artGrid.className = "art-grid";

        const artText = document.createElement("div");
        artText.className = "art-text";
        artText.textContent = project.short;

        projectArt.appendChild(artGrid);
        projectArt.appendChild(artText);

        preview.appendChild(projectArt);

        const info = document.createElement("div");
        info.className = "project-info";

        const left = document.createElement("div");

        const number = document.createElement("div");
        number.className = "project-index";
        number.textContent = String(index + 1).padStart(3, "0");

        const title = document.createElement("div");
        title.className = "project-name";
        title.textContent = project.title;

        left.appendChild(number);
        left.appendChild(title);

        const description = document.createElement("div");
        description.className = "project-type";
        description.textContent = project.description;

        info.appendChild(left);
        info.appendChild(description);

        article.appendChild(preview);
        article.appendChild(info);

        projectGrid.appendChild(article);
    });
}

function setupVideos() {
    const previews = document.querySelectorAll(
        ".project-preview[data-video]"
    );

    previews.forEach((preview) => {
        preview.addEventListener("click", () => {
            const video = preview.dataset.video;
            const id = getYouTubeId(video);

            if (!id) {
                return;
            }

            if (preview.querySelector("iframe")) {
                return;
            }

            preview.innerHTML = "";

            const iframe = document.createElement("iframe");

            iframe.src =
                `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

            iframe.style.position = "absolute";
            iframe.style.inset = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "0";

            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

            iframe.allowFullscreen = true;

            preview.appendChild(iframe);
        });
    });
}

async function loadDiary() {
    if (!diaryList) {
        return;
    }

    try {
        const response = await fetch("diary.json");

        if (!response.ok) {
            throw new Error("Failed to load diary.json");
        }

        const entries = await response.json();

        if (!Array.isArray(entries)) {
            throw new Error("diary.json must contain an array");
        }

        renderDiary(entries);

    } catch (error) {
        console.error(error);
        renderBuiltInDiary();
    }
}


function renderDiary(entries) {
    diaryList.innerHTML = "";

    if (!entries.length) {
        renderBuiltInDiary();
        return;
    }

    entries.forEach((entry) => {
        const item = document.createElement("div");
        item.className = "diary-item";

        const date = document.createElement("div");
        date.className = "diary-date";
        date.textContent = entry.date || "";

        const content = document.createElement("div");

        const title = document.createElement("div");
        title.className = "diary-name";
        title.textContent = entry.title || "Untitled";

        const description = document.createElement("div");
        description.className = "diary-description";
        description.textContent = entry.description || "";

        content.appendChild(title);
        content.appendChild(description);

        const arrow = document.createElement("div");
        arrow.className = "diary-arrow";
        arrow.textContent = "↗";

        item.appendChild(date);
        item.appendChild(content);
        item.appendChild(arrow);

        diaryList.appendChild(item);
    });
}


function renderBuiltInDiary() {
    if (!diaryList) {
        return;
    }

    const entries = [
        {
            date: "08.28.26",
            title: "New portfolio",
            description: "Made a new website for my projects."
        },
        {
            date: "08.14.26",
            title: "New event idea",
            description: "Working on a new Minecraft event."
        },
        {
            date: "07.30.26",
            title: "Plugin work",
            description: "Working on some new server features."
        }
    ];

    renderDiary(entries);
}

loadProjects();
loadDiary();
