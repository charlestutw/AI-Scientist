// ================= core: helpers, background, HUD, transitions, subtitles =================
function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hr(a, b) { return rng(a * 7919 + b * 104729 + 13)(); }        // stateless hash-random
const SVGNS = "http://www.w3.org/2000/svg";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const tl = gsap.timeline({ paused: true });
const IR = { immediateRender: false };
const S = (n) => SHOTS[n - 1].t, D = (n) => SHOTS[n - 1].d, E = (n) => SHOTS[n - 1].t + SHOTS[n - 1].d;
const A = (n) => ACTS[n - 1].t, AE = (n) => ACTS[n - 1].t + ACTS[n - 1].d;
const F1 = 1 / FPS;

function el(tag, attrs = {}, parent = null, html = "") {
  const svg = ["svg", "g", "path", "line", "circle", "ellipse", "rect", "polyline", "text"].includes(tag);
  const n = svg ? document.createElementNS(SVGNS, tag) : document.createElement(tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (html) n.innerHTML = html;
  if (parent) parent.appendChild(n);
  return n;
}

// ---- reveal / hide ----
const RESET = { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotation: 0, rotationX: 0, rotationY: 0, xPercent: 0, yPercent: 0, filter: "blur(0px)" };
function show(t, sel, from = {}, d = 0.6, ease = "expo.out", to = {}) {
  const tv = { opacity: 1 };
  for (const k in from) if (k in RESET) tv[k] = RESET[k];
  tl.fromTo(sel, { opacity: 0, ...from }, { ...tv, ...to, duration: d, ease, ...IR }, t);
}
function hide(t, sel, d = 0.35, to = {}) { tl.to(sel, { opacity: 0, duration: d, ease: "power2.in", ...to }, t); }
function drawLine(t, sel, d = 0.6, ease = "expo.out", from = 1) {
  tl.fromTo(sel, { attr: { "stroke-dashoffset": from }, opacity: 1 }, { attr: { "stroke-dashoffset": 0 }, opacity: 1, duration: d, ease, ...IR }, t);
}
function decodeText(node, final, t0, d = 0.7, glyphs = "#$%&*+0123456789") {
  const o = { p: 0 }, chars = [...final];
  node.textContent = "";
  tl.fromTo(o, { p: 0 }, { p: 1, duration: d, ease: "none", ...IR, onUpdate: () => {
    const fr = Math.floor(o.p * d * FPS);
    node.textContent = chars.map((c, i) => {
      const lock = (i + 1) / (chars.length + 1);
      if (o.p >= lock || c === " ") return c;
      return o.p * 1.6 > lock ? glyphs[Math.floor(hr(i + 3, fr + 11) * glyphs.length)] : "";
    }).join("");
  } }, t0);
}
function countTo(node, from, to, t0, d, fmt = (v) => String(Math.round(v)), ease = "power2.out") {
  const o = { v: from }; node.textContent = fmt(from);
  tl.fromTo(o, { v: from }, { v: to, duration: d, ease, ...IR, onUpdate: () => { node.textContent = fmt(o.v); } }, t0);
}
function shake(target, t0, d, amp, seed) {
  const n = Math.max(2, Math.round(d * FPS)), kf = [];
  for (let i = 0; i < n; i++) { const k = 1 - i / n; kf.push({ x: (hr(seed, i) * 2 - 1) * amp * k, y: (hr(seed + 1, i) * 2 - 1) * amp * k, duration: F1, ease: "none" }); }
  kf.push({ x: 0, y: 0, duration: F1, ease: "none" });
  tl.to(target, { keyframes: kf }, t0);
}
function flash(t0, amt = 0.5, d = 0.25) {
  const f = el("div", { class: "full", style: "background:radial-gradient(ellipse at 50% 45%, #fffdf7, rgba(255,250,240,.6) 60%, rgba(244,239,230,0));opacity:0" }, $("#impacts"));
  tl.fromTo(f, { opacity: 0 }, { keyframes: [{ opacity: amt, duration: F1 }, { opacity: 0, duration: d }], ...IR }, t0);
}
function inkOf(str) {
  str = String(str);
  if (str.includes("200,68,47")) return "#c8442f";
  if (str.includes("79,138,91")) return "#4f8a5b";
  if (str.includes("168,116,45")) return "#a8742d";
  return "#2b4c7e";
}
function shock(parent, x, y, t0, color = "", glow = "rgba(200,68,47,.8)", size = 9) {
  const c = inkOf(glow);
  [0, 1].forEach((k) => {
    const r = el("div", { class: "abs", style: `left:${x - 50}px;top:${y - 50}px;width:100px;height:100px;border-radius:50%;border:${k ? 1 : 2.5}px solid ${c};opacity:0` }, parent);
    tl.fromTo(r, { scale: 0.3, opacity: 0 }, { keyframes: [{ scale: 0.4, opacity: 0.9, duration: F1 }, { scale: size * (k ? 0.7 : 1), opacity: 0, duration: 1.1, ease: "expo.out" }], ...IR }, t0 + k * 0.12);
  });
}
function flare(parent, y, t0, core = "#fff", tint = "rgba(255,180,220,.9)", glow = "rgba(255,92,138,.6)") {
  const c = inkOf(glow);
  const f = el("div", { class: "abs", style: `left:0;top:${y - 1.5}px;width:1920px;height:3px;opacity:0;transform-origin:960px 2px;background:linear-gradient(90deg,transparent,${c} 30%,${c} 70%,transparent)` }, parent);
  tl.fromTo(f, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.18, ease: "expo.out", ...IR }, t0);
  tl.to(f, { opacity: 0, duration: 0.6 }, t0 + 0.25);
}
// The impact frame: 2 negative frames, then the giant word holds long enough to read, then decays.
function impact(t0, text, color = "#c8442f", hold = 1.1, size = 620, top = 110) {
  const host = $("#impacts");
  const back = el("div", { class: "impact abs", style: `color:#f4efe6;font-size:${size}px;top:${top}px` }, host, text);
  const w = el("div", { class: "impact abs", style: `color:${color};font-size:${size}px;top:${top}px` }, host, text);
  tl.set("#neg", { opacity: 1 }, t0);
  tl.set(back, { opacity: 1 }, t0);
  tl.set(["#neg", back], { opacity: 0 }, t0 + 3 * F1);
  tl.fromTo(w, { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1.0, duration: 0.14, ease: "power4.out", ...IR }, t0 + 3 * F1);
  tl.to(w, { scale: 0.97, duration: hold, ease: "none" }, t0 + 0.2);
  shake(w, t0 + 3 * F1, 0.35, 12, 501);
  for (let i = 0; i < 38; i++) {
    const a = hr(600, i) * Math.PI * 2, r0 = 260 + hr(601, i) * 260, sz = 6 + hr(602, i) * 26;
    const d = el("div", { class: "abs", style: `left:${960 + Math.cos(a) * r0 * 1.5 - sz / 2}px;top:${top + size / 2 + Math.sin(a) * r0 * 0.75 - sz / 2}px;width:${sz}px;height:${sz * (0.7 + hr(603, i) * 0.6)}px;border-radius:50%;background:${i % 4 ? "#1e1b18" : color};opacity:0` }, host);
    tl.fromTo(d, { opacity: 0, scale: 0.2, x: -Math.cos(a) * 80, y: -Math.sin(a) * 40 }, { opacity: 0.9, scale: 1, x: 0, y: 0, duration: 0.18, ease: "expo.out", ...IR }, t0 + 3 * F1);
    tl.to(d, { opacity: 0, duration: 0.4 }, t0 + 0.2 + hold);
  }
  tl.to(w, { opacity: 0, scale: 0.94, filter: "blur(10px)", duration: 0.35, ease: "power2.in" }, t0 + 0.2 + hold);
}
function hudColor(t, c, d = 0.2) { tl.to(":root", { "--hud": c, duration: d }, t); }

