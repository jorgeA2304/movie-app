// This confirms the JavaScript file is connected correctly
console.log("script loaded");

// Get HTML elements so JavaScript can use them
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

// IMPORTANT:
// Replace the text below with your real OMDb API key
const API_KEY = "6d018866";


// This function runs when the user searches for a movie
async function handleSearch() {
  // Get the text from the input and remove extra spaces
  const query = searchInput.value.trim();

  console.log("Query:", query);

  // If the input is empty, stop here
  if (query === "") return;

  // Show a loading message while waiting for the API
  results.innerHTML = "<p>Loading...</p>";

  // Build the API URL using the movie name the user typed
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;

  console.log("URL:", url);

  try {
    // Send request to the OMDb API
    const response = await fetch(url);

    console.log("Fetch response:", response);

    // Convert the API response into JavaScript data
    const data = await response.json();

    console.log("API data:", data);

    // If the API says no results or another error
    if (data.Response === "False") {
      results.innerHTML = `<p>${data.Error}</p>`;
      return;
    }

    // If movies were found, show them on the page
    displayMovies(data.Search);

  } catch (error) {
    // If something fails (internet error, API problem, etc.)
    console.error("Fetch error:", error);
    results.innerHTML = "<p>Error loading data.</p>";
  }
}


// This function displays all movies returned by the API
function displayMovies(movies) {


// This function gets detailed info about ONE movie
async function getMovieDetails(imdbID) {

  // Show loading message while fetching
  results.innerHTML = "<p>Loading details...</p>";

  // Build a new API URL using the movie ID
  // Notice: now we use "i=" instead of "s="
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`;

  try {
    // Send request to API
    const response = await fetch(url);

    // Convert response to usable data
    const data = await response.json();

    console.log("Movie details:", data);

    // Show the movie details on screen
    showMovieDetails(data);

  } catch (error) {
    // If something fails
    console.error(error);
    results.innerHTML = "<p>Error loading details.</p>";
  }
}





  // Clear old search results
  results.innerHTML = "";

  // Loop through each movie in the array
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    // If the API does not provide a poster, use a placeholder image instead
    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x445?text=No+Image";

    // Create a div for this movie card
    const div = document.createElement("div");

    // Add a CSS class so it gets styled like a card
    div.classList.add("movie-card");

    // Put movie info inside the card
    div.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;


    // When user clicks a movie card
    div.addEventListener("click", function () {
      // We call another function and pass the movie ID
      // imdbID is a unique identifier for each movie
      getMovieDetails(movie.imdbID);
    });


    // Add the card to the results section
    results.appendChild(div);
  }
}


// When the button is clicked, run the search
searchBtn.addEventListener("click", function () {
  handleSearch();
});

// When the user presses Enter inside the input, run the search
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});






// This function displays the selected movie details
function showMovieDetails(movie) {

  // Replace everything on the screen with this new layout
  results.innerHTML = `
    <div class="movie-detail">

      <!-- Movie title -->
      <h2>${movie.Title}</h2>

      <!-- Poster -->
      <img src="${movie.Poster}" width="200"/>

      <!-- Year -->
      <p><strong>Year:</strong> ${movie.Year}</p>

      <!-- Rating -->
      <p><strong>Rating:</strong> ${movie.imdbRating}</p>

      <!-- Plot description -->
      <p><strong>Plot:</strong> ${movie.Plot}</p>

      <!-- Button to go back -->
      <button id="backBtn">Back</button>
    </div>
  `;

  // Add click event to the Back button
  document.getElementById("backBtn").addEventListener("click", function () {

    // When clicked, run the search again
    // This reloads the movie list
    handleSearch();
  });
}




