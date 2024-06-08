const baseUrl = "https://api.jikan.moe/v4/top/anime";
let page = 1;
let isLoading = false;
let currentSearchQuery = "";

async function fetchAndDisplayAnime() {
  if (isLoading) return;
  isLoading = true;

  const loadingElement = document.getElementById("loadingToFetch");
  const animeContainerElement = document.getElementById("anime-container");

  try {
    const response = await fetch(`${baseUrl}?page=${page}`);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();

    console.log(data);
    const animeList = data.data;
    if (animeList.length === 0) {
      loadingElement.textContent = "No more anime to load";
      return;
    }

    animeList.forEach((anime) => {
      const card = document.createElement("div");
      card.className = "anime-card";

      const image = document.createElement("img");
      image.src = anime.images.jpg.image_url;
      card.appendChild(image);

      const title = document.createElement("h3");
      title.textContent = anime.title;
      title.classList.add("line-clamp-2");
      card.appendChild(title);

      const episodes = document.createElement("h5");
      episodes.textContent = `Episodes: ${anime.episodes}`;
      card.appendChild(episodes);

      animeContainerElement.appendChild(card);

      card.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.classList.add("modal");

        const iframe = document.createElement("iframe");
        iframe.src = anime.trailer.embed_url;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        modal.appendChild(iframe);

        document.body.appendChild(modal);

        modal.addEventListener("click", () => {
          document.body.removeChild(modal);
        });

        modal.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          return false;
        });
      });
    });

    page++;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  } finally {
    isLoading = false;
  }
}

async function fetchAndDisplaySearchResults(query) {
  if (isLoading) return;
  isLoading = true;

  const loadingElement = document.getElementById("loadingToFetch");
  const animeContainerElement = document.getElementById("anime-container");

  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&page=${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();

    const searchResults = data.data;
    if (searchResults.length === 0) {
      loadingElement.textContent = "No more anime to load";
      return;
    }

    searchResults.forEach((anime) => {
      const card = document.createElement("div");
      card.className = "anime-card";

      const image = document.createElement("img");
      image.src = anime.images.jpg.image_url;
      card.appendChild(image);

      const title = document.createElement("h3");
      title.textContent = anime.title;
      title.classList.add("line-clamp-2");
      card.appendChild(title);

      const episodes = document.createElement("h5");
      episodes.textContent = `Episodes: ${anime.episodes}`;
      card.appendChild(episodes);

      animeContainerElement.appendChild(card);

      card.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.classList.add("modal");

        const iframe = document.createElement("iframe");
        console.log(anime.trailer.embed_url);
        iframe.src = anime.trailer.embed_url;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        modal.appendChild(iframe);

        document.body.appendChild(modal);

        modal.addEventListener("click", () => {
          document.body.removeChild(modal);
        });

        modal.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          return false;
        });
      });
    });

    page++;
  } catch (error) {
    console.error("There was a problem with the search operation:", error);
  } finally {
    isLoading = false;
  }
}

// Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      if (currentSearchQuery) {
        fetchAndDisplaySearchResults(currentSearchQuery);
      } else {
        fetchAndDisplayAnime();
      }
    }
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  }
);

const loadingElement = document.getElementById("loadingToFetch");
observer.observe(loadingElement);

fetchAndDisplayAnime();

// Search functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", async function () {
  const searchString = this.value.trim();
  const animeContainerElement = document.getElementById("anime-container");

  animeContainerElement.innerHTML = "";
  page = 1;
  currentSearchQuery = searchString;

  if (searchString === "") {
    fetchAndDisplayAnime();
  } else {
    fetchAndDisplaySearchResults(searchString);
  }
});
