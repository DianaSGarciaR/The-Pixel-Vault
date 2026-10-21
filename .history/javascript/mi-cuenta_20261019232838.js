const perfil = document.getElementById("imagenperfil");
const guardarcambios = document.querySelector(".modal-footer .btn-primary");
const modalElemento = document.getElementById('exampleModal');

/* Cambio de avatar en perfil */
let avatarselect = "";

document.addEventListener("click", (e) => {
    if (e.target.id && e.target.id.startsWith("av")) {
        avatarselect = e.target.id;
    }
});

if (guardarcambios) {
    guardarcambios.addEventListener("click", () => {
        if (avatarselect !== "") {
            localStorage.setItem("avatarGuardado", avatarselect);
            renderizarAvatar(avatarselect);
            const modalInstance = bootstrap.Modal.getInstance(modalElemento);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    });
}

function renderizarAvatar(idAvatar) {
    let rutaAvatar = "";
    switch (idAvatar) {
        case "av1": rutaAvatar = "assets/avatar1.svg"; break;
        case "av2": rutaAvatar = "assets/avatar2.svg"; break;
        case "av3": rutaAvatar = "assets/avatar3.svg"; break;
        case "av4": rutaAvatar = "assets/avatar4.svg"; break;
        case "av5": rutaAvatar = "assets/avatar5.svg"; break;
        case "av6": rutaAvatar = "assets/avatar6.svg"; break;
        default: rutaAvatar = "assets/avatar1.svg";
    }
    perfil.innerHTML = "";
    perfil.insertAdjacentHTML(
        "afterbegin",
        `<img src="${rutaAvatar}" alt="Avatar Seleccionado" class="avatar-renderizado">`
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const avatarEnMemoria = localStorage.getItem("avatarGuardado");
    if (avatarEnMemoria) {
        renderizarAvatar(avatarEnMemoria);
    } else {
        renderizarAvatar("av1");
    }
});

/* Guardar forma de pago */
const casillaswitch = document.querySelectorAll(".form-check-input");
const btnEditarPago = document.getElementById("editarpago");
const btnGuardarPago = document.getElementById("guardarpago");

document.addEventListener("click", (e) => {
    if (e.target.id === "editarpago" || e.target.closest("#editarpago")) {
        casillaswitch.forEach(casilla => casilla.disabled = false);
        if (btnEditarPago) btnEditarPago.classList.add("d-none");
        if (btnGuardarPago) btnGuardarPago.classList.remove("d-none");
    }
    if (e.target.id === "guardarpago") {
        const estadosArray = [];
        casillaswitch.forEach(casilla => {
            estadosArray.push(casilla.checked);
            casilla.disabled = true;
        });
        localStorage.setItem("switchGuardado", JSON.stringify(estadosArray));
        if (btnGuardarPago) btnGuardarPago.classList.add("d-none");
        if (btnEditarPago) btnEditarPago.classList.remove("d-none");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const switchelegido = localStorage.getItem("switchGuardado");
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
const inputsUsuario = document.querySelectorAll("#datos-usuario input");
const btnEditarDatos = document.getElementById("editardatos");
const btnGuardarDatos = document.getElementById("guardardatos");

document.addEventListener("click", (e) => {
    if (e.target.id === "editardatos" || e.target.closest("#editardatos")) {
        inputsUsuario.forEach(input => input.disabled = false);
        if (btnEditarDatos) btnEditarDatos.classList.add("d-none");
        if (btnGuardarDatos) btnGuardarDatos.classList.remove("d-none");
    }
    
    // CORRECCIÓN AQUÍ: Todo se ejecuta al hacer click en guardar datos
    if (e.target.id === "guardardatos") {
        const BaseDatosUsuario = {};
        inputsUsuario.forEach(input => {
            BaseDatosUsuario[input.id] = input.value;
            input.disabled = true;
        });
        localStorage.setItem("DATA_USER", JSON.stringify(BaseDatosUsuario));

        // 1. Definir los IDs para la URL (Asegúrate de que tu backend Spring Boot esté encendido)
        const userId = 1;     
        const roleId = 1;     

        // 2. Construir el objeto leyendo los inputs en tiempo real al hacer click
        const updatedUserData = {
            userName: document.getElementById('nombre').value, 
            userMiddleName: document.getElementById('segundoNombre').value,
            userLastNameFirst: document.getElementById('apellidoPaterno').value,
            userLastNameSecond: document.getElementById('apellidoMaterno').value,
            email: document.getElementById('email').value,
            userPhone: document.getElementById('telefono').value,
            password: document.getElementById('telefono').value, // Requerido por tu backend (@NotBlank)

            userAddress: {
                street: document.getElementById('calle').value,
                number: document.getElementById('numero').value, 
                sector: document.getElementById('colonia').value, 
                city: document.getElementById('municipio').value, 
                state: document.getElementById('estado').value,   
                zipCode: document.getElementById('postal').value, 
                country: 1 
            }
        };

        // 3. Enviar la petición PUT a Spring Boot
        fetch(`http://localhost:8080/api/users/${userId}/${roleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUserData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { 
                    console.error('Errores de validación del Backend:', err);
                    throw new Error(`Error en el servidor (Código ${response.status})`); 
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('¡Sincronización exitosa con Spring Boot!', data);
            alert('Los cambios han sido guardados correctamente en la base de datos.');
            
            // Si la petición es exitosa, cambiamos los botones de la interfaz
            if (btnGuardarDatos) btnGuardarDatos.classList.add("d-none");
            if (btnEditarDatos) btnEditarDatos.classList.remove("d-none");
        })
        .catch(error => {
            console.error('Fallo en la comunicación:', error);
            alert(error.message || 'No se pudo establecer conexión con el backend.');
            
            // Si falla la conexión, dejamos los inputs activos para que el usuario intente de nuevo
            inputsUsuario.forEach(input => input.disabled = false);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const datosMemoria = localStorage.getItem("DATA_USER");
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
const btnCerrarSesion = document.getElementById("cerrarsesion");
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("DATA_USER");
        localStorage.removeItem("avatarGuardado");
        localStorage.removeItem("switchGuardado");

        window.location.href = "index.html";
    });
}
