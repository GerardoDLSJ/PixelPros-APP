import { categoriasEsp } from "./categorias.js";
import { buscarImagen } from "./render_imagenes.js";
import { enviarCategorias, listarCategorias } from "./render_categorias.js";
import { initRouter, router } from "./routes.js";

const timeInactive = 2000; // 4 segundos

// establece el temporizador
let temp;

window.addEventListener("DOMContentLoaded", () => {
  document.title = "UpNechMovies";
  //Inicio las rutas
  initRouter();

  // Carga los generos en el menu y los despliega con el hover
  listarCategorias(categoriasEsp.categorias);
  // Añade el evento para detectar un submit en la parte de la barra de busqueda (el dar enter)
  addListeners();
});

export function addListeners() {
  // Selecciono el elemento con el id main-search
  const $formSearch = document.getElementById("main-search");
  // Cuando detecta el submit llama a la función search movie
  $formSearch.addEventListener("submit", buscarImagen);

  document.addEventListener("click", function (event) {
    // Si el elemento clickeado es un anchor, prevenir la acción por defecto
    if (event.target.tagName === "A") {
      event.preventDefault();
      let { origin: host } = window.location;
      console.log(host);
      let currentPath = event.target.href.replace(host, "");
      console.log(currentPath);
      router.navigate(currentPath);
    }
  });
}

document.addEventListener("mousemove", () => {
  // restablece el temporizador cada vez que se detecta movimiento del mouse
  clearTimeout(temp);
  const imgMovie = document.querySelector(".full-info-resources img");
  const trailerMovie = document.querySelector(".full-info-resources iframe");
  if (!imgMovie && !trailerMovie) {
    return;
  }

  temp = setTimeout(() => {
    // realiza alguna acción cuando el usuario está inactivo
    imgMovie.classList.add("hidden");
    trailerMovie.classList.remove("hidden");
  }, timeInactive);
});
