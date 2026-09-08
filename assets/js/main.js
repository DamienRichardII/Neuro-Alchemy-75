/* =========================================================
   NeuroAlchemy — main.js
   Menu burger, FAQ accordéon, formulaire (confirmation frontend)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Menu burger mobile ---------- */
  var burger = document.querySelector(".burger");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.remove("open");
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    // Fermer au clic sur un lien
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // Fermer avec Echap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- FAQ accordéon ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      // fermer les autres
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (open) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Formulaire de réservation (confirmation frontend) ---------- */
  var form = document.getElementById("reservationForm");
  if (form) {
    var success = document.getElementById("formSuccess");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Vérifier les cases de consentement obligatoires
      var requiredChecks = form.querySelectorAll('input[type="checkbox"][required]');
      var allChecked = true;
      requiredChecks.forEach(function (c) {
        if (!c.checked) allChecked = false;
      });

      if (!form.checkValidity() || !allChecked) {
        form.reportValidity();
        if (!allChecked) {
          alert("Merci de cocher les cases de consentement obligatoires pour continuer.");
        }
        return;
      }

      // Succès : message frontend
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }

  /* ---------- Avis : bande défilante continue ---------- */
  var testimonialTrack = document.getElementById("testimonialTrack");
  if (testimonialTrack) {
    // Duplique une fois le contenu pour un défilement en boucle sans coupure.
    // Fait avant l'effet de révélation au scroll : les clones sont retirés
    // du système data-reveal pour rester visibles en permanence.
    var originalCards = Array.prototype.slice.call(testimonialTrack.children);
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.removeAttribute("data-reveal");
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
      clone.querySelectorAll("button, a").forEach(function (el) { el.setAttribute("tabindex", "-1"); });
      testimonialTrack.appendChild(clone);
    });
  }

  /* ---------- Avis : modal "Lire le témoignage complet" ---------- */
  var testimonialModal = document.getElementById("testimonialModal");
  if (testimonialModal) {
    var modalStars = document.getElementById("testimonialModalStars");
    var modalText = document.getElementById("testimonialModalText");
    var modalAuthor = document.getElementById("testimonialModalAuthor");

    function openTestimonialModal(card) {
      var stars = card.querySelector(".testimonial-stars");
      var text = card.querySelector(".testimonial-text");
      var author = card.querySelector(".testimonial-author");
      modalStars.innerHTML = stars ? stars.innerHTML : "";
      modalText.innerHTML = text ? text.innerHTML : "";
      modalAuthor.innerHTML = author ? author.innerHTML : "";
      testimonialModal.classList.add("show");
      testimonialModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeTestimonialModal() {
      testimonialModal.classList.remove("show");
      testimonialModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    document.addEventListener("click", function (e) {
      var moreBtn = e.target.closest(".testimonial-more");
      if (moreBtn) {
        var card = moreBtn.closest(".testimonial-card");
        if (card) openTestimonialModal(card);
        return;
      }
      if (e.target.closest("[data-modal-close]")) closeTestimonialModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeTestimonialModal();
    });
  }

  /* ---------- Effet léger d'apparition au scroll ---------- */
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
      observer.observe(el);
    });
  }

  /* ---------- Année footer ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
