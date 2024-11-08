const apiKey = 'ae9f9edb'; // Your OMDB API key
const movieGrid = document.getElementById('movieGrid');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const movieDetailsModal = document.getElementById('movieDetailsModal');
const movieDetails = document.getElementById('movieDetails');
const closeModal = document.querySelector('.close');
const watchlistMenu = document.getElementById('watchlistMenu');
const homePage = document.getElementById('homePage');
const watchlistPage = document.getElementById('watchlistPage');
const backButton = document.getElementById('backButton');
const watchlistContent = document.getElementById('watchlistContent'); // Updated selector

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Event listeners
searchButton.addEventListener('click', fetchMovies);
closeModal.addEventListener('click', () => movieDetailsModal.style.display = 'none');
watchlistMenu.addEventListener('click', showWatchlist);
backButton.addEventListener('click', showHome);

window.onload = fetchDefaultMovies; // Fetch default movies when the page loads

function fetchMovies() {
    const searchTerm = searchInput.value;
    const apiUrl = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${apiKey}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                movieGrid.innerHTML = `<p>No results found for "${searchTerm}".</p>`;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchDefaultMovies() {
    const apiUrl = `https://www.omdbapi.com/?s=Avengers&page=1&apikey=${apiKey}`; // Default search term (e.g., "Avengers")
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                movieGrid.innerHTML = `<p>No results found for default movies.</p>`;
            }
        })
        .catch(error => console.error('Error fetching default movies:', error));
}

function displayMovies(movies) {
    movieGrid.innerHTML = ''; // Clear previous results
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="viewMovieDetails('${movie.imdbID}')">View Details</button>
            <button onclick="addToWatchlist('${movie.imdbID}', '${movie.Title}', '${movie.Poster}', '${movie.Year}')">Add to Watchlist</button>
        `;
        movieGrid.appendChild(movieCard);
    });
}

function viewMovieDetails(imdbID) {
    const apiUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(movie => {
            // Populate modal with movie details
            movieDetails.innerHTML = `
                <h2>${movie.Title}</h2>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Cast:</strong> ${movie.Actors}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Released:</strong> ${movie.Released}</p>
            `;
            movieDetailsModal.style.display = 'flex'; // Show the modal
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function addToWatchlist(imdbID, title, poster, year) {
    const movie = { imdbID, title, poster, year };
    
    // Check if the movie is already in the watchlist
    if (!watchlist.some(m => m.imdbID === imdbID)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${title} has been added to your Watchlist!`);
    } else {
        alert(`${title} is already in your Watchlist.`);
    }
}

function showWatchlist() {
    homePage.style.display = 'none'; // Hide home page
    watchlistPage.style.display = 'block'; // Show watchlist page
    displayWatchlist(); // Display watchlist content
}

function showHome() {
    watchlistPage.style.display = 'none'; // Hide watchlist page
    homePage.style.display = 'block'; // Show home page
}

function displayWatchlist() {
    watchlistContent.innerHTML = ''; // Clear previous results
    if (watchlist.length === 0) {
        watchlistContent.innerHTML = `<p>Your Watchlist is empty.</p>`;
    } else {
        watchlist.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('watchlist-card'); // Use a different class for watchlist
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.year}</p>
                <button onclick="removeFromWatchlist('${movie.imdbID}')">Remove from Watchlist</button>
            `;
            watchlistContent.appendChild(movieCard);
        });
    }
}

function removeFromWatchlist(imdbID) {
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist(); // Refresh the watchlist
}
