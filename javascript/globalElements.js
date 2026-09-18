/**
 * ! ELEMENTOS GLOBALES
  * Este archivo contiene los elementos globales reutilizables
  * que se utilizan en las diferentes vistas del proyecto,
  * con el objetivo de evitar la duplicidad de código. 
 * ? Elementos:
 *    - Navbar
 *    - Footer
 *  */

/**
 *! --------- INICIO: navbar --------- 
 * ? Descripción:
 *  Este componente genera el Navbar principal de The Pixel Vault.
 * ? Como usar:
 * 1. Agregar la siguiente línea en el HTML:
 *        <main class="navThePixelVault"></main>
 * 
 * 2. Incluir la hoja de estilos necesaria:
 *      <link rel="stylesheet" href="styles/styles.css"/>
 * 
 * 3. Incluir este archivo JavaScript en el HTML:
 *      <script src="/javascript/globalElements.js"></script>
*/
const mainNavbar = document.querySelector(".navThePixelVault");

const renderNavbar = () => {
  // Solo metemos los tres bloques hijos directamente. 
  // Así, el flex-direction: row-reverse de tu CSS actúa sobre ellos de inmediato.
  let botonMenu = `<!-- ========== MENÚ RADIAL DANIEL ========== -->
                    <div id="radialMenuOverlay" class="radial-overlay hidden">
                      <div class="radial-menu">
                        
                        <!-- Centro -->
                        <div class="radial-center">
                          <!-- <img src="./assets/ThePixelVaultLogo.png" alt="Logo P" class="center-logo"> --!>
                          <p class="center-letter head yellow-accent">THE PIXEL <br>VAULT</p> 
                        </div>

                        <!-- Los 6 items -->
                        <a href="index.html" class="radial-item item-1 head yellow-accent">
                          <div class="icon">💻</div>
                          <span>INICIO</span>
                        </a>

                        <a href="tienda.html" class="radial-item item-2">
                          <div class="icon">🛍️</div>
                          <span>TIENDA / CATÁLOGO</span>
                        </a>

                        <a href="soporte.html" class="radial-item item-3">
                          <div class="icon">🎧</div>
                          <span>SOPORTE Y<br>ATENCIÓN AL CLIENTE</span>
                        </a>

                        <a href="mi-cuenta.html" class="radial-item item-4">
                          <div class="icon">🧑‍🦱</div>
                          <span>MI CUENTA</span>
                        </a>

                        <a href="contactanos.html" class="radial-item item-5">
                          <div class="icon">📞</div>
                          <span>CONTÁCTENOS</span>
                        </a>

                        <a href="acercaNosotros.html" class="radial-item item-6">
                          <div class="icon">🏫</div>
                          <span>ACERCA DE<br>NOSOTROS</span>
                        </a>

                      </div>
                    </div>
                    <!-- ========== FINAL MENÚ RADIAL DANIEL ========== -->`

  const contenidoInterno = `
    <div class="contenedormenu">
        <div class="menuinteractivo" id="menuinteractivo">
            <div class="ranura" id="ranura"></div>
            <div class="moneda" id="moneda"></div>
            <img class="flecha" src="assets/flecha.png" rel="flecha">
            <p>Ver MENÚ: $1</p>
            <div class="menu" id="menudesplegable">
            <ul>
            ${botonMenu}
            </ul>
            </div>
        </div>
    </div>
    <img class="logo" src="assets/ThePixelVaultLogo.png">
    <div class="contenedorBarras">
        <img class="barraRosa" src="assets/navBarraRosa.png">
        <img class="barraAzul" src="assets/navBarraAzul.png">
    </div>`;

  mainNavbar.insertAdjacentHTML("beforeend", contenidoInterno);
};
renderNavbar();

/* --------- FIN: navbar --------- */

/* --------- INICIO: MENU INTERACTIVO --------- */
// Enlazar elementos que necesitamos en la animación
const moneda = document.querySelector('#moneda');
const ranura = document.querySelector('#ranura');
const menudesplegable = document.querySelector('#menudesplegable');
const dropSound = new Audio(`assets/sonidomoneda.mp3`);

let interactuando = false;
let agarreX, agarreY; // Coordenadas del desfase del cursor al hacer clic

// Coordenadas iniciales fijas de la moneda
const inicioX = moneda.offsetLeft;
const inicioY = moneda.offsetTop;

// Posición actual de la moneda
let posicionactualX = inicioX;
let posicionactualY = inicioY;

//* Evento POINTERDOWN
moneda.addEventListener("pointerdown", (e) => {
  interactuando = true; // (Sin 'let' para modificar la variable global)
  moneda.setPointerCapture(e.pointerId);

  // Calculamos el desfase exacto donde hizo clic el usuario dentro de la moneda
  agarreX = e.clientX - posicionactualX;
  agarreY = e.clientY - posicionactualY;
});

//* Evento POINTERMOVE
moneda.addEventListener("pointermove", (e) => {
  if (!interactuando) return;

  // Calcula las nuevas coordenadas restando la posición actual del cursor menos el desfase
  posicionactualX = e.clientX - agarreX;
  posicionactualY = e.clientY - agarreY;

  // Se actualiza la posición en tiempo real
  moneda.style.left = `${posicionactualX}px`;
  moneda.style.top = `${posicionactualY}px`;
});

