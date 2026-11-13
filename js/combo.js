// Combo vending lead form.
// Same mechanism as the homepage: Netlify Forms, URL-encoded POST to this page.
// This form is named "combo-vending" so its submissions stay separate.
(function () {
  "use strict";

  var form = document.getElementById("comboLeadForm");
  var note = document.getElementById("comboFormNote");
  if (!form) return;

  var submitBtn = form.querySelector("[type=submit]");
  var defaultLabel = submitBtn ? submitBtn.textContent : "";

  function setNote(message, color) {
    if (!note) return;
    note.style.color = color;
    note.textContent = message;
  }

  function phoneOk(value) {
    var digits = value.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.charAt(0) === "1");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.elements.name;
    var business = form.elements.business_name;
    var area = form.elements.address_or_area;
    var email = form.elements.email;
    var phone = form.elements.phone;
    var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

    if (!name.value.trim() || !business.value.trim() || !area.value.trim() || !validEmail || !phoneOk(phone.value)) {
      setNote("Please add your name, business, address or area, a valid email, and a phone number.", "var(--warn)");
      if (!name.value.trim()) name.focus();
      else if (!business.value.trim()) business.focus();
      else if (!area.value.trim()) area.focus();
      else if (!validEmail) email.focus();
      else phone.focus();
      return;
    }

    setNote("Sending…", "#cfe3bf");
    if (submitBtn) submitBtn.disabled = true;

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Form post failed");
        var first = name.value.trim().split(" ")[0];
        setNote("Thanks, " + first + ". We'll be in touch about a combo machine.", "var(--brand-light)");
        form.reset();
      })
      .catch(function () {
        setNote("Something went wrong. Email betterbites93@gmail.com or call (602) 203-2899.", "var(--warn)");
      })
      .then(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        }
      });
  });
})();
