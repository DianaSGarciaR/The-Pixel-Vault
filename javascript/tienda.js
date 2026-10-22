
// Variable global para almacenar los productos que vienen de la BD
let productosp = [];

const productsElement = document.querySelector("#productos");
let modalsContainer = document.body; 

// Función para renderizar un producto (Mantiene tu diseño cyber intacto)
let renderProduct = (product) => {
    const productCard = `
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="notch">
            <div class="card">
                <div class="art">
                    <!-- Ojo: Asegúrate de que las propiedades coincidan con los atributos del modelo de Java (product.image, product.name, etc.) -->
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

// ==========================================
// NUEVO: Función Asíncrona para cargar productos de Spring Boot
// ==========================================
const cargarProductosDesdeBackend = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        
        productosp = await response.json(); // Guardamos los datos reales de la BD
        
        // Limpiamos y pintamos los productos iniciales
        productsElement.innerHTML = "";
        productosp.forEach((product) => renderProduct(product));

    } catch (error) {
        console.error("No se pudo cargar el catálogo del backend:", error);
        productsElement.innerHTML = `<p class="text-danger text-center">Error: No se pudo conectar con el servidor de la API.</p>`;
    }
};

// Ejecutamos la carga al iniciar la página
document.addEventListener("DOMContentLoaded", cargarProductosDesdeBackend);
//----Inicio localStorage---------------------------------
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
            if (product.precio >= min && product.precio <= max) {
                renderProduct(product);
            }
        }
        
        // Filtro por Plataforma convertimos a minúsculas 
        else if (filterType === "platform") {
            if (product.plataforma.toLowerCase().includes(filterValue.toLowerCase())) {
                renderProduct(product);
            }
        }
        
        // Filtro por Género
        else if (filterType === "genre") {
            if (product.genero.toLowerCase() === filterValue.toLowerCase()) {
                renderProduct(product);
            }
        }
    });
});