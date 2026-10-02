// 1. Referencias al DOM
const contenedorCarrito = document.querySelector('#contenedor-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const contadorCarritoBadge = document.querySelector('#contador-carrito');

// Variable global en memoria para manipular los productos en esta vista
let carrito = [];

// 2. Funciones de sincronización con localStorage
function cargarCarritoDesdeStorage() {
    carrito = JSON.parse(localStorage.getItem('carrito_compras')) || [];
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito_compras', JSON.stringify(carrito));
}

// 3. Operaciones del Carrito (Modificar cantidad y eliminar)
function cambiarCantidad(idProducto, cambio) {
    const producto = carrito.find(item => item.id === idProducto);
    if (!producto) return;

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        eliminarDelCarrito(idProducto);
        return;
    }

    actualizarEstadoCarrito();
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarEstadoCarrito();
}

function actualizarEstadoCarrito() {
    guardarCarritoEnStorage();
    renderizarCarrito();
    actualizarContadorUI();
}

// 4. Renderizado en el DOM
function renderizarCarrito() {
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p class="empty-cart-msg">El carrito está vacío.</p>';
        if (totalCarrito) totalCarrito.textContent = '$0 MXN';
        return;
    }

    let sumaTotal = 0;

    carrito.forEach(product => {
        const subtotal = product.precio * product.cantidad;
        sumaTotal += subtotal;

        const productCol = document.createElement('div');
        productCol.className = 'col-12 col-sm-6 col-lg-4';
        
        productCol.innerHTML = `
            <div class="card notch" data-id="${product.id}">
              <div class="art">
                <img src="${product.imagen}" class="card-img-top" alt="${product.nombre}">
                <span class="badge">${product.genero}</span>
                <small>${product.plataforma}</small>
              </div>
              <div class="body">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion || ''}</p>
                <div class="card-action-row">
                    <span class="price">$${subtotal} MXN</span>
                </div>
                <div class="cantidad">
                  <span class="quantity-label">Cantidad</span>
                  <div class="quantity-control">
                    <button class="qty-btn js-qty-decrease" aria-label="Disminuir cantidad">—</button>
                    <span class="qty-number">${product.cantidad}</span>
                    <button class="qty-btn js-qty-increase" aria-label="Aumentar cantidad">+</button>
                  </div>
                </div>

                <div class="item-actions">
                  <button class="action-btn js-remove-product" aria-label="Eliminar producto">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
        `;

        contenedorCarrito.appendChild(productCol);
    });

    if (totalCarrito) {
        totalCarrito.textContent = `$${sumaTotal} MXN`;
    }
}

function actualizarContadorUI() {
    if (!contadorCarritoBadge) return;
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarritoBadge.textContent = totalItems;
}

// 5. Delegación de Eventos
if (contenedorCarrito) {
    contenedorCarrito.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;

        const idProducto = Number(card.dataset.id);

        if (e.target.closest('.js-qty-increase')) {
            cambiarCantidad(idProducto, 1);
        } else if (e.target.closest('.js-qty-decrease')) {
            cambiarCantidad(idProducto, -1);
        } else if (e.target.closest('.js-remove-product')) {
            eliminarDelCarrito(idProducto);
        }
    });
}

// 6. Carga e Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeStorage();
    renderizarCarrito();
    actualizarContadorUI();
});