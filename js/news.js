const API =
"https://script.google.com/macros/s/AKfycbw2HlHvFRGSto9oVJKnUtdA5VkBG5JpqkBbUd9AFaSxde0u0tHkvSrJsRflwGI23TYxMA/exec";

fetch(API)

.then(res => res.json())

.then(news => {

    // Sortowanie od najnowszych
    news.sort((a, b) => b.id - a.id);

    // Tylko 3 najnowsze
    news = news.slice(0, 3);

    const container = document.getElementById("news-container");

    container.innerHTML = "";

    news.forEach(item => {

        const card = `

        <div class="col-lg-4">

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

        container.innerHTML += card;

    });

})

.catch(error => console.error(error));

function shortText(text) {

    if (!text) return "";

    if (text.length <= 120) return text;

    return text.substring(0, 120) + "...";

}

function formatDate(date) {

    return new Date(date).toLocaleDateString("pl-PL");

}