// ---- master clock: per-act draw functions are pure functions of time ----
const DRAWS = [];
function onClock(fn) { DRAWS.push(fn); }
const clock = { t: 0 };
tl.to(clock, { t: FILM, duration: FILM, ease: "none", onUpdate: () => DRAWS.forEach((f) => f(clock.t)) }, 0);

// ---- background ----
(function background() {
  const r = rng(11), g = $("#stars");
  for (let i = 0; i < 260; i++) {
    const x = r() * 1920, y = r() * 1080, a = r() * Math.PI * 2, L = 10 + r() * 46, c = (r() - 0.5) * 20;
    el("path", { d: `M${x.toFixed(1)} ${y.toFixed(1)} q${(Math.cos(a) * L / 2 + c).toFixed(1)} ${(Math.sin(a) * L / 2 - c).toFixed(1)} ${(Math.cos(a) * L).toFixed(1)} ${(Math.sin(a) * L).toFixed(1)}`,
      fill: "none", stroke: i % 9 ? "#c9bca5" : "#b9a98c", "stroke-width": (0.5 + r() * 0.9).toFixed(2), opacity: (0.25 + r() * 0.45).toFixed(2) }, g);
  }
  for (let i = 0; i < 90; i++) el("circle", { cx: (r() * 1920).toFixed(1), cy: (r() * 1080).toFixed(1), r: (0.4 + r() * 1.1).toFixed(2), fill: "#a8987c", opacity: (0.2 + r() * 0.4).toFixed(2) }, g);
  const s = $("#streaks"), r2 = rng(5);
  for (let i = 0; i < 160; i++) {
    const a = r2() * Math.PI * 2, d0 = 80 + r2() * 700, len = 120 + r2() * 420;
    el("line", { x1: 960 + Math.cos(a) * d0, y1: 430 + Math.sin(a) * d0, x2: 960 + Math.cos(a) * (d0 + len), y2: 430 + Math.sin(a) * (d0 + len),
      stroke: i % 4 ? "#cfeeff" : (i % 8 ? "#7fe8ff" : "#9b8cff"), "stroke-width": (0.6 + r2() * 1.6).toFixed(2), "stroke-opacity": (0.25 + r2() * 0.6).toFixed(2) }, s);
  }
  tl.to("#stars", { x: -40, duration: FILM, ease: "none" }, 0);
  tl.to("#nebula", { x: 60, y: -30, duration: FILM, ease: "none" }, 0);
})();

