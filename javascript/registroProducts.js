// Busca en el DOM el formulario con el id "registro-products-form".
const formEl = document.getElementById("registro-products-form");
//console.log(formEl);

let productos = [];
// Este arreglo guardará todos los productos que se registren o que se lean desde localStorage.


window.addEventListener("load", () => {
    // Cuando la página termina de cargar, revisamos si ya hay productos guardados.
    if (getItemLocalStorage("productos") === undefined) return;

    // Si existen, los cargamos en el arreglo para mostrarlos o trabajarlos luego.
    productos = [...getItemLocalStorage("productos")];

    //console.log(productos);
});


formEl.addEventListener("submit", (event) => {
    // Se ejecuta cuando el usuario envía el formulario.
    event.preventDefault();

    if (!formEl.checkValidity()) {
        return;
    }
    // Evita que la página recargue por defecto al enviar el formulario.

    // Recolecta todos los campos del formulario en un objeto iterable.
    const formData = new FormData(formEl);
    //console.log(formData);
    const dataArray = [...formData];


    // Convierte el arreglo de pares clave-valor en un objeto JavaScript.
    const producto = Object.fromEntries(dataArray);


    // Agrega el nuevo producto al arreglo general.
    productos.push(producto);

    // Guarda la lista actualizada en localStorage.
    setLocalStorage("productos", productos);



    // Limpia los campos del formulario para dejarlo listo para otro registro.
    formEl.reset();
});


const setLocalStorage = (key, value) => {
    // Guarda información en localStorage.

    // Paso 1: convertir el valor JS a texto con JSON.stringify.
    const textValue = JSON.stringify(value);

    // Paso 2: almacenar el texto bajo la clave indicada.
    localStorage.setItem(key, textValue);
};


const getItemLocalStorage = (key) => {
    // Obtiene un valor guardado en localStorage por su clave.
    if (localStorage.getItem(key) == null) return;

    // Convierte el texto JSON almacenado a un objeto o arreglo de JavaScript.
    const data = JSON.parse(localStorage.getItem(key));
    return data;
};


/**========== Inicio código validación de formulario ========== */
/** =========================================================
 * VALIDACIÓN DEL FORMULARIO DE REGISTRO DE PRODUCTOS
 * ========================================================= */

const formulario = document.getElementById("registro-products-form");


/** =========================================================
 * FUNCIÓN AUXILIAR PARA MOSTRAR UN MENSAJE DE ERROR
 * ========================================================= */

function mostrarError(input, mensaje, idError) {

    // Si ya existe un mensaje de error, lo eliminamos
    const errorAnterior = document.getElementById(idError);

    if (errorAnterior) {
        errorAnterior.remove();
    }

    const errorSpan = document.createElement("span");

    errorSpan.textContent = mensaje;
    errorSpan.style.color = "red";
    errorSpan.style.display = "block";
    errorSpan.id = idError;

    input.insertAdjacentElement("afterend", errorSpan);
}


/** =========================================================
 * FUNCIÓN PARA ELIMINAR UN MENSAJE DE ERROR
 * ========================================================= */

function eliminarError(idError) {

    const error = document.getElementById(idError);

    if (error) {
        error.remove();
    }
}


/** =========================================================
 * VALIDACIONES MIENTRAS EL USUARIO ESCRIBE
 * ========================================================= */

formulario.addEventListener("input", function (event) {

    const input = event.target;
    const valor = input.value.trim();


    // ---------------------------------------------------------
    // VALIDACIÓN DEL NOMBRE
    // ---------------------------------------------------------

    if (input.id === "nameProduct") {

        eliminarError("nameProduct-error");

        if (valor.length < 5) {

            mostrarError(
                input,
                "El nombre del producto debe contener al menos 5 caracteres.",
                "nameProduct-error"
            );
        }
    }


    // ---------------------------------------------------------
    // VALIDACIÓN DE LA DESCRIPCIÓN
    // ---------------------------------------------------------

    if (input.id === "Descripcion") {

        eliminarError("descripcion-error");

        if (valor.length < 30 || valor.length > 200) {

            mostrarError(
                input,
                "La descripción debe tener entre 30 y 200 caracteres.",
                "descripcion-error"
            );
        }
    }


    // ---------------------------------------------------------
    // VALIDACIÓN DEL PRECIO
    // ---------------------------------------------------------

    if (input.id === "precio") {

        eliminarError("precio-error");

        const precio = Number(valor);

        if (valor === "" || precio <= 0) {

            mostrarError(
                input,
                "El precio debe ser mayor que cero.",
                "precio-error"
            );
        }
    }


    // ---------------------------------------------------------
    // VALIDACIÓN DEL GÉNERO
    // ---------------------------------------------------------

    if (input.id === "genero") {

        eliminarError("genero-error");

        if (valor.length < 5) {

            mostrarError(
                input,
                "El género debe contener al menos 5 caracteres.",
                "genero-error"
            );
        }
    }


    // ---------------------------------------------------------
    // VALIDACIÓN DEL STOCK
    // ---------------------------------------------------------

    if (input.id === "stock") {

        eliminarError("stock-error");

        const stock = Number(valor);

        if (valor === "" || stock < 1 || stock > 20) {

            mostrarError(
                input,
                "El stock debe estar entre 1 y 20 piezas.",
                "stock-error"
            );
        }
    }
});


