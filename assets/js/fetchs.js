const APIKEY = "33573797-da431ff16773565d07c823b48";

// Fetch API para obtener imagenes por categoria
export const fetchCategorias = async (categoria, page) => {
  const url = `https://pixabay.com/api/?key=${APIKEY}&category=${categoria}&per_page=20&page=${page}`;
  try {
    // console.log(url);
    const respuesta = await fetch(url);

    if (respuesta.status === 200) {
      const resultado = await respuesta.json();
      console.log(resultado);
      return resultado;
    } else if (respuesta.status === 401) {
      console.log("Error al realizar la petición");
    }
  } catch (error) {
    throw error;
  }
};

export const fetchBusqueda = async (busqueda) => {
  const url = `https://pixabay.com/api/?key=${APIKEY}&q=${busqueda}&per_page=50`;

  // console.log(url);
  const respuesta = await fetch(url);
  const resultado = await respuesta.json();
  // console.log(resultado);
  return resultado;
};