// ---- HUD ----
(function hud() {
  const prog = $("#prog");
  ACTS.slice(1).forEach((a) => el("div", { class: "tick", style: `left:${(a.t / FILM) * 1776}px` }, prog));
  tl.fromTo("#hud", { opacity: 0 }, { opacity: 1, duration: 0.6, ...IR }, 0.4);
  tl.fromTo("#progfill", { scaleX: 0 }, { scaleX: 1, duration: FILM, ease: "none", ...IR }, 0);
  tl.fromTo("#proghead", { x: 0 }, { x: 1772, duration: FILM, ease: "none", ...IR }, 0);
  tl.fromTo("#seal", { scale: 1.6, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: "power4.in", ...IR }, 0.8);
  ACTS.forEach((a) => {
    show(a.t + 0.3, `#actlbl-${a.n} .actno`, { y: -24, filter: "blur(8px)" }, 0.9, "power2.out");
    tl.fromTo(`#actlbl-${a.n} .actrule`, { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.6, ease: "power2.inOut", ...IR }, a.t + 0.6);
    show(a.t + 0.75, `#actlbl-${a.n} .actname`, { y: -30, filter: "blur(8px)" }, 1.0, "power2.out");
  });
})();

// ---- transitions ----
function warp(tB, reverse = false) { return reverse ? shoji(tB) : inkCurtain(tB); }
function inkCurtain(tB) {
  const c = el("div", { class: "abs", style: "left:-2500px;top:0;width:2300px;height:1080px;background:#f2ece1" }, $("#impacts"));
  const edge = (side) => el("div", { class: "abs", style: `${side}:-70px;top:-40px;width:140px;height:1160px;background:#1e1b18;filter:url(#inkedge);border-radius:40% 60% 50% 50%` }, c);
  edge("right"); edge("left");
  tl.fromTo(c, { x: 0 }, { keyframes: [{ x: 2500, duration: 0.55, ease: "power3.in" }, { x: 4900, duration: 0.7, ease: "power3.out" }], ...IR }, tB - 0.55);
}
function shoji(tB) {
  const lattice = "repeating-linear-gradient(90deg, transparent 0 156px, #7a5a38 156px 162px), repeating-linear-gradient(0deg, transparent 0 176px, #7a5a38 176px 182px), #f7f2e8";
  const L = el("div", { class: "abs", style: `left:-960px;top:0;width:960px;height:1080px;background:${lattice};border-right:14px solid #6b4c2e` }, $("#impacts"));
  const R = el("div", { class: "abs", style: `left:1920px;top:0;width:960px;height:1080px;background:${lattice};border-left:14px solid #6b4c2e` }, $("#impacts"));
  tl.fromTo(L, { x: 0 }, { keyframes: [{ x: 960, duration: 0.5, ease: "power2.inOut" }, { x: 960, duration: 0.18 }, { x: 0, duration: 0.6, ease: "power2.inOut" }], ...IR }, tB - 0.6);
  tl.fromTo(R, { x: 0 }, { keyframes: [{ x: -960, duration: 0.5, ease: "power2.inOut" }, { x: -960, duration: 0.18 }, { x: 0, duration: 0.6, ease: "power2.inOut" }], ...IR }, tB - 0.6);
}
function warpOld(tB, reverse = false) {
  const s = $("#streaks").cloneNode(true); s.removeAttribute("id"); s.style.opacity = 0; $("#world").appendChild(s);
  s.style.transformOrigin = "960px 430px";
  if (!reverse) {
    tl.fromTo(s, { scale: 0.4, opacity: 0 }, { keyframes: [{ scale: 1.2, opacity: 1, duration: 0.35, ease: "power2.in" }, { scale: 2.4, opacity: 0, duration: 0.4, ease: "expo.out" }], ...IR }, tB - 0.35);
  } else {
    tl.fromTo(s, { scale: 2.4, opacity: 0 }, { keyframes: [{ scale: 1.1, opacity: 1, duration: 0.35, ease: "power2.in" }, { scale: 0.3, opacity: 0, duration: 0.4, ease: "expo.out" }], ...IR }, tB - 0.35);
  }
  flash(tB - 0.02, 0.7, 0.35);
  tl.fromTo("#stars", { scale: 1 }, { keyframes: [{ scale: reverse ? 0.8 : 1.3, duration: 0.35, ease: "power2.in" }, { scale: 1, duration: 0.5, ease: "expo.out" }], ...IR }, tB - 0.35);
}
function blinds(tB) {
  const b = $("#blinds");
  for (let i = 0; i < 12; i++) el("div", { class: "slat", style: `top:${i * 90}px;transform-origin:50% ${i % 2 ? "0%" : "100%"}` }, b);
  const slats = [...b.children];
  tl.fromTo(slats, { scaleY: 0 }, { scaleY: 1.02, duration: 0.25, ease: "power2.in", stagger: 0.018, ...IR }, tB - 0.45);
  tl.to(slats, { scaleY: 0, duration: 0.3, ease: "expo.out", stagger: 0.018 }, tB);
}
function lightDissolve(tB) {
  const f = el("div", { class: "full", style: "background:radial-gradient(ellipse at 50% 45%, #fffdf8, #f7f2e8 60%, #efe7d8);opacity:0" }, $("#impacts"));
  tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.in", ...IR }, tB - 0.6);
  tl.to(f, { opacity: 0, duration: 0.9, ease: "power2.out" }, tB);
}
function actEnter(n, from = { scale: 1.06, filter: "blur(10px)" }, d = 0.7) { show(A(n), `#act${n}`, from, d, "expo.out"); }

