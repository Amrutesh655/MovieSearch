const apiKey = '47235f02';  // Replace with your OMDb key

const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');
const movieResult = document.getElementById('movieResult');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('errorMessage');
const historyList = document.getElementById('searchHistory');
const toggleThemeBtn = document.getElementById('toggleTheme');

let searchHistory = JSON.parse(localStorage.getItem('movieHistory')) || [];
renderHistory();

// Load theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    toggleThemeBtn.textContent = '☀️ Light Mode';
}

// Theme toggle
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        toggleThemeBtn.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        toggleThemeBtn.textContent = '🌙 Dark Mode';
    }
});

// Search
searchBtn.addEventListener('click', searchMovie);

// History click
historyList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        movieInput.value = e.target.textContent;
        searchMovie();
    }
});

function searchMovie() {
    const movieName = movieInput.value.trim();

    errorDiv.classList.add('hidden');
    movieResult.innerHTML = '';

    if (!movieName) {
        showError('Please enter a movie name.');
        return;
    }

    loading.classList.remove('hidden');

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieName)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            loading.classList.add('hidden');

            if (data.Response === 'True') {
                movieResult.innerHTML = `
          <h2>${data.Title} (${data.Year})</h2>
          <img src="${data.Poster !== 'N/A' ? data.Poster : ''}" alt="Poster">
          <p><strong>Genre:</strong> ${data.Genre}</p>
          <p><strong>Plot:</strong> ${data.Plot}</p>
          <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
          <p><em>Check availability on Netflix, Prime Video, Disney+, etc.</em></p>
        `;
                saveToHistory(movieName);
            } else {
                showError('❌ Movie not found. Please check the spelling and try again.');
            }
        })
        .catch(error => {
            loading.classList.add('hidden');
            showError('⚠️ Something went wrong. Please try again later.');
            console.error(error);
        });
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function saveToHistory(movieName) {
    if (!searchHistory.includes(movieName)) {
        searchHistory.unshift(movieName);
        if (searchHistory.length > 5) searchHistory.pop();
        localStorage.setItem('movieHistory', JSON.stringify(searchHistory));
        renderHistory();
    }
}

function renderHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie;
        historyList.appendChild(li);
    });
}
