# 🎮 The Pixel Vault

> Tienda en línea de videojuegos digitales y merchandising con estética retro / pixel-art y neón.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?logo=bootstrap&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)

<!-- Opcional: agrega aquí una captura o GIF de la página principal -->
<!-- ![Vista previa](./docs/preview.png) -->

---

## 📖 Descripción

**The Pixel Vault** es una tienda en línea donde los usuarios pueden explorar y comprar:

- 🕹️ **Videojuegos digitales** y ediciones especiales.
- 🧸 **Merchandising**: juguetes, pósteres, ropa, accesorios y complementos para consola.
---

## ✨ Funcionalidades

- Menú circular de navegación con diseño pixel / neón.
- Registro e inicio de sesión de usuarios.
- Catálogo de productos (tienda) con tarjetas y modal de detalle.
- **Mi carrito** con control de cantidades y modal de pago (datos de pago, dirección de envío y facturación).
- **Mi cuenta**: avatar, métodos de pago y cierre de sesión.
- **Registrar productos** (formulario con validación).
- **Contáctanos**: formulario de contacto integrado con Formspree.
- **Atención al cliente / Soporte**: preguntas frecuentes, términos y condiciones y política de privacidad en modales.
- Historial de pedidos.
- Diseño responsivo.

---

## 🛠️ Tecnologías

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5 |
| **Backend** | Java, Spring Boot |
| **Base de datos** | MySQL |
| **Diseño** | Figma |
| **Servicios externos** | Formspree (formulario de contacto) |
| **Control de versiones** | Git y GitHub |

---

## 📁 Estructura del proyecto

> Ajusta esta sección para que coincida con las carpetas reales de tu repositorio.

```
The-Pixel-Vault/
├── index.html
├── contactanos.html
├── soporte.html
├── registroProducts.html
├── miCarrito.html
├── mi-cuenta.html
├── styles/
│   ├── styles.css
│   ├── tienda.css
│   ├── contactanos.css
│   ├── registroProducts.css
│   ├── soporte.css
│   └── mi-cuenta.css
├── javascript/
│   ├── globalElements.js
│   ├── contactanos.js
│   ├── registroProducts.js
│   ├── soporte.js
│   ├── carrito.js
│   └── mi-cuenta.js
├── img/
└── README.md
```

---

## 🗄️ Base de datos

El modelo incluye las siguientes tablas principales:

| Tabla | Descripción |
|-------|-------------|
| `user` | Datos de los usuarios. |
| `user_role` | Roles de usuario. |
| `order` | Pedidos realizados. |
| `order_has_product` | Relación entre pedidos y productos. |
| `order_tracking` | Seguimiento de cada pedido. |
| `product` | Producto general, con subtablas por categoría. |
| `contact_support` | Mensajes enviados desde Contáctanos / soporte. |

**Subtablas de `product`:** `videogames`, `toys`, `clothes`, `art_and_posters`, `console_complements`, `accesories`.

<!-- Opcional: agrega aquí la imagen del diagrama entidad-relación -->
<!-- ![Diagrama de base de datos](./docs/diagrama-bd.png) -->

---


## 🎨 Diseño

El diseño de las pantallas está en Figma: [Ver diseño en Figma]([[enlace-a-tu-figma]](https://www.figma.com/design/5U4eQ6WsQhtzSDkHyFOe5c/THE-PIXEL-VAULT?node-id=0-1&p=f&t=FxN53ZeCmJ6CuE3n-0))

**Paleta principal:** cian neón · amarillo neón · rosa neón · fondo oscuro.

---

## 🌿 Flujo de trabajo con Git

- `main`: versión estable.
- `develop`: integración de funcionalidades. *(si lo usan)*
- Ramas por tarea, por ejemplo `Historial_Pedido`.

Cada tarea se trabaja en su propia rama y se une a la rama principal mediante *Pull Request*.

---

## 👥 Equipo
Diana Saraí García Ramírez
Alberto Pedraza Pedraza
Salvador Osorio Palma
Diego González Celis
Fernando Angel Chalqueño Nava
Maria del Carmen Galindo Ramirez
Blanca Jazmin Hernández Miranda
Daniel Castro Perez
Natalia González Coca
Alejandro Enrique Sanchez Mendoza 
---

<p align="center">Hecho con 💛 por el equipo de The Pixel Vault</p>


