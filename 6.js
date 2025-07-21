// Movie Search App - Pure JavaScript with React
const { useState, useEffect, useCallback } = React;

// API Configuration
const API_KEY = '47235f02';
const API_BASE_URL = 'https://www.omdbapi.com/';

// Main App Component
function MovieApp() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    // Search movies function
    const searchMovies = useCallback(async (query) => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setSearchTerm(query);

        try {
            const response = await fetch(`${API_BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
            const data = await response.json();

            if (data.Response === "True" && data.Search) {
                setMovies(data.Search);
                updateContentTitle(`Search Results for "${query}"`);
            } else {
                setError(data.Error || "No movies found");
                setMovies([]);
                updateContentTitle("No Results");
            }
        } catch (err) {
            setError("Failed to fetch movies. Please try again.");
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load featured movies on startup
    const loadFeaturedMovies = useCallback(async () => {
        await searchMovies("Batman");
        updateContentTitle("Featured Movies");
    }, [searchMovies]);

    // Fetch movie details
    const fetchMovieDetails = async (movieId) => {
        setModalLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}?i=${movieId}&apikey=${API_KEY}`);
            const data = await response.json();

            if (data.Response === "True") {
                setSelectedMovie(data);
            } else {
                setError("Failed to fetch movie details");
            }
        } catch (err) {
            setError("Network error occurred");
        } finally {
            setModalLoading(false);
        }
    };

    // Handle movie card click
    const handleMovieClick = (movieId) => {
        setIsModalOpen(true);
        fetchMovieDetails(movieId);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    // Update content title
    const updateContentTitle = (title) => {
        const titleElement = document.getElementById('content-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    };

    // Load featured movies on component mount
    useEffect(() => {
        loadFeaturedMovies();
    }, [loadFeaturedMovies]);

    return React.createElement(React.Fragment, null,
        // Movie Grid
        React.createElement(MovieGrid, {
            movies: movies,
            loading: loading,
            error: error,
            onMovieClick: handleMovieClick
        }),

        // Movie Modal
        React.createElement(MovieModal, {
            isOpen: isModalOpen,
            movie: selectedMovie,
            loading: modalLoading,
            onClose: closeModal
        })
    );
}

// Movie Grid Component
function MovieGrid({ movies, loading, error, onMovieClick }) {
    useEffect(() => {
        // Update DOM elements
        const loader = document.getElementById('loader');
        const errorMessage = document.getElementById('error-message');
        const resultsContainer = document.getElementById('results-container');

        if (loading) {
            loader.classList.remove('hidden');
            errorMessage.classList.add('hidden');
            resultsContainer.innerHTML = '';
        } else {
            loader.classList.add('hidden');

            if (error) {
                errorMessage.textContent = error;
                errorMessage.classList.remove('hidden');
                resultsContainer.innerHTML = '';
            } else {
                errorMessage.classList.add('hidden');
                renderMovieCards(movies, onMovieClick, resultsContainer);
            }
        }
    }, [movies, loading, error, onMovieClick]);

    return null; // This component only manages DOM updates
}

// Movie Modal Component
function MovieModal({ isOpen, movie, loading, onClose }) {
    useEffect(() => {
        const modal = document.getElementById('movie-modal');
        const modalBody = document.getElementById('modal-body');

        if (isOpen) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            if (loading) {
                modalBody.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                        <div class="loader"></div>
                    </div>
                `;
            } else if (movie) {
                renderMovieDetails(movie, modalBody);
            }
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }, [isOpen, movie, loading]);

    return null; // This component only manages DOM updates
}

// Utility Functions
function renderMovieCards(movies, onMovieClick, container) {
    container.innerHTML = '';

    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        const poster = movie.Poster === "N/A"
            ? `https://via.placeholder.com/300x450/1a1a1a/ffd700?text=${encodeURIComponent(movie.Title)}`
            : movie.Poster;

        movieCard.innerHTML = `
            <div style="position: relative;">
                <img src="${poster}" alt="${movie.Title}" class="movie-poster" 
                     onerror="this.src='https://via.placeholder.com/300x450/1a1a1a/ffd700?text=${encodeURIComponent(movie.Title)}'">
                <div class="movie-year">${movie.Year}</div>
                <div class="movie-type">${movie.Type}</div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <div class="movie-underline"></div>
            </div>
        `;

        movieCard.addEventListener('click', () => onMovieClick(movie.imdbID));

        // Add staggered animation
        setTimeout(() => {
            movieCard.classList.add('fade-in');
        }, index * 100);

        container.appendChild(movieCard);
    });
}

function renderMovieDetails(movie, container) {
    const poster = movie.Poster === "N/A"
        ? `https://via.placeholder.com/400x600/1a1a1a/ffd700?text=${encodeURIComponent(movie.Title)}`
        : movie.Poster;

    container.innerHTML = `
        <img src="${poster}" alt="${movie.Title}" class="modal-poster"
             onerror="this.src='https://via.placeholder.com/400x600/1a1a1a/ffd700?text=${encodeURIComponent(movie.Title)}'">
        <div class="modal-info">
            <h1 class="modal-title">${movie.Title}</h1>
            
            <div class="modal-badges">
                <span class="modal-badge badge-year">${movie.Year}</span>
                ${movie.Rated !== "N/A" ? `<span class="modal-badge badge-rated">${movie.Rated}</span>` : ''}
                ${movie.Runtime !== "N/A" ? `<span class="modal-badge badge-runtime">${movie.Runtime}</span>` : ''}
            </div>

            ${(movie.imdbRating !== "N/A" || movie.Metascore !== "N/A") ? `
                <div class="modal-ratings">
                    ${movie.imdbRating !== "N/A" ? `
                        <div class="rating-item">
                            <span class="rating-value">${movie.imdbRating}</span>
                            <div class="rating-label">IMDb Rating</div>
                        </div>
                    ` : ''}
                    ${movie.Metascore !== "N/A" ? `
                        <div class="rating-item">
                            <span class="rating-value">${movie.Metascore}</span>
                            <div class="rating-label">Metascore</div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            ${movie.Plot !== "N/A" ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Plot</h3>
                    <p class="modal-section-content">${movie.Plot}</p>
                </div>
            ` : ''}

            <div class="modal-details">
                ${movie.Genre !== "N/A" ? `
                    <div class="detail-item">
                        <div class="detail-label">Genre</div>
                        <div class="detail-value">${movie.Genre}</div>
                    </div>
                ` : ''}
                ${movie.Director !== "N/A" ? `
                    <div class="detail-item">
                        <div class="detail-label">Director</div>
                        <div class="detail-value">${movie.Director}</div>
                    </div>
                ` : ''}
                ${movie.Actors !== "N/A" ? `
                    <div class="detail-item">
                        <div class="detail-label">Cast</div>
                        <div class="detail-value">${movie.Actors}</div>
                    </div>
                ` : ''}
                ${movie.Released !== "N/A" ? `
                    <div class="detail-item">
                        <div class="detail-label">Released</div>
                        <div class="detail-value">${movie.Released}</div>
                    </div>
                ` : ''}
                ${movie.BoxOffice !== "N/A" ? `
                    <div class="detail-item">
                        <div class="detail-label">Box Office</div>
                        <div class="detail-value">${movie.BoxOffice}</div>
                    </div>
                ` : ''}
                ${movie.Awards !== "N/A" ? `
                    <div class="detail-item">
                        <div class="detail-label">Awards</div>
                        <div class="detail-value">${movie.Awards}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Mount React app
    const appContainer = document.createElement('div');
    document.body.appendChild(appContainer);
    ReactDOM.render(React.createElement(MovieApp), appContainer);

    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    let movieAppInstance;

    // Create a global search function
    window.performSearch = function (query) {
        if (movieAppInstance && movieAppInstance.searchMovies) {
            movieAppInstance.searchMovies(query);
        }
    };

    // Search button click
    searchButton.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query) {
            window.performSearch(query);
        }
    });

    // Enter key press
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.performSearch(query);
            }
        }
    });

    // Modal close events
    modalClose.addEventListener('click', function () {
        const modal = document.getElementById('movie-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    modalBackdrop.addEventListener('click', function () {
        const modal = document.getElementById('movie-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    // Enhanced search functionality with React integration
    const createEnhancedMovieApp = () => {
        const [movies, setMovies] = React.useState([]);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState(null);

        const searchMovies = React.useCallback(async (query) => {
            if (!query.trim()) return;

            setLoading(true);
            setError(null);

            // Update content title
            const titleElement = document.getElementById('content-title');
            if (titleElement) {
                titleElement.textContent = `Search Results for "${query}"`;
            }

            try {
                const response = await fetch(`${API_BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
                const data = await response.json();

                if (data.Response === "True" && data.Search) {
                    setMovies(data.Search);

                    // Update DOM directly
                    const resultsContainer = document.getElementById('results-container');
                    const loader = document.getElementById('loader');
                    const errorMessage = document.getElementById('error-message');

                    loader.classList.add('hidden');
                    errorMessage.classList.add('hidden');
                    renderMovieCards(data.Search, handleMovieClick, resultsContainer);
                } else {
                    setError(data.Error || "No movies found");
                    setMovies([]);
                }
            } catch (err) {
                setError("Failed to fetch movies. Please try again.");
                setMovies([]);
            } finally {
                setLoading(false);
            }
        }, []);

        const handleMovieClick = async (movieId) => {
            const modal = document.getElementById('movie-modal');
            const modalBody = document.getElementById('modal-body');

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            modalBody.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                    <div class="loader"></div>
                </div>
            `;

            try {
                const response = await fetch(`${API_BASE_URL}?i=${movieId}&apikey=${API_KEY}`);
                const data = await response.json();

                if (data.Response === "True") {
                    renderMovieDetails(data, modalBody);
                } else {
                    modalBody.innerHTML = '<p style="text-align: center; color: #ff6b6b;">Failed to load movie details</p>';
                }
            } catch (err) {
                modalBody.innerHTML = '<p style="text-align: center; color: #ff6b6b;">Network error occurred</p>';
            }
        };

        // Load featured movies on startup
        React.useEffect(() => {
            searchMovies("Batman");
            const titleElement = document.getElementById('content-title');
            if (titleElement) {
                titleElement.textContent = "Featured Movies";
            }
        }, [searchMovies]);

        // Expose search function globally
        window.performSearch = searchMovies;

        return null;
    };

    // Mount the enhanced app
    ReactDOM.render(React.createElement(createEnhancedMovieApp), appContainer);
});
