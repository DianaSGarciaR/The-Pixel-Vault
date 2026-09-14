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
    const navThePixelVault = `    <nav class="navbar bg-body-tertiary" id="navbar">

        <div id="divNavLeft">
            <img src="./assets/navBarraRosa.png" alt="navBarraRosa" width="150px" height="auto">
            <br>
            <img src="./assets/navBarraAzul.png" alt="navBarraAzul" width="150px" height="auto">
        </div>

        <div id="divNavCenter" class="magicalGlow">
            <img class="magicalGlowLogo" src="./assets/ThePixelVaultLogo.png" alt="ThePixelVaultLogo" width="300px" height="auto">
        </div>

        <div id="divNavRight">
            <li class="nav-item dropdown">
                <button id="btnMenu" type="button" href="#" data-bs-toggle="dropdown">
                    <img class="btnImg" src="assets/botonmenu.png" alt="botonMenu">
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="index.html">INICIO</a></li>
                    <li><a class="dropdown-item" href="acercaNosotros.html">ACERCA DE NOSOTROS</a></li>
                </ul>
            </li>
        </div>
    </nav>`
    mainNavbar.insertAdjacentHTML("beforeend", navThePixelVault);
};
renderNavbar();
/* --------- FIN: navbar --------- */

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