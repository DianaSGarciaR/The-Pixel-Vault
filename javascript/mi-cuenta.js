/* =========== import =========== */
import { getAllOrdersByIdUser } from "../services/miCuentaApi.service.js"

/* =========== variable =========== */
const perfil = document.getElementById('imagenperfil');
const guardarcambios = document.querySelector('.modal-footer .btn-primary');
const modalElemento = document.getElementById('exampleModal');
const tableHistoyOrders = document.querySelector("#tableHistoyOrders");



let LIST_ERRORES = [];
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

document.addEventListener('click', (e) => {
    if (e.target.id === 'editardatos' || e.target.closest('#editardatos')) {
        inputsUsuario.forEach(input => input.disabled = false);
        if (btnEditarDatos) btnEditarDatos.classList.add('d-none');
        if (btnGuardarDatos) btnGuardarDatos.classList.remove('d-none');
    }
    if (e.target.id === 'guardardatos') {
        const BaseDatosUsuario = {};
        inputsUsuario.forEach(input => {
            BaseDatosUsuario[input.id] = input.value;
            input.disabled = true;
        });
        localStorage.setItem('DATA_USER', JSON.stringify(BaseDatosUsuario));

        // Temporales hasta conectar con crear usuario
        const userId = 1;
        const roleId = 1;

        const updatedUserData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            userName: document.getElementById('nombre').value,
            userMiddleName: document.getElementById('segundoNombre').value,
            userPhone: document.getElementById('telefono').value,
            userLastNameFirst: document.getElementById('apellidoPaterno').value,
            status: 1,
            userLastNameSecond: document.getElementById('apellidoMaterno').value,
            roleId: parseInt(roleId) || 1,
            userAddress: {
                city: document.getElementById('municipio').value,
                state: document.getElementById('estado').value,
                number: document.getElementById('numero').value,
                sector: document.getElementById('colonia').value,
                street: document.getElementById('calle').value,
                country: document.getElementById('pais').value,
                zipCode: parseInt(document.getElementById('postal').value) || null
            }
        };

        // 3. Enviar la petición PUT a Spring Boot 
        fetch(`http://localhost:8080/api/users/${userId}/${roleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(`Error en el servidor (Código ${response.status})`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (btnGuardarDatos) btnGuardarDatos.classList.add('d-none');
                if (btnEditarDatos) btnEditarDatos.classList.remove('d-none');
            })
            .catch(error => {
                inputsUsuario.forEach(input => input.disabled = false);
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const datosMemoria = localStorage.getItem('DATA_USER');
    if (datosMemoria) {
        const data = JSON.parse(datosMemoria);
        inputsUsuario.forEach(input => {
            if (data[input.id] !== undefined) {
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
        localStorage.removeItem('avatarGuardado');
        localStorage.removeItem('switchGuardado');
        window.location.href = 'index.html';
    });
}

/**
 * Converit una fecha al formatro dd/mmm/yyyyy
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
let userId = 1;
let listHistoryOrders = await getAllOrdersByIdUser(null, userId);

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
/** ========= END: Historial de pedidos ========= */

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
