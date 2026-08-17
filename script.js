/* ===========================================
   PLAKATY MECZU Z GOOGLE DRIVE
=========================================== */

const MATCH_POSTER_API =
"https://script.google.com/macros/s/AKfycbzkpcWE3QdByjQwD_qBCXm1cS0efw7t0VRemzIle12omIfqADxadq47mJTp3CcpIpmO/exec";

const matchPosters = document.getElementById("matchPosters");
const posterLoader = document.getElementById("posterLoader");


if (matchPosters) {

    // Pokazujemy loader
    if (posterLoader) {
        posterLoader.style.display = "block";
    }

    matchPosters.style.display = "none";


    fetch(MATCH_POSTER_API)
        .then(response => {

            if (!response.ok) {
                throw new Error("Błąd odpowiedzi serwera.");
            }

            return response.json();

        })
        .then(data => {

            if (
                !data.success ||
                !data.images ||
                data.images.length === 0
            ) {

                if (posterLoader) {
                    posterLoader.style.display = "none";
                }

                console.log(
                    "Brak plakatów w folderze Google Drive."
                );

                return;
            }


            /* ===========================================
               SORTOWANIE PLAKATÓW
            =========================================== */

            const posters = data.images
                .map(poster => {

                    const match =
                        poster.name.match(/\d+/);

                    return {
                        ...poster,

                        // Jeżeli nazwa ma numer:
                        // 2.jpg -> 2
                        // 10.jpg -> 10
                        //
                        // Jeżeli nie ma numeru,
                        // dajemy bardzo dużą liczbę,
                        // żeby takie pliki były na końcu.
                        number: match
                            ? parseInt(match[0], 10)
                            : 999999
                    };

                })
                .sort((a, b) => {

                    return a.number - b.number;

                });


            /* ===========================================
               CZYŚCIMY STARE PLAKATY
            =========================================== */

            matchPosters.innerHTML = "";


            /* ===========================================
               TWORZYMY PLAKATY
            =========================================== */

            posters.forEach((poster, index) => {

                const img =
                    document.createElement("img");


                img.src =
                    poster.image +
                    "&t=" +
                    Date.now();


                img.alt =
                    poster.name ||
                    "Plakat meczu";


                // Pierwszy plakat ładuje się od razu.
                // Reszta lazy.
                img.loading =
                    index === 0
                        ? "eager"
                        : "lazy";


                matchPosters.appendChild(img);

            });


            /* ===========================================
               POKAZUJEMY PLAKATY
            =========================================== */

            if (posterLoader) {
                posterLoader.style.display = "none";
            }

            matchPosters.style.display = "flex";

        })
        .catch(error => {

            if (posterLoader) {
                posterLoader.style.display = "none";
            }

            console.error(
                "Błąd pobierania plakatów:",
                error
            );

        });

}