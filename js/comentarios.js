function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

let movieId = getMovieIdFromUrl();
let selectedRating = 0;

document.addEventListener("DOMContentLoaded", function () {
  const commentBox = document.getElementById("comment-box");
  const starRating = document.getElementById("star-rating");
  const submitButton = document.getElementById("submit-comment");
  const displayComments = document.getElementById("display-comments");

  loadComments(movieId);

  starRating.addEventListener("click", function (event) {
    if (event.target.classList.contains("star")) {
      selectedRating = event.target.getAttribute("data-value");
      Array.from(starRating.children).forEach((star) => {
        star.classList.remove("active");
        if (star.getAttribute("data-value") <= selectedRating) {
          star.classList.add("active");
        }
      });
    }
  });

  submitButton.addEventListener("click", function () {
    const commentText = commentBox.value.trim();
    if (commentText && selectedRating > 0) {
      displayComment(commentText, selectedRating);
      const savedComments =
        JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
      savedComments.push({ text: commentText, rating: selectedRating });
      localStorage.setItem(
        `comments_${movieId}`,
        JSON.stringify(savedComments)
      );
      commentBox.value = "";
      selectedRating = 0;
      Array.from(starRating.children).forEach((star) =>
        star.classList.remove("active")
      );
    }
  });

  function loadComments(movieId) {
    const savedComments =
      JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
    savedComments.forEach((comment) => {
      displayComment(comment.text, comment.rating);
    });
  }

  function displayComment(text, rating) {
    const commentDiv = document.createElement("div");
    commentDiv.innerHTML = `<p>${text}</p><p>Puntuación: ${rating} estrellas</p>`;
    displayComments.appendChild(commentDiv);
  }
});
