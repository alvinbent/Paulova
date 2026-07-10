(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function findMenuTrigger(nav) {
    return Array.from(nav.querySelectorAll(".material-symbols-outlined")).find(function (node) {
      return node.textContent && node.textContent.trim() === "menu";
    });
  }

  function findDesktopMenu(nav) {
    return (
      nav.querySelector(".hidden.md\\:flex") ||
      nav.querySelector(".hidden.md\\:block") ||
      nav.querySelector(".hidden.md\\:inline-flex")
    );
  }

  function normalizeClone(node) {
    var clone = node.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.remove("hidden", "md:flex", "md:block", "md:inline-flex");
    clone.classList.add("paunova-mobile-menu-item");
    return clone;
  }

  onReady(function () {
    document.documentElement.classList.add("paunova-responsive-ready");

    document.querySelectorAll("nav").forEach(function (nav, index) {
      var trigger = findMenuTrigger(nav);
      var desktopMenu = findDesktopMenu(nav);

      if (!trigger || !desktopMenu || trigger.dataset.paunovaReady === "true") {
        return;
      }

      var panel = document.createElement("div");
      var panelId = "paunova-mobile-menu-" + index;
      panel.id = panelId;
      panel.className = "paunova-mobile-menu";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Navegación principal");

      Array.from(desktopMenu.children).forEach(function (child) {
        panel.appendChild(normalizeClone(child));
      });

      document.body.appendChild(panel);

      trigger.dataset.paunovaReady = "true";
      trigger.classList.add("paunova-public-menu-trigger");
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("aria-label", "Abrir menú");
      trigger.setAttribute("aria-controls", panelId);
      trigger.setAttribute("aria-expanded", "false");

      function closePanel() {
        panel.classList.remove("is-open");
        document.body.classList.remove("paunova-menu-open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-label", "Abrir menú");
      }

      function openPanel() {
        document.querySelectorAll(".paunova-mobile-menu.is-open").forEach(function (openMenu) {
          if (openMenu !== panel) {
            openMenu.classList.remove("is-open");
          }
        });
        panel.classList.add("is-open");
        document.body.classList.add("paunova-menu-open");
        trigger.setAttribute("aria-expanded", "true");
        trigger.setAttribute("aria-label", "Cerrar menú");
      }

      function togglePanel(event) {
        event.preventDefault();
        event.stopPropagation();
        if (panel.classList.contains("is-open")) {
          closePanel();
          return;
        }
        openPanel();
      }

      trigger.addEventListener("click", togglePanel);
      trigger.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          togglePanel(event);
        }
        if (event.key === "Escape") {
          closePanel();
        }
      });

      panel.addEventListener("click", function (event) {
        var target = event.target;
        if (target && target.closest && target.closest("a")) {
          closePanel();
        }
      });

      document.addEventListener("click", function (event) {
        var target = event.target;
        if (!panel.classList.contains("is-open")) {
          return;
        }
        if (target === trigger || panel.contains(target)) {
          return;
        }
        closePanel();
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth >= 768) {
          closePanel();
        }
      });
    });
  });
})();
