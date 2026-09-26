const productos = [
    {
        id: 1,
        nombre: "Cyber Warriors",
        tipo: "Videojuego",
        categoria: "Físico",
        imagen: "./assets/img/cyber-warriors.jpg",
        descripcion: "Combate futurista en una ciudad dominada por la tecnología.",
        precio: 899,
        genero: "Acción",
        plataforma: "PC",
        stock: 15,
        calificacion: 4.8,
        status: "Disponible"
    },
    {
        id: 2,
        nombre: "Kingdom of Legends",
        tipo: "Videojuego",
        categoria: "Digital",
        imagen: "./assets/img/kingdom-legends.jpg",
        descripcion: "Explora un mundo fantástico lleno de aventuras y misterios.",
        precio: 1199,
        genero: "RPG",
        plataforma: "PS5",
        stock: 8,
        calificacion: 4.7,
        status: "Disponible"
    },
    {
        id: 3,
        nombre: "Speed Horizon",
        tipo: "Videojuego",
        categoria: "Fisico",
        imagen: "./assets/img/speed-horizon.jpg",
        descripcion: "Compite a toda velocidad en diferentes pistas y ciudades.",
        precio: 799,
        genero: "Carreras",
        plataforma: "Xbox",
        stock: 12,
        calificacion: 4.5,
        status: "Disponible"
    },
    {
        id: 4,
        nombre: "Shadow Ninja",
        tipo: "Videojuego",
        categoria: "Edición especial",
        imagen: "./assets/img/shadow-ninja.jpg",
        descripcion: "Conviértete en un ninja y domina diferentes técnicas de combate.",
        precio: 699,
        genero: "Acción",
        plataforma: "Nintendo Switch",
        stock: 0,
        calificacion: 4.6,
        status: "Agotado"
    },
    {
        id: 5,
        nombre: "Galaxy Explorer",
        tipo: "Videojuego",
        categoria: "Digital",
        imagen: "./assets/img/galaxy-explorer.jpg",
        descripcion: "Viaja por el espacio y descubre nuevos planetas.",
        precio: 999,
        genero: "Aventura",
        plataforma: "PC",
        stock: 20,
        calificacion: 4.9,
        status: "Disponible"
    },
    {
        id: 6,
        nombre: "Battle Arena X",
        tipo: "Videojuego",
        categoria: "Edición especial",
        imagen: "./assets/img/battle-arena-x.jpg",
        descripcion: "Enfréntate a otros jugadores en intensas batallas.",
        precio: 749,
        genero: "Peleas",
        plataforma: "PS5",
        stock: 6,
        calificacion: 4.4,
        status: "Disponible"
    },
    {
        id: 7,
        nombre: "Mystic Forest",
        tipo: "Videojuego",
        categoria: "Físico",
        imagen: "./assets/img/mystic-forest.jpg",
        descripcion: "Aventúrate en un bosque mágico lleno de criaturas.",
        precio: 599,
        genero: "Aventura",
        plataforma: "Nintendo Switch",
        stock: 10,
        calificacion: 4.3,
        status: "Disponible"
    },
    {
        id: 8,
        nombre: "Football Stars 2026",
        tipo: "Videojuego",
        categoria: "Digital",
        imagen: "./assets/img/football-stars.jpg",
        descripcion: "Forma tu equipo y compite en emocionantes partidos.",
        precio: 899,
        genero: "Deportes",
        plataforma: "Xbox",
        stock: 4,
        calificacion: 4.2,
        status: "Disponible"
    },
    {
        id: 9,
        nombre: "Zombie Survival",
        tipo: "Videojuego",
        categoria: "Edición especial",
        imagen: "./assets/img/zombie-survival.jpg",
        descripcion: "Sobrevive a un mundo invadido por criaturas peligrosas.",
        precio: 849,
        genero: "Terror",
        plataforma: "PC",
        stock: 0,
        calificacion: 4.7,
        status: "Agotado"
    },
    {
        id: 10,
        nombre: "Dragon Quest",
        tipo: "Videojuego",
        categoria: "Físico",
        imagen: "./assets/img/dragon-quest.jpg",
        descripcion: "Embárcate en una aventura para derrotar al poderoso dragón.",
        precio: 1099,
        genero: "RPG",
        plataforma: "PS5",
        stock: 9,
        calificacion: 4.8,
        status: "Disponible"
    }
];


/**
 * ===================== Generación de productos a partir del json usando el DOM ===============================
 */

//Seleccionamos el elemento del DOM donde se van a renderizar las cards de los productos
let productsElement = document.querySelector("#produtos");
let modalsContainer = document.body; // En donde se renderiza el modal

//Definimos la función para renderizar el producto
let renderProduct = (product) => {
    // CARDS
    const productCard = `
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="notch">
            <div class="card">
                <div class="art">
                    <img src="${product.imagen}" class="card-img-top" alt="${product.nombre}">
                    <span class="badge">${product.genero}</span>
                    <small>${product.plataforma}</small>
                </div>
                <div class="body">
                    <h3>${product.nombre}</h3>
                    <div class="card-action-row">
                        <span class="price">$${product.precio} MXN</span>
                        <button type="button" class="cta notch-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.id}">INSPECCIONAR</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // MODAL
    const productModal = `
    <div class="modal fade" id="modal-${product.id}" tabindex="-1" aria-labelledby="modalLabel-${product.id}" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <button type="button" class="btn-cerrar-cyber" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                <div class="container-back"></div>
                <img class="imagen-modal" src="${product.imagen}" alt="${product.nombre}">
                <div class="container-descripcion">
                    <h1>${product.nombre}</h1>
                    <h3>${product.plataforma}</h3>
                    <p class="precio">$${product.precio} MXN</p>
                    <p>${product.descripcion}</p>
                    <div class="carrito-container">
                        <button class="carrito">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    productsElement.insertAdjacentHTML('beforeend', productCard);
    modalsContainer.insertAdjacentHTML('beforeend', productModal);
}

//Ahora sí mandamos a llamar a la función render product sobre cada uno de los productos del json

productos.map((product) => renderProduct(product));
//Recordar que map va a recibir como argumento un callback, en este caso, la función a aplicar sobre cada uno de sus productos.
const juegosElement = document.querySelector("#menuVideojuegos");

juegosElement.addEventListener("click",(e) => {
    e.preventDefault();
    if(e.target.id == "Videojuegos"){
        productsElement.innerHTML= "";
        const pr = "Videojuego";
        console.log("Ya dió click");
        productos.map((product) =>{
            if(product.tipo == pr){
                renderProduct(product);
            }
        })
    }else if(e.target.id == "Fisicos"){
        productsElement.innerHTML= "";
        const pr = "Físico";
        console.log("Ya dió click");
        productos.map((product) =>{
            if(product.categoria == pr){
                renderProduct(product);
            }
        })
    }else if(e.target.id == "Digitales"){
        productsElement.innerHTML= "";
        const pr = "Digital";
        console.log("Ya dió click");
        productos.map((product) =>{
            if(product.categoria == pr){
                renderProduct(product);
            }
        })
    }else if(e.target.id == "EdicionEspecial"){
        productsElement.innerHTML= "";
        const pr = "Edición especial";
        console.log("Ya dió click");
        productos.map((product) =>{
            if(product.categoria == pr){
                renderProduct(product);
            }
        })
    }
});
