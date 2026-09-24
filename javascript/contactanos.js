
/* ===================================== INICIO VALIDACION FORMULARIO ======================================= */
document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("contactUs");
  const nombreInput = document.querySelector("#nombre");
  const correoInput = document.querySelector("#correo");
  const telefonoInput = document.querySelector("#telefono");
  const mensajeInput = document.querySelector("#mensaje");
  
  // Elemento donde se renderizan los mensajes de éxito o error
  const resultadoRegistro = document.querySelector("#resultadoRegistro");

  if (formulario) {
    formulario.addEventListener("submit", async(event) => {
      event.preventDefault(); // Evita que la URL cambie y se recargue la página

      let formularioValido = true;
      const mensajesError = [];

      const nombre = nombreInput ? nombreInput.value.trim() : "";
      const correo = correoInput ? correoInput.value.trim() : "";
      const telefono = telefonoInput ? telefonoInput.value.trim() : "";
      const mensaje = mensajeInput ? mensajeInput.value.trim() : "";

      // Validaciones usando las funciones auxiliares
      if (!validarNombre(nombre, mensajesError)) {
        formularioValido = false;
      }

      if (!validarCorreo(correo, mensajesError)) {
        formularioValido = false;
      }

      if (telefono.length < 10) {
        formularioValido = false;
        mensajesError.push("Debes ingresar un número de teléfono válido (al menos 10 dígitos).");
      }

      if (mensaje.length < 7) {
        formularioValido = false;
        mensajesError.push("El mensaje debe ser más descriptivo (al menos 7 caracteres).");
      }

      if (formularioValido) {
        const data = new FormData(formulario);
        try{
          const response = await fetch(formulario.action,{
            method:formulario.method,
            body:data,
            headers:{
              'Accept':'application/json'
            }
          });
          if(response.ok){
            formulario.reset();
            renderizar(true,[],resultadoRegistro);
          }else{
            mensajesError.push("Hubo un error al enviar el formulario, Intenta más tarde");
            renderizar(false,mensajesError,resultadoRegistro);
          }
        }catch(error){
          mensajesError.push("Error de conexión. Revisa tu acceso a internet");
          renderizar(false,mensajesError,resultadoRegistro);
        }
      }else{
        renderizar(false,mensajesError,resultadoRegistro);
      }
    });
  }
});

// FUNCIONES AUXILIARES DE VALIDACIÓN
function esVacio(cadena, longitudMinima) {
  return cadena && cadena.length >= longitudMinima;
}

function validarNombre(nombreValor, mensajesError) {
  const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  let esValido = true;

  if (!esVacio(nombreValor, 3)) {
    esValido = false;
    mensajesError.push("El nombre es obligatorio y debe tener al menos 3 caracteres.");
  } else if (!regexSoloLetras.test(nombreValor)) {
    esValido = false;
    mensajesError.push("El nombre solo debe contener letras y espacios.");
  }

  return esValido;
}

function validarCorreo(correoValor, mensajesError) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let esValido = true;

  if (correoValor === "") {
    esValido = false;
    mensajesError.push("El correo es obligatorio.");
  } else if (!regexEmail.test(correoValor)) {
    esValido = false;
    mensajesError.push("El formato del correo electrónico no es válido.");
  }

  return esValido;
}

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