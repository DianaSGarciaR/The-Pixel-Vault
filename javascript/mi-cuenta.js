/* =========== import =========== */
import { getAllOrdersByIdUser } from "../services/miCuentaApi.service.js"
import { obtenerUsuario } from '../services/DataUser.js';

/* =========== variable =========== */
const perfil = document.getElementById('imagenperfil');
const guardarcambios = document.querySelector('.modal-footer .btn-primary');
const modalElemento = document.getElementById('exampleModal');
const tableHistoyOrders = document.querySelector("#tableHistoyOrders");
const TOKEN = localStorage.getItem("TOKEN");

let LIST_ERRORES = [];

/**
 *? Obtener un valor del LocalStorage
 * @param {*} key 
 * @returns 
 */
const getItemLocalStorage = (key) => {
    //? Validar que existan items
    if (localStorage.getItem == null) return;
    //? Obtener el item (text) y lo convertimos a json
    const data = JSON.parse(localStorage.getItem(key));
    return data;
}
const DATA_USER = getItemLocalStorage("DATA_USER");


/* Cambio de avatar en perfil */
let avatarselect = '';
document.addEventListener('click', (e) => {
    if (e.target.id && e.target.id.startsWith('av')) {
        avatarselect = e.target.id;
    }
});

if (guardarcambios) {
    guardarcambios.addEventListener('click', () => {
        if (avatarselect !== '') {
            localStorage.setItem('avatarGuardado', avatarselect);
            renderizarAvatar(avatarselect);
            const modalInstance = bootstrap.Modal.getInstance(modalElemento);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    });
}

function renderizarAvatar(idAvatar) {
    let rutaAvatar = '';
    switch (idAvatar) {
        case 'av1': rutaAvatar = 'assets/avatar1.svg'; break;
        case 'av2': rutaAvatar = 'assets/avatar2.svg'; break;
        case 'av3': rutaAvatar = 'assets/avatar3.svg'; break;
        case 'av4': rutaAvatar = 'assets/avatar4.svg'; break;
        case 'av5': rutaAvatar = 'assets/avatar5.svg'; break;
        case 'av6': rutaAvatar = 'assets/avatar6.svg'; break;
        default: rutaAvatar = 'assets/avatar1.svg';
    }
    perfil.innerHTML = '';
    perfil.insertAdjacentHTML('afterbegin', `<img src="${rutaAvatar}" alt="Avatar Seleccionado" class="avatar-renderizado">`);
}

document.addEventListener('DOMContentLoaded', () => {
    const avatarEnMemoria = localStorage.getItem('avatarGuardado');
    if (avatarEnMemoria) {
        renderizarAvatar(avatarEnMemoria);
    } else {
        renderizarAvatar('av1');
    }
});

/* Guardar forma de pago */
const casillaswitch = document.querySelectorAll('.form-check-input');
const btnEditarPago = document.getElementById('editarpago');
const btnGuardarPago = document.getElementById('guardarpago');

document.addEventListener('click', (e) => {
    if (e.target.id === 'editarpago' || e.target.closest('#editarpago')) {
        casillaswitch.forEach(casilla => casilla.disabled = false);
        if (btnEditarPago) btnEditarPago.classList.add('d-none');
        if (btnGuardarPago) btnGuardarPago.classList.remove('d-none');
    }
    if (e.target.id === 'guardarpago') {
        const estadosArray = [];
        casillaswitch.forEach(casilla => {
            estadosArray.push(casilla.checked);
            casilla.disabled = true;
        });
        localStorage.setItem('switchGuardado', JSON.stringify(estadosArray));
        if (btnGuardarPago) btnGuardarPago.classList.add('d-none');
        if (btnEditarPago) btnEditarPago.classList.remove('d-none');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const switchelegido = localStorage.getItem('switchGuardado');
    if (switchelegido) {
        const estadosArray = JSON.parse(switchelegido);
        casillaswitch.forEach((casilla, indice) => {
            casilla.checked = estadosArray[indice] === true;
            casilla.disabled = true;
        });
    } else {
        casillaswitch.forEach(casilla => {
            casilla.checked = false;
            casilla.disabled = true;
        });
    }
});

/* Guardar info de usuario y Conectar con Spring Boot */
const inputsUsuario = document.querySelectorAll('#datos-usuario input');
const btnEditarDatos = document.getElementById('editardatos');
const btnGuardarDatos = document.getElementById('guardardatos');
const mensajeErrorUsuario = document.getElementById('error-usuario');
let usuarioActual;

async function cargarDatosUsuario() {
    try {
        // Aqui llamo a mi funcion que tiene los datos de la api
        usuarioActual = await obtenerUsuario(TOKEN.substring(1, TOKEN.length - 1), DATA_USER.id);  // Revisar

        // Si ya habías guardado cambios, los mostramos; si no, usamos lo que vino de la API.
        const datosGuardados = JSON.parse(localStorage.getItem('DATOS_PARA_POST')) || usuarioActual;
        document.getElementById('nombre').value = datosGuardados.userName || '';
        document.getElementById('segundoNombre').value = datosGuardados.userMiddleName || '';
        document.getElementById('apellidoPaterno').value = datosGuardados.userLastNameFirst || '';
        document.getElementById('apellidoMaterno').value = datosGuardados.userLastNameSecond || '';
        document.getElementById('email').value = datosGuardados.email || '';
        document.getElementById('telefono').value = datosGuardados.userPhone || '';

        // La dirección viene dentro de userAddress en la respuesta.
        const direccion = datosGuardados.userAddress || {};     // Revisar
        document.getElementById('calle').value = direccion.street || '';
        document.getElementById('numero').value = direccion.number || '';
        document.getElementById('colonia').value = direccion.sector || '';
        document.getElementById('municipio').value = direccion.city || '';
        document.getElementById('estado').value = direccion.state || '';
        document.getElementById('pais').value = direccion.country || '';
        document.getElementById('postal').value = direccion.zipCode || '';
    } catch (error) {
        console.error('No se pudieron cargar los datos del usuario:', error);
        mensajeErrorUsuario.textContent = 'No se pudieron cargar tus datos. Revisa que el servidor esté activo.';
        mensajeErrorUsuario.classList.remove('d-none');
    }
}

cargarDatosUsuario();

document.addEventListener('click', (e) => {
    if (e.target.id === 'editardatos' || e.target.closest('#editardatos')) {
        inputsUsuario.forEach(input => input.disabled = false);
        if (btnEditarDatos) btnEditarDatos.classList.add('d-none');
        if (btnGuardarDatos) btnGuardarDatos.classList.remove('d-none');
    }
    if (e.target.id === 'guardardatos') {
        guardarDatosUsuario(); // para cuando se modifique algun cammpo
    }
});

function guardarDatosUsuario() { // Revisar
    const roleId = usuarioActual && usuarioActual.roleId ? usuarioActual.roleId : 1;
    const datosParaPost = { // Revisar
        email: document.getElementById('email').value,
        userName: document.getElementById('nombre').value,
        userMiddleName: document.getElementById('segundoNombre').value,
        userPhone: document.getElementById('telefono').value,
        userLastNameFirst: document.getElementById('apellidoPaterno').value,
        status: usuarioActual && usuarioActual.status ? usuarioActual.status : 1,
        userLastNameSecond: document.getElementById('apellidoMaterno').value,
        roleId,
        userAddress: {
            city: document.getElementById('municipio').value,
            state: document.getElementById('estado').value,
            number: document.getElementById('numero').value,
            sector: document.getElementById('colonia').value,
            street: document.getElementById('calle').value,
            country: document.getElementById('pais').value,
            zipCode: parseInt(document.getElementById('postal').value, 10) || null
        }
    };

    try {// Revisar
        // Guardamos el objeto para poder enviarlo a la API más adelante.
        localStorage.setItem('DATOS_PARA_POST', JSON.stringify(datosParaPost));
        document.getElementById('password').value = '';
        inputsUsuario.forEach(input => input.disabled = true);
        mensajeErrorUsuario.textContent = 'Datos guardados.';
        mensajeErrorUsuario.classList.remove('text-danger');
        mensajeErrorUsuario.classList.add('te       xt-success');
        mensajeErrorUsuario.classList.remove('d-none');
        if (btnGuardarDatos) btnGuardarDatos.classList.add('d-none');
        if (btnEditarDatos) btnEditarDatos.classList.remove('d-none');
    } catch (error) {
        console.error('No se pudieron guardar los datos en el navegador:', error);
        mensajeErrorUsuario.textContent = 'No se pudieron guardar los datos en este navegador.';
        mensajeErrorUsuario.classList.remove('text-success');
        mensajeErrorUsuario.classList.add('text-danger');  // Revisar
        mensajeErrorUsuario.classList.remove('d-none');
        inputsUsuario.forEach(input => input.disabled = false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const datosMemoria = localStorage.getItem('DATA_USER');
    if (datosMemoria) {
        const data = JSON.parse(datosMemoria);
        inputsUsuario.forEach(input => {
            if (input.id !== 'password' && data[input.id] !== undefined) {
                input.value = data[input.id];
            }
            input.disabled = true;
        });
    }
});

/* Código del botón de cerrar sesión */
const btnCerrarSesion = document.getElementById('cerrarsesion');
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('DATA_USER');
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('avatarGuardado');
        localStorage.removeItem('switchGuardado');
        window.location.href = 'index.html';
    });
}

