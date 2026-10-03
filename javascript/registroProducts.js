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

    //ejecutamos las validaciones personalizadas
    const formularioValido = validarFormAlEnviar();

    if (!formularioValido) {
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
    limpiarFormulario();
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

const formulario = document.getElementById("registro-products-form");
const inputImagen = document.getElementById("imagen");
const nombreImagen = document.querySelector(".file-field__name");

/*FUNCIÓN AUXILIAR PARA MOSTRAR UN MENSAJE DE ERROR*/
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
    // Opcional: Agregar una clase de Bootstrap para espaciado superior
    errorSpan.classList.add("mt-1"); 

    // BUSCAMOS EL CONTENEDOR CORRECTO:
    // .closest('.col-sm-10') sube en el DOM hasta encontrar ese contenedor div
    const contenedorPadre = input.closest(".col-sm-10");

    if (contenedorPadre) {
        // Lo añade al final del div .col-sm-10 (debajo del input-group)
        contenedorPadre.appendChild(errorSpan);
    } else {
        // Respaldo por si no encuentra la clase: lo pone después del input
        input.insertAdjacentElement("afterend", errorSpan);
    }
}



/**FUNCIÓN PARA ELIMINAR UN MENSAJE DE ERROR*/
function eliminarError(idError) {

    const error = document.getElementById(idError);

    if (error) {
        error.remove();
    }
}


/**VALIDACIONES MIENTRAS EL USUARIO ESCRIBE */
formulario.addEventListener("input", function (event) {

    const input = event.target;
    const valor = input.value.trim();


    // VALIDACIÓN DEL NOMBRE
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


    // VALIDACIÓN DE LA DESCRIPCIÓN
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


    // VALIDACIÓN DEL PRECIO
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

    // VALIDACIÓN DEL GÉNERO
    if (input.id === "genero") {

        eliminarError("genero-error");

        if (valor.length < 3) {

            mostrarError(
                input,
                "El género debe contener al menos 3 caracteres.",
                "genero-error"
            );
        }
    }


    // VALIDACIÓN DEL STOCK
    if (input.id === "stock") {

        eliminarError("stock-error");

        const stock = Number(valor);

        if (valor === "" || stock < 1) {

            mostrarError(
                input,
                "El stock debe ser de mayor que cero",
                "stock-error"
            );
        }
    }
});


/**VALIDACIÓN DE LOS SELECT */
formulario.addEventListener("change", function (event) {

    const select = event.target;

    // VALIDACIÓN DEL TIPO DE PRODUCTO
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


    // VALIDACIÓN DE LA CALIFICACIÓN
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


/**VALIDACIÓN AL ENVIAR EL FORMULARI*/
function validarFormAlEnviar() {

    // Obtenemos todos los campos
    const nombre = document.getElementById("nameProduct");
    const tipo = document.getElementById("tipo");
    const imagen = document.getElementById("imagen");
    const descripcion = document.getElementById("Descripcion");
    const precio = document.getElementById("precio");
    const genero = document.getElementById("genero");
    const stock = document.getElementById("stock");
    const calificacion = document.getElementById("cal");

    let formularioValido = true;


    /** NOMBRE */
    eliminarError("nameProduct-error");

    if (nombre.value.trim().length < 5) {

        mostrarError(
            nombre,
            "El nombre del producto debe contener al menos 5 caracteres.",
            "nameProduct-error"
        );

        formularioValido = false;
    }


    /** TIPO */
    eliminarError("tipo-error");

    if (tipo.value === "") {

        mostrarError(
            tipo,
            "Por favor, selecciona el tipo de producto.",
            "tipo-error"
        );

        formularioValido = false;
    }


    /** DESCRIPCIÓN */
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


    /** PRECIO */

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


    /** GÉNERO */
    eliminarError("genero-error");

    if (genero.value.trim().length < 3) {

        mostrarError(
            genero,
            "El género debe contener al menos 5 caracteres.",
            "genero-error"
        );

        formularioValido = false;
    }


    /** STOCK */
    eliminarError("stock-error");

    const stockValor = Number(stock.value);

    if (
        stock.value === "" ||
        stockValor < 1
    ) {

        mostrarError(
            stock,
            "El stock debe estar entre una o más piezas.",
            "stock-error"
        );

        formularioValido = false;
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

    if (!formularioValido) {
        // Si hay errores, sube la pantalla para que el usuario los vea
        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        return false;
    }
    return true;
}
 
    function limpiarFormulario(){
    // Limpiamos el formulario manualmente de forma segura
    formulario.reset();

    eliminarError("nameProduct-error");
    eliminarError("tipo-error");
    eliminarError("descripcion-error");
    eliminarError("precio-error");
    eliminarError("genero-error");
    eliminarError("stock-error");
    eliminarError("calificacion-error");
    // Restauramos visualmente el campo personalizado de la imagen
    if (nombreImagen) {
        nombreImagen.textContent = "Ningún archivo seleccionado";
    }

    // Mostrar un mensaje de éxito al usuario en el div
    const resultado = document.getElementById("resultadoRegistro");
    if (resultado) {
        resultado.textContent = "¡Producto registrado con éxito!";
        resultado.style.color = "green";

        // Desaparecer el mensaje de éxito después de 4 segundos
        setTimeout(() => {
            resultado.textContent = "";
        }, 4000);
    }
    }


inputImagen.addEventListener("change", function () {

    // Eliminamos cualquier error anterior
    eliminarError("imagen-error");

    // Verificamos si el usuario seleccionó algún archivo
    if (inputImagen.files.length === 0) {

        nombreImagen.textContent = "Ningún archivo seleccionado";

        mostrarError(
            inputImagen,
            "Debes seleccionar una imagen.",
            "imagen-error"
        );

        return;
    }

    // Obtenemos el archivo seleccionado
    const archivo = inputImagen.files[0];

    // Verificamos que realmente sea una imagen
    if (!archivo.type.startsWith("image/")) {

        nombreImagen.textContent = "Archivo no válido";

        mostrarError(
            inputImagen,
            "El archivo seleccionado debe ser una imagen.",
            "imagen-error"
        );

        // Eliminamos el archivo seleccionado
        inputImagen.value = "";

        return;
    }

    // Si llegamos aquí, la imagen es válida
    nombreImagen.textContent = archivo.name;
});

/**========== Fin código validación de formulario ========== */