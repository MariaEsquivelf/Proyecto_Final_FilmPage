const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OGUzYTY4MzQ4ZGVkNjA5Y2MxYTZmOThmMzE1OGQ2MCIsInN1YiI6IjY0ODM1YzNkOTkyNTljMDBmZjBkZWIxNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.18WNXqNdzpqsxMZDWMC8OgOGB-vUteG7uAZ5LM7XgqM",
  },
};

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}
function loadFavoriteMovies() {
  const favorites = getFavorites();
  const container = document.getElementById("favorites-container");

  favorites.forEach((movieId) => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=es-ES`,
      options
    )
      .then((response) => response.json())
      .then((movie) => {
        console.log(movie);
        const card = createMovieCard(movie);
        console.log(container);
        container.appendChild(card); // Agregar la tarjeta al contenedor
      })
      .catch((err) => {
        console.error("Error al cargar los datos de la película:", err);
      });
  });
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  const imgCard = document.createElement("div");
  imgCard.className = "imgCard";
  const img = document.createElement("img");
  if (movie.poster_path) {
    img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    img.alt = movie.title + " poster";
  }
  imgCard.appendChild(img);

  const content = document.createElement("div");
  content.className = "content";
  const h3 = document.createElement("h3");
  h3.innerText = movie.title;
  const p = document.createElement("p");
  p.innerText = movie.overview;
  content.appendChild(h3);
  content.appendChild(p);

  card.appendChild(imgCard);
  card.appendChild(content);

  function handleCardClick() {
    window.location.href = `./movie.html?id=${movie.id}`;
  }

  img.addEventListener("click", handleCardClick);
  h3.addEventListener("click", handleCardClick);
  p.addEventListener("click", handleCardClick);

  return card;
}

document.addEventListener("DOMContentLoaded", function () {
  loadFavoriteMovies();
});
