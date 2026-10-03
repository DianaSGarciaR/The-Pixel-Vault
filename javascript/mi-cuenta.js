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