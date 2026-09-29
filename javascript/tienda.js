
import { productosp } from "../services/dataCatalogo.js";



const productsElement = document.querySelector("#productos");


//Seleccionamos el elemento del DOM donde se van a renderizar las cards de los productos
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

productosp.map((product) => renderProduct(product));
//Recordar que map va a recibir como argumento un callback, en este caso, la función a aplicar sobre cada uno de sus productos.
const juegosElement = document.querySelector("#menuVideojuegos");

juegosElement.addEventListener("click",(e) => {
    e.preventDefault();
    if(e.target.id == "Videojuegos"){
        productsElement.innerHTML= "";
        const pr = "Videojuego";
        console.log("Ya dió click");
        productosp.map((product) =>{
            if(product.tipo == pr){
                renderProduct(product);
            }
        })
    }else if(e.target.id == "Fisicos"){
        productsElement.innerHTML= "";
        const pr = "Físico";
        console.log("Ya dió click");
        productosp.map((product) =>{
            if(product.categoria == pr){
                renderProduct(product);
            }
        })
    }else if(e.target.id == "Digitales"){
        productsElement.innerHTML= "";
        const pr = "Digital";
        console.log("Ya dió click");
        productosp.map((product) =>{
            if(product.categoria == pr){
                renderProduct(product);
            }
        })
    }else if(e.target.id == "EdicionEspecial"){
        productsElement.innerHTML= "";
        const pr = "Edición especial";
        console.log("Ya dió click");
        productosp.map((product) =>{
            if(product.categoria == pr){
                renderProduct(product);
            }
        })
    }
});
//#########################################################
