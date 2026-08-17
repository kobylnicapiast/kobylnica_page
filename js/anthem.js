const anthemAudio = document.getElementById("anthemAudio");


/* ===========================================
   HYMN - PERSISTENT AUDIO
=========================================== */

if (anthemAudio) {

    /*
     * Przenosimy audio poza body.
     * Dzięki temu przy zmianie zawartości strony
     * audio nie zostanie usunięte.
     */
    document.documentElement.appendChild(anthemAudio);


    /* ===========================================
       PRZYCISK HYMNU
    =========================================== */

    function setupAnthemButton() {

        const button = document.getElementById("anthemBtn");

        if (!button) {
            return;
        }

        if (button.dataset.anthemReady === "true") {
            return;
        }

        button.dataset.anthemReady = "true";


        button.addEventListener("click", async () => {

            if (anthemAudio.paused) {

                try {

                    await anthemAudio.play();

                    button.classList.add("playing");

                } catch (error) {

                    console.error(
                        "Nie udało się odtworzyć hymnu:",
                        error
                    );

                }

            } else {

                anthemAudio.pause();

                button.classList.remove("playing");

            }

        });


        /*
         * Jeżeli hymn już gra,
         * nowy przycisk również pokazuje stan playing.
         */
        if (!anthemAudio.paused) {

            button.classList.add("playing");

        }

    }


    setupAnthemButton();


    /* ===========================================
       KONIEC HYMNU
    =========================================== */

    anthemAudio.addEventListener("ended", () => {

        const button = document.getElementById("anthemBtn");

        if (button) {
            button.classList.remove("playing");
        }

        anthemAudio.currentTime = 0;

    });


    /* ===========================================
       STYLE PODSTRON
    =========================================== */

    function loadPageStyles(newDocument) {

        /*
         * Usuwamy poprzednie style podstrony.
         */
        const oldStyles =
            document.getElementById("persistentPageStyles");

        if (oldStyles) {
            oldStyles.remove();
        }


        /*
         * Pobieramy style <style> z nowej strony.
         */
        const styles =
            newDocument.querySelectorAll("style");

        if (!styles.length) {
            return;
        }


        const styleContainer =
            document.createElement("div");

        styleContainer.id =
            "persistentPageStyles";


        styles.forEach(style => {

            const newStyle =
                document.createElement("style");

            newStyle.textContent =
                style.textContent;

            styleContainer.appendChild(newStyle);

        });


        document.head.appendChild(styleContainer);

    }


    /* ===========================================
       URUCHAMIANIE SKRYPTÓW PODSTRONY
    =========================================== */

    async function runPageScripts(newDocument, url) {

        const scripts =
            newDocument.querySelectorAll("script");


        for (const script of scripts) {

            /*
             * Nie uruchamiamy ponownie anthem.js.
             */
            const src = script.getAttribute("src");

            if (src) {

                const absoluteSrc =
                    new URL(src, url).href;


                /*
                 * Nie uruchamiamy ponownie Bootstrapa.
                 * Jest już załadowany na stronie głównej.
                 */
                if (
                    absoluteSrc.includes(
                        "cdn.jsdelivr.net"
                    )
                ) {

                    continue;

                }


                /*
                 * Nie uruchamiamy ponownie anthem.js.
                 */
                if (
                    absoluteSrc.includes(
                        "js/anthem.js"
                    )
                ) {

                    continue;

                }


                try {

                    const response =
                        await fetch(absoluteSrc);


                    if (!response.ok) {

                        console.error(
                            "Nie udało się pobrać skryptu:",
                            absoluteSrc
                        );

                        continue;

                    }


                    const code =
                        await response.text();


                    /*
                     * Uruchamiamy kod w osobnym zakresie.
                     *
                     * Dzięki temu const/let z script.js
                     * nie powodują konfliktów przy ponownym
                     * wejściu na index.html.
                     */
                    const execute =
                        new Function(code);

                    execute();

                } catch (error) {

                    console.error(
                        "Błąd uruchamiania skryptu:",
                        absoluteSrc,
                        error
                    );

                }

            } else {

                /*
                 * Skrypt inline.
                 *
                 * Jest potrzebny np. dla menu.html,
                 * gdzie znajduje się kod pobierający
                 * cennik z Google Sheets.
                 */
                const code =
                    script.textContent.trim();


                if (!code) {
                    continue;
                }


                try {

                    const execute =
                        new Function(code);

                    execute();

                } catch (error) {

                    console.error(
                        "Błąd skryptu inline:",
                        error
                    );

                }

            }

        }

    }


    /* ===========================================
       CZY LINK MA DZIAŁAĆ BEZ PRZEŁADOWANIA
    =========================================== */

    function isPersistentLink(link) {

        if (!link) {
            return false;
        }


        /*
         * Linki z klasą persistent-link.
         */
        if (
            link.classList.contains(
                "persistent-link"
            )
        ) {

            return true;

        }


        /*
         * Przycisk "Powrót" z hymn.html/menu.html.
         *
         * Obie strony mają:
         * href="index.html"
         */
        try {

            const linkUrl =
                new URL(
                    link.href,
                    window.location.href
                );


            const currentPath =
                window.location.pathname;


            const targetPath =
                linkUrl.pathname;


            if (
                targetPath.endsWith(
                    "/index.html"
                ) ||
                targetPath === "/" ||
                targetPath === currentPath
            ) {

                return true;

            }

        } catch (error) {

            return false;

        }


        return false;

    }


    /* ===========================================
       PODPINANIE LINKÓW
    =========================================== */

    function setupPersistentLinks() {

        document
            .querySelectorAll("a[href]")
            .forEach(link => {

                if (
                    !isPersistentLink(link)
                ) {

                    return;

                }


                if (
                    link.dataset.persistentReady ===
                    "true"
                ) {

                    return;

                }


                link.dataset.persistentReady =
                    "true";


                link.addEventListener(
                    "click",
                    async event => {

                        event.preventDefault();


                        const url =
                            new URL(
                                link.href,
                                window.location.href
                            ).href;


                        /*
                         * Jeżeli kliknięto aktualną stronę,
                         * nic nie robimy.
                         */
                        if (
                            url ===
                            window.location.href
                        ) {

                            return;

                        }


                        await loadPage(
                            url,
                            true
                        );

                    }
                );

            });

    }


    /* ===========================================
       GŁÓWNA FUNKCJA ZMIANY STRONY
    =========================================== */

    async function loadPage(
        url,
        addToHistory = true
    ) {

        try {

            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Nie udało się załadować strony."
                );

            }


            const html =
                await response.text();


            const parser =
                new DOMParser();


            const newDocument =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            /*
             * Zachowujemy ten sam element audio.
             */
            const persistentAudio =
                anthemAudio;


            /*
             * Zapamiętujemy pozycję strony.
             */
            const currentScrollY =
                window.scrollY;


            /*
             * Ładujemy style podstrony.
             */
            loadPageStyles(
                newDocument
            );


            /*
             * Czyścimy body.
             */
            document.body.innerHTML =
                "";


            /*
             * Pobieramy body nowej strony.
             */
            const newBody =
                newDocument.body;


            /*
             * Kopiujemy elementy body.
             */
            Array.from(
                newBody.children
            ).forEach(element => {

                /*
                 * Audio nie kopiujemy.
                 * Ono już istnieje.
                 */
                if (
                    element.id ===
                    "anthemAudio"
                ) {

                    return;

                }


                /*
                 * Skryptów nie kopiujemy
                 * jako elementów DOM.
                 *
                 * Uruchomimy je osobno
                 * przez runPageScripts().
                 */
                if (
                    element.tagName ===
                    "SCRIPT"
                ) {

                    return;

                }


                document.body.appendChild(
                    element.cloneNode(true)
                );

            });


            /*
             * Audio musi nadal istnieć
             * poza body.
             */
            if (
                persistentAudio.parentElement !==
                document.documentElement
            ) {

                document.documentElement.appendChild(
                    persistentAudio
                );

            }


            /*
             * Aktualizujemy historię.
             *
             * Przy kliknięciu:
             * pushState().
             *
             * Przy Wstecz/Dalej:
             * false -> bez tworzenia nowego wpisu.
             */
            if (addToHistory) {

                window.history.pushState(
                    {},
                    "",
                    url
                );

            }


            /*
             * Aktualizujemy tytuł.
             */
            document.title =
                newDocument.title;


            /*
             * Uruchamiamy skrypty nowej strony.
             *
             * Dzięki temu:
             *
             * index.html
             * -> sponsors.js
             * -> script.js
             *
             * menu.html
             * -> Google Sheets CSV
             */
            await runPageScripts(
                newDocument,
                url
            );
            if (
                window.location.pathname.endsWith("index.html") ||
                window.location.pathname === "/" ||
                new URL(url, window.location.href).pathname.endsWith("index.html") ||
                new URL(url, window.location.href).pathname === "/"
            ) {

                if (typeof window.initSponsors === "function") {

                    window.initSponsors();

                }

            }


            /*
             * Ponownie podpinamy przycisk hymnu.
             */
            setupAnthemButton();


            /*
             * Ponownie podpinamy linki.
             */
            setupPersistentLinks();


            /*
             * Jeżeli hymn gra,
             * nowy przycisk ma klasę playing.
             */
            const currentButton =
                document.getElementById(
                    "anthemBtn"
                );


            if (
                currentButton &&
                !anthemAudio.paused
            ) {

                currentButton.classList.add(
                    "playing"
                );

            }


            /*
             * Przy zmianie strony nie resetujemy
             * pozycji hymnu.
             *
             * Przy zwykłym przejściu:
             * przewijamy na początek.
             *
             * Przy Wstecz/Dalej:
             * również zaczynamy od góry,
             * ponieważ jest to nowy widok strony.
             */
            window.scrollTo(
                0,
                0
            );


        } catch (error) {

            console.error(
                "Błąd podczas zmiany strony:",
                error
            );


            /*
             * Jeżeli coś naprawdę pójdzie nie tak,
             * wykonujemy normalne przejście.
             */
            window.location.href =
                url;

        }

    }


    /* ===========================================
       START
    =========================================== */

    setupPersistentLinks();


    /* ===========================================
       WSTECZ / DALEJ PRZEGLĄDARKI
    =========================================== */

    window.addEventListener(
        "popstate",
        async () => {

            await loadPage(
                window.location.href,
                false
            );

        }
    );

}

document.addEventListener("DOMContentLoaded", function () {

    const anthemBtn = document.getElementById("anthemBtn");
    const anthemHint = document.getElementById("anthemHint");

    if (!anthemBtn || !anthemHint) return;

    // Pokaż dymek po wejściu na stronę
    setTimeout(() => {
        anthemHint.classList.add("show");
    }, 500);

    // Kliknięcie / dotknięcie gdziekolwiek poza ikonką zamyka dymek
    document.addEventListener("click", function (event) {

        if (!anthemBtn.contains(event.target)) {
            anthemHint.classList.remove("show");
        }

    });

    // Obsługa telefonu - dotknięcie ekranu
    document.addEventListener("touchstart", function (event) {

        if (!anthemBtn.contains(event.target)) {
            anthemHint.classList.remove("show");
        }

    }, { passive: true });

});