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
            <img src="./assets/navBarraRosa.png" alt="navBarraRosa" width="100" height="auto">
            <br>
            <img src="./assets/navBarraAzul.png" alt="navBarraAzul" width="100px" height="auto">
        </div>

        <div id="divNavCenter" class="magicalGlow">
            <img src="./assets/ThePixelVaultLogo.png" alt="ThePixelVaultLogo" width="300px" height="auto">
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