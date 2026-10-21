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

/* Guardar info de usuario */
const inputsUsuario = document.querySelectorAll("#datos-usuario input");
const btnEditarDatos = document.getElementById("editardatos");
const btnGuardarDatos = document.getElementById("guardardatos");

document.addEventListener("click", (e) => {
    if (e.target.id === "editardatos" || e.target.closest("#editardatos")) {
        inputsUsuario.forEach(input => input.disabled = false);
        if (btnEditarDatos) btnEditarDatos.classList.add("d-none");
        if (btnGuardarDatos) btnGuardarDatos.classList.remove("d-none");
    }
    if (e.target.id === "guardardatos") {
        const BaseDatosUsuario = {};
        inputsUsuario.forEach(input => {
            BaseDatosUsuario[input.id] = input.value;
            input.disabled = true;
        });
        localStorage.setItem("DATA_USER", JSON.stringify(BaseDatosUsuario));
        if (btnGuardarDatos) btnGuardarDatos.classList.add("d-none");
        if (btnEditarDatos) btnEditarDatos.classList.remove("d-none");
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

/*codigo del boton de cerrar sesion */
const btnCerrarSesion = document.getElementById("cerrarsesion");

btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("DATA_USER");
    localStorage.removeItem("avatarGuardado");
    localStorage.removeItem("switchGuardado");

    window.location.href = "index.html";
});

/* EDITAR DATOS DE USUARIO */
// 1. Obtén los IDs necesarios para la URL del endpoint
const userId = 1;     // ID del usuario a modificar
const roleId = 1;     // ID del rol del usuario (se manda en la URL y en el cuerpo)

// 2. Construye el objeto respetando de forma exacta la estructura de tus Records en Java
const updatedUserData = {
    // Datos principales (UsersRequest)
    email: document.getElementById('email').value,
    userName: document.getElementById('nombre').value, // Mapeado al input "Nombre"
    userMiddleName: "N/A", // Si no tienes input en el HTML para este campo, asígnalo temporalmente o déjalo vacío según tu lógica
    userPhone: document.getElementById('telefono').value,
    userLastNameFirst: document.getElementById('apellidos').value.split(" ")[0] || "", // Primer apellido
    userLastNameSecond: document.getElementById('apellidos').value.split(" ")[1] || "", // Segundo apellido
    password: "", // Ojo: Es @NotBlank en tu backend. Pásale el password actual o el valor que manejes si no se cambia aquí
    status: 1,    // Ojo: Es @NotNull Byte (0 o 1). Ajusta según corresponda
    roleId: roleId, // Ojo: Es @NotNull Long

    // Objeto anidado (UserAddress)
    userAddress: {
        street: document.getElementById('calle').value,
        number: document.getElementById('numero').value, // Tu Record lo recibe como String en Java
        sector: document.getElementById('colonia').value, // "Colonia" mapea a "sector"
        city: document.getElementById('municipio').value, // "Municipio" mapea a "city"
        state: document.getElementById('estado').value,   // "Estado/Ciudad" mapea a "state"
        zipCode: document.getElementById('postal').value, // "CP" mapea a "zipCode" como String
        country: 1 // Tu Record requiere un Integer en Java. Coloca el ID de país correspondiente
    }
};

// 3. Envío de la petición PUT a Spring Boot
fetch(`http://localhost:8080/api/users/${userId}/${roleId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUserData)
})
.then(response => {
    if (!response.ok) {
        // Si hay un error 400 (Bad Request), te mostrará en consola qué anotación (@NotBlank, etc.) falló
        return response.json().then(err => { 
            console.error('Errores detallados del Backend:', err);
            throw new Error(`Error de validación en el servidor (Código ${response.status})`); 
        });
    }
    return response.json();
})
.then(data => {
    console.log('¡Sincronización exitosa con Spring Boot!', data);
    alert('Los cambios han sido guardados correctamente en la base de datos.');
})
.catch(error => {
    console.error('Fallo en la comunicación:', error);
    alert(error.message || 'No se pudo establecer conexión con el backend.');
});
