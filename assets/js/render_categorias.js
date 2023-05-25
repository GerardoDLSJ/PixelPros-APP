// import { obtenerCategorias } from "./options";
import { categoriasEsp } from "./categorias.js";

export const enviarCategorias = () => {
  listarCategorias(categoriasEsp.categorias);
};

export function listarCategorias(listaCategorias) {
  console.log(listaCategorias);
  var $fragment = document.createDocumentFragment();

  var $lista = document.getElementById("menu-categorias");

  Object.entries(listaCategorias).forEach(([key, value]) => {
    var $li = document.createElement("li");
    $li.classList.add("main-nav__submenu-item");

    var $link = document.createElement("a");
    $link.textContent = value.toUpperCase();
    $link.setAttribute("href", "/categoria/" + key);
    $link.setAttribute("data-navigo", "");

    $li.appendChild($link);
    $fragment.appendChild($li);
  });

  $lista.appendChild($fragment);
}
