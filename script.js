/* Kian Esmaeili - Research site interactions. Vanilla JS, no dependencies. */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    const closeNav = () => {
      navLinks.setAttribute("data-open", "false");
      navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.getAttribute("data-open") === "true";
      navLinks.setAttribute("data-open", String(!isOpen));
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  }

  /* ---------------- Theme toggle (light / dark) ---------------- */
  const themeToggle = document.getElementById("themeToggle");
  const iconSun = document.getElementById("iconSun");
  const iconMoon = document.getElementById("iconMoon");
  const root = document.documentElement;
  const STORAGE_KEY = "kian-theme";

  function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (iconSun) iconSun.style.display = "none";
      if (iconMoon) iconMoon.style.display = "block";
      themeToggle?.setAttribute("aria-pressed", "true");
    } else {
      root.setAttribute("data-theme", "light");
      if (iconSun) iconSun.style.display = "block";
      if (iconMoon) iconMoon.style.display = "none";
      themeToggle?.setAttribute("aria-pressed", "false");
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  applyTheme(stored || (systemPrefersDark() ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------------- Scroll-spy active nav link ---------------- */
  const sections = document.querySelectorAll("main section[id], header[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const link = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    revealEls.forEach((el) => reveal.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- Living Papers demo widget ---------------- */
  const demoEventBtn = document.getElementById("demoEventBtn");
  const demoBehaviorBtn = document.getElementById("demoBehaviorBtn");
  const demoStat = document.getElementById("demoStat");
  const demoStatLabel = document.getElementById("demoStatLabel");
  const demoBar = document.getElementById("demoBar");

  const DEMO_STATES = {
    event: {
      value: "≈ 99%",
      width: "99%",
      label: "This is what most Sysmon-based ransomware classifiers report when scored one event at a time.",
    },
    behavior: {
      value: "75–82%",
      width: "78%",
      label: "This is what the same models achieve once behavior, not single events, is evaluated over time.",
    },
  };

  function setDemoState(state) {
    const data = DEMO_STATES[state];
    if (!data || !demoStat) return;
    demoStat.textContent = data.value;
    demoStatLabel.textContent = data.label;
    demoBar.style.width = data.width;
    demoEventBtn.setAttribute("aria-pressed", String(state === "event"));
    demoBehaviorBtn.setAttribute("aria-pressed", String(state === "behavior"));
  }

  demoEventBtn?.addEventListener("click", () => setDemoState("event"));
  demoBehaviorBtn?.addEventListener("click", () => setDemoState("behavior"));
})();
