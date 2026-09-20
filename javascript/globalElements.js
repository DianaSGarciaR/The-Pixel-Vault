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
const listMenuBtn = [
  { id: "inicio", icon: "💻", name: "INICIO", pathHtml: "index.html" },
  { id: "tienda", icon: "🛍️", name: "TIENDA / CATÁLOGO", pathHtml: "tienda.html" },
  { id: "catalogo", icon: "🎧", name: "CATÁLOGO", pathHtml: "tienda.html" },
  { id: "miCuenta", icon: "🧑‍🦱", name: "MI CUENTA", pathHtml: "mi-cuenta.html" },
  { id: "contactanos", icon: "📞", name: "CONTÁCTENOS", pathHtml: "contactanos.html" },
  { id: "nosotros", icon: "🏫", name: "NOSOTROS", pathHtml: "acercaNosotros.html" }
];

const renderNavbar = () => {
  // Solo metemos los tres bloques hijos directamente. 
  // Así, el flex-direction: row-reverse de tu CSS actúa sobre ellos de inmediato.
  let botonMenu = `<!-- ========== MENÚ RADIAL DANIEL ========== -->
                    <div id="radialMenuOverlay" class="radial-overlay hidden">
                      <div class="radial-menu">
                        
                        <!-- Centro -->
                        <div class="radial-center">
                          <img src="./assets/logo_vertical.png" alt="Logo P" class="center-logo"> 
                          <!--<h3 class="center-letter head yellow-accent">THE PIXEL <br>VAULT </h3>--!>
                        </div>

                        <!-- Los 6 items -->
                        <a href="index.html" class="radial-item item-1 head yellow-accent">
                          <div class="icon">💻</div>
                          <span>INICIO</span>
                        </a>

                        <a href="tienda.html" class="radial-item item-2 head yellow-accent">
                          <div class="icon">🛍️</div>
                          <span>TIENDA / CATÁLOGO</span>
                        </a>

                        <a href="soporte.html" class="radial-item item-3 head yellow-accent">
                          <div class="icon">🎧</div>
                          <span>ATENCIÓN AL CLIENTE</span>
                        </a>

                        <a href="mi-cuenta.html" class="radial-item item-4 head yellow-accent">
                          <div class="icon">👤</div>
                          <span>MI CUENTA</span>
                        </a>

                        <a href="contactanos.html" class="radial-item item-5 head yellow-accent">
                          <div class="icon">📞</div>
                          <span>CONTÁCTENOS</span>
                        </a>

                        <a href="acercaNosotros.html" class="radial-item item-6 head yellow-accent">
                          <div class="icon">🏫</div>
                          <span>ACERCA DE<br>NOSOTROS</span>
                        </a>

                      </div>
                    </div>
                    <!-- ========== FINAL MENÚ RADIAL DANIEL ========== -->`

  let mobileBurgerMenu = `
    <div class="burgerMenu" id="responsBurgerMenu">
      <a class="iconMoneda" onclick="viewOptionBurgerMenu()">
        <img src="./assets/btnJuego.png" id="btnJuego">
      </a>
    </div>
    `;

  let optionBurger = creatreBtnOpcionBuergerMenu();

  const contenidoInterno = `
    <div class="contenedormenu">
      <!-- Imagen - Se anida dentro de este div para evitar que un fragmento del elemento quede visible en pantallas móviles. -->
      <div class="menuinteractivo divNavRight" id="menuinteractivo">
        <!-- Imagen - Se anida dentro de este div para evitar que un fragmento del elemento quede visible en pantallas móviles. -->
        <img class="insertcoin" src="./assets/insertcoin.png" rel="insertcoin">
        <div class="ranura" id="ranura"></div>
        <div class="moneda" id="moneda"></div>
        <div class="menu" id="menudesplegable">
          ${botonMenu}
        </div>
      </div>
    </div>
    <img class="logo" src="./assets/ThePixelVaultLogo.png">
    ${mobileBurgerMenu}
    <div class="contenedorBarras divNavLeft">
        <img class="barraRosa" src="./assets/navBarraRosa.png">
        <img class="barraAzul" src="./assets/navBarraAzul.png">
    </div>
    `;

  mainNavbar.insertAdjacentHTML("beforeend", contenidoInterno);
  mainNavbar.insertAdjacentHTML("afterend", optionBurger);
};



/* Funcion para mostrar/ocultar las opciones del Menu Hamburgesa */
const viewOptionBurgerMenu = () => {
  var optionMenu = document.getElementById("optionBurgerMenu");
  if (optionMenu.className === "opBurgerMenu") {
    optionMenu.className += " responsive";
  } else {
    optionMenu.className = "opBurgerMenu";
  }
}

