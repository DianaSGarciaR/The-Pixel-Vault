//*==========FUNCIONES PARA GENERAR LOS MARCOS NEON ==========

/* ==========================================================================
   GEOMETRÍA DEL MARCO
   Estas dos funciones no cambiaron: generan el contorno con esquinas
   escalonadas del marco, igual que en las versiones anteriores.
   ========================================================================== */

// Genera el "zig-zag" canónico de una esquina superior-izquierda: de (cs,0) a (0,cs)
function stairPoints(steps, cs){
  const s = cs / steps;
  const pts = [];
  for (let i = 0; i < steps; i++){
    pts.push([cs - i*s, i*s]);
    pts.push([cs - i*s, (i+1)*s]);
    pts.push([cs - (i+1)*s, (i+1)*s]);
  }
  return pts;
}

// Reutiliza ese mismo zig-zag, reflejado para cada una de las 4 esquinas,
// y lo conecta con los bordes rectos del rectángulo W x H.
function buildFramePath(W, H, cs, steps){
  const pts = stairPoints(steps, cs);
  const tl = pts.slice().reverse();                        // (0,cs)   -> (cs,0)
  const tr = pts.map(([x,y]) => [W - x, y]);                // (W-cs,0) -> (W,cs)
  const br = pts.map(([x,y]) => [W - x, H - y]).reverse();  // (W,H-cs) -> (W-cs,H)
  const bl = pts.map(([x,y]) => [x, H - y]);                // (cs,H)   -> (0,H-cs)
  const all = tl.concat(tr, br, bl);
  return 'M ' + all.map(([x,y]) => x.toFixed(1) + ',' + y.toFixed(1)).join(' L ') + ' Z';
}

/* ==========================================================================
   NUEVO: dibujo del marco basado en el tamaño REAL de cada instancia.

   La versión anterior calculaba todo con un ancho fijo de W=100 y una
   altura fija H=50 ("misma relación de aspecto 2:1" a mano), sin importar
   cuánto midiera realmente cada .frame-demo en la pantalla. Eso rompía el
   principio de "viewBox = tamaño real en píxeles" de las versiones
   previas, y además significaba que el marco NUNCA se enteraba si su
   contenedor cambiaba de alto o de ancho (por ejemplo, cuando el texto
   crece en móvil y empuja la altura del marco, como ahora permite
   styles.css).

   setupNeonFrame() reemplaza a applyFrame(): en vez de calcular una sola
   vez con valores fijos, mide el tamaño real de .frame-demo con
   ResizeObserver y vuelve a dibujar el marco cada vez que ese tamaño
   cambia (por la ventana, por Bootstrap reacomodando columnas, o porque
   el texto reflowed y empujó la altura).
   ========================================================================== */
const STEPS = 5; // esquina con 5 escalones

// Proporciones de referencia: un marco de 520px de ancho usa una esquina
// de 28px y un grosor de trazo de 5px. Marcos más angostos o más anchos
// escalan estos valores en la misma proporción.
const CORNER_RATIO = 28 / 520;
const BORDER_RATIO = 5  / 520;

function setupNeonFrame(frameId, svgId, pathId){
  const frameDemo = document.getElementById(frameId);
  const svg  = document.getElementById(svgId);
  const path = document.getElementById(pathId);
  if (!frameDemo || !svg || !path) return; // por si algún id no existe en esta página

  function render(){
    // clientWidth/clientHeight = tamaño real en píxeles ya calculado por
    // el navegador, después de aplicar CSS, container queries, etc.
    const W = frameDemo.clientWidth;
    const H = frameDemo.clientHeight;
    if (W === 0 || H === 0) return; // el elemento aún no tiene tamaño (p. ej. display:none)

    const cs = Math.max(10, W * CORNER_RATIO);
    const sw = Math.max(2,  W * BORDER_RATIO);

    // El viewBox se redefine igual a W y H reales: 1 unidad del path
    // equivale a 1 píxel en pantalla, así el trazo nunca se distorsiona
    // sin importar el tamaño ni la proporción del contenedor.
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    path.setAttribute('d', buildFramePath(W, H, cs, STEPS));
    path.style.strokeWidth = sw + 'px';
  }

  // ResizeObserver dispara render() apenas el elemento aparece en pantalla
  // y cada vez que su tamaño cambia después. Esto es lo que hace posible
  // que el marco siga al texto cuando este crece en altura en móvil.
  new ResizeObserver(render).observe(frameDemo);
}

// Se registra un marco por cada instancia presente en la página.
setupNeonFrame('frameDemo',  'frameSvg',  'framePath');


//* ===================================== FIN DEL CÓDIGO PARA LOS MARCOS NEON =======================================

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
    formulario.addEventListener("submit", (event) => {
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
        formulario.reset();
      }

      renderizar(formularioValido, mensajesError, resultadoRegistro);
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