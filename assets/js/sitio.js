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

  /* Aparición suave del contenido (una sola vez por elemento).
     Solo se ocultan los elementos que todavía están fuera de pantalla,
     y solo si este script se ejecuta: sin JavaScript todo queda visible. */
  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var elementos = Array.prototype.slice.call(document.querySelectorAll(".revelar"));

  if (!sinMovimiento && "IntersectionObserver" in window && elementos.length) {
    /* Retraso escalonado dentro de cada grupo de tarjetas */
    var grupos = [".servicios__lista", ".galeria__rejilla", ".contacto__datos"];
    grupos.forEach(function (selector) {
      var grupo = document.querySelector(selector);
      if (!grupo) return;
      grupo.querySelectorAll(".revelar").forEach(function (el, i) {
        el.style.setProperty("--retraso", (i * 110) + "ms");
      });
    });

    var altoVentana = window.innerHeight || document.documentElement.clientHeight;
    var pendientes = elementos.filter(function (el) {
      return el.getBoundingClientRect().top > altoVentana * 0.92;
    });
    pendientes.forEach(function (el) { el.classList.add("revelar--pendiente"); });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        el.classList.add("es-visible");
        observador.unobserve(el);
        /* Al terminar se retiran las clases para que no interfieran con otros efectos */
        el.addEventListener("transitionend", function limpiar(e) {
          if (e.target !== el || e.propertyName !== "opacity") return;
          el.removeEventListener("transitionend", limpiar);
          el.classList.remove("revelar--pendiente", "revelar--anima", "es-visible");
          el.style.removeProperty("--retraso");
        });
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    /* Activa las transiciones en el siguiente cuadro, ya con el estado inicial aplicado */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pendientes.forEach(function (el) {
          el.classList.add("revelar--anima");
          observador.observe(el);
        });
      });
    });
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
