/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target
                        .classList
                        .add("visible");

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {
    observer.observe(element);
});


/* =========================================================
   YOUTUBE ID
========================================================= */

function getYouTubeId(url) {

    if (!url) {
        return null;
    }

    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    return match
        ? match[1]
        : null;
}


/* =========================================================
   LOAD PROJECTS
========================================================= */

async function loadProjects() {

    const grid =
        document.getElementById("projectGrid");

    if (!grid) {
        return;
    }

    try {

        const response =
            await fetch("work.json");

        if (!response.ok) {
            return;
        }

        const projects =
            await response.json();

        if (!Array.isArray(projects)) {
            return;
        }

        if (!projects.length) {
            return;
        }

        grid.innerHTML = "";


        projects.forEach(
            (project, index) => {

                const article =
                    document.createElement("article");

                article.className =
                    "project";


                const preview =
                    document.createElement("div");

                preview.className =
                    "project-preview";


                const art =
                    document.createElement("div");

                art.className =
                    "project-art";


                const artGrid =
                    document.createElement("div");

                artGrid.className =
                    "art-grid";


                const artText =
                    document.createElement("div");

                artText.className =
                    "art-text";

                artText.textContent =
                    "MC";


                art.appendChild(
                    artGrid
                );

                art.appendChild(
                    artText
                );


                if (project.image) {

                    preview.style.backgroundImage =
                        `url("${project.image}")`;

                    preview.style.backgroundSize =
                        "cover";

                    preview.style.backgroundPosition =
                        "center";

                }


                if (project.video) {

                    const id =
                        getYouTubeId(
                            project.video
                        );

                    if (id) {

                        preview.dataset.video =
                            project.video;

                    }

                }


                preview.appendChild(
                    art
                );


                const info =
                    document.createElement("div");

                info.className =
                    "project-info";


                const left =
                    document.createElement("div");


                const number =
                    document.createElement("div");

                number.className =
                    "project-index";

                number.textContent =
                    String(index + 1)
                        .padStart(3, "0");


                const title =
                    document.createElement("div");

                title.className =
                    "project-name";

                title.textContent =
                    project.title ||
                    "Untitled";


                left.appendChild(
                    number
                );

                left.appendChild(
                    title
                );


                const description =
                    document.createElement("div");

                description.className =
                    "project-type";

                description.textContent =
                    project.description ||
                    "";


                info.appendChild(
                    left
                );

                info.appendChild(
                    description
                );


                article.appendChild(
                    preview
                );

                article.appendChild(
                    info
                );


                grid.appendChild(
                    article
                );

            }
        );


        setupVideos();

    } catch (error) {

        console.log(
            "Using built in projects."
        );

    }

}


/* =========================================================
   YOUTUBE VIDEO PLAYER
========================================================= */

function setupVideos() {

    document
        .querySelectorAll(".project-preview")
        .forEach(preview => {

            const video =
                preview.dataset.video;

            const id =
                getYouTubeId(video);

            if (!id) {
                return;
            }


            preview.addEventListener(
                "click",
                () => {

                    if (
                        preview.querySelector("iframe")
                    ) {
                        return;
                    }


                    preview.innerHTML =
                        "";


                    const iframe =
                        document.createElement("iframe");


                    iframe.src =
                        `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;


                    iframe.style.position =
                        "absolute";

                    iframe.style.inset =
                        "0";

                    iframe.style.width =
                        "100%";

                    iframe.style.height =
                        "100%";

                    iframe.style.border =
                        "0";


                    iframe.allow =
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


                    iframe.allowFullscreen =
                        true;


                    preview.appendChild(
                        iframe
                    );

                }
            );

        });

}


/* =========================================================
   LOAD DIARY
========================================================= */

async function loadDiary() {

    const diary =
        document.getElementById("diaryList");

    if (!diary) {
        return;
    }

    try {

        const response =
            await fetch("diary.json");

        if (!response.ok) {
            return;
        }

        const entries =
            await response.json();

        if (!Array.isArray(entries)) {
            return;
        }

        if (!entries.length) {
            return;
        }

        diary.innerHTML = "";


        entries.forEach(entry => {

            const item =
                document.createElement("div");

            item.className =
                "diary-item";


            const date =
                document.createElement("div");

            date.className =
                "diary-date";

            date.textContent =
                entry.date || "";


            const content =
                document.createElement("div");


            const title =
                document.createElement("div");

            title.className =
                "diary-name";

            title.textContent =
                entry.title || "Untitled";


            const description =
                document.createElement("div");

            description.className =
                "diary-description";

            description.textContent =
                entry.description || "";


            content.appendChild(
                title
            );

            content.appendChild(
                description
            );


            const arrow =
                document.createElement("div");

            arrow.className =
                "diary-arrow";

            arrow.textContent =
                "↗";


            item.appendChild(
                date
            );

            item.appendChild(
                content
            );

            item.appendChild(
                arrow
            );


            diary.appendChild(
                item
            );

        });

    } catch (error) {

        console.log(
            "Using built in diary."
        );

    }

}


/* =========================================================
   START
========================================================= */

loadProjects();
loadDiary();
