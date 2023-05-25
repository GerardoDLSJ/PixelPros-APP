import {
  observador,
  obtenerImagenPorBusqueda,
  obtenerImagenesPorGenero,
} from "./render_imagenes.js";
export const router = new Navigo("/", true);

const $main = document.querySelector("#root");
const history = window.history;
const $title = document.querySelector("#search-result");
export function initRouter() {
  $('[data-bs-toggle="popover"]').popover("destroy");
  let { href: currentURL, origin: host } = window.location;

  let currentPath = currentURL.replace(host, "");

  router.on("/", () => {
    // $main.innerHTML = renderLastSearch();
    $('[data-bs-toggle="popover"]').popover();
    notReload();
  });

  // Primera ruta search
  router.on("/search", ({ data, params, queryString }) => {
    if (params) {
      if (params.q) {
        let search = params.q;
        limpiarHTML($main);
        obtenerImagenPorBusqueda(search)
          .then((section) => {
            $main.textContent = "";
            $main.appendChild(section);
            $('[data-bs-toggle="popover"]').popover();
            notReload();
          })
          .catch((err) => {
            console.log("No se pudo cargar la ruta: " + err);
          });
      }
    }
  });
  // Ruta: Listar las imagenes por categoria
  router.on("/categoria/:categoria", ({ data }) => {
    if (!data) {
      $main.textContent = "";
      $main.innerHTML = '<h2 style="margin-top: 100px">Sin resultados<h2>';
      return;
    }
    if ($main.hasChildNodes) {
      limpiarHTML($main);
    }
    obtenerImagenesPorGenero(data.categoria).then((section) => {
      $main.textContent = "";
      console.log(section);
      $main.appendChild(section);
      notReload();
      const peliculasEnPantalla = document.querySelectorAll(
        ".container-movies a"
      );
      let ultimaPelicula = peliculasEnPantalla[peliculasEnPantalla.length - 1];
      observador.observe(ultimaPelicula);
    });
  });

  // Ruta info imagen
  router.on("/movie/:id", ({ data }) => {
    if (!data) {
      $main.textContent = "";
      $main.innerHTML = '<h2 style="margin-top: 100px">Ocurrió un error<h2>';
      return;
    }
    $main.innerHTML = renderMovieById(data.id);
    if (document.querySelector(".popover")) {
      document.querySelector(".popover").remove();
    }
    $title.textContent = "";
  });

  router.notFound(() => {
    document.querySelector("main").innerHTML =
      '<h2 style="margin-top: 100px">Page not found<h2>';
  });

  router.resolve(currentPath);
  //$('[data-bs-toggle="popover"]').popover("destroy")

  $('[data-bs-toggle="popover"]').popover();
  // router.navigate(currentPath);
}
// Evitar que se recargue;
export function notReload() {
  console.log("hola");
  const anchors = document.querySelectorAll(".container-movies a");
  for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    if (anchor.hasAttribute("href")) {
      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        // $('[data-bs-toggle="popover"]').popover("destroy");
        let { origin: host } = window.location;
        let currentPath = this.href.replace(host, "");
        router.navigate(currentPath);
      });
    }
  }
}

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}
