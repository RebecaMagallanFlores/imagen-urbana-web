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
    var grupos = [".servicios__lista", ".valores__lista", ".metodo__lista", ".sectores", ".proyectos"];
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
  /* Formulario de contacto.
     No hay servidor: al enviarlo se abre la aplicación de correo del visitante
     con el mensaje ya preparado. No se guarda ni se transmite nada por otra vía. */
  var formulario = document.getElementById("formulario");
  if (formulario) {
    var CORREO = "imagen_urbanizacion@outlook.com";
    var estado = document.getElementById("formulario-estado");
    var etiquetas = {
      publico: { asunto: "Solicitud de información - Sector público", tipo: "Solicitar información (sector público)" },
      privado: { asunto: "Solicitud de cotización - Sector privado", tipo: "Solicitar cotización (sector privado)" }
    };

    function marcarSector(valor) {
      var radio = formulario.querySelector('input[name="sector"][value="' + valor + '"]');
      if (radio) radio.checked = true;
    }
    /* Los botones de los bloques de sector preseleccionan el tipo de solicitud */
    document.querySelectorAll("[data-sector]").forEach(function (enlace) {
      enlace.addEventListener("click", function () { marcarSector(enlace.getAttribute("data-sector")); });
    });

    function mensajeError(campo) {
      if (campo.validity.valueMissing) return "Este campo es obligatorio.";
      if (campo.validity.typeMismatch) return "Escribe un correo electrónico válido.";
      return "Revisa este campo.";
    }
    function limpiarError(campo) {
      campo.removeAttribute("aria-invalid");
      var previo = document.getElementById(campo.id + "-error");
      if (previo) previo.remove();
      var desc = (campo.getAttribute("aria-describedby") || "").split(" ").filter(function (d) { return d && d !== campo.id + "-error"; });
      if (desc.length) campo.setAttribute("aria-describedby", desc.join(" ")); else campo.removeAttribute("aria-describedby");
    }
    function mostrarError(campo) {
      limpiarError(campo);
      campo.setAttribute("aria-invalid", "true");
      var aviso = document.createElement("p");
      aviso.className = "campo__error";
      aviso.id = campo.id + "-error";
      aviso.textContent = mensajeError(campo);
      campo.insertAdjacentElement("afterend", aviso);
      var desc = campo.getAttribute("aria-describedby");
      campo.setAttribute("aria-describedby", (desc ? desc + " " : "") + aviso.id);
    }
    formulario.querySelectorAll(".campo input, .campo select, .campo textarea").forEach(function (campo) {
      campo.addEventListener("input", function () { if (campo.getAttribute("aria-invalid") && campo.checkValidity()) limpiarError(campo); });
    });

    formulario.addEventListener("submit", function (e) {
      e.preventDefault();
      estado.className = "formulario__estado";
      estado.textContent = "";
      var primero = null;
      formulario.querySelectorAll(".campo input, .campo select, .campo textarea").forEach(function (campo) {
        if (!campo.checkValidity()) { mostrarError(campo); if (!primero) primero = campo; } else { limpiarError(campo); }
      });
      var sector = formulario.querySelector('input[name="sector"]:checked');
      var consentimiento = formulario.querySelector('input[name="consentimiento"]');
      var faltantes = [];
      if (!sector) faltantes.push("elige el tipo de solicitud");
      if (primero) faltantes.push("completa los campos marcados");
      if (!consentimiento.checked) faltantes.push("acepta el aviso sobre tus datos");
      if (faltantes.length) {
        estado.classList.add("es-error");
        estado.textContent = "Para continuar, " + faltantes.join(", ") + ".";
        (primero || (!sector ? formulario.querySelector('input[name="sector"]') : consentimiento)).focus();
        return;
      }

      var datos = etiquetas[sector.value];
      var v = function (nombre) { return (formulario.elements[nombre].value || "").trim() || "No indicado"; };
      var cuerpo = [
        "Tipo de solicitud: " + datos.tipo,
        "Nombre: " + v("nombre"),
        "Empresa u organización: " + v("empresa"),
        "Correo electrónico: " + v("correo"),
        "Teléfono: " + v("telefono"),
        "Tipo de servicio: " + v("servicio"),
        "",
        "Descripción del proyecto:",
        v("descripcion")
      ].join("\r\n");

      window.location.href = "mailto:" + CORREO +
        "?subject=" + encodeURIComponent(datos.asunto) +
        "&body=" + encodeURIComponent(cuerpo);

      estado.classList.add("es-listo");
      estado.textContent = "Abrimos tu aplicación de correo con la solicitud preparada. Revisa el mensaje y envíalo. Si no se abrió, escríbenos directamente a " + CORREO + " o llámanos al (55) 8494 4232.";
    });
  }
})();
