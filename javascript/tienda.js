
const carrito = [];

const productsElement = document.querySelector("#productos");
const contenedorCarrito = document.querySelector('#contenedor-carrito');
const totalCarrito = document.querySelector('#total-carrito');

const carritoStorage = JSON.parse(localStorage.getItem('carrito_compras')) || [];

//Guardar en localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito_compras', JSON.stringify(carrito));
}

function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito_compras');
    if (carritoGuardado) {
        const datos = JSON.parse(carritoGuardado);
        carrito.length = 0;
        carrito.push(...datos);
    }
}

function renderProducts() {

    if (typeof productos === 'undefined' || !productsElement) return;

    productsElement.innerHTML = '';
    
    productos.forEach(product => {
        const productCol = document.createElement('div');
        productCol.className = 'col-12 col-sm-6 col-lg-4';
        
        productCol.innerHTML = `
            <div class="card notch">
              <div class="art">
                <img src="${product.imagen}" class="card-img-top" alt="${product.nombre}">
                <span class="badge">${product.genero}</span>
                <small>${product.plataforma}</small>
              </div>
              <div class="body">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <div class="card-action-row">
                    <span class="price">$${product.precio} MXN</span>
                    <button class="cta notch-sm btn-agregar">Añadir</button>
                </div>
              </div>
            </div>
        `;

        
        //Se maneja el boton agregar
        const btnAgregar = productCol.querySelector('.btn-agregar');
        btnAgregar.addEventListener('click', (event) => {
            agregarAlCarrito(product.id);
        });
        

        productsElement.appendChild(productCol);
    });
}

//Operaciones del carrito
function agregarAlCarrito(id_producto) {
    const productoEncontrado = productos.find(p => p.id === id_producto);
    
    if (productoEncontrado) {
        const productoEnCarrito = carrito.find(p => p.id === id_producto);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            carrito.push({
                ...productoEncontrado,
                cantidad: 1
            });
        }
        
        // Guardamos en LocalStorage
        guardarCarritoEnStorage();
        if (contenedorCarrito) actualizaDOMCarrito();
    }
}

function eliminarDelCarrito(id_producto) {
    const indice = carrito.findIndex(p => p.id === id_producto);
    
    if (indice !== -1) {
        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad -= 1;
        } else {
            carrito.splice(indice, 1);
        }
        guardarCarritoEnStorage();
        actualizaDOMCarrito();
    }
}

function actualizaDOMCarrito() {
    contenedorCarrito.innerHTML = '';
    
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
        totalCarrito.textContent = '$0 MXN';
        return;
    }

    let sumaTotal = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        sumaTotal += subtotal;

        const itemCard = document.createElement('div');
        itemCard.className = 'col-12 col-sm-6 col-lg-4';
        
        itemCard.innerHTML = `
            <div class="card notch">
              <div class="art">
                <img src="${item.imagen}" class="card-img-top" alt="${item.nombre}">
                <span class="badge">${item.genero}</span>
                <small>${item.plataforma}</small>
              </div>
              <div class="body">
                <h3>${item.nombre} (x${item.cantidad})</h3>
                <p>Subtotal: $${subtotal} MXN</p>
                <div class="card-action-row">
                    <button type="button" class="cta notch-sm btn-eliminar">Eliminar</button>
                </div>
              </div>
            </div>
        `;

        const botonEliminar = itemCard.querySelector('.btn-eliminar');
        botonEliminar.addEventListener('click', () => {
            eliminarDelCarrito(item.id);
        });

        contenedorCarrito.appendChild(itemCard);
    });

    totalCarrito.textContent = `$${sumaTotal} MXN`;
}

cargarCarritoDesdeStorage();
renderProducts();
actualizaDOMCarrito();