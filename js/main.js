// BetterBites Vending — interactions
(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav: shadow on scroll
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  var toggle = document.getElementById("navToggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu when a link is tapped
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(
    ".card, .machine-card, .step, .plan, .section__head, .quote__inner, .cta__card"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Lead form
  var form = document.getElementById("leadForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      if (!name.value.trim() || !validEmail) {
        if (note) {
          note.style.color = "var(--warn)";
          note.textContent = "Please enter your name and a valid work email.";
        }
        return;
      }

      var first = name.value.trim().split(" ")[0];
      if (note) {
        note.style.color = "var(--ink-soft)";
        note.textContent = "Sending…";
      }
      // Submit to Netlify Forms (URL-encoded POST to the page).
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function () {
          if (note) {
            note.style.color = "var(--accent)";
            note.textContent = "Thanks, " + first + "! We'll be in touch within one business day.";
          }
          form.reset();
        })
        .catch(function () {
          if (note) {
            note.style.color = "var(--warn)";
            note.textContent = "Something went wrong — please email betterbites93@gmail.com.";
          }
        });
    });
  }
})();
