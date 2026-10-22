import { obtenerUsuario } from '../services/DataUser.js';

const perfil = document.getElementById('imagenperfil'); 
const guardarcambios = document.querySelector('.modal-footer .btn-primary'); 
const modalElemento = document.getElementById('exampleModal'); 

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
        usuarioActual = await obtenerUsuario();

        // Lo mando a llamr cada valor en usuarioActual
        document.getElementById('nombre').value = usuarioActual.userName || '';
        document.getElementById('segundoNombre').value = usuarioActual.userMiddleName || '';
        document.getElementById('apellidoPaterno').value = usuarioActual.userLastNameFirst || '';
        document.getElementById('apellidoMaterno').value = usuarioActual.userLastNameSecond || '';
        document.getElementById('email').value = usuarioActual.email || '';
        document.getElementById('telefono').value = usuarioActual.userPhone || '';

        // La dirección viene dentro de userAddress en la respuesta.
        const direccion = usuarioActual.userAddress || {};
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

async function guardarDatosUsuario() {
        if (!usuarioActual) {
            mensajeErrorUsuario.textContent = 'Primero hay que cargar los datos del usuario.';
            mensajeErrorUsuario.classList.remove('d-none');
            return;
        }

        // El ID viene del usuario cargado. El 3 y el 1 son valores de respaldo.
        const userId = usuarioActual && usuarioActual.id ? usuarioActual.id : 3;
        const roleId = usuarioActual && usuarioActual.roleId ? usuarioActual.roleId : 1;
        const updatedUserData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
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

        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/${roleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUserData)
            });

            if (!response.ok) {
                throw new Error(`Error en el servidor (Código ${response.status})`);
            }

            // Guardamos lo escrito para que siga disponible en la página.
            const BaseDatosUsuario = {};
            inputsUsuario.forEach(input => {
                BaseDatosUsuario[input.id] = input.value;
                input.disabled = true;
            });
            localStorage.setItem('DATA_USER', JSON.stringify(BaseDatosUsuario));
            mensajeErrorUsuario.classList.add('d-none');
            if (btnGuardarDatos) btnGuardarDatos.classList.add('d-none');
            if (btnEditarDatos) btnEditarDatos.classList.remove('d-none');
        } catch (error) {
            console.error('No se pudieron guardar los datos del usuario:', error);
            mensajeErrorUsuario.textContent = 'No se pudieron guardar tus cambios. Intenta de nuevo.';
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
        localStorage.removeItem('avatarGuardado'); 
        localStorage.removeItem('switchGuardado'); 
        window.location.href = 'index.html'; 
    }); 
}
