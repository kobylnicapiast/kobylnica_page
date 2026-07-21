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

const MATCH_POSTER_API =
    "https://script.google.com/macros/s/AKfycbxgKMeiCqAO0UteYOWWQzJfqskYSGQxkxJq_-RiOc5OH1tm74XDNwftfu1hVDJGARrA/exec";

const matchPoster = document.getElementById("matchPoster");

if (matchPoster) {

    fetch(MATCH_POSTER_API)
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                // odświeżanie cache
                matchPoster.src = data.image + "&t=" + Date.now();

            } else {

                console.error("Nie znaleziono plakatu.");

            }

        })
        .catch(error => console.error("Błąd pobierania plakatu:", error));

}