const MATCHDAY_API = "https://script.google.com/macros/s/AKfycbwglD3HlXEnPspf15iqj6wltJ5CbS24QpeYPzgiTE2gLH_HyDM_yE2QhMFx7hZzhSspIw/exec";

const CLUB_API = "https://script.google.com/macros/s/AKfycbwUvafgouOvsG8e4wmijAtgt5wWUnwJ9cfV46hH1LXxLIEN8rTLTE0iGKnwiI-EXmMYHw/exec";

async function loadSponsors(apiUrl, containerId) {

    const track = document.getElementById(containerId);

    if (!track) return;

    // Ustalenie odpowiedniego loadera
    const loaderId = containerId === "matchdaySponsors"
        ? "matchdayLoader"
        : "clubLoader";

    const loader = document.getElementById(loaderId);

    try {

        // Pokazujemy loader
        if (loader) loader.style.display = "block";
        track.style.display = "none";

        track.innerHTML = "";

        const response = await fetch(apiUrl);
        const sponsors = await response.json();

        sponsors.forEach(s => {

            const img = document.createElement("img");

            img.src = "https://drive.google.com/thumbnail?id=" + s.id + "&sz=w600";
            img.alt = s.name;
            img.loading = "lazy";

            track.appendChild(img);

        });

        // Duplikujemy tylko gdy jest więcej niż jeden sponsor
        if (sponsors.length > 1) {

            track.innerHTML += track.innerHTML;
            track.classList.remove("single-logo");

        } else {

            track.classList.add("single-logo");

        }

        // Chowamy loader i pokazujemy sponsorów
        track.style.display = "flex";
        track.classList.add("loaded");

        setTimeout(() => {
            if(loader){
                loader.style.display = "none";
            }
        },50);

    } catch (error) {

        console.error("Błąd ładowania sponsorów:", error);

        // Chowamy loader również w razie błędu
        if (loader) loader.style.display = "none";

    }

}

document.addEventListener("DOMContentLoaded", () => {

    loadSponsors(MATCHDAY_API, "matchdaySponsors");
    loadSponsors(CLUB_API, "clubSponsors");

});