/**
 * Convertir una fecha al formatro dd/mmm/yyyyy
 * @param {*} date 
 * @returns dd/mmm/yyyyy
 */
const formatDateDDMMYYYY = (date) => {
    let newDate = new Date(date);
    let day = ((newDate.getDay() < 10) ? ("0" + newDate.getDay()) : newDate.getDay());
    let month = ((newDate.getMonth() < 10) ? ("0" + newDate.getMonth()) : newDate.getMonth());
    let year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
}

/** ========= STAR: Historial de pedidos ========= */
// ! IMPORTANTE Cuando se libero el login obtener el id del usuario
let listHistoryOrders = await getAllOrdersByIdUser(TOKEN.substring(1, TOKEN.length - 1), DATA_USER.id);

const renderTableHistory = (listMyOrdes) => {
    let rows = ``;
    let content = ``;
    if (listMyOrdes.length > 0) {
        for (let i = 0; i < listMyOrdes.length; i++) {
            rows += `<tr>
                <th scope="row">PED-${listMyOrdes[i].id}</th>
                <td>${formatDateDDMMYYYY(listMyOrdes[i].orderDate)}</td>
                <td>$${listMyOrdes[i].total}</td>
                <td>${listMyOrdes[i].orderTrackings[0]?.orderStatus ? listMyOrdes[i].orderTrackings[0]?.orderStatus : "En proceso"}</td>
            </tr> `;
        }
        content = `<table class="table">
            <thead> <tr>
                <th scope="col">ID DEL PEDIDO</th> <th scope="col">FECHA</th> 
                <th scope="col">TOTAL</th> <th scope="col">ESTADO</th>
            </tr> </thead>
            <tbody class="table-group-divider"> ${rows} </tbody>
          </table>`
    } else {
        content = `<h5>Sin pedidos</h5><img src="/assets/Bolsa_compras_triste.webp" width="200px">`
    }
    tableHistoyOrders.insertAdjacentHTML("afterend", content);
};

const getOrdersByIdUser = () => {
    LIST_ERRORES = [];
    listHistoryOrders = (listHistoryOrders ? listHistoryOrders : []);
    renderTableHistory(listHistoryOrders);
    LIST_ERRORES.push("Error de conexión. Revisa tu acceso a internet");
};




getOrdersByIdUser();