/** =========================================================
 * VALIDACIÓN DE LOS SELECT
 * ========================================================= */

formulario.addEventListener("change", function (event) {

    const select = event.target;


    // ---------------------------------------------------------
    // VALIDACIÓN DEL TIPO DE PRODUCTO
    // ---------------------------------------------------------

    if (select.id === "tipo") {

        eliminarError("tipo-error");

        if (select.value === "") {

            mostrarError(
                select,
                "Por favor, selecciona el tipo de producto.",
                "tipo-error"
            );
        }
    }


    // ---------------------------------------------------------
    // VALIDACIÓN DE LA CALIFICACIÓN
    // ---------------------------------------------------------

    if (select.id === "cal") {

        eliminarError("calificacion-error");

        if (select.value === "") {

            mostrarError(
                select,
                "Por favor, selecciona una calificación para el producto.",
                "calificacion-error"
            );
        }
    }
});


/** =========================================================
 * VALIDACIÓN AL ENVIAR EL FORMULARIO
 * ========================================================= */

formulario.addEventListener("submit", function (event) {

    // Obtenemos todos los campos
    const nombre = document.getElementById("nameProduct");
    const tipo = document.getElementById("tipo");
    const descripcion = document.getElementById("Descripcion");
    const precio = document.getElementById("precio");
    const genero = document.getElementById("genero");
    const stock = document.getElementById("stock");
    const calificacion = document.getElementById("cal");

    let formularioValido = true;


    /** -------------------------------------------------------
     * NOMBRE
     * ------------------------------------------------------- */

    eliminarError("nameProduct-error");

    if (nombre.value.trim().length < 5) {

        mostrarError(
            nombre,
            "El nombre del producto debe contener al menos 5 caracteres.",
            "nameProduct-error"
        );

        formularioValido = false;
    }


    /** -------------------------------------------------------
     * TIPO
     * ------------------------------------------------------- */

    eliminarError("tipo-error");

    if (tipo.value === "") {

        mostrarError(
            tipo,
            "Por favor, selecciona el tipo de producto.",
            "tipo-error"
        );

        formularioValido = false;
    }


    /** -------------------------------------------------------
     * DESCRIPCIÓN
     * ------------------------------------------------------- */

    eliminarError("descripcion-error");

    const descripcionValor = descripcion.value.trim();

    if (
        descripcionValor.length < 30 ||
        descripcionValor.length > 200
    ) {

        mostrarError(
            descripcion,
            "La descripción debe tener entre 30 y 200 caracteres.",
            "descripcion-error"
        );

        formularioValido = false;
    }


    /** -------------------------------------------------------
     * PRECIO
     * ------------------------------------------------------- */

    eliminarError("precio-error");

    const precioValor = Number(precio.value);

    if (
        precio.value === "" ||
        precioValor <= 0
    ) {

        mostrarError(
            precio,
            "El precio debe ser mayor que cero.",
            "precio-error"
        );

        formularioValido = false;
    }


    /** -------------------------------------------------------
     * GÉNERO
     * ------------------------------------------------------- */

    eliminarError("genero-error");

    if (genero.value.trim().length < 5) {

        mostrarError(
            genero,
            "El género debe contener al menos 5 caracteres.",
            "genero-error"
        );

        formularioValido = false;
    }


    /** -------------------------------------------------------
     * STOCK
     * ------------------------------------------------------- */

    eliminarError("stock-error");

    const stockValor = Number(stock.value);

    if (
        stock.value === "" ||
        stockValor < 1 ||
        stockValor > 20
    ) {

        mostrarError(
            stock,
            "El stock debe estar entre 1 o más piezas.",
            "stock-error"
        );

        formularioValido = false;
    }


    /** -------------------------------------------------------
     * CALIFICACIÓN
     * ------------------------------------------------------- */

    if (event.target.id === "tipo" || event.target.id === "cal") {

        console.log("Select:", event.target.id);
        console.log("Valor:", event.target.value);
    }

    eliminarError("calificacion-error");

    if (calificacion.value === "") {

        mostrarError(
            calificacion,
            "Por favor, selecciona una calificación para el producto.",
            "calificacion-error"
        );

        formularioValido = false;
    }


    /** -------------------------------------------------------
     * EVITAR ENVÍO SI HAY ALGÚN ERROR
     * ------------------------------------------------------- */

    if (!formularioValido) {

        event.preventDefault();

        // Lleva al usuario al inicio del formulario
        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }


    // Si llegamos aquí, todos los campos son válidos
    console.log("Formulario válido.");
});


const inputImagen = document.getElementById("imagen");
const nombreImagen = document.querySelector(".file-field__name");

inputImagen.addEventListener("change", function () {

    if (inputImagen.files.length > 0) {

        // Obtenemos el archivo que seleccionó el usuario
        const archivo = inputImagen.files[0];

        // Mostramos el nombre del archivo
        nombreImagen.textContent = archivo.name;

        //console.log("Imagen seleccionada:", archivo);
    } else {

        nombreImagen.textContent = "Ningún archivo seleccionado";
    }
});

/**========== Fin código validación de formulario ========== */