// ================= ACT 5 用撞的來驗證 (shots 36–49) =================
(function act5() {
  const AX = 1350, AY = 450, HIT = 1236;           // atom centre, contact x
  actEnter(5, { scale: 1.04, filter: "blur(6px)" }, 0.5);
  gsap.set(["#a5-e", "#a5-blk1", "#a5-blk2", "#a5-ue"], { xPercent: -50, yPercent: -50 });

  // ---- shot 36: 1914 (one digit after 1913) + the two names ----
  const t36 = S(36);
  show(t36 + 0.15, "#a5-year", { scale: 1.08, filter: "blur(10px)" }, 0.5);
  const ld = $("#a5-lastd"), dA = ld.children[0], dB = ld.children[1], roll = { v: 3 };
  const drawRoll = () => { const d = Math.floor(roll.v), q = roll.v - d;
    dA.textContent = String(d % 10); dB.textContent = String((d + 1) % 10);
    dA.style.transform = `translateY(${-q * 1.05}em)`; dA.style.opacity = 1 - q; dB.style.transform = `translateY(${(1 - q) * 1.05}em)`; dB.style.opacity = q; };
  drawRoll();
  tl.fromTo(roll, { v: 3 }, { v: 4, duration: 0.5, ease: "power3.out", onUpdate: drawRoll, ...IR }, t36 + 0.55);
  show(t36 + 0.7, "#a5-franck", { x: -200, rotationY: 40, transformPerspective: 900 }, 0.6);
  show(t36 + 0.7, "#a5-hertz", { x: 200, rotationY: -40, transformPerspective: 900 }, 0.6);
  show(t36 + 1.15, "#a5-x", { scale: 2.2 }, 0.35, "back.out(2)");
  flash(t36 + 1.2, 0.2, 0.15);

  // ---- shot 37: the setup, target locked ----
  const t37 = S(37);
  hide(t37, ["#a5-year", "#a5-franck", "#a5-x", "#a5-hertz"], 0.35, { y: -30 });
  show(t37 + 0.2, "#a5-exp", { x: 200 }, 0.6);
  tl.fromTo("#a5-guide", { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -400 }, duration: AE(5) - t37, ease: "none", ...IR }, t37);
  tl.fromTo("#a5-reticle", { opacity: 0, scale: 1.8, rotation: 30 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "expo.out", ...IR }, t37 + 0.6);
  tl.to("#a5-reticle", { scale: 0.92, duration: 0.15, yoyo: true, repeat: 1 }, t37 + 1.1);
  show(t37 + 0.5, "#a5-energy", { x: -20 }, 0.3);
  const segs = $("#a5-segs");
  for (let k = 0; k < 4; k++) {
    const a0 = -Math.PI / 2 + k * (Math.PI / 2) + 0.08, a1 = a0 + Math.PI / 2 - 0.16, r = 150;
    el("path", { d: `M${160 + r * Math.cos(a0)} ${160 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${160 + r * Math.cos(a1)} ${160 + r * Math.sin(a1)}`, fill: "none", stroke: "#a8742d", "stroke-width": 5, "stroke-linecap": "round", opacity: 0.12, class: "a5-seg" }, segs);
  }

  // helper: an electron run toward the atom
  const run = (t, opt) => {
    const { x0 = 430, size = 1, dim = 1, bounce = false, toX = 1750, slowmo = false, fast = false } = opt;
    tl.set("#a5-e", { x: x0, y: AY, scale: size, opacity: dim }, t);
    if (slowmo) {
      tl.to("#a5-e", { x: HIT - 90, duration: 0.3, ease: "none" }, t);
      tl.to("#a5-e", { x: HIT, duration: 0.9, ease: "none" }, t + 0.3);
      return t + 1.2;
    }
    const dT = fast ? 0.32 : 0.6;
    tl.to("#a5-e", { x: HIT, duration: dT, ease: "none" }, t);
    if (bounce) {
      tl.to("#a5-e", { x: 760, duration: 0.55, ease: "power1.out" }, t + dT);
      tl.to("#a5-e", { opacity: 0, duration: 0.2 }, t + dT + 0.45);
    } else {
      tl.to("#a5-e", { x: toX, opacity: 0.45, scale: size * 0.8, duration: 0.5, ease: "power1.out" }, t + dT);
      tl.to("#a5-e", { opacity: 0, duration: 0.15 }, t + dT + 0.45);
    }
    return t + dT;
  };
  const ripple = (t, color = "rgba(43,76,126,.9)") => shock($("#a5-hit"), HIT + 6, AY, t, "#2b4c7e", color, 2.2);

  // ---- shot 38: not enough energy — bounced ----
  const t38 = S(38);
  const h38 = run(t38 + 0.25, { size: 0.6, dim: 0.65, bounce: true });
  ripple(h38);
  const ebar = $("#a5-ebar");
  const setBar = (t, s) => { const o = { p: 0 }; tl.fromTo(o, { p: 0 }, { p: 1, duration: 0.01, ...IR, onUpdate: () => { ebar.textContent = s; } }, t); };
  setBar(t38, "▮▯▯▯");

  // ---- shot 39: enough energy — one portion taken (bullet time) ----
  const t39 = S(39);
  setBar(t39, "▮▮▮▯");
  const h39 = run(t39 + 0.15, { size: 1, slowmo: true });
  tl.to("#a5-exp", { rotationY: -28, rotationX: 6, scale: 1.12, transformPerspective: 1600, duration: 0.8, ease: "power2.inOut" }, t39 + 0.35);
  const sp = $("#a5-speed");
  for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2, r0 = 120 + hr(390, i) * 60; el("line", { x1: HIT + Math.cos(a) * r0, y1: AY + Math.sin(a) * r0, x2: HIT + Math.cos(a) * (r0 + 160 + hr(391, i) * 160), y2: AY + Math.sin(a) * (r0 + 160), stroke: "#1e1b18", "stroke-opacity": 0.4, "stroke-width": 1.4 }, sp); }
  tl.fromTo("#a5-speed", { opacity: 0, scale: 1.4, transformOrigin: `${HIT}px ${AY}px` }, { opacity: 1, scale: 1, duration: 0.4, ease: "expo.out", ...IR }, t39 + 0.45);
  hide(h39 + 0.1, "#a5-speed", 0.3);
  ripple(h39, "rgba(168,116,45,.9)");
  flash(h39, 0.35, 0.18);
  tl.set("#a5-blk1", { x: HIT, y: AY, scale: 0.4, opacity: 1 }, h39);
  tl.to("#a5-blk1", { keyframes: [{ x: HIT + 40, y: AY - 120, scale: 1, rotation: 45, duration: 0.25, ease: "power2.out" }, { x: AX - 40, y: 272, rotation: 0, duration: 0.3, ease: "power2.inOut" }] }, h39);
  tl.to("#a5-exp", { rotationY: 0, rotationX: 0, scale: 1, duration: 0.6, ease: "expo.inOut" }, h39 + 0.1);
  tl.to("#a5-e", { x: 1760, opacity: 0.4, scale: 0.8, duration: 0.5, ease: "power1.out" }, h39 + 0.05);
  tl.to("#a5-e", { opacity: 0, duration: 0.15 }, h39 + 0.5);
  tl.fromTo("#a5-atom", { scale: 1 }, { keyframes: [{ scale: 1.12, duration: 0.08 }, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" }], ...IR }, h39);
  show(h39 + 0.35, "#a5-x1", { y: 10 }, 0.3);
  show(h39 + 0.15, "#a5-took", { y: 12 }, 0.35);

  // ---- shot 40: more energy — still only that one portion ----
  const t40 = S(40);
  setBar(t40, "▮▮▮▮");
  hide(t40, "#a5-took", 0.25);
  const g40 = []; for (let i = 0; i < 6; i++) g40.push(el("div", { class: "abs ghost", style: "opacity:0" }, $("#a5-hit")));
  gsap.set(g40, { xPercent: -50, yPercent: -50 });
  const h40 = run(t40 + 0.15, { size: 1.6, fast: true });
  g40.forEach((g, k) => { tl.set(g, { x: 430, y: AY, opacity: 0.6 - k * 0.08 }, t40 + 0.15); tl.to(g, { x: HIT - (k + 1) * 26, duration: 0.32, ease: "none" }, t40 + 0.15); tl.to(g, { opacity: 0, duration: 0.15 }, h40); });
  ripple(h40, "rgba(168,116,45,.9)");
  shake("#stage", h40, 0.2, 7, 40);
  tl.set("#a5-blk2", { x: HIT, y: AY, scale: 0.4, opacity: 1 }, h40);
  tl.to("#a5-blk2", { keyframes: [{ x: HIT + 60, y: AY - 140, scale: 1, rotation: -45, duration: 0.25, ease: "power2.out" }, { x: AX + 70, y: 272, rotation: 0, duration: 0.3, ease: "power2.inOut" }] }, h40);
  tl.to("#a5-blk1", { x: AX - 70, duration: 0.3, ease: "power2.inOut" }, h40 + 0.25);
  tl.to("#a5-x1", { opacity: 0, duration: 0.2 }, h40);
  show(h40 + 0.55, "#a5-eq", { scaleX: 0 }, 0.4);
  tl.to(["#a5-blk1", "#a5-blk2"], { keyframes: [{ scale: 1.25, duration: 0.1 }, { scale: 1, duration: 0.3 }] }, h40 + 0.55);
  show(h40 + 0.3, "#a5-same", { y: 12 }, 0.35);

  // ---- shot 41: analogy — a machine that only accepts 10 ----
  const t41 = S(41);
  hide(t41, ["#a5-same", "#a5-eq", "#a5-blk1", "#a5-blk2", "#a5-reticle", "#a5-energy"], 0.25);
  tl.to("#a5-exp", { scale: 0.3, x: -560, y: 60, opacity: 0.8, duration: 0.6, ease: "expo.inOut" }, t41);
  show(t41 + 0.3, "#a5-frame", {}, 0.3);
  show(t41, "#a5-tint", {}, 0.6);
  hudColor(t41, "#a8742d", 0.4);
  tl.fromTo("#a5-vend", { opacity: 0, y: 140 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", ...IR }, t41 + 0.2);
  tl.fromTo("#a5-d10", { opacity: 0 }, { keyframes: [{ opacity: 0.6, duration: 0.04 }, { opacity: 0, duration: 0.05 }, { opacity: 0.8, duration: 0.04 }, { opacity: 0.1, duration: 0.05 }, { opacity: 1, duration: 0.06 }], ...IR }, t41 + 0.75);
  tl.to("#a5-only", { opacity: 0.2, duration: 0.25, yoyo: true, repeat: 7 }, t41 + 1.0);

  // ---- shot 42: put in 50, it only takes 10 ----
  const t42 = S(42);
  tl.fromTo("#a5-coin50", { opacity: 0, x: 200, y: -80 }, { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "expo.out", ...IR }, t42 + 0.1);
  tl.to("#a5-coin50", { x: -195, y: 10, rotationY: 540, scaleX: 0.3, duration: 0.5, ease: "power2.in" }, t42 + 0.55);
  tl.to("#a5-coin50", { opacity: 0, duration: 0.05 }, t42 + 1.05);
  tl.to("#a5-d10", { opacity: 0, duration: 0.05 }, t42 + 1.05);
  tl.fromTo("#a5-d50", { opacity: 0 }, { opacity: 1, duration: 0.05, ...IR }, t42 + 1.05);
  tl.to("#a5-d50", { opacity: 0, duration: 0.05 }, t42 + 1.45);
  tl.fromTo("#a5-d10", { opacity: 0 }, { opacity: 1, duration: 0.05, ...IR }, t42 + 1.45);
  tl.to("#a5-d10", { opacity: 0, duration: 0.05 }, t42 + 1.85);
  tl.fromTo("#a5-dok", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)", ...IR }, t42 + 1.85);
  tl.fromTo("#a5-coin40", { opacity: 0, y: -40 }, { keyframes: [{ opacity: 1, y: 40, duration: 0.25, ease: "power2.in" }, { y: 10, duration: 0.15, ease: "power2.out" }, { y: 40, duration: 0.15, ease: "power2.in" }, { y: 30, duration: 0.08 }, { y: 40, duration: 0.08 }], ...IR }, t42 + 1.5);

  // ---- shot 43: atoms take energy one portion at a time ----
  const t43 = S(43);
  hide(t43, ["#a5-vend", "#a5-coin40", "#a5-tint", "#a5-exp"], 0.35);
  hudColor(t43, "#2b4c7e", 0.4);
  show(t43 + 0.15, "#a5-stack", { scale: 0.9 }, 0.5);
  const r4 = $("#a5-ring4"), qb = $("#a5-qblocks");
  for (let k = 0; k < 4; k++) {
    const a0 = -Math.PI / 2 + k * (Math.PI / 2) + 0.08, a1 = a0 + Math.PI / 2 - 0.16, r = 160;
    const s = el("path", { d: `M${180 + r * Math.cos(a0)} ${180 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${180 + r * Math.cos(a1)} ${180 + r * Math.sin(a1)}`, fill: "none", stroke: "#a8742d", "stroke-width": 7, "stroke-linecap": "round", opacity: 0.12, style: "filter:)" }, r4);
    const b = el("div", { class: "abs", style: "left:938px;top:0;width:44px;height:44px;border-radius:6px;background:linear-gradient(135deg,#e9c98f,#c9974c);opacity:0" }, qb);
    const t = t43 + 0.08 + 0.3 + k * 0.3;
    tl.fromTo(b, { opacity: 1, y: 120 }, { y: 410, duration: 0.28, ease: "power2.in", ...IR }, t - 0.2);
    tl.to(b, { opacity: 0, scale: 0.4, duration: 0.1 }, t + 0.08);
    tl.to(s, { opacity: 1, duration: 0.1 }, t + 0.08);
  }

  // ---- shot 44: the stairs are real (VERIFIED) ----
  const t44 = S(44), land = t44 + 0.75;
  hide(t44, "#a5-stack", 0.3);
  tl.fromTo("#a5-holo", { opacity: 0 }, { keyframes: Array.from({ length: 6 }, (_, k) => ({ opacity: 0.2 + hr(440, k) * 0.35, duration: 0.06 })), ...IR }, t44 + 0.1);
  tl.to("#a5-holo", { opacity: 1, duration: 0.05 }, t44 + 0.5);
  flash(t44 + 0.5, 0.5, 0.2);
  shock($("#a5-uprip"), 960, 500, t44 + 0.5, "#4f8a5b", "rgba(79,138,91,.8)", 9);
  tl.set("#a5-vstampwrap", { opacity: 1 }, t44 + 0.53);
  tl.fromTo("#a5-vstamp", { scale: 2.4, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: 0.22, ease: "power4.in", ...IR }, t44 + 0.53);
  tl.set("#neg", { opacity: 1 }, land);
  tl.set("#neg", { opacity: 0 }, land + 2 * F1);
  shake("#stage", land, 0.3, 10, 44);
  hudColor(land, "#4f8a5b", 0.05);
  hudColor(E(44) - 0.2, "#2b4c7e", 0.2);

  // ---- shot 45: side note (slice glitch) ----
  const t45 = S(45);
  hide(t45, ["#a5-holo", "#a5-vstampwrap"], 0.1);
  for (let i = 0; i < 7; i++) {
    const b = el("div", { class: "abs", style: `left:0;top:${hr(450, i) * 1000}px;width:1920px;height:${20 + hr(451, i) * 70}px;background:${i % 2 ? "rgba(43,76,126,.22)" : "rgba(200,68,47,.18)"};opacity:0` }, $("#a5-glitchbars"));
    tl.fromTo(b, { opacity: 0, x: 0 }, { keyframes: [{ opacity: 1, x: (hr(452, i) - 0.5) * 120, duration: F1 * 2 }, { x: (hr(453, i) - 0.5) * 80, duration: F1 * 2 }, { opacity: 0, x: 0, duration: F1 * 2 }], ...IR }, t45 + i * 0.02);
  }
  shake("#stage", t45, 0.25, 16, 45);
  tl.set("#a5-note", { opacity: 1 }, t45 + 0.2);
  decodeText($("#a5-note"), "SIDE NOTE · 插曲", t45 + 0.2, 0.7, "#/_0123456789");

  // ---- shot 46: they thought electrons were knocked out ----
  const t46 = S(46);
  hide(t46, "#a5-note", 0.25);
  show(t46 + 0.1, "#a5-wrong", { scale: 0.95 }, 0.4);
  tl.to("#a5-wrong", { filter: "saturate(0) brightness(.9)", duration: 0.4 }, t46 + 0.5);
  tl.to("#a5-kick", { keyframes: [{ x: 260, y: -200, duration: 0.5, ease: "power2.out" }, { x: 760, y: -560, opacity: 0, duration: 0.4, ease: "power1.in" }] }, t46 + 0.35);
  drawLine(t46 + 0.9, ".a5-x", 0.22, "power3.in");
  tl.to(".a5-x", { attr: { "stroke-dashoffset": 0 }, duration: 0.01 }, t46 + 1.15);
  shake("#stage", t46 + 1.12, 0.2, 8, 46);
  drawLine(t46 + 1.2, "#a5-hstrike", 0.25, "power2.out");

  // ---- shot 47: that would need much more energy ----
  const t47 = S(47);
  hide(t47, "#a5-wrong", 0.3);
  tl.set("#a5-bars", { opacity: 1 }, t47 + 0.1);
  tl.fromTo("#a5-bar2", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "expo.out", ...IR }, t47 + 0.15);
  tl.fromTo("#a5-bar1", { scaleY: 0 }, { keyframes: [{ scaleY: 1.04, duration: 0.9, ease: "expo.out" }, { scaleY: 1, duration: 0.3, ease: "power2.inOut" }], ...IR }, t47 + 0.15);
  tl.fromTo("#a5-gap", { attr: { "stroke-dashoffset": 1 }, opacity: 0 }, { attr: { "stroke-dashoffset": 0 }, opacity: 1, duration: 0.5, ...IR }, t47 + 0.9);
  show(t47 + 1.1, "#a5-much", { y: -30 }, 0.4);

  // ---- shot 48: what they saw was "one step up" ----
  const t48 = S(48);
  hide(t48, "#a5-bars", 0.3);
  show(t48 + 0.15, "#a5-up", {}, 0.4);
  tl.set("#a5-ue", { x: 850, y: 568 }, t48);
  tl.to("#a5-ue", { x: 1070, duration: 0.5, ease: "none" }, t48 + 0.55);
  tl.to("#a5-ue", { keyframes: [{ y: 400, duration: 0.25, ease: "power2.out" }, { y: 463, duration: 0.25, ease: "power2.in" }] }, t48 + 0.55);
  shock($("#a5-uprip"), 1070, 478, t48 + 1.05, "#4f8a5b", "rgba(79,138,91,.8)", 2.5);
  show(t48 + 1.05, "#a5-uplbl", { x: 20 }, 0.35);

  // ---- shot 49: 1925, Nobel Prize ----
  const t49 = S(49), rays = $("#a5-rays");
  hide(t49, "#a5-up", 0.3);
  tl.set("#a5-medal", { opacity: 1 }, t49 + 0.1);
  for (let i = 0; i < 3; i++) el("circle", { cx: 960, cy: 420, r: 262 + i * 30, fill: "none", stroke: "#a8742d", "stroke-width": 1.5 - i * 0.3, "stroke-dasharray": i === 1 ? "2 10" : "none", opacity: 0, class: "a5-ray" }, rays);
  drawLine(t49 + 0.15, "#a5-ring1", 0.8, "power2.inOut");
  tl.fromTo("#a5-ring2", { rotation: 0, svgOrigin: "960 420", opacity: 0 }, { rotation: -90, opacity: 1, duration: AE(5) - t49, ease: "none", ...IR }, t49 + 0.2);
  tl.to(".a5-ray", { opacity: 0.8, duration: 0.6, stagger: 0.25 }, t49 + 0.5);
  tl.fromTo("#a5-rays", { rotation: 0, svgOrigin: "960 420" }, { rotation: 20, duration: AE(5) - t49, ease: "none", ...IR }, t49);
  show(t49 + 0.3, "#a5-medalyear", { scale: 0.8, filter: "blur(8px)" }, 0.6);
  decodeText($("#a5-medalyear"), "1925", t49 + 0.3, 0.7, "0123456789");
  show(t49 + 0.7, "#a5-nobel", { y: 16 }, 0.5);
  tl.to("#a5-medal", { scale: 1.08, transformOrigin: "960px 420px", duration: AE(5) - t49, ease: "none" }, t49);

  // exit into act 6: slow light dissolve
  lightDissolve(A(6));
})();
