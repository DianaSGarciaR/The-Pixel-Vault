
const keyEncryption = 22;
const NEW_USER = { tipo_user: "COSTOMER", status: 0 }; // Valores que no vienen en el formuario
const formNewUser = document.querySelector("#formNewUser");
const formLogin = document.querySelector("#formLogin");

const resultadoRegistro = document.querySelector("#resultadoRegistro");

/**
 *  @deprecated
 * ! LIST_USERS : Este list se borrara cuando se implente la Base de datos
 */
let LIST_USERS = [];


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

    //! Validar si exite el registro en la base de datos */
    if (!validExistUser(newUser.email, LIST_ERRORES)) {
        formularioValido = false;
    }

    /* 2 Validamos si no exiten errores */
    if (formularioValido) {
        delete newUser.passwordConfirm;
        let user = { ...newUser, ...NEW_USER }
        createUser(user);
    } else {
        renderizarMensajes(false, LIST_ERRORES, resultadoRegistro);
    }
}));

const createUser = (dataUser) => {
    // !=== STAR: Esta pArte se sustituye cuando Se implemente BackEnd === 
    // Se deja solo para simular el guardado de datos en la base de datos, cuando se implemente el BackEnd esta parte se eliminara
    LIST_USERS.push(dataUser);
    setLocalStorage("LIST_USERS", LIST_USERS);
    //! === END: Esta pArte se sustituye cuando Se implemente BackEnd === */
    showFormulario(null, 'sectionLogin');
    renderizarMensajes(true, [], resultadoRegistro);

};

/* =============================== END: Create user ===============================*/

/* =============================== START: Login =============================*/
formLogin.addEventListener("submit", (event => {
    const starLoginF = Object.fromEntries([...new FormData(formLogin)]);
    let LIST_ERRORES = [];
    let formularioValido = true;
    event.preventDefault();

    /** 1. Validar y se elimana espacios */
    starLoginF.email = ((starLoginF.email) ? (starLoginF.email).trim() : "");
    starLoginF.password = ((starLoginF.password) ? (starLoginF.password).trim() : "");

    if (!validarCorreo(starLoginF.email, LIST_ERRORES)) {
        formularioValido = false;
    }

    /* validar password y si el pasword1 == pasword2 */
    if (!validarPasword(starLoginF.password, null, "LOGIN", LIST_ERRORES)) {
        formularioValido = false;
    }

    //! Validar ya que esto se realiza en Back End
    if (!existUserByEmailAndPassword(starLoginF.email, starLoginF.password, LIST_ERRORES)) {
        formularioValido = false;
    }

    /* 2 Validamos si no exiten errores */
    if (formularioValido) {
        starLogin(starLoginF);
    } else {
        renderizarMensajes(false, LIST_ERRORES, resultadoRegistro);
    }
}));

/**
 * Funcion para obtener info del ususario
 * @param {} dataLoginUser  es el objeto Usuario
 */
const starLogin = (dataLoginUser) => {
    // !=== STAR: Esta parte se complementa cuando implemente BackEnd === 
    setLocalStorage("DATA_USER", dataLoginUser);
    //! === END: Esta parte se complementa cuando implemente BackEnd === */
    window.location.href = "mi-cuenta.html";
};
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

/** 
 * @deprecated
 * !Evaluar esta funcion si se borrara cuando se implemente el BackEnd Y Base de datos */
function validExistUser(email, LIST_ERRORES) {
    let esValido = true;
    let existUser = LIST_USERS.filter(user => user.email === email);
    if (existUser && existUser.length > 0) {
        esValido = false;
        LIST_ERRORES.push("El email ingresado ya exite en el sistema");
    }
    return esValido;
}

/** 
 * @deprecated
 * !Evaluar esta funcion si se borrara cuando se implemente el BackEnd Y Base de datos */
function existUserByEmailAndPassword(email, password, LIST_ERRORES) {
    let esValido = false;
    let existUser = LIST_USERS.filter(user => user.email === email && user.password === password);
    if (existUser && existUser.length > 0) {
        esValido = true;
    } else {
        LIST_ERRORES.push("Ususario no encontrado, verifique el correo y la contraseña.");
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
        renderizarMensajes(null, [], resultadoRegistro);
        showOrHideElements("SHOW", "sectionCreateUser");
        showOrHideElements("HIDEN", "sectionLogin");
    } else if (elementId === "sectionLogin") {
        /** Muestra formuario login y coculta formulario Registro */
        showOrHideElements("SHOW", "sectionLogin");
        showOrHideElements("HIDEN", "sectionCreateUser");
    }
}
/** ================= END: Mostrar/Ocultar elementos ================= */

/** ================= STAR: Mensajes ================= */
// Mensajes de error 
function renderizarMensajes(statusForm, mensajes, contenedor) {
    if (!contenedor) return;

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

const getListUser = () => { LIST_USERS = getItemLocalStorage("LIST_USERS"); LIST_USERS = (LIST_USERS) ? LIST_USERS : []; };
getListUser();
