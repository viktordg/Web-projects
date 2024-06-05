window.onload = function() {
    fetch('/api/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            data.articles.forEach(article => {
                const newsCard = `<div class="news-card">
                                    <h2>${article.title}</h2>
                                    <a href="${article.url}" target="_blank">Read more</a>
                                  </div>`;
                newsContainer.innerHTML += newsCard;
            });
        })
        .catch(error => console.error('Error:', error));
};