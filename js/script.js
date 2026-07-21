const anthemBtn = document.getElementById("anthemBtn");
const anthemAudio = document.getElementById("anthemAudio");

if (anthemBtn && anthemAudio) {

    anthemBtn.addEventListener("click", () => {

        if (anthemAudio.paused) {

            anthemAudio.play();
            anthemBtn.classList.add("playing");

        } else {

            anthemAudio.pause();
            anthemBtn.classList.remove("playing");

        }

    });

    anthemAudio.addEventListener("ended", () => {

        anthemBtn.classList.remove("playing");
        anthemAudio.currentTime = 0;

    });

}

/* ===========================================
   PLAKAT MECZU Z GOOGLE DRIVE
=========================================== */

/* ===========================================
   PLAKAT MECZU Z GOOGLE DRIVE
=========================================== */

const MATCH_POSTER_API =
    "https://script.google.com/macros/s/AKfycbxgKMeiCqAO0UteYOWWQzJfqskYSGQxkxJq_-RiOc5OH1tm74XDNwftfu1hVDJGARrA/exec";

const matchPoster = document.getElementById("matchPoster");
const posterLoader = document.getElementById("posterLoader");

if (matchPoster) {

    // pokazujemy loader
    if (posterLoader) posterLoader.style.display = "block";
    matchPoster.style.display = "none";

    fetch(MATCH_POSTER_API)
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                // gdy obraz się załaduje
                matchPoster.src = data.image + "&t=" + Date.now();

                setTimeout(() => {

                    if (posterLoader)
                        posterLoader.style.display = "none";

                    matchPoster.style.display = "block";

                }, 300);

            } else {

                if (posterLoader)
                    posterLoader.style.display = "none";

                console.error("Nie znaleziono plakatu.");

            }

        })
        .catch(error => {

            if (posterLoader)
                posterLoader.style.display = "none";

            console.error("Błąd pobierania plakatu:", error);

        });

}