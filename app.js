
// classes
const moviesSearchResultsEl = document.querySelector('.movies__description--search-results');
const searchPageEl = document.querySelector('.movies__filter--title');
const moviesListEl = document.querySelector('.movies__list');
const loadingEl = document.querySelector('.fa-spinner');

// api key
const apiKey = '314d35d9';

// add delays easily
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// search variables
let maxPages = 1;
let titleSearch = null;
let searchIndex = 1;

async function onSearchChange(event) {
    const movieTitle = event.target.value;
    // update values
    titleSearch = movieTitle;
    searchIndex = 1;
    maxPages = 1;

    // render new html
    renderMovies(movieTitle, searchIndex);
}

async function nextPage() {
    // prevent if there is no movie searched
    if(titleSearch === null)
        return alert("Please search for something first before trying to go to navigate through pages!");
    
    // prevent from going higher than the max pages
    if(searchIndex >= maxPages)
        return alert("Cannot go higher than max pages!");

    // generate new html
    searchIndex++;
    renderMovies(titleSearch, searchIndex);
}

async function previousPage() {
    // prevent if there is no movie searched
    if(titleSearch === null)
        return alert("Please search for something first before trying to go to navigate through pages!");

    // prevent from going lower than 1 pages
    if(searchIndex == 1)
        return alert("Cannot go lower than the page 0!")
    
    // generate new html
    searchIndex--;
    renderMovies(titleSearch, searchIndex);
} 

async function renderMovies(movieTitle, searchPage) {
    // remove all movies & activate load state
    moviesListEl.innerHTML = `<div class="movies__load--state">
        <i class="fas fa-spinner movies__loading--spinner movies__loading"></i>
    </div>`
    
    // await delay(1000000);

    // fetch movies
    const movies = await fetch(`https://www.omdbapi.com?apikey=${apiKey}&s=${movieTitle}&page=${searchPage}`);
    const moviesData = await movies.json();

    // remove load state
    loadingEl.classList.remove("movies__loading");

    if(moviesData.Response !== "True") {
        moviesSearchResultsEl.innerHTML = `Search Results (0):`
        return searchPageEl.innerHTML = `Pages: (0/0)`
    }

    console.log(moviesData);

    // set new max pages
    maxPages = moviesData.totalResults;

    // generate new html
    moviesSearchResultsEl.innerHTML = `Search Results (${moviesData.totalResults}):`
    searchPageEl.innerHTML = `Pages: (${searchPage}/${Math.ceil(moviesData.totalResults/10)})`
    moviesListEl.innerHTML = moviesData.Search.map((data => movieHTML(data))).join("");
}

function movieHTML(movie) {
    return `<div class="movie">
        <figure class="movie__container">
            <img src="${movie.Poster != "N/A" ? movie.Poster : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'}" alt="${movie.Title}" class="movie__container--picture">
        </figure>
        <div class="movie__description">
            <p class="movie--title">${movie.Title}</p>
            <p class="movie--details">${movie.Year}, ${movie.Type}</p>
        </div>
    </div>`;
}
