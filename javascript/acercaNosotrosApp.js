/** ================== Inicio: import ================== */
import { LIST_TRIPULANTES } from './dataBase.js';
/** ================== Fin: import ===================== */


//*==========FUNCIONES PARA GENERAR LOS MARCOS NEON DE LA SECCION DESCRIPCIÓN DEL PROYECTO Y MISSION LOGS==========

/* ==========================================================================
   GEOMETRÍA DEL MARCO
   Estas dos funciones no cambiaron: generan el contorno con esquinas
   escalonadas del marco, igual que en las versiones anteriores.
   ========================================================================== */

// Genera el "zig-zag" canónico de una esquina superior-izquierda: de (cs,0) a (0,cs)
function stairPoints(steps, cs) {
  const s = cs / steps;
  const pts = [];
  for (let i = 0; i < steps; i++) {
    pts.push([cs - i * s, i * s]);
    pts.push([cs - i * s, (i + 1) * s]);
    pts.push([cs - (i + 1) * s, (i + 1) * s]);
  }
  return pts;
}

// Reutiliza ese mismo zig-zag, reflejado para cada una de las 4 esquinas,
// y lo conecta con los bordes rectos del rectángulo W x H.
function buildFramePath(W, H, cs, steps) {
  const pts = stairPoints(steps, cs);
  const tl = pts.slice().reverse();                        // (0,cs)   -> (cs,0)
  const tr = pts.map(([x, y]) => [W - x, y]);                // (W-cs,0) -> (W,cs)
  const br = pts.map(([x, y]) => [W - x, H - y]).reverse();  // (W,H-cs) -> (W-cs,H)
  const bl = pts.map(([x, y]) => [x, H - y]);                // (cs,H)   -> (0,H-cs)
  const all = tl.concat(tr, br, bl);
  return 'M ' + all.map(([x, y]) => x.toFixed(1) + ',' + y.toFixed(1)).join(' L ') + ' Z';
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
const BORDER_RATIO = 5 / 520;

function setupNeonFrame(frameId, svgId, pathId) {
  const frameDemo = document.getElementById(frameId);
  const svg = document.getElementById(svgId);
  const path = document.getElementById(pathId);
  if (!frameDemo || !svg || !path) return; // por si algún id no existe en esta página

  function render() {
    // clientWidth/clientHeight = tamaño real en píxeles ya calculado por
    // el navegador, después de aplicar CSS, container queries, etc.
    const W = frameDemo.clientWidth;
    const H = frameDemo.clientHeight;
    if (W === 0 || H === 0) return; // el elemento aún no tiene tamaño (p. ej. display:none)

    const cs = Math.max(10, W * CORNER_RATIO);
    const sw = Math.max(2, W * BORDER_RATIO);

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
setupNeonFrame('frameDemo', 'frameSvg', 'framePath');
setupNeonFrame('frameDemo2', 'frameSvg2', 'framePath2');
setupNeonFrame('frameDemo3', 'frameSvg3', 'framePath3');
setupNeonFrame('frameDemo4', 'frameSvg4', 'framePath4');
setupNeonFrame('frameDemo5', 'frameSvg5', 'framePath5');
setupNeonFrame('frameDemo6', 'frameSvg6', 'framePath6');

//* ===================================== FIN DEL CÓDIGO PARA LOS MARCOS NEON =======================================

//* ==================== Inicio: DOM - Menu equipo ====================

const teamGridMenu = document.querySelector(".team-grid");
const renderMenuTeam = (LIST_TRIPULANTES) => {
  let renderHtml = "";
  let filas = 1;
  if (LIST_TRIPULANTES != null) {
    for (let f = 0; f < filas; f++) {
      renderHtml += `<div class="team-row">`;
      for (let i = 0; i < LIST_TRIPULANTES.length; i++) {
        renderHtml += `
          <button type="button" class="team-member" data-bs-toggle="modal" data-bs-target="#modal${LIST_TRIPULANTES[i].id}">
            <img src="${LIST_TRIPULANTES[i].infoBtn.btnImgUrl}" class="img-fluid" alt="Abrir información de ${LIST_TRIPULANTES[i].name}" />
          </button>
        `;
      }
      renderHtml += `</div>`;
    }

    teamGridMenu.insertAdjacentHTML("beforeend", renderHtml)
  }
}

//renderMenuTeam(LIST_TRIPULANTES);
//* ===================== Fin: DOM - Menu equipo ======================