// import { options } from "./options.js";
import { router } from "./routes.js";
import { getFromBD, saveMovies } from "./bd.js";
import { notReload } from "./routes.js";
import { fetchBusqueda, fetchCategorias } from "./fetchs.js";

let pagina = 1;
//Observer
export let observador = new IntersectionObserver(
  (entradas, observador) => {
    entradas.forEach((entrada) => {
      console.log(entradas);
      if (entrada.isIntersecting) {
        pagina++;
        if (pagina < 27) {
          let parametro = "";
          let categoria = "";
          if (window.location.pathname) {
            parametro = window.location.pathname;
            categoria = parametro.split("/").pop();
          } else if (window.location.search) {
          }

          obtenerImagenesPorGenero(categoria);
        } else {
          pagina = 1;
        }
      }
    });
  },
  {
    rootMargin: "0px 0px 0px 0px",
    threshold: 1.0,
  }
);

export const buscarImagen = (event) => {
  event.preventDefault();
  const search = event.target.search.value;
  document.title = search;

  router.navigate(`/search?q=${search}`);
  event.target.search.value = "";
};

// Función para obtener imagenes por categoria
export const obtenerImagenesPorGenero = async (categoria) => {
  const imagenes = await fetchCategorias(categoria, pagina);
  return renderImagenes(imagenes.hits);
};

// Función que carga imagenes por busqueda
export const obtenerImagenPorBusqueda = async (busqueda) => {
  const resultadoImagenes = await fetchBusqueda(busqueda);
  return renderImagenes(resultadoImagenes.hits);
};

// Función que se encargá de renderizar los resultados de los fetchs
const renderImagenes = (imagenes) => {
  const fragment = document.createDocumentFragment();

  const $sectionMovies = document.createElement("div");
  $sectionMovies.classList.add("container-movies");

  const $template = document.querySelector("#template-producto");

  imagenes.forEach((imagen, index) => {
    const link = document.createElement("a");
    const {
      downloads,
      id,
      largeImageURL,
      likes,
      tags,
      previewURL,
      user,
      views,
    } = imagen;

    link.setAttribute("href", `/imagen/${id}`);

    // INFORMACIÓN DE CADA IMAGEN PARA EL HOVER

    const $clonArticle = $template.content.cloneNode(true);
    $clonArticle.querySelector("img").src =
      previewURL ?? "/assets/img/icon-image-not-found-vector.webp";
    // $clonArticle.querySelector("article").setAttribute(
    //   "data-bs-content",
    //   ` <div class='container-hover'>
    //         <h3>${title}</h3>
    //         <div class='details-datetime-hover'>
    //           <p>${year}</p>
    //           <p>${runtime} min</p>
    //         </div>
    //         <div class='overview_hover'>
    //           <span>${overview}</span>
    //         </div>
    //         <p class='castActors_hover'>Actors: ${castActors}</p>
    //       </div>
    //   `
    // );

    link.appendChild($clonArticle);
    fragment.appendChild(link);
  });

  if (document.querySelector(".container-movies")) {
    console.log("hola");
    observador.disconnect();
    document.querySelector(".container-movies").appendChild(fragment);
    const peliculasEnPantalla = document.querySelectorAll(
      ".container-movies a"
    );
    let ultimaPelicula = peliculasEnPantalla[peliculasEnPantalla.length - 1];
    observador.observe(ultimaPelicula);
    return;
  }

  $sectionMovies.appendChild(fragment);

  console.log($sectionMovies);

  return $sectionMovies;
};

const updateSearchTitle = (title) => {
  const $titleSearch = document.querySelector("#search-result");
  $titleSearch.textContent = title;
};

export const renderMovieById = (id) => {
  const movies = getFromBD("movies");

  const movie = movies[id - 1];
  const {
    title,
    imdbRating,
    year,
    runtime,
    genres,
    overview,
    streamingInfo,
    youtubeTrailerVideoId,
    youtubeTrailerVideoLink,
    backdropURLs,
  } = movie;
  document.title = title;
  const genresList = genres
    .map((genre, index) => {
      return genre.name;
    })
    .join(" ");

  return `
    <section class="container-movie-fullinfo">
      <div class="fullinfo-data">
          <h2>${title}</h2>
          <p class="imdb-raiting">Imdb <span>${imdbRating}</span></p>
          <a class="btn-trailer" href="${youtubeTrailerVideoLink}" target="_blank">
          <i class="bi bi-play"></i>
          <p>
            Trailer
          </p>
          </a>
          <div class='fullinfo-details'>
            <div class='details-datetime'>
                <p>${year}</p>
                <p>${runtime} min</p>
              </div>
              <div class='details-genres'>
                <span>${genresList}</span>
              </div>
            </div>
            <div class='fullinfo-overview'>
            <p class='overview'>${overview}</p>
            </div>
          <h3>Available in:</h3>
          <div class='container-platforms'>
            ${streamingPlatforms(streamingInfo.us).innerHTML}
          </div>
      </div>
      <div class="full-info-resources">
          <img style="height: 100%; width: 100%;""  src="${
            backdropURLs.original ??
            "/assets/img/icon-image-not-found-vector.webp"
          }" />
          <iframe class="hidden" width="100%" height="100%"  src="https://www.youtube.com/embed/${youtubeTrailerVideoId}?autoplay=1&mute=1&loop=1" frameborder="0" allowfullscreen></iframe>

      </div>
    </section>
  `;
};

// export function renderLastSearch() {
//   const lastSearch = getFromBD("movies");
//   const $titleRenderLastSearch = document.querySelector("#search-result");
//   $titleRenderLastSearch.innerHTML = `Top Movies`;

//   if (!lastSearch) {
//     selectRandomMovies().then((result) => {
//       const $main = document.querySelector("#root");
//       $main.appendChild(result);
//       $('[data-bs-toggle="popover"]').popover();
//       notReload();
//     });
//     return ``;
//   }
//   document.title = `Cine Upnech`;
//   return `
//           <div class="container-movies">
//                 ${renderMovies(lastSearch).innerHTML}
//           </div>`;
// }
