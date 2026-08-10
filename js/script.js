/* ===========================================
   PLAKATY MECZU Z GOOGLE DRIVE
=========================================== */

const MATCH_POSTER_API =
"https://script.google.com/macros/s/AKfycbzkpcWE3QdByjQwD_qBCXm1cS0efw7t0VRemzIle12omIfqADxadq47mJTp3CcpIpmO/exec";

const matchPosters = document.getElementById("matchPosters");
const posterLoader = document.getElementById("posterLoader");

if (matchPosters) {

    // pokazujemy loader
    if (posterLoader) {
        posterLoader.style.display = "block";
    }

    matchPosters.style.display = "none";

    fetch(MATCH_POSTER_API)
        .then(response => response.json())
        .then(data => {

            if (data.success && data.images && data.images.length > 0) {

                // czyścimy kontener
                matchPosters.innerHTML = "";

                // tworzymy obraz dla każdego pliku z Google Drive
                data.images.forEach((poster, index) => {

                    const img = document.createElement("img");

                    img.src = poster.image + "&t=" + Date.now();
                    img.alt = poster.name || "Plakat meczu";
                    img.loading = index === 0 ? "eager" : "lazy";

                    matchPosters.appendChild(img);

                });

                // chowamy loader
                if (posterLoader) {
                    posterLoader.style.display = "none";
                }

                // pokazujemy wszystkie plakaty
                matchPosters.style.display = "flex";

            } else {

                if (posterLoader) {
                    posterLoader.style.display = "none";
                }

                console.log("Brak plakatów w folderze Google Drive.");

            }

        })
        .catch(error => {

            if (posterLoader) {
                posterLoader.style.display = "none";
            }

            console.error("Błąd pobierania plakatów:", error);

        });

}