/* Creamos los botnes del menu hamburgesa */
const creatreBtnOpcionBuergerMenu = () => {
  let option = `<div>
    <!-- onclick="viewOptionBurgerMenu()" : indica que se debe ejecutar la función JavaScript llamada viewOptionBurgerMenu cuando se hace clic en ese enlace. -->
    <div class="opBurgerMenu" id="optionBurgerMenu">`;

  for (let i = 0; i < listMenuBtn.length; i++) {
    option += `<a href="${listMenuBtn[i].pathHtml}"> ${listMenuBtn[i].icon} ${listMenuBtn[i].name}</a>`;
  }

  option += `</div></div>`;
  return option;
};

renderNavbar();
/* --------- FIN: navbar --------- */

/* --------- INICIO: MENU INTERACTIVO --------- */
const moneda = document.querySelector('#moneda');
const ranura = document.querySelector('#ranura');
const menudesplegable = document.querySelector('#menudesplegable');
const dropSound = new Audio(`./assets/sonidomoneda.mp3`);

let interactuando = false;
let agarreX, agarreY;

// Iniciamos la animación flotante por CSS
moneda.classList.add('flotando');

// Guardamos las coordenadas iniciales fijas
const inicioX = moneda.offsetLeft;
const inicioY = moneda.offsetTop;

let posicionactualX = inicioX;
let posicionactualY = inicioY;

//* Evento POINTERDOWN
moneda.addEventListener("pointerdown", (e) => {
  interactuando = true;
  moneda.setPointerCapture(e.pointerId);

  // Leemos dónde está la moneda exactamente antes de quitar la animación
  posicionactualX = moneda.offsetLeft;
  posicionactualY = moneda.offsetTop;

  // Quitamos la clase para que el arrastre sea fluido y preciso
  moneda.classList.remove('flotando');

  // Fijamos la posición en línea temporalmente para que no salte al quitar la clase
  moneda.style.left = `${posicionactualX}px`;
  moneda.style.top = `${posicionactualY}px`;

  agarreX = e.clientX - posicionactualX;
  agarreY = e.clientY - posicionactualY;
});

//* Evento POINTERMOVE
moneda.addEventListener("pointermove", (e) => {
  if (!interactuando) return;

  posicionactualX = e.clientX - agarreX;
  posicionactualY = e.clientY - agarreY;

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

  checkDropZone();
});

//* CheckDropZone
function checkDropZone() {
  const monedaRect = moneda.getBoundingClientRect();
  const ranuraRect = ranura.getBoundingClientRect();

  const overlap = !(
    monedaRect.right < ranuraRect.left ||
    monedaRect.left > ranuraRect.right ||
    monedaRect.bottom < ranuraRect.top ||
    monedaRect.top > ranuraRect.bottom
  );

  if (overlap) {
    moneda.style.pointerEvents = 'none';

    dropSound.currentTime = 0;
    dropSound.play().catch(e => console.log("Audio bloqueado:", e));

    const targetX = ranuraRect.left - moneda.offsetParent.getBoundingClientRect().left + (ranuraRect.width / 2) - (monedaRect.width / 2);
    const targetY = ranuraRect.top - moneda.offsetParent.getBoundingClientRect().top + (ranuraRect.height / 2) - (monedaRect.height / 2) + 15;

    const animacion = moneda.animate([
      { left: `${posicionactualX}px`, top: `${posicionactualY}px`, transform: 'scale(1) rotate(0deg)', opacity: 1, zIndex: 10 },
      { left: `${posicionactualX}px`, top: `${posicionactualY}px`, transform: 'scale(0.5) rotate(25deg)', opacity: 1, zIndex: 10 },
      { left: `${targetX}px`, top: `${targetY}px`, transform: 'scaleX(0.2) scaleY(0.1) rotate(45deg)', opacity: 0, zIndex: 1 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.5, 0, 1, 1)',
      fill: 'forwards'
    });

    animacion.onfinish = () => {
      openMenu();
    };

  } else {
    // Animación de regreso a la posición
    const regreso = moneda.animate([
      { left: `${posicionactualX}px`, top: `${posicionactualY}px` },
      { left: `${inicioX}px`, top: `${inicioY}px` }
    ], {
      duration: 300,
      easing: 'ease-out'
    });

    // Cuando termine la animación de regreso
    regreso.onfinish = () => {
      // 1. Borramos las coordenadas en línea para que vuelva a mandar el CSS (9rem y 2.5rem)
      moneda.style.removeProperty('left');
      moneda.style.removeProperty('top');

      // 2. Reiniciamos variables para el próximo arrastre
      posicionactualX = inicioX;
      posicionactualY = inicioY;

      // 3. Esperamos un frame del navegador y reactivamos la flotación limpia
      requestAnimationFrame(() => {
        moneda.classList.add('flotando');
      });
    };
  }
}

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