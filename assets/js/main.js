/* Ahmad Obaidullah portfolio — vanilla JS interactions */
(function () {
  "use strict";

  /* Theme (persists per browser) */
  try {
    var saved = localStorage.getItem("ao-theme");
    if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
  } catch (e) {}
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    var root = document.documentElement;
    var light = root.getAttribute("data-theme") === "light";
    if (light) { root.removeAttribute("data-theme"); } else { root.setAttribute("data-theme", "light"); }
    try { localStorage.setItem("ao-theme", light ? "dark" : "light"); } catch (err) {}
  });

  /* Mobile nav */
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-nav-toggle]");
    if (toggle) {
      var links = document.querySelector("[data-nav-links]");
      if (links) links.classList.toggle("open");
      return;
    }
    if (e.target.closest("[data-nav-links] a")) {
      var l = document.querySelector("[data-nav-links]");
      if (l) l.classList.remove("open");
    }
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Count-up for impact numbers */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-decimals") || "0") === "1" ? 2 : 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1100, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = (el.getAttribute("data-prefix") || "") + Number(el.getAttribute("data-count")).toLocaleString("en-US") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* Video facade: click-to-load (never autoplay) */
  document.querySelectorAll(".video-facade").forEach(function (facade) {
    facade.addEventListener("click", function () {
      var src = facade.getAttribute("data-src");
      var note = facade.querySelector(".soon-note");
      if (!src) {
        if (note) { note.hidden = false; }
        else {
          note = document.createElement("div");
          note.className = "soon-note";
          note.textContent = "Video link coming soon — the upload is pending. All other content is live.";
          facade.appendChild(note);
        }
        return;
      }
      var iframe = document.createElement("iframe");
      iframe.className = "video-frame";
      iframe.setAttribute("allow", "accelerometer; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("title", facade.getAttribute("data-title") || "Project video");
      var url = src;
      if (src.indexOf("youtube") > -1 && src.indexOf("embed") === -1) {
        var m = src.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{6,})/);
        if (m) url = "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0";
      }
      iframe.src = url;
      facade.style.aspectRatio = "auto";
      facade.innerHTML = "";
      facade.style.cursor = "default";
      facade.appendChild(iframe);
    });
  });

  /* Copy email */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-copy");
      function done() { var old = btn.textContent; btn.textContent = "Copied ✓"; setTimeout(function () { btn.textContent = old; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = val; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
  });
})();
