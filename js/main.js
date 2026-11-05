"use strict";
(function () {
  var body = document.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* =========================================================
     GALLERY PHOTOS — edit this list to change the home-page carousel.
       src:   the photo (web-sized copies live in img/web/; originals stay in img/ and img/gallery/)
       thumb: small preview for the thumbnail strip (optional; falls back to src)
       alt:   what is happening in the photo, for screen-reader users
       title / text: the caption shown on the photo
     To add a photo: put it in img/gallery/ and add a line, e.g.
       { src: "img/gallery/new-photo.jpg", alt: "...", title: "...", text: "..." },
     ========================================================= */
  var SLIDES = [
    { src: "img/web/2015_Group_Photo.jpg", thumb: "img/web/thumbs/2015_Group_Photo.jpg",
      alt: "A large group of teachers posing outdoors in front of a campus building.",
      title: "2015 summer cohort", text: "K–12 teachers in from the 2015 PUMP-CS #1 summer cohort." },
    { src: "img/web/Teecher_Cohort.jpg", thumb: "img/web/thumbs/Teecher_Cohort.jpg",
      alt: "Smiling teachers and facilitators wearing red sunglasses pose together in a classroom.",
      title: "A PUMP-CS teacher cohort", text: "Teachers and facilitators from a PUMP-CS workshop." },
    { src: "img/web/Dennis_Teaching_2017.jpg", thumb: "img/web/thumbs/Dennis_Teaching_2017.jpg",
      alt: "Dennis Brylow at the front of a classroom while teachers work on laptops.",
      title: "Dr. Brylow leading a teacher workshop, 2017", text: "Teachers work through course activities on laptops at Marquette." },
    { src: "img/web/RM_401_Teacher_Training.jpg", thumb: "img/web/thumbs/RM_401_Teacher_Training.jpg",
      alt: "Three teachers working on laptops around a conference table.",
      title: "Hands-on teacher training", text: "Teachers work through course materials together during a summer session." },
    { src: "img/web/MU_401_Teacher.jpg", thumb: "img/web/thumbs/MU_401_Teacher.jpg",
      alt: "A teacher laughs while talking with a teacher beside a worktable.",
      title: "Peer collaboration", text: "Teachers are brainstorming before their presentation at a PD session." },
    { src: "img/web/Teacher_Group_Photo.jpg", thumb: "img/web/thumbs/Teacher_Group_Photo.jpg",
      alt: "A group of smiling teachers gathered in front of a projector screen.",
      title: "Teachers learning together", text: "A teacher cohort pauses for a group photo during a workshop." },
    { src: "img/web/dennis_lecture.png", thumb: "img/web/thumbs/dennis_lecture.png",
      alt: "Dr. Dennis Brylow lecturing on Sentinel values.",
      title: "Python bootcamp follow-up", text: "Dr. Brylow discussing Python Sentinel values." },
    { src: "img/web/Elementary_Coding_Hands_on.jpg", thumb: "img/web/thumbs/Elementary_Coding_Hands_on.jpg",
      alt: "Two elementary students sit on a classroom floor testing small robots.",
      title: "Robots on the classroom floor", text: "Elementary students test their code with small robots." },
    { src: "img/web/01-cs-fundamentals.jpg", thumb: "img/web/thumbs/01-cs-fundamentals.jpg",
      alt: "A young student smiles while working on a laptop.",
      title: "Early coding", text: "A young student working on a coding activity." },
    { src: "img/web/Scratch_in_Classroom.jpg", thumb: "img/web/thumbs/Scratch_in_Classroom.jpg",
      alt: "A classroom of students programming on laptops while a lesson is projected.",
      title: "A classroom coding lesson", text: "Students program on laptops while the teacher projects the lesson." },
    { src: "img/web/Three_Sudents_with_HP.jpg", thumb: "img/web/thumbs/Three_Sudents_with_HP.jpg",
      alt: "Three smiling students in school uniforms sit behind laptops.",
      title: "Proud programmers", text: "Three students pause from their coding project for a photo." },
    { src: "img/web/Students_Coding.jpg", thumb: "img/web/thumbs/Students_Coding.jpg",
      alt: "Students at desks building block-based programs on laptops.",
      title: "Block-based coding", text: "Students build programs with block-based code." }
  ];
  var PORTRAIT = body.getAttribute("data-portrait") || "";

  /* ---------- Carousel (cross-fading photo wall with thumbnail strip) ---------- */
  var carousel = $("#carousel");
  var stopCarousel = function () {};
  if (carousel) {
    var track = $("#track"), count = $("#slideCount");
    var thumbs = $("#thumbs") || $("#dots");
    var playBtn = $("#playSlide"), playIcon = $("#playIcon");
    var current = 0, timer = null;
    thumbs.className = "thumbs";

    SLIDES.forEach(function (s, i) {
      var fig = document.createElement("figure");
      fig.className = "slide";
      fig.setAttribute("role", "group");
      fig.setAttribute("aria-roledescription", "slide");
      fig.setAttribute("aria-label", (i + 1) + " of " + SLIDES.length + ": " + s.title);

      var bg = document.createElement("div");
      bg.className = "slide-bg"; bg.setAttribute("aria-hidden", "true");
      var img = document.createElement("img");
      img.className = "slide-media";
      img.alt = s.alt || s.text;
      img.decoding = "async";
      if (i > 1) img.loading = "lazy";
      img.addEventListener("load", function () { bg.style.backgroundImage = "url(\"" + (s.thumb || s.src) + "\")"; });
      img.addEventListener("error", function () {
        var ph = document.createElement("div");
        ph.className = "slide-placeholder"; ph.textContent = "Photo not found: " + s.src;
        img.replaceWith(ph);
      });
      img.src = s.src;

      var cap = document.createElement("figcaption");
      cap.innerHTML = "<strong></strong><span></span>";
      cap.querySelector("strong").textContent = s.title;
      cap.querySelector("span").textContent = s.text;
      fig.appendChild(bg); fig.appendChild(img); fig.appendChild(cap);
      track.appendChild(fig);

      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button"; b.className = "thumb";
      b.setAttribute("aria-label", "Show photo " + (i + 1) + ": " + s.title);
      var t = document.createElement("img");
      t.src = s.thumb || s.src; t.alt = ""; t.loading = "lazy";
      b.appendChild(t);
      b.addEventListener("click", function () { stop(); go(i); });
      li.appendChild(b); thumbs.appendChild(li);
    });

    var go = function (i) {
      current = (i + SLIDES.length) % SLIDES.length;
      $$(".slide", track).forEach(function (el, k) {
        var on = k === current;
        el.classList.toggle("is-active", on);
        if (on) { el.removeAttribute("aria-hidden"); el.inert = false; }
        else { el.setAttribute("aria-hidden", "true"); el.inert = true; }
      });
      $$(".thumb", thumbs).forEach(function (d, k) {
        d.setAttribute("aria-current", k === current ? "true" : "false");
        if (k === current) {
          var box = thumbs.getBoundingClientRect(), r = d.getBoundingClientRect();
          if (r.left < box.left || r.right > box.right) thumbs.scrollBy({ left: r.left - box.left - box.width / 2 + r.width / 2, behavior: reduce ? "auto" : "smooth" });
        }
      });
      if (count) count.textContent = (current + 1) + " / " + SLIDES.length;
    };
    var play = function () {
      if (timer) return;
      track.setAttribute("aria-live", "off");
      timer = setInterval(function () { go(current + 1); }, 6000);
      playBtn.setAttribute("aria-label", "Pause slideshow");
      playIcon.setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");
    };
    var stop = function () {
      clearInterval(timer); timer = null;
      track.setAttribute("aria-live", "polite");
      playBtn.setAttribute("aria-label", "Start slideshow");
      playIcon.setAttribute("d", "M8 5v14l11-7z");
    };
    stopCarousel = stop;
    $("#prevSlide").addEventListener("click", function () { stop(); go(current - 1); });
    $("#nextSlide").addEventListener("click", function () { stop(); go(current + 1); });
    playBtn.addEventListener("click", function () { timer ? stop() : play(); });
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { stop(); go(current - 1); }
      if (e.key === "ArrowRight") { stop(); go(current + 1); }
    });
    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { stop(); go(current + (dx < 0 ? 1 : -1)); }
      x0 = null;
    });
    go(0);
  }

  /* ---------- Portrait: shows the photo once the file exists ---------- */
  var portrait = $(".portrait");
  if (portrait && PORTRAIT) {
    var pic = new Image();
    pic.onload = function () { pic.alt = "Dr. Dennis Brylow"; pic.className = "portrait-img"; portrait.replaceWith(pic); };
    pic.src = PORTRAIT;
  }

  /* ---------- Copy buttons ---------- */
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy"), label = btn.textContent;
      var done = function (msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = label; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done("Copied"); }, function () { done("Select and copy"); });
      } else { done("Select and copy"); }
    });
  });

  /* ---------- Desktop menus (WAI-ARIA disclosure navigation pattern) ---------- */
  var menuButtons = $$(".nav-desktop button[aria-controls]");
  var closeAll = function (except) {
    menuButtons.forEach(function (b) {
      if (b !== except) { b.setAttribute("aria-expanded", "false"); document.getElementById(b.getAttribute("aria-controls")).hidden = true; }
    });
  };
  menuButtons.forEach(function (btn) {
    var menu = document.getElementById(btn.getAttribute("aria-controls"));
    var links = function () { return $$("a", menu); };
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      closeAll(btn);
      btn.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); closeAll(btn); btn.setAttribute("aria-expanded", "true"); menu.hidden = false; links()[0].focus(); }
    });
    menu.addEventListener("keydown", function (e) {
      var l = links(), i = l.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); l[(i + 1) % l.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); l[(i - 1 + l.length) % l.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); l[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); l[l.length - 1].focus(); }
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeAll(); });
    btn.parentElement.addEventListener("focusout", function (e) {
      if (!btn.parentElement.contains(e.relatedTarget)) { btn.setAttribute("aria-expanded", "false"); menu.hidden = true; }
    });
  });
  var topItems = $$(".nav-desktop > ul > li > .nav-btn, .nav-desktop > ul > li > .cta-btn");
  topItems.forEach(function (el, i) {
    el.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); topItems[(i + 1) % topItems.length].focus(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); topItems[(i - 1 + topItems.length) % topItems.length].focus(); }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = menuButtons.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; })[0];
    if (open) { closeAll(); open.focus(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".nav-desktop")) closeAll(); });

  /* ---------- Mobile modal navigation drawer ---------- */
  var drawer = $("#drawer"), scrim = $("#scrim"), openBtn = $("#menuOpen"), closeBtn = $("#menuClose");
  var behind = $$(".skip-link, .utility, #appbar, #main, .logo-strip, footer");
  var openDrawer = function () {
    drawer.hidden = false; scrim.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add("open"); scrim.classList.add("open"); });
    openBtn.setAttribute("aria-expanded", "true");
    behind.forEach(function (el) { el.inert = true; });
    document.documentElement.style.overflow = "hidden";
    closeBtn.focus();
  };
  var closeDrawer = function (returnFocus) {
    drawer.classList.remove("open"); scrim.classList.remove("open");
    openBtn.setAttribute("aria-expanded", "false");
    behind.forEach(function (el) { el.inert = false; });
    document.documentElement.style.overflow = "";
    setTimeout(function () { drawer.hidden = true; scrim.hidden = true; }, reduce ? 0 : 250);
    if (returnFocus !== false) openBtn.focus();
  };
  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", function () { closeDrawer(); });
  scrim.addEventListener("click", function () { closeDrawer(); });
  drawer.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); closeDrawer(); return; }
    if (e.key !== "Tab") return;
    var f = $$("button, a[href]", drawer).filter(function (el) { return el.offsetParent !== null; });
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $$("button.drawer-label", drawer).forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      document.getElementById(b.getAttribute("aria-controls")).hidden = open;
    });
  });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(false); });
  window.matchMedia("(min-width: 1080px)").addEventListener("change", function (m) {
    if (m.matches && openBtn.getAttribute("aria-expanded") === "true") closeDrawer(false);
  });

  /* ---------- App bar elevation ---------- */
  var appbar = $("#appbar");
  var onScroll = function () { appbar.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Single-file preview only: show one page at a time from the #hash ---------- */
  if (body.getAttribute("data-mode") === "preview") {
    var pages = $$("[data-page]");
    var titles = {};
    pages.forEach(function (p) { titles[p.id] = p.getAttribute("data-title"); });
    var markCurrent = function (pid) {
      $$("[data-nav]").forEach(function (a) {
        var on = a.getAttribute("data-nav") === pid;
        if (a.tagName === "A") { on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); }
        a.classList.toggle("is-current", on && !a.classList.contains("cta-btn") && !a.classList.contains("drawer-label"));
      });
    };
    var route = function () {
      var id = decodeURIComponent(location.hash.slice(1)) || "home";
      var target = document.getElementById(id);
      var page = target && target.closest("[data-page]");
      if (!page && target) { target.focus(); return; }   // e.g. the skip link's #main
      if (!page) { page = document.getElementById("home"); target = page; }
      var changed = page.hidden;
      pages.forEach(function (p) { p.hidden = p !== page; });
      if (changed) stopCarousel();
      document.title = titles[page.id];
      markCurrent(page.id);
      if (target === page) { window.scrollTo(0, 0); if (changed) { var h = $("h1", page); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } } }
      else { target.scrollIntoView({ behavior: reduce || changed ? "auto" : "smooth" }); target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
    };
    window.addEventListener("hashchange", route);
    route();
  }


})();
