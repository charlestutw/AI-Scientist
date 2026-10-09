// ================= ACT 3 玻爾的三條規矩 (shots 20–31) =================
(function act3() {
  const ST = [[630, 673], [850, 568], [1070, 463], [1290, 358]];   // electron resting point on each step
  actEnter(3, { scale: 1.5, filter: "blur(14px)" }, 0.8);
  const chip = (n, t) => {
    [1, 2, 3].forEach((k) => tl.to(`#a3-c${k}`, { opacity: k === n ? 1 : 0.35, borderColor: k === n ? "#6cffc8" : "rgba(127,232,255,.5)", color: k === n ? "#6cffc8" : "#7fe8ff", duration: 0.3 }, t));
    tl.fromTo(`#a3-c${n}`, { scale: 1.25 }, { scale: 1, duration: 0.4, ease: "back.out(2)", ...IR }, t);
  };

  // ---- shot 20: 1913, digits lock like a mechanism ----
  const t20 = S(20);
  tl.fromTo("#a3-pillar", { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.6, ease: "expo.out", ...IR }, t20 + 0.1);
  tl.set("#a3-year", { opacity: 1 }, t20 + 0.15);
  $$(".a3-d").forEach((d, i) => {
    tl.fromTo(d, { y: i % 2 ? 260 : -260, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "expo.out", ...IR }, t20 + 0.15 + i * 0.08);
    flash(t20 + 0.65 + i * 0.08, 0.08, 0.1);
  });
  show(t20 + 0.7, "#a3-bohr", { y: 30 }, 0.5);
  decodeText($("#a3-bname"), "N. BOHR", t20 + 0.75, 0.6);

  // ---- shot 21: three protocol cards fan in ----
  const t21 = S(21);
  hide(t21, ["#a3-year", "#a3-bohr", "#a3-pillar"], 0.35, { y: -40 });
  tl.set("#a3-protos", { opacity: 1 }, t21 + 0.1);
  $$(".a3-proto").forEach((c, i) => {
    tl.fromTo(c, { rotationY: 90, opacity: 0, transformPerspective: 1400 }, { rotationY: (1 - i) * 14, opacity: 1, duration: 0.6, ease: "expo.out", ...IR }, t21 + 0.15 + i * 0.15);
  });
  tl.fromTo("#a3-sweep", { opacity: 0, x: 0 }, { keyframes: [{ opacity: 1, duration: 0.05 }, { x: 1000, duration: 0.5, ease: "power2.inOut" }, { opacity: 0, duration: 0.1 }], ...IR }, t21 + 0.9);
  tl.to("#a3-protos", { scale: 1.06, duration: D(21), ease: "none" }, t21);

  // ---- shot 22: rule 1 — fixed orbits ----
  const t22 = S(22);
  tl.to(".a3-proto", { scale: 0.2, x: (i) => -380 - i * 380 + 40, y: -260, opacity: 0, duration: 0.5, ease: "expo.inOut" }, t22);
  show(t22 + 0.35, "#a3-chips", { x: -20 }, 0.4);
  chip(1, t22 + 0.45);
  show(t22 + 0.2, "#a3-nucleus", { scale: 0.3 }, 0.5, "back.out(2)");
  tl.set("#a3-rings", { opacity: 1 }, t22 + 0.25);
  drawLine(t22 + 0.3, ".a3-ring", 0.6);
  tl.to(".a3-ring", { attr: { "stroke-dashoffset": 0 }, duration: 0.01 }, t22 + 0.95);
  show(t22 + 0.7, "#a3-e", { scale: 2 }, 0.35, "back.out(3)");
  const eOrbit = (t) => { const a = (t - t22) * 2.2 + 1.1; return [960 + 200 * Math.cos(a), 430 + 84 * Math.sin(a)]; };
  const E_ORBIT_END = S(24) + 0.15;
  onClock((t) => {
    if (t < t22 || t > E_ORBIT_END) return;
    const [x, y] = eOrbit(t);
    $("#a3-e").style.left = "0px"; gsap.set("#a3-e", { x, y, xPercent: -50, yPercent: -50 });
  });
  shock($("#a3-ripple"), 960 + 200 * Math.cos(1.1 + 0.7 * 2.2), 430 + 84 * Math.sin(1.1 + 0.7 * 2.2), t22 + 0.75, "#e9fbff", "rgba(127,232,255,.8)", 2);

  // ---- shot 23: no energy leaks ----
  const t23 = S(23);
  show(t23 + 0.1, "#a3-meter", { x: 40 }, 0.5);
  tl.to("#a3-mfill", { opacity: 0.6, duration: 0.6, yoyo: true, repeat: 2, ease: "sine.inOut" }, t23 + 0.5);

  // ---- shot 24: rule 2 — orbits are levels: rings become stairs (3D orbit) ----
  const t24 = S(24), [r1, r2, r3] = $$(".a3-ring");
  chip(2, t24 + 0.05);
  hide(t24, "#a3-meter", 0.3);
  tl.to("#a3-scene", { keyframes: [{ rotationY: -34, rotationX: 8, duration: 0.6, ease: "power2.inOut" }, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power2.inOut" }], transformPerspective: 1600 }, t24 + 0.05);
  [[r1, 1, 585], [r2, 2, 480], [r3, 3, 375]].forEach(([r, k, y]) => {
    tl.to(r, { attr: { cx: (ST[k][0]), cy: y, rx: 110, ry: 0 }, duration: 0.7, ease: "expo.inOut" }, t24 + 0.15);
  });
  hide(t24 + 0.2, "#a3-nucleus", 0.4, { scale: 0.2 });
  const [ox, oy] = eOrbit(t24 + 0.2);
  tl.fromTo("#a3-e", { x: ox, y: oy, xPercent: -50, yPercent: -50 }, { x: ST[1][0], y: ST[1][1], xPercent: -50, yPercent: -50, duration: 0.6, ease: "expo.inOut", ...IR }, t24 + 0.2);
  drawLine(t24 + 0.6, ["#a3-stairs", "#a3-stairs-glow"], 0.7, "power2.out");
  hide(t24 + 1.0, "#a3-rings", 0.3);

  // ---- shot 25: no half step ----
  const t25 = S(25);
  tl.set("#a3-half", { opacity: 1 }, t25 + 0.05);
  tl.fromTo("#a3-halfline", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, t25 + 0.05);
  show(t25 + 0.15, "#a3-halflbl", { y: 10 }, 0.3);
  drawLine(t25 + 0.45, ".a3-x", 0.18, "power2.in");
  tl.to(".a3-x", { attr: { "stroke-dashoffset": 0 }, duration: 0.01 }, t25 + 0.66);
  tl.to(".a3-hh", { y: (i) => (i ? 26 : -26), x: (i) => (i ? 10 : -10), opacity: 0, duration: 0.5, ease: "expo.out" }, t25 + 0.7);
  for (let i = 0; i < 10; i++) {
    const p = el("div", { class: "abs pt", style: `left:${645 + i * 10}px;top:${635}px;opacity:0;background:#c7bfff` }, $("#a3-dust"));
    tl.fromTo(p, { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: (hr(90, i) - 0.5) * 120, y: 40 + hr(91, i) * 80, duration: 0.7, ease: "power2.out", ...IR }, t25 + 0.68);
  }
  tl.to("#a3-halfline", { opacity: 0, duration: 0.05 }, t25 + 0.68);
  shake("#a3-half", t25 + 0.66, 0.2, 6, 25);

  // ---- shot 26: you can't stand on half a step ----
  const t26 = S(26);
  hide(t26, "#a3-half", 0.3);
  tl.to("#a3-e", { x: ST[2][0], y: ST[2][1], duration: 0.3, ease: "power2.inOut" }, t26);
  show(t26 + 0.2, "#a3-step", { x: 30 }, 0.35);
  decodeText($("#a3-step"), "STEP 3 → STEP 4", t26 + 0.2, 0.5);
  const jump = (t, from, to, h = 120, d = 0.5) => {
    tl.to("#a3-e", { x: ST[to][0], duration: d, ease: "none" }, t);
    tl.to("#a3-e", { keyframes: [{ y: Math.min(ST[from][1], ST[to][1]) - h, duration: d / 2, ease: "power2.out" }, { y: ST[to][1], duration: d / 2, ease: "power2.in" }] }, t);
    tl.to("#a3-e", { keyframes: [{ scaleX: 1.5, scaleY: 0.6, duration: 0.06 }, { scaleX: 1, scaleY: 1, duration: 0.25, ease: "elastic.out(1,0.4)" }] }, t + d);
    shock($("#a3-ripple"), ST[to][0], ST[to][1] + 14, t + d, "#e9fbff", "rgba(127,232,255,.7)", 2.2);
  };
  jump(t26 + 0.5, 2, 3);
  tl.to("#a3-scene", { y: 30, duration: 0.6, ease: "power2.inOut" }, t26 + 0.5);

  // ---- shot 27: the lowest step is the floor ----
  const t27 = S(27);
  hide(t27, "#a3-step", 0.25);
  tl.to("#a3-scene", { y: -30, duration: 0.8, ease: "power2.inOut" }, t27);
  tl.fromTo("#a3-floorfill", { opacity: 1, attr: { width: 0 } }, { opacity: 1, attr: { width: 220 }, duration: 0.4, ease: "expo.out", ...IR }, t27 + 0.15);
  tl.fromTo("#a3-floor", { opacity: 0, y: -260 }, { opacity: 1, y: 0, duration: 0.35, ease: "power4.in", ...IR }, t27 + 0.35);
  shake("#stage", t27 + 0.7, 0.22, 7, 27);
  for (let i = 0; i < 16; i++) {
    const p = el("div", { class: "abs pt", style: `left:${80 + i * 28}px;top:${650}px;opacity:0;background:#ffd08a;box-shadow:0 0 8px rgba(255,173,66,.8)` }, $("#a3-dust"));
    tl.fromTo(p, { opacity: 0.9, x: 0, y: 0 }, { opacity: 0, x: (hr(60, i) - 0.5) * 80, y: -30 - hr(61, i) * 60, duration: 0.8, ease: "power2.out", ...IR }, t27 + 0.7);
  }

  // ---- shot 28: it can't fall any further ----
  const t28 = S(28);
  tl.to("#a3-floor", { opacity: 0.35, duration: 0.4 }, t28);
  tl.to("#a3-scene", { y: 0, duration: 0.6, ease: "power2.inOut" }, t28);
  jump(t28 + 0.1, 3, 2, 40, 0.28); jump(t28 + 0.42, 2, 1, 40, 0.28); jump(t28 + 0.74, 1, 0, 40, 0.28);
  tl.set("#a3-field", { opacity: 1 }, t28 + 0.2);
  tl.fromTo("#a3-field", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, t28 + 0.2);
  show(t28 + 0.3, "#a3-nolower", {}, 0.3);
  tl.fromTo("#a3-marq", { x: 0 }, { x: -600, duration: 3, ease: "none", ...IR }, t28 + 0.3);
  tl.to("#a3-e", { keyframes: [{ y: ST[0][1] + 22, duration: 0.15, ease: "power2.in" }, { y: ST[0][1] - 30, duration: 0.2, ease: "power2.out" }, { y: ST[0][1], duration: 0.2, ease: "bounce.out" }] }, t28 + 1.15);
  [0, 1, 2].forEach((k) => {
    const h = el("div", { class: "abs", style: `left:${630 - 40}px;top:${700 - 20}px;width:80px;height:40px;border-radius:50%;border:2px solid rgba(255,92,138,.9);opacity:0` }, $("#a3-ripple"));
    tl.fromTo(h, { opacity: 1, scale: 0.3 }, { opacity: 0, scale: 3 + k, duration: 0.6, ease: "expo.out", ...IR }, t28 + 1.3 + k * 0.08);
  });

  // ---- shot 29: rule 3 — jump down one step ----
  const t29 = S(29);
  chip(3, t29 + 0.05);
  hide(t29, ["#a3-field", "#a3-nolower", "#a3-floor"], 0.3);
  tl.to("#a3-e", { opacity: 0, duration: 0.05 }, t29 + 0.15);
  tl.set("#a3-e", { x: ST[2][0], y: ST[2][1] }, t29 + 0.2);
  tl.to("#a3-e", { opacity: 1, duration: 0.05 }, t29 + 0.25);
  flash(t29 + 0.22, 0.12, 0.1);
  tl.fromTo("#a3-lock", { opacity: 0, scale: 2.4, rotation: 45 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "expo.out", ...IR }, t29 + 0.4);
  jump(t29 + 0.85, 2, 1, 50, 0.4);
  hide(t29 + 1.3, "#a3-lock", 0.2);

  // ---- shot 30: it releases one portion of light ----
  const t30 = S(30), x0 = ST[1][0], y0 = ST[1][1];
  let d = `M${x0} ${y0}`;
  for (let x = 0; x <= 860; x += 6) d += ` L${x0 + x} ${y0 - 0 + Math.sin(x / 26) * 22 * Math.min(1, x / 60) + (x * 0.0)}`;
  $("#a3-wave").setAttribute("d", d);
  shock($("#a3-ripple"), x0, y0, t30 + 0.05, "#ffffff", "rgba(127,232,255,.9)", 4);
  flash(t30 + 0.05, 0.25, 0.15);
  drawLine(t30 + 0.15, "#a3-wave", 0.9, "power1.in");
  tl.to("#a3-scene", { x: -140, duration: 0.6, ease: "expo.inOut" }, t30 + 0.9);

  // ---- shot 31: the mysterious numbers are explained ----
  const t31 = S(31);
  show(t31 - 0.6, "#a3-sband", { x: 200, filter: "blur(8px)" }, 0.6);
  tl.fromTo("#a3-hitline", { scaleY: 1 }, { keyframes: [{ scaleY: 1.8, duration: 0.08 }, { scaleY: 1, duration: 0.5, ease: "elastic.out(1,0.4)" }], ...IR }, t31 + 0.1);
  flare($("#a3-ripple"), 585, t31 + 0.1, "#fff", "rgba(190,240,255,.9)", "rgba(43,184,255,.6)");
  flash(t31 + 0.1, 0.6, 0.2);
  shock($("#a3-ripple"), 1712, 585, t31 + 0.1, "#ffffff", "rgba(127,232,255,.9)", 4);
  show(t31 + 0.4, "#a3-solved", { scale: 0.6 }, 0.45, "back.out(2)");
  tl.to("#a3-scene", { scale: 0.86, x: -60, duration: 1.4, ease: "expo.inOut" }, t31 + 0.9);
})();