// ---- subtitles ----
const DECODE_GLYPHS = "■□◆◇０１２３４５６７８９";
function buildSubtitles() {
  $$(".sub .txt").forEach((txt) => {
    const walk = (node, into) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          [...n.textContent].forEach((c) => { const s = el("span", { class: "ch w" }, into); s.textContent = c; s.dataset.c = c; });
        } else {
          const e2 = n.cloneNode(false); into.appendChild(e2); walk(n, e2);
          el("span", { class: "ul" }, e2);
        }
      });
    };
    const tmp = txt.cloneNode(true); txt.innerHTML = ""; walk(tmp, txt);
  });
  $$(".sub").forEach((sub) => {
    const t0 = parseFloat(sub.dataset.start) + 0.08 + (sub.id === "sub-01" ? 0.45 : 0);
    const t1 = parseFloat(sub.dataset.start) + parseFloat(sub.dataset.duration);
    const chars = [...sub.querySelectorAll(".ch")], ems = [...sub.querySelectorAll("em")], uls = [...sub.querySelectorAll(".ul")];
    const emChars = [...sub.querySelectorAll("em .ch")];
    const meta = sub.querySelector(".meta"), txt = sub.querySelector(".txt"), kind = sub.dataset.reveal;
    tl.fromTo(meta, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "expo.out", ...IR }, t0 - 0.05);
    if (kind === "rise" || kind === "stairs" || kind === "drop") {
      const plain = kind === "rise" ? chars : chars.filter((c) => !emChars.includes(c));
      tl.fromTo(plain, { opacity: 0, y: 28, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.045, ease: "power3.out", ...IR }, t0);
      if (kind === "stairs") emChars.forEach((c, i) => tl.fromTo(c, { opacity: 0, y: 40 }, { opacity: 1, y: -i * 16, duration: 0.45, ease: "back.out(2)", ...IR }, t0 + 0.25 + i * 0.16));
      if (kind === "drop") emChars.forEach((c, i) => tl.fromTo(c, { opacity: 0, y: -160 }, { opacity: 1, y: 0, duration: 0.42, ease: "bounce.out", ...IR }, t0 + 0.3 + i * 0.3));
    } else if (kind === "decode") {
      tl.fromTo(chars, { opacity: 0, scale: 1.3, filter: "blur(16px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.05, ease: "power2.out", ...IR }, t0);
    } else if (kind === "scan") {
      tl.set(chars, { opacity: 1 }, t0);
      const wrap = el("span", { class: "scanwrap" }, txt); el("span", { class: "scanline" }, wrap);
      tl.fromTo(txt, { clipPath: "inset(-40% 100% -40% 0)" }, { clipPath: "inset(-40% 0% -40% 0)", duration: 1.0, ease: "power2.inOut", ...IR }, t0);
      tl.fromTo(wrap, { xPercent: -100, opacity: 1 }, { xPercent: 0, opacity: 1, duration: 1.0, ease: "power2.inOut", ...IR }, t0);
      tl.to(wrap, { opacity: 0, duration: 0.3 }, t0 + 1.0);
    } else if (kind === "slam") {
      tl.set(chars, { opacity: 1 }, t0);
      tl.fromTo(txt, { scale: 1.8, opacity: 0, filter: "blur(14px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.in", ...IR }, t0);
      shake(sub, t0 + 0.22, 0.2, 6, 7 + sub.id.length);
      if (ems.length) tl.fromTo(ems, { color: "#1e1b18" }, { color: "#c8442f", duration: 0.25, ...IR }, t0 + 0.22 + 2 * F1);
    }
    if (uls.length) tl.fromTo(uls, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.inOut", ...IR }, t0 + 0.5);
    if (t1 < FILM - 0.05) {
      tl.to(chars, { opacity: 0, y: "-=12", filter: "blur(8px)", duration: 0.4, stagger: 0.015, ease: "power2.in" }, t1 - 0.45);
      tl.to([meta, ...uls], { opacity: 0, duration: 0.3 }, t1 - 0.4);
    }
  });
}

function finish() {
  tl.to("#fade", { opacity: 0, duration: 0.6, ease: "power2.out" }, 0);
  tl.to("#fade", { opacity: 1, duration: 0.6, ease: "power2.in" }, FILM - 0.6);
  DRAWS.forEach((f) => f(0));
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  tl.seek(0);
}
