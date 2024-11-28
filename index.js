const API_URL = "https://newsapi.org/v2/top-headlines?country=us&apiKey=2f79c081b2eb4047ab9f32ad38f50a19";
const headerNavEl = $('#header-nav');
const mainContainerEl = $('#main-container');
const categories = ['politics', 'business', 'sports', 'technology', 'entertainment', 'science', 'health'];
let activeCategory;

// Event handlers
$(document.body).on('click', '[data-load-category]', function(e) {
    e.preventDefault();
    const category = $(this).data('category');

    if (category == activeCategory) return;

    activeCategory = category;
    mainContainerEl.empty();
    displayCategories(category);
    displayCategory(category);
});

// Function to fetch and display JSON data
const fetchNews = async (category) => {
    try {
        const requestURL = `${API_URL}&category=${category}`;
        const response = await fetch(requestURL);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayCategories(activeCategory) {
    headerNavEl.html(`<ul class="nav__list">
        ${categories.map(category => `
            <li class="${category == activeCategory ? 'nav__item active' : 'nav__item'}">
                <a href="#${category}" class="nav__link" data-load-category="true" data-category="${category}">${category}</a>
            </li>`).join('')}
    </ul>`);
}

function displayCards(articles, title, maxDisplay) {
    console.log(articles);

    let newsCards = '';
    let counter = 0;

    mainContainerEl.append(`
        <div class="cards-group">
            <div class="cards-group__header">
                <h2 class="cards-group__title">${title}</h2>
                <button class="cards-group__btn" data-load-category="true" data-category="${title}">View All</button>
            </div>
            <div class="cards">
                ${articles.map((item, i) => {
                    if (item.urlToImage) {
                        counter += 1;
                        if (counter <= maxDisplay) {
                            return `
                                <div class="card">
                                    <div class="card__img-box">
                                        <a href="${item.url}" target="_blank""><img src="${item.urlToImage}" alt="" onerror="this.style.display='none'" class="card__img"></a>
                                    </div>
                                    <div class="card__body">
                                        <a href="${item.url}" target="_blank" class="card__title line-clamp" style="--lines: 3">${item.title}</a>
                                        <div class="card__description line-clamp" style="--lines: 3">${item.description}</div>
                                    </div>
                                </div>
                            `;
                        }
                    }
                }).join('')}
            </div>
        </div>
    `);
}

const displayCategory = async (category, maxDisplay) => {
    let data = await fetchNews(category);
    maxDisplay = maxDisplay || data.articles.length;
    displayCards(data.articles, category, maxDisplay);
}

// Call the fetchNews function when the page loads
window.onload = () => {
    displayCategories();
    categories.forEach((category, index) => {
        if (index > 2) return;
        displayCategory(category, 4);
    });
};