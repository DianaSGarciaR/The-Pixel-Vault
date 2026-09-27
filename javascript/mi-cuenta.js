
/**
 * @deprecated LIST_USER
 * Este list se borrara cuando se implente la Base de datos
 */
let LIST_USER = [
    {
        email: "diana@hotmail.com",
        user: "_diana_",
        password: "A2021bcgEN."
    }
];


let userLoging = {};
let newUser = {};

const formNewUser = document.querySelector("#formNewUser")
const inputEmail = document.querySelector("#inputEmail");
const inputPasswordConfirm = document.querySelector("#inputPasswordConfirm");
const inputPassword = document.querySelector("#inputPassword");

// Elemento donde se renderizan los mensajes de éxito o error
const resultadoRegistro = document.querySelector("#resultadoRegistro");

/* =============================== Create user ===============================*/
formNewUser.addEventListener("submit", (event => {
    console.log("1 ", inputPassword)
    console.log("2 ", inputPasswordConfirm)
    console.log(getItemLocalStorage("LIST_USER"));
    console.log("Create user")
    event.preventDefault();
    /* 1 Validar datos ingresados */

    let LIST_ERRORES = [];
    let formularioValido = true;

    /** Validar si los campos existen, se elimana espacios */
    let email = ((inputEmail) ? inputEmail.value.trim() : "");
    let password = ((inputPassword) ? inputPassword.value.trim() : "");
    let passwordConfirm = ((inputPasswordConfirm) ? inputPasswordConfirm.value.trim() : "");
    /* email */
    if (!validarCorreo(email, LIST_ERRORES)) {
        formularioValido = false;
    }

    /* validar password y si el pasword1 == pasword2 */
    if (!validarPasword(password, passwordConfirm, LIST_ERRORES)) {
        formularioValido = false;
    }

    /* Validar si exite el registro en la base de datos */
    if (!validExistUser(email, LIST_ERRORES)) {
        formularioValido = false;
    }


    /* 2 Validamos si no exiten errores */
    if (formularioValido) {
        const newUser = Object.fromEntries([...new FormData(formNewUser)]);
        delete newUser.passwordConfirm;
        createUser(newUser);
    } else {
        renderizar(false, LIST_ERRORES, resultadoRegistro);
    }
}));

const createUser = (dataUser) => {
    LIST_USER.push(dataUser);
    setLocalStorage("LIST_USERS", LIST_USER);
};


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

function validarPasword(paswordValor, passwordConfirmValor, LIST_ERRORES) {
    // Expresión para que el texto ingresaro cumpla con la estructura de la contraseña
    const regexEmail = /^.{8,20}$/;
    let esValido = true;
    console.log("1 ", paswordValor)
    console.log("2 ", passwordConfirmValor)
    if (paswordValor === "" || passwordConfirmValor === "") {
        esValido = false;
        LIST_ERRORES.push("La contraseña es obligatoria.");
    } else if (!regexEmail.test(paswordValor)) {
        esValido = false;
        LIST_ERRORES.push("La contraseña no es válida.");
    } else if (paswordValor !== passwordConfirmValor) {


        esValido = false;
        LIST_ERRORES.push("La contraseña de coincidir.");
    }
    return esValido;
}


/** 
 * @deprecated
 * Evaluar esta funcion si se borrara cuando se implemente el BackEnd
 */

function validExistUser(email, LIST_ERRORES) {
    let esValido = true;
    let existUser = LIST_USER.filter(user => user.email === email);
    if (existUser && existUser.length > 0) {
        esValido = false;
        LIST_ERRORES.push("El email ingresado ya exite en el sistema");
    }
    return esValido;
}


/**  Mensajes de error */
function renderizar(statusForm, mensajes, contenedor) {
    if (!contenedor) return;

    if (statusForm) {
        contenedor.innerHTML = '<div class="alert alert-success mt-3" style="background-color: #122418; color: #2ecc71; border: 1px solid #2a7e43;">El registro se realizó con éxito.</div>';
    } else {
        contenedor.innerHTML = "";
        let htmlContent = '<div class="alert alert-danger mt-3" style="background-color: #2a0808; color: #ff6b6b; border: 1px solid #842029;"><ul class="mb-0">';
        for (const mensaje of mensajes) {
            htmlContent += `<li>${mensaje}</li>`;
        }
        htmlContent += '</ul></div>';
        contenedor.innerHTML = htmlContent;
    }
}

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