import { obtenerProductos } from "../services/productService.js";

let productosp = [];
const productsElement = document.querySelector("#productos");
let modalsContainer = document.body;

// Función para renderizar un producto 
let renderProduct = (product) => {
    const productCard = `
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="notch">
            <div class="card">
                <div class="art">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <span class="badge">Nuevo</span>
                    <small>${product.game || 'General'}</small>
                </div>
                <div class="body">
                    <h3>${product.name}</h3>
                    <div class="card-action-row">
                        <span class="price">$${product.price} MXN</span>
                        <button type="button" class="cta notch-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.id}">INSPECCIONAR</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    const productModal = `
    <div class="modal fade" id="modal-${product.id}" tabindex="-1" aria-labelledby="modalLabel-${product.id}" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <button type="button" class="btn-cerrar-cyber" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                <div class="container-back"></div>
                <img class="imagen-modal" src="${product.image}" alt="${product.name}">
                <div class="container-descripcion">
                    <h1>${product.name}</h1>
                    <h3>${product.game || ''}</h3>
                    <p class="precio">$${product.price} MXN</p>
                    <p>${product.description}</p>
                    <div class="carrito-container">
                        <button class="carrito" data-id="${product.id}">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    productsElement.insertAdjacentHTML('beforeend', productCard);
    modalsContainer.insertAdjacentHTML('beforeend', productModal);
};

const cargarProductosDesdeBackend = async () => {
    productosp = await obtenerProductos();
    
    if (productosp.length === 0) {
        productsElement.innerHTML = `<p class="text-danger text-center">Error: No se pudo conectar con el servidor de la API o no hay productos.</p>`;
        return;
    }

    productsElement.innerHTML = "";
    productosp.forEach((product) => renderProduct(product));
};

// Ejecutamos la carga al iniciar la página
document.addEventListener("DOMContentLoaded", cargarProductosDesdeBackend);

//----Inicio localStorage-----
function agregarProductoAlCarrito(product_id) {
  const carritoActual = JSON.parse(localStorage.getItem('carrito_compras')) || [];

  const productoSeleccionado = productosp.find(p => p.id === product_id);
  if (!productoSeleccionado) return;

  const productoEnCarrito = carritoActual.find(item => item.id === product_id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
   
    carritoActual.push({
      ...productoSeleccionado,
      cantidad: 1
    });
  }
  localStorage.setItem('carrito_compras', JSON.stringify(carritoActual));
}

// Función para mostrar una notificación rápida
function mostrarNotificacion(mensaje) {
    // Verificar si ya existe una notificación para reutilizarla o crearla
    let toast = document.querySelector('#toast-notificacion');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notificacion';
        toast.className = 'toast-cyber';
        document.body.appendChild(toast);
    }

    toast.textContent = mensaje;
    toast.classList.add('show');

    // Ocultar automáticamente después de 2.5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

modalsContainer.addEventListener('click', (e) => {
    const btnAgregar = e.target.closest('.carrito');
    if(btnAgregar){
        const idProducto = Number(btnAgregar.dataset.id);
        agregarProductoAlCarrito(idProducto);
        mostrarNotificacion('¡Agregaste al carrito!');
    }
});

// Seleccionamos el contenedor de la sección de filtros
const filtrosElement = document.querySelector("#menuFiltros"); 

filtrosElement.addEventListener("click", (e) => {
    // Si el clic no fue en un botón de filtro (.filter-tag), no hacemos nada
    if (!e.target.classList.contains("filter-tag")) return;

    e.preventDefault();

    // Obtenemos el tipo y el valor desde los atributos data-*
    const filterType = e.target.dataset.filterType;
    const filterValue = e.target.dataset.filterValue;

    // Limpiamos los productos actuales antes de renderizar los filtrados
    productsElement.innerHTML = "";

    productosp.forEach((product) => {
        // Filtro por Precio
        if (filterType === "price") {
            const [min, max] = filterValue.split("-").map(Number);
            if (product.price >= min && product.price <= max) {
                renderProduct(product);
            }
        }
        
        // Filtro por Plataforma convertimos a minúsculas 
        else if (filterType === "platform") {
            if (product.game == filterValue) {
                renderProduct(product);
            }
        }
        
        // Filtro por Género
        else if (filterType === "genre") {
            if (product.attributes.toLowerCase() === filterValue.toLowerCase()) {
                renderProduct(product);
            }
        }
    });
});


// Seleccionamos el contenedor de la sección de filtros
const filtrosVideojuegos = document.querySelector("#menuVideojuegos"); 

filtrosVideojuegos.addEventListener("click", (e) => {
    e.preventDefault();

    // Obtenemos el valor desde los atributos data-*
    const filterId = e.target.id;
    // Limpiamos los productos actuales antes de renderizar los filtrados
    productsElement.innerHTML = "";

    productosp.forEach((product) => {
        // Filtro por Precio
        if (filterId === "Videojuegos") {
            if (product.categories.some(item => item.categoryName ==="Videojuegos")) {
                renderProduct(product);
            }
        }
        
        // Filtro por Plataforma convertimos a minúsculas 
        else if (filterId === "Físico") {
            if (product.categories.some(item => item.categoryName ==="Físico")) {
                renderProduct(product);
            }
        }
        
        // Filtro por Género
        else if (filterId === "Digital") {
            if (product.categories.some(item => item.categoryName ==="Digital")) {
                renderProduct(product);
            }
        }
        // Filtro por Género
        else if (filterId === "Edición Especial") {
            if (product.categories.some(item => item.categoryName ==="Edición Especial")) {
                renderProduct(product);
            }
        }
    });
});

// Seleccionamos el contenedor de la sección de filtros
const filtrosMerch = document.querySelector("#menuMerch"); 

filtrosMerch.addEventListener("click", (e) => {
    e.preventDefault();

    // Obtenemos el valor desde los atributos data-*
    const filterId = e.target.id;
    // Limpiamos los productos actuales antes de renderizar los filtrados
    productsElement.innerHTML = "";

    productosp.forEach((product) => {
        // Filtro por CDs y Viniles
        if (filterId === "CDs y Viniles") {
            if (product.categories.some(item => item.categoryName ==="CDs y Viniles")) {
                renderProduct(product);
            }
        }
        
        // Filtro Peluches 
        else if (filterId === "Peluches") {
            if (product.categories.some(item => item.categoryName ==="Peluches")) {
                renderProduct(product);
            }
        }
        
        // Filtro por Arte y Pósters
        else if (filterId === "Arte y Pósters") {
            if (product.categories.some(item => item.categoryName ==="Arte y Pósters")) {
                renderProduct(product);
            }
        }
        // Filtro por Accesorios
        else if (filterId === "Accesorios") {
            if (product.categories.some(item => item.categoryName ==="Accesorios")) {
                renderProduct(product);
            }
        }
        // Filtro por Accesorios
        else if (filterId === "Ropa y Calzado") {
            if (product.categories.some(item => item.categoryName ==="Ropa y Calzado")) {
                renderProduct(product);
            }
        }

    });
});