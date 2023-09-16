let slider = document.querySelector(".slider .list");
let items = document.querySelectorAll(".slider .list .item");
let next = document.getElementById("next");
let prev = document.getElementById("prev");
let dots = document.querySelectorAll(".slider .dots li");

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OGUzYTY4MzQ4ZGVkNjA5Y2MxYTZmOThmMzE1OGQ2MCIsInN1YiI6IjY0ODM1YzNkOTkyNTljMDBmZjBkZWIxNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.18WNXqNdzpqsxMZDWMC8OgOGB-vUteG7uAZ5LM7XgqM'

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};

let lengthItems = items.length - 1;
let active = 0;
next.onclick = function () {
  active = active + 1 <= lengthItems ? active + 1 : 0;
  reloadSlider();
};
prev.onclick = function () {
  active = active - 1 >= 0 ? active - 1 : lengthItems;
  reloadSlider();
};

let refreshInterval = setInterval(() => {
  next.click();
}, 30000);

function reloadSlider() {
  slider.style.left = -items[active].offsetLeft + "px";
  let last_active_dot = document.querySelector(".slider .dots li.active");
  last_active_dot.classList.remove("active");
  dots[active].classList.add("active");

  clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    next.click();
  }, 30000);
}

dots.forEach((li, key) => {
  li.addEventListener("click", () => {
    active = key;
    reloadSlider();
  });
});
window.onresize = function (event) {
  reloadSlider();
};

function updateSliderImages(movies) {
  const items = document.querySelectorAll(".slider .list .item");
  movies.forEach((movie, index) => {
    function handleslideClick() {
        window.location.href = `./movie.html?id=${movie.id}`;
    }
    if (items[index]) {
      items[
        index
      ].style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;

      const divContainer = document.createElement("div");
      divContainer.className = "movie-container";

      if (movie.poster_path) {
        const poster = document.createElement("img");
        poster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        poster.alt = movie.title + " poster";
        poster.className = "movie-poster";
        divContainer.appendChild(poster);


        poster.addEventListener("click", handleslideClick);
      }

      const infoContainer = document.createElement("div");
      infoContainer.className = "movie-info";

      const title = document.createElement("h2");
      title.innerText = movie.title;
      title.className = "movie-title";
      infoContainer.appendChild(title);


      title.addEventListener("click", handleslideClick);

      const description = document.createElement("p");
      description.innerText = movie.overview;
      description.className = "movie-description";
      infoContainer.appendChild(description);

      // Añadir evento click a la descripción
      description.addEventListener("click", handleslideClick);

      divContainer.appendChild(infoContainer);
      items[index].appendChild(divContainer);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getTopMovies().then((topMovies) => {
    updateSliderImages(topMovies);
  });
  getPopularMovies().then((popularMovies) => {
    updatePopularImages(popularMovies);
  });
});

function getTopMovies() {
  return fetch(
    "https://api.themoviedb.org/3/trending/movie/week?language=es-ES",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      return data.results.slice(0, 6).map((movie) => ({
        id: movie.id,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        title: movie.title,
        overview: movie.overview,
      }));
    })
    .catch((err) => {
      console.error("Error al cargar la imagen:", err);
      return [];
    });
}

function getPopularMovies() {
  return fetch(
    "https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1&region=PY",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      return data.results.slice(0, 10).map((movie) => ({
        id: movie.id,
        poster_path: movie.poster_path,
        title: movie.title,
        overview: movie.overview,
      }));
    })
    .catch((err) => console.error(err));
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

    img.addEventListener('click', handleCardClick);
    h3.addEventListener('click', handleCardClick);
    p.addEventListener('click', handleCardClick);

    return card;
}


function updatePopularImages(movies) {
  const container = document.querySelector(".container-cards");
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

