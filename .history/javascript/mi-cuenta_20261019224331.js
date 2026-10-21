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

/* EDITAR INFO DE USUARIO */
const inputUsuario = document.querySelectorAll("#datos-usuario input");
const btnEditarDatos = document.getElementById("editardatos");
const btnGuardarDatos = document.getElementById("guardardatos");

const USER_ID = 1; //temporal por ahora
const ROLE_ID = 2; // temporal por ahora xdd
const URL_BASE = `http://localhost:8080/api/users`;

// 3. Función para obtener la información actual del usuario
async function cargarDatosUsuario() {
    try {
        // Intentamos traer los datos desde el backend (asumiendo que tienes un GET /api/users/1)
        const respuesta = await fetch(`${URL_BASE}/${USER_ID}`);
        
        if (respuesta.ok) {
            const datosServidor = await respuesta.json();
            console.log("Datos cargados desde el servidor:", datosServidor);
            rellenarFormulario(datosServidor);
            return; // Si funciona, salimos de la función
        }
    } catch (error) {
        console.warn("Servidor inaccesible. Cargando datos desde LocalStorage como respaldo...", error);
    }

    // Respaldo por si el servidor falla o no responde
    const datosLocales = localStorage.getItem("DATA_USER");
    if (datosLocales) {
        const datosParseados = JSON.parse(datosLocales);
        rellenarFormulario(datosParseados);
    }
}

// Función auxiliar para rellenar los inputs y dejarlos deshabilitados
function rellenarFormulario(data) {
    inputsUsuario.forEach(input => {
        if (data[input.id] !== undefined) {
            input.value = data[input.id];
        }
        input.disabled = true; // Asegura que inicien bloqueados
    });
}
// 4. Función para enviar la actualización a Spring Boot
async function guardarDatosEnServidor() {
    const datosFormulario = {};
    
    // Recopilamos el ID de cada input y su valor actual
    inputsUsuario.forEach(input => {
        datosFormulario[input.id] = input.value;
    });

    try {
        // Bloqueamos los inputs temporalmente durante la transferencia
        inputsUsuario.forEach(input => input.disabled = true);

        // Hacemos la petición de actualización (PUT)
        const respuesta = await fetch(`${URL_BASE}/${USER_ID}/${ROLE_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' // Obligatorio para enviar JSON
            },
            body: JSON.stringify(datosFormulario) // Convierte el objeto JS a texto JSON
        });

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: ${respuesta.status}`);
        }

        const usuarioActualizado = await respuesta.json();
        console.log("¡Servidor actualizado con éxito!", usuarioActualizado);

        // Guardamos también en localStorage para mantener el respaldo al día
        localStorage.setItem("DATA_USER", JSON.stringify(datosFormulario));

        // Intercambiamos los botones de acción
        if (btnGuardarDatos) btnGuardarDatos.classList.add("d-none");
        if (btnEditarDatos) btnEditarDatos.classList.remove("d-none");

    } catch (error) {
        console.error("No se pudo guardar la información:", error);
        alert("Hubo un error al conectar con el servidor. Los cambios no se guardaron.");
        
        // Si hay error, desbloqueamos los campos para que el usuario pueda intentar corregir o reintentar
        inputsUsuario.forEach(input => input.disabled = false);
    }
}
// 5. Escuchar cuando el usuario hace clic en los botones
document.addEventListener("click", (e) => {
    // Botón de EDITAR
    if (e.target.id === "editardatos" || e.target.closest("#editardatos")) {
        inputsUsuario.forEach(input => input.disabled = false); // Habilita escritura
        if (btnEditarDatos) btnEditarDatos.classList.add("d-none");
        if (btnGuardarDatos) btnGuardarDatos.classList.remove("d-none");
    }
    
    // Botón de GUARDAR
    if (e.target.id === "guardardatos") {
        guardarDatosEnServidor(); // Ejecuta la función del Paso 3
    }
});

// 6. Escuchar cuando la página se abre por primera vez
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosUsuario(); // Ejecuta la función del Paso 2
});


/*codigo del boton de cerrar sesion */
const btnCerrarSesion = document.getElementById("cerrarsesion");

btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("DATA_USER");
    localStorage.removeItem("avatarGuardado");
    localStorage.removeItem("switchGuardado");

    window.location.href = "index.html";
});