//* Evento POINTERUP 
moneda.addEventListener("pointerup", (e) => {
  if (!interactuando) return;
  interactuando = false;

  try {
    moneda.releasePointerCapture(e.pointerId);
  } catch (error) { }

  checkDropZone(); // Llama a la función que verifica si cayó dentro de la zona de ranura
});

//* CheckDropZone
function checkDropZone() {
  // Obtiene las coordenadas exactas de los elementos
  const monedaRect = moneda.getBoundingClientRect();
  const ranuraRect = ranura.getBoundingClientRect();

  // Calcula si hay colisión entre las coordenadas de la moneda y la ranura
  const overlap = !(
    monedaRect.right < ranuraRect.left ||
    monedaRect.left > ranuraRect.right ||
    monedaRect.bottom < ranuraRect.top ||
    monedaRect.top > ranuraRect.bottom
  );

  //* IF ELSE para los eventos si cayó o no dentro de la ranura
  if (overlap) {
    moneda.style.pointerEvents = 'none';

    // Activa sonido
    dropSound.currentTime = 0;
    dropSound.play().catch(e => console.log("Audio bloqueado:", e));

    // Estas dos líneas de código sirven para calcular el punto exacto al centro de la ranura donde debe terminar la moneda al ser soltada, asegurando que quede perfectamente alineada (tanto horizontal como verticalmente) sin importar en qué parte exacta de la ranura la haya soltado el usuario.
    const targetX = ranuraRect.left - moneda.offsetParent.getBoundingClientRect().left + (ranuraRect.width / 2) - (monedaRect.width / 2);
    const targetY = ranuraRect.top - moneda.offsetParent.getBoundingClientRect().top + (ranuraRect.height / 2) - (monedaRect.height / 2) + 15;

    // Animación de entrada a la ranura
    const animacion = moneda.animate([
      {
        left: `${posicionactualX}px`,
        top: `${posicionactualY}px`,
        transform: 'scale(1) rotate(0deg)',
        opacity: 1,
        zIndex: 10
      },
      {
        left: `${posicionactualX}px`,
        top: `${posicionactualY}px`,
        transform: 'scale(0.5) rotate(25deg)',
        opacity: 1,
        zIndex: 10
      },
      {
        left: `${targetX}px`,
        top: `${targetY}px`,
        transform: 'scaleX(0.2) scaleY(0.1) rotate(45deg)',
        opacity: 0,
        zIndex: 1
      }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.5, 0, 1, 1)',
      fill: 'forwards'
    });

    animacion.onfinish = () => {
      openMenu();
    };

  } else {
    // Animación de regreso si cae fuera
    moneda.animate([
      { left: `${posicionactualX}px`, top: `${posicionactualY}px` },
      { left: `${inicioX}px`, top: `${inicioY}px` }
    ], {
      duration: 300,
      easing: 'ease-out'
    });

    moneda.style.left = `${inicioX}px`;
    moneda.style.top = `${inicioY}px`;
    posicionactualX = inicioX;
    posicionactualY = inicioY;
  }
}

//* Abrir menú
function openMenu() {
  menudesplegable.classList.add('active');
}
/* --------- FIN: MENU INTERACTIVO --------- */

/* --------- INICIO: footer --------- */
const mainfooter = document.querySelector(".footer-container");
const renderfooter = () => {
  const renderfooter = `
    <!-- Grilla principal de 4 columnas -->
    <div class="footer-grid">

      <!-- Columna 1: Marca -->
      <div class="footer-brand">
        <h2 class="brand-title">THE PIXEL VAULT</h2>
        <p class="brand-subtitle">TIENDA RETRO DE VIDEOJUEGOS</p>
        <p class="brand-description">
          Tu tesoro de coleccionables físicos, videojuegos retro y cultura gamer. Valor, dinamismo y confianza en cada
          entrega.
        </p>
      </div>

      <!-- Columna 2: Navegación -->
      <div class="footer-column">
        <h3 class="column-title">NAVEGACIÓN</h3>
        <ul class="footer-links">
          <li><a href="#"><span class="play-icon">▶</span> Inicio</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Catálogo</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Novedades</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Ofertas</a></li>
        </ul>
      </div>

      <!-- Columna 3: Colección -->
      <div class="footer-column">
        <h3 class="column-title">COLECCIÓN</h3>
        <ul class="footer-links">
          <li><a href="#"><span class="play-icon">▶</span> Consolas Retro</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Videojuegos</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Coleccionables</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Merchandising</a></li>
        </ul>
      </div>

      <!-- Columna 4: Soporte -->
      <div class="footer-column">
        <h3 class="column-title">SOPORTE</h3>
        <ul class="footer-links">
          <li><a href="#"><span class="play-icon">▶</span> Envíos y Entregas</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Términos y Condiciones</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Política de Privacidad</a></li>
          <li><a href="#"><span class="play-icon">▶</span> Contacto</a></li>
        </ul>
      </div>

    </div>

    <!-- Barra Inferior fuera del grid -->
    <div class="footer-bottom">
      <p>&copy; 2026 <strong class="white-text">THE PIXEL VAULT</strong>. Todos los derechos reservados.</p>
      <p class="credits">BY DEV CORE SOLUTIONS</p>
    </div>`
  mainfooter.insertAdjacentHTML("beforeend", renderfooter);
};
renderfooter();
/* --------- FIN:: footer --------- */