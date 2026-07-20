const API =
"https://script.google.com/macros/s/AKfycbw2HlHvFRGSto9oVJKnUtdA5VkBG5JpqkBbUd9AFaSxde0u0tHkvSrJsRflwGI23TYxMA/exec";

const container = document.getElementById("news-page-container");
const loadMoreBtn = document.getElementById("load-more");

let news = [];
let visible = 6;

// Pobierz dane z API
fetch(API)
    .then(response => response.json())
    .then(data => {

        // sortowanie od najnowszych
        news = data.sort((a, b) => b.id - a.id);

        renderNews();

    })
    .catch(error => console.error(error));

// Wyświetlanie aktualności
function renderNews() {

    container.innerHTML = "";

    news.slice(0, visible).forEach(item => {

        container.innerHTML += `
            <div class="col-lg-4 col-md-6">

                <article class="news-card">

                    <img src="${item.zdjecie}" alt="${item.tytul}">

                    <div class="news-content">

                        <small>${formatDate(item.data)}</small>

                        <h3>${item.tytul}</h3>

                        <p>${shortText(item.zajawka)}</p>

                        <a href="aktualnosc.html?id=${item.id}">
                            Czytaj więcej →
                        </a>

                    </div>

                </article>

            </div>
        `;
    });

    if (visible >= news.length) {
        loadMoreBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "inline-block";
    }
}

// Przycisk "Pokaż więcej"
loadMoreBtn.addEventListener("click", () => {

    visible += 6;

    renderNews();

});

// Skrócenie tekstu
function shortText(text) {

    if (text.length <= 120) return text;

    return text.substring(0, 120) + "...";

}

// Format daty
function formatDate(date) {

    return new Date(date).toLocaleDateString("pl-PL");

}