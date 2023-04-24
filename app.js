

const moviesSearchResultsEl = document.querySelector('.movies__description--search-results');
const searchPageEl = document.querySelector('.movies__filter--title');
const moviesListEl = document.querySelector('.movies__list');
const apiKey = '314d35d9';

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
    const movies = await fetch(`https://www.omdbapi.com?apikey=${apiKey}&s=${movieTitle}&page=${searchPage}`);
    const moviesData = await movies.json();

    if(moviesData.Response !== "True") {
        return moviesSearchResultsEl.innerHTML = `Search Results (0):`
    }

    console.log(moviesData);

    // set new max pages
    maxPages = moviesData.totalResults;

    // generate new html
    moviesSearchResultsEl.innerHTML = `Search Results (${moviesData.totalResults}):`
    searchPageEl.innerHTML = `Pages: (${searchPage}/${moviesData.totalResults})`
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
