// Signup form handling and UTM capture. No framework.
(function () {
  "use strict";

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  var STORE_KEY = "cr_first_touch";

  function params() {
    try { return new URLSearchParams(window.location.search); } catch (e) { return null; }
  }

  // Keep the first UTM set we see for this browser session, so a visitor who
  // lands on a landing page and then clicks through to the homepage still
  // reports the post they came from.
  function firstTouch() {
    var p = params();
    var found = {};
    var any = false;
    if (p) {
      UTM_KEYS.forEach(function (k) {
        var v = p.get(k);
        if (v) { found[k] = v.toLowerCase(); any = true; }
      });
    }
    try {
      if (any) {
        window.sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
        return found;
      }
      var saved = window.sessionStorage.getItem(STORE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return found;
    }
  }

  function fillHidden(form, touch) {
    UTM_KEYS.forEach(function (k) {
      var input = form.querySelector('input[name="' + k + '"]');
      if (input) input.value = touch[k] || "";
    });
    var ref = form.querySelector('input[name="referrer"]');
    if (ref) ref.value = document.referrer || "";
  }

  function setStatus(form, text, isError) {
    var el = form.querySelector(".form-status");
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("error", !!isError);
  }

  function handleSubmit(form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = form.querySelector('input[name="email"]');
      if (!email || !email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        setStatus(form, "Please enter a valid email address.", true);
        if (email) email.focus();
        return;
      }
      var button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      setStatus(form, "Sending…", false);

      var page = form.getAttribute("data-page") || "unknown";
      var body = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: body,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            window.location.assign("/thanks?from=" + encodeURIComponent(page));
            return;
          }
          return res.json().then(function (data) {
            var msg = (data && data.errors && data.errors.map(function (e) { return e.message; }).join(", ")) ||
              "Something went wrong. Please try again.";
            throw new Error(msg);
          }, function () { throw new Error("Something went wrong. Please try again."); });
        })
        .catch(function (err) {
          if (button) button.disabled = false;
          setStatus(form, err.message || "Could not send. Please try again.", true);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var touch = firstTouch();
    var forms = document.querySelectorAll("form[data-signup]");
    Array.prototype.forEach.call(forms, function (form) {
      fillHidden(form, touch);
      handleSubmit(form);
    });

    // Thank-you page: fire the signup event once, with the originating page.
    if (document.body.getAttribute("data-page") === "thanks" && typeof window.gtag === "function") {
      var p = params();
      var from = (p && p.get("from")) || "unknown";
      window.gtag("event", "signup", { method: "email", signup_page: from, utm_source: touch.utm_source || "(none)" });
      var el = document.querySelector("[data-from-page]");
      if (el && from !== "unknown") el.textContent = from.replace(/-/g, " ");
    }
  });
})();
