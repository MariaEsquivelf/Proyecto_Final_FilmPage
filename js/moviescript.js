function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

let movieId = getMovieIdFromUrl();

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OGUzYTY4MzQ4ZGVkNjA5Y2MxYTZmOThmMzE1OGQ2MCIsInN1YiI6IjY0ODM1YzNkOTkyNTljMDBmZjBkZWIxNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.18WNXqNdzpqsxMZDWMC8OgOGB-vUteG7uAZ5LM7XgqM",
  },
};

function loadMovieData(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=es-ES`, options)
    .then((response) => response.json())
    .then((movie) => {
      const itemDiv = document.querySelector(".slider .list .item");
      itemDiv.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;

      const divContainer = document.createElement("div");
      divContainer.className = "movie-container";

      if (movie.poster_path) {
        const poster = document.createElement("img");
        poster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        poster.alt = movie.title + " poster";
        poster.className = "movie-poster";
        divContainer.appendChild(poster);
      }

      const infoContainer = document.createElement("div");
      infoContainer.className = "movie-info";

      const title = document.createElement("h2");
      title.innerText = movie.title;
      title.className = "movie-title";
      infoContainer.appendChild(title);

      const description = document.createElement("p");
      description.innerText = movie.overview;
      description.className = "movie-description";
      infoContainer.appendChild(description);

      const voteAverage = document.createElement("p");
      voteAverage.innerText = `Promedio de votos: ${movie.vote_average}`;
      voteAverage.className = "movie-vote-average";
      infoContainer.appendChild(voteAverage);

      divContainer.appendChild(infoContainer);
      itemDiv.appendChild(divContainer);
    })
    .catch((err) => {
      console.error("Error al cargar los datos de la película:", err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const movieId = getMovieIdFromUrl();
  if (movieId) {
    loadMovieData(movieId);
    updateFavoriteButtonState();
  }
});

// Guardar una película en favoritos
function addToFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Eliminar una película de favoritos
function removeFromFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.indexOf(movieId);
  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Obtener todas las películas favoritas
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function updateFavoriteButtonState() {
  const favoriteBtn = document.getElementById("favoriteBtn");
  const favorites = getFavorites();

  if (favorites.includes(movieId)) {
    favoriteBtn.textContent = "Eliminar de favoritos";
    favoriteBtn.onclick = function () {
      removeFromFavorites(movieId);
      alert("Película eliminada de favoritos!");
      updateFavoriteButtonState();
    };
  } else {
    favoriteBtn.textContent = "Agregar a favoritos";
    favoriteBtn.onclick = function () {
      addToFavorites(movieId);
      alert("Película agregada a favoritos!");
      updateFavoriteButtonState();
    };
  }
}
