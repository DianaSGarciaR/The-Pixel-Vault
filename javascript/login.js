/* =========== import =========== */
import { createUser, loginUser, getUserByEmail } from "../services/loginApi.service.js";

/* =========== variable =========== */
const NEW_USER = {
    "userName": "-----",
    "userMiddleName": "-----",
    "userLastNameFirst": "-----",
    "userLastNameSecond": "-----",
    "userPhone": "0000000000"
};

const viewRegistrate = document.querySelector("#viewRegistrate");
const viewLogin = document.querySelector("#viewLogin");

const formNewUser = document.querySelector("#formNewUser");
const formLogin = document.querySelector("#formLogin");

const resultadoRegistro = document.querySelector("#resultadoRegistro");

/* =============================== START: Create user ===============================*/
formNewUser.addEventListener("submit", (event => {
    const newUser = Object.fromEntries([...new FormData(formNewUser)]);
    let LIST_ERRORES = [];
    let formularioValido = true;
    event.preventDefault();

    /** 1. Validar y se elimana espacios */
    newUser.email = ((newUser.email) ? (newUser.email).trim() : "");
    newUser.password = ((newUser.password) ? (newUser.password).trim() : "");
    newUser.passwordConfirm = ((newUser.passwordConfirm) ? (newUser.passwordConfirm).trim() : "");

    if (!validarCorreo(newUser.email, LIST_ERRORES)) {
        formularioValido = false;
    }

    /* validar password y si el pasword1 == pasword2 */
    if (!validarPasword(newUser.password, newUser.passwordConfirm, "CREATE", LIST_ERRORES)) {
        formularioValido = false;
    }

    /* 2 Validamos si no exiten errores */
    if (formularioValido) {
        delete newUser.passwordConfirm;
        let user = { ...newUser, ...NEW_USER }
        try {
            createNewUser(user);
        } catch (error) {
            LIST_ERRORES.push("Error de conexión. Revisa tu acceso a internet");
            renderizarMensajes(false, LIST_ERRORES, resultadoRegistro);
        }
    } else {
        renderizarMensajes(false, LIST_ERRORES, resultadoRegistro);
    }
}));

const createNewUser = (dataUser) => {
    createUser(dataUser);
    showFormulario(null, 'sectionLogin');
    renderizarMensajes(true, [], resultadoRegistro);
    formNewUser.reset();
};

/* =============================== END: Create user ===============================*/

/* =============================== START: Login =============================*/
formLogin.addEventListener("submit", async (event) => {
    const dataLoginUser = Object.fromEntries([...new FormData(formLogin)]);
    let LIST_ERRORES = [];
    let formularioValido = true;
    event.preventDefault();

    /** 1. Validar y se elimana espacios */
    dataLoginUser.email = ((dataLoginUser.email) ? (dataLoginUser.email).trim() : "");
    dataLoginUser.password = ((dataLoginUser.password) ? (dataLoginUser.password).trim() : "");

    if (!validarCorreo(dataLoginUser.email, LIST_ERRORES)) {
        formularioValido = false;
    }

    /* validar password y si el pasword1 == pasword2 */
    if (!validarPasword(dataLoginUser.password, null, "LOGIN", LIST_ERRORES)) {
        formularioValido = false;
    }

    /* 2 Validamos si no exiten errores */
    if (formularioValido) {
        try {
            const { token } = await loginUser(dataLoginUser);
            setLocalStorage("TOKEN", token);

            let user = await getUserByEmail(token, dataLoginUser.email);
            console.log("user ", user)
            // Guardamos solo email del user
            setLocalStorage("DATA_USER", { id: user.id, email: user.email });
            formNewUser.reset();
            window.location.href = "index.html";
        } catch (error) {
            LIST_ERRORES.push("Error de conexión. Revisa tu acceso a internet");
            renderizarMensajes(false, LIST_ERRORES, resultadoRegistro);
        }
    } else {
        renderizarMensajes(false, LIST_ERRORES, resultadoRegistro);
    }
});
/* =============================== END: Login ===============================*/

/** ================= STAR: Funciones de validacion de campos para formulario ================= */
function validarCorreo(correoValor, LIST_ERRORES) {
    // Expresión para que el texto ingresaro cumpla con la estructura de la email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let esValido = true;

    if (correoValor === "") {
        esValido = false;
        LIST_ERRORES.push("El correo es obligatorio.");
    } else if (!regexEmail.test(correoValor)) {
        esValido = false;
        LIST_ERRORES.push("El formato del correo electrónico no es válido.");
    }
    return esValido;
}

function validarPasword(paswordValor, passwordConfirmValor, type, LIST_ERRORES) {
    // Expresión para que el texto ingresaro cumpla con la estructura de la contraseña
    const regexEmail = /^.{8,20}$/;
    let esValido = true;

    if ((type === "CREATE" && (paswordValor === "" || passwordConfirmValor === ""))
        || (type === "LOGIN" && paswordValor === "")) {
        esValido = false;
        LIST_ERRORES.push("La contraseña es obligatoria.");
    } else if (!regexEmail.test(paswordValor)) {
        esValido = false;
        LIST_ERRORES.push("La contraseña debe tener min 8 caracteres.");
    } else if (paswordValor !== passwordConfirmValor && type === "CREATE") {
        esValido = false;
        LIST_ERRORES.push("La contraseñas deben coincidir.");
    }
    return esValido;
}
/** ================= END: Funciones de validacion de campos para formulario ================= */

/** ======== STAR: Mostrar/Ocultar formulario ================= */
function showFormulario(event, elementId) {
    if (event) {
        event.preventDefault();
    }
    /** Muestra formuario Registro y coculta el fomulario login */
    if (elementId === "sectionCreateUser") {

        showOrHideElements("SHOW", "sectionCreateUser");
        showOrHideElements("HIDEN", "sectionLogin");
    } else if (elementId === "sectionLogin") {
        /** Muestra formuario login y coculta formulario Registro */
        showOrHideElements("SHOW", "sectionLogin");
        showOrHideElements("HIDEN", "sectionCreateUser");
    }

    setTimeout(() => {
        resultadoRegistro.classList.add('oculto');
    }, 5000);
}
/** ================= END: Mostrar/Ocultar elementos ================= */

/** ===================== =============== */
viewRegistrate.addEventListener("click", (event) => {
    showFormulario(event, 'sectionCreateUser');
});

viewLogin.addEventListener("click", (event) => {
    showFormulario(event, 'sectionLogin');
});

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

/** ================= STAR: Funcines LocalStorage ================= */
/**
 *? Se almacenan los datos en LocalStorage
 * @param {*} key Identificador que guarda el valor
 * @param {*} value El valor
 */
const setLocalStorage = (key, value) => {
    //? paso 1 convertir el valor a texto
    const textValue = JSON.stringify(value);
    //? paso 2 almacenar
    localStorage.setItem(key, textValue);
}

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
/** ================= END: Funcines LocalStorage ================= */

/** ================= STAR: Logica css ================ */
/**
 * Funcion para mostrar/ocultar elementos HTML
 * @param {*} type ¿Que desar hacer? SHOW (mostrar) | HIDEN (ocultar)
 * @param {*} elementId Id del elemento HTML que se desea mostrar/ocultar
 */
const showOrHideElements = (type, elementId) => {
    let element = document.getElementById(elementId);
    if (type === "SHOW") {
        element.removeAttribute("hidden");
    } else if (type === "HIDEN") {
        element.setAttribute("hidden", "");
    }
}
/** ================= END: Logica css ================= */