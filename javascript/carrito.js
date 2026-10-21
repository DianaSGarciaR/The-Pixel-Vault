// 1. Referencias al DOM
const contenedorCarrito = document.querySelector('#contenedor-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const contadorCarritoBadge = document.querySelector('#contador-carrito');
const subtotalCarrito = document.querySelector('#subtotal-carrito');

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
        if (subtotalCarrito) subtotalCarrito.textContent = '$0 MXN';
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
                    <button class="qty-btn js-qty-decrease" aria-label="Disminuir cantidad">&minus;</button>
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
    if (subtotalCarrito) {
        subtotalCarrito.textContent = `$${sumaTotal} MXN`;
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

// 7. Modal de proceder al pago
const modalPago = document.querySelector('#modalPago');
const formPago = document.querySelector('#formPago');
const listaProductos = document.querySelector('#pagoProductos');

let temporizadorAviso;
function mostrarAviso(texto) {
    const aviso = document.querySelector('#avisoPago');
    if (!aviso) return;

    aviso.textContent = texto;
    aviso.classList.add('show');

    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove('show'), 3500);
}

function pintarProductosModal() {
    listaProductos.innerHTML = carrito.map((p, i) => `
        <button type="button" class="pv-prod ${i === 0 ? 'activo' : ''}" title="${p.nombre}">
            <img src="${p.imagen}" alt="${p.nombre}">
            <span class="pv-prod__cant">x${p.cantidad}</span>
        </button>
    `).join('');
}

function iniciarModalPago() {
    if (!modalPago) return;

    modalPago.addEventListener('show.bs.modal', (e) => {
        if (carrito.length === 0) {
            e.preventDefault();
            mostrarAviso('Tu carrito está vacío.');
            return;
        }
        pintarProductosModal();
    });

    document.querySelector('#pagoPrev').addEventListener('click', () => {
        listaProductos.scrollBy({ left: -180 });
    });
    document.querySelector('#pagoNext').addEventListener('click', () => {
        listaProductos.scrollBy({ left: 180 });
    });

    listaProductos.addEventListener('click', (e) => {
        const boton = e.target.closest('.pv-prod');
        if (!boton) return;
        listaProductos.querySelectorAll('.pv-prod').forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');
    });

    const soloDigitos = (texto) => texto.replace(/\D/g, '');

    document.querySelector('#numTarjeta').addEventListener('input', (e) => {
        e.target.value = soloDigitos(e.target.value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    });

    document.querySelector('#expiracion').addEventListener('input', (e) => {
        const d = soloDigitos(e.target.value).slice(0, 4);
        e.target.value = d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
    });

    ['#cvv', '#cp'].forEach(selector => {
        const campo = document.querySelector(selector);
        if (!campo) return;
        campo.addEventListener('input', () => {
            campo.value = soloDigitos(campo.value).slice(0, selector === '#cvv' ? 4 : 5);
        });
    });

    formPago.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!formPago.checkValidity()) {
            formPago.classList.add('was-validated');
            return;
        }

        // para enviar al backend (Spring Boot).
        bootstrap.Modal.getInstance(modalPago).hide();
        mostrarAviso('¡Pago confirmado! 🎮');
    });

    modalPago.addEventListener('hidden.bs.modal', () => {
        formPago.reset();
        formPago.classList.remove('was-validated');
    });
}

iniciarModalPago();