import { obtenerProductos } from "../services/productService.js";
import { createOrderData } from "../services/orderApi.service.js";
// 1. Referencias al DOM
const contenedorCarrito = document.querySelector('#contenedor-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const contadorCarritoBadge = document.querySelector('#contador-carrito');
const subtotalCarrito = document.querySelector('#subtotal-carrito');
const TOKEN = localStorage.getItem("TOKEN");
const resultadoRegistro = document.querySelector("#resultadoRegistro");
let TOTAL_ORDER = 0;

let carrito = [];

/**
 *? Obtener un valor del LocalStorage
 
@param {*} key
@returns */
const getItemLocalStorage = (key) => {
    //? Validar que existan items
    if (localStorage.getItem == null) return;
    //? Obtener el item (text) y lo convertimos a json
    const data = JSON.parse(localStorage.getItem(key));
    return data;
}
const DATA_USER = getItemLocalStorage("DATA_USER");

// Funciones de sincronización con localStorage
function cargarCarritoDesdeStorage() {
    carrito = JSON.parse(localStorage.getItem('carrito_compras')) || [];
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito_compras', JSON.stringify(carrito));
}

// Operaciones del Carrito (Modificar cantidad y eliminar)
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
        const subtotal = product.price * product.cantidad;
        sumaTotal += subtotal;

        const productCol = document.createElement('div');
        productCol.className = 'col-12 col-sm-6 col-lg-4';

        productCol.innerHTML = `
            <div class="card notch" data-id="${product.id}">
              <div class="art">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <span class="badge">Nuevo</span>
                <small>${product.game || 'General'}</small>
              </div>
              <div class="body">
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <div class="card-action-row">
                    <span class="price">$${product.price} MXN</span> 
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

    TOTAL_ORDER = sumaTotal;
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
document.addEventListener('DOMContentLoaded', async () => {
    cargarCarritoDesdeStorage();

    // Sincronizamos con el backend para mantener precios y datos frescos
    try {
        const productosBD = await obtenerProductos();
        if (productosBD && productosBD.length > 0) {
            carrito = carrito.map(itemCart => {
                const prodFresh = productosBD.find(p => p.id === itemCart.id);
                return prodFresh ? { ...prodFresh, cantidad: itemCart.cantidad } : itemCart;
            });
            guardarCarritoEnStorage();
        }
    } catch (error) {
        console.error("Error al sincronizar con la API:", error);
    }

    // ¡Estas son las funciones que faltaban ejecutar!
    renderizarCarrito();
    actualizarContadorUI();

    // Inicializamos el modal de pago
    iniciarModalPago();
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
        <button type="button" class="pv-prod ${i === 0 ? 'activo' : ''}" title="${p.name}">
            <img src="${p.image}" alt="${p.name}">
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

        let fecha = new Date(); // O cualquier fecha existente
        let diasASumar = 10;

        let orderObj = {
            orders_date: (fecha.setDate(fecha.getDate() + diasASumar)),
            total: TOTAL_ORDER
        }

        let ordenTraking = {
            estimatedDeliveryDate: new Date(fecha.setDate(fecha.getDate() + diasASumar)),
            orderStatus: "ENVIADO"
        }

        try {
            createOrderData((TOKEN.substring(1, TOKEN.length - 1)), DATA_USER.id, orderObj, carrito, ordenTraking);
        } catch (error) {
            LIST_ERRORES.push("Error de conexión. Revisa tu acceso a internet.");
            renderizarMensajes(false, LIST_ERRORES, resultadoRegistro);
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

/*iniciarModalPago();
carrito.forEach(product => {
    orderApiService.registrarProducto(orderIdValue, product)
        .then(data => {
            console.log('Producto registrado:', data);
        })
        .catch(error => {
            console.error('Error al registrar el producto:', error);
        });
});*/

/** ================= STAR: Mensajes ================= */
// Mensajes de error 
function renderizarMensajes(statusForm, mensajes, contenedor) {
    if (!contenedor) return;
    resultadoRegistro.classList.remove('oculto');
    if (statusForm) {
        contenedor.innerHTML = '<div class="alert alert-success mt-3" style="background-color: #122418; color: #2ecc71; border: 1px solid #2a7e43;">El registro se realizó con éxito.</div>';
    } else if (!statusForm) {
        contenedor.innerHTML = "";
        let htmlContent = '<div class="alert alert-danger mt-3" style="background-color: #2a0808; color: #ff6b6b; border: 1px solid #842029;"><ul class="mb-0">';
        for (const mensaje of mensajes) {
            htmlContent += `<li>${mensaje}</li>`;
        }
        htmlContent += '</ul></div>';
        contenedor.innerHTML = htmlContent;
    } else {
        contenedor.innerHTML = "";
    }
}
/** ================= END: Mensajes ================= */