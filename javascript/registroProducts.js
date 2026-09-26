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