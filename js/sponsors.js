const MATCHDAY_API = "https://script.google.com/macros/s/AKfycbwglD3HlXEnPspf15iqj6wltJ5CbS24QpeYPzgiTE2gLH_HyDM_yE2QhMFx7hZzhSspIw/exec";

const CLUB_API = "https://script.google.com/macros/s/AKfycbwUvafgouOvsG8e4wmijAtgt5wWUnwJ9cfV46hH1LXxLIEN8rTLTE0iGKnwiI-EXmMYHw/exec";

async function loadSponsors(apiUrl, containerId) {

    const track = document.getElementById(containerId);

    if (!track) return;

    try {

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

        // Duplikujemy logotypy dla płynnej animacji
        track.innerHTML += track.innerHTML;

    } catch (error) {

        console.error("Błąd ładowania sponsorów:", error);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    loadSponsors(MATCHDAY_API, "matchdaySponsors");
    loadSponsors(CLUB_API, "clubSponsors");

});