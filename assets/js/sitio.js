/* Imagen Urbana y Modernización — comportamiento mínimo del sitio */
(function () {
  "use strict";
  var raiz = document.documentElement;
  raiz.classList.add("js");

  var encabezado = document.getElementById("encabezado");
  var boton = document.querySelector(".menu-boton");
  var menu = document.getElementById("menu");

  /* Año actual en el pie */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* Encabezado sólido al desplazarse */
  function actualizarEncabezado() {
    encabezado.classList.toggle("es-solido", window.scrollY > 40);
  }
  actualizarEncabezado();
  window.addEventListener("scroll", actualizarEncabezado, { passive: true });

  /* Menú móvil */
  function cerrarMenu(devolverFoco) {
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
    menu.classList.remove("esta-abierto");
    encabezado.classList.remove("menu-abierto");
    if (devolverFoco) boton.focus();
  }
  function abrirMenu() {
    boton.setAttribute("aria-expanded", "true");
    boton.setAttribute("aria-label", "Cerrar menú");
    menu.classList.add("esta-abierto");
    encabezado.classList.add("menu-abierto");
    var primero = menu.querySelector("a");
    if (primero) primero.focus();
  }
  boton.addEventListener("click", function () {
    if (boton.getAttribute("aria-expanded") === "true") cerrarMenu(false); else abrirMenu();
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) cerrarMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("esta-abierto")) cerrarMenu(true);
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", function (m) {
    if (m.matches) cerrarMenu(false);
  });

  /* Aparición suave del contenido */
  var elementos = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("es-visible");
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    elementos.forEach(function (el) { observador.observe(el); });
  } else {
    elementos.forEach(function (el) { el.classList.add("es-visible"); });
  }

  /* Enlace activo del menú según la sección visible */
  var enlaces = menu.querySelectorAll('ul a[href^="#"]');
  if ("IntersectionObserver" in window) {
    var secciones = Array.prototype.map.call(enlaces, function (a) {
      return document.querySelector(a.getAttribute("href"));
    }).filter(Boolean);
    var obsSecciones = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlaces.forEach(function (a) {
          var actual = a.getAttribute("href") === "#" + entrada.target.id;
          a.classList.toggle("es-actual", actual);
          if (actual) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secciones.forEach(function (s) { obsSecciones.observe(s); });
  }
})();
