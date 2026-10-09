// ================= ACT 2 一串神祕的數字 (shots 7–19) =================
(function act2() {
  const LX = [590, 700, 1010, 1390], LC = ["#b69cff", "#8c9bff", "#7fe8ff", "#ff7a9a"], BY = 470, BH = 110;
  actEnter(2, { scale: 0.7, filter: "blur(12px)" }, 0.8);

  // ---- shot 7: "1885" assembles from particles ----
  const cv = $("#a2-canvas"), ctx = cv.getContext("2d"), N = P1885.length, t7 = S(7);
  const start = P1885.map((_, i) => [960 + (hr(1, i) - 0.5) * 2600, 430 + (hr(2, i) - 0.5) * 1500]);
  const delay = P1885.map((_, i) => hr(3, i) * 0.28);
  const eio = (x) => (x < 0.5 ? 16 * x ** 5 : 1 - Math.pow(-2 * x + 2, 5) / 2);
  let cleared = false;
  onClock((t) => {
    const lt = t - t7;
    if (lt < -0.05 || lt > 1.5) { if (!cleared) { ctx.clearRect(0, 0, 1920, 1080); cleared = true; } return; }
    cleared = false;
    ctx.clearRect(0, 0, 1920, 1080);
    const fade = lt > 1.0 ? Math.max(0, 1 - (lt - 1.0) / 0.45) : 1;
    for (let i = 0; i < N; i++) {
      const p = Math.max(0, Math.min(1, (lt - delay[i]) / 0.9)), e = eio(p);
      const sw = (1 - e) * 2.2, dx = start[i][0] - P1885[i][0], dy = start[i][1] - P1885[i][1];
      const x = P1885[i][0] + (dx * Math.cos(sw) - dy * Math.sin(sw)) * (1 - e);
      const y = P1885[i][1] + (dx * Math.sin(sw) + dy * Math.cos(sw)) * (1 - e);
      ctx.globalAlpha = (0.35 + 0.65 * e) * fade;
      ctx.fillStyle = i % 9 ? "#bff3ff" : "#c7bfff";
      ctx.beginPath(); ctx.arc(x, y, 2.1, 0, 6.283); ctx.fill();
    }
  });
  tl.fromTo("#a2-canvas", { scale: 1.45 }, { scale: 1, duration: 1.2, ease: "expo.out", transformOrigin: "960px 400px", ...IR }, t7);
  tl.set("#a2-year", { opacity: 1 }, t7 + 0.85);
  drawLine(t7 + 0.85, "#a2-yline", 0.45, "power2.inOut");
  tl.fromTo("#a2-yfill", { opacity: 0 }, { opacity: 1, duration: 0.5, ...IR }, t7 + 1.0);
  tl.to("#a2-yline", { opacity: 0.25, duration: 0.4 }, t7 + 1.3);
  flare($("#a2-flarehost"), 400, t7 + 0.95, "#fff", "rgba(190,240,255,.9)", "rgba(43,184,255,.6)");
  decodeText($("#a2-basel"), "BASEL · 巴塞爾", t7 + 1.0, 0.6, "#/0123456789");

  // ---- shot 8: year flies to a chip, Balmer card + age ring ----
  const t8 = S(8);
  tl.to("#a2-year", { scale: 0.3, x: -560, y: -300, opacity: 0, duration: 0.6, ease: "expo.inOut" }, t8);
  hide(t8, "#a2-basel", 0.3);
  show(t8 + 0.45, "#a2-ychip", { x: -20 }, 0.4);
  show(t8 + 0.15, "#a2-balmer", { y: 40 }, 0.6);
  decodeText($("#a2-bname"), "J. J. BALMER", t8 + 0.2, 0.7, "#$%&*+0123456789");
  const ticks = $("#a2-ticks");
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2 - Math.PI / 2, r0 = i % 10 ? 84 : 78;
    el("line", { x1: 110 + Math.cos(a) * r0, y1: 110 + Math.sin(a) * r0, x2: 110 + Math.cos(a) * 98, y2: 110 + Math.sin(a) * 98,
      stroke: "#7fe8ff", "stroke-width": i % 10 ? 1.5 : 2.5, opacity: 0.15, class: i < 72 ? "a2-on" : "" }, ticks);
  }
  tl.to(".a2-on", { opacity: 1, duration: 0.05, stagger: 0.008 }, t8 + 0.3);
  countTo($("#a2-age"), 0, 60, t8 + 0.3, 0.6, (v) => String(Math.round(v)), "none");

  // ---- shot 9: hydrogen tube ignites ----
  const t9 = S(9);
  tl.to("#a2-balmer", { x: -380, scale: 0.7, opacity: 0.4, filter: "blur(3px)", duration: 0.6, ease: "expo.inOut" }, t9);
  hide(t9, "#a2-ychip", 0.3);
  tl.fromTo("#a2-tube", { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.5, ease: "expo.out", ...IR }, t9 + 0.2);
  tl.to("#a2-tube", { keyframes: [{ opacity: 0.25, duration: 0.05 }, { opacity: 1, duration: 0.05 }, { opacity: 0.4, duration: 0.07 }, { opacity: 1, duration: 0.05 }, { opacity: 0.6, duration: 0.05 }, { opacity: 1, duration: 0.08 }] }, t9 + 0.72);
  show(t9 + 0.5, "#a2-hglyph", { scale: 1.08 }, 0.9);
  tl.to("#a2-hglyph", { opacity: 0.55, duration: 0.3 }, t9 + 1.4);

  // ---- shot 10: the lines burst out of the dark ----
  const t10 = S(10), lines = $("#a2-lines");
  hide(t10, "#a2-balmer", 0.3);
  tl.to("#a2-hglyph", { opacity: 0.12, duration: 0.4 }, t10);
  tl.fromTo("#a2-beam", { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.3, ease: "power2.in", ...IR }, t10 + 0.05);
  show(t10 + 0.3, "#a2-band", { scaleX: 0.92 }, 0.4);
  LX.forEach((x, i) => {
    const g = el("rect", { x: x - 3, y: BY + 4, width: 6, height: BH - 8, fill: LC[i], style: `filter:drop-shadow(0 0 10px ${LC[i]})`, opacity: 0 }, lines);
    const t = t10 + 0.5 + i * 0.15;
    tl.fromTo(g, { opacity: 0, scaleY: 0, transformOrigin: `${x}px ${BY + BH / 2}px` }, { opacity: 1, scaleY: 1, duration: 0.25, ease: "expo.out", ...IR }, t);
    flare($("#a2-flarehost"), BY + BH / 2, t, "#fff", LC[i], LC[i]);
    flash(t, 0.18, 0.12);
    const n = el("div", { class: "abs mono", style: `left:${x - 30}px;top:${BY - 40}px;width:60px;text-align:center;font-size:20px;color:${LC[i]};opacity:0` }, $("#a2-lnums"), `0${i + 1}`);
    show(t + 0.1, n, { y: 8 }, 0.3);
  });
  tl.to("#a2-lines rect", { opacity: 0.75, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut", stagger: 0.1 }, t10 + 1.4);

  // ---- shot 11: ruler + measurement arcs (tilted, blueprint-like) ----
  const t11 = S(11), ruler = $("#a2-ruler"), arcs = $("#a2-arcs");
  for (let x = 410, i = 0; x <= 1510; x += 20, i++) el("line", { x1: x, y1: BY + BH + 6, x2: x, y2: BY + BH + (i % 5 ? 16 : 28), stroke: "#7fe8ff", "stroke-opacity": 0.55, "stroke-width": 1.2, class: "a2-tick", opacity: 0 }, ruler);
  tl.set("#a2-ruler", { opacity: 1 }, t11);
  tl.to(".a2-tick", { opacity: 1, duration: 0.05, stagger: 0.008 }, t11 + 0.05);
  tl.to("#a2-sci", { rotationX: 22, transformPerspective: 1400, transformOrigin: "960px 525px", duration: 0.9, ease: "expo.inOut" }, t11);
  for (let i = 0; i < 3; i++) {
    const x0 = LX[i], x1 = LX[i + 1], ym = BY + BH + 40;
    const a = el("path", { d: `M${x0} ${ym} Q${(x0 + x1) / 2} ${ym + 70} ${x1} ${ym}`, fill: "none", stroke: "#d6f8ff", "stroke-width": 1.6, pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 }, arcs);
    drawLine(t11 + 0.35 + i * 0.22, a, 0.4, "power2.out");
  }

  // ---- shot 12: data compresses into a formula ----
  const t12 = S(12);
  hide(t12, ["#a2-tube", "#a2-beam", "#a2-hglyph"], 0.3);
  tl.to("#a2-sci", { rotationX: 0, duration: 0.6, ease: "expo.inOut" }, t12);
  hide(t12 + 0.1, ["#a2-ruler", "#a2-arcs"], 0.3);
  LX.forEach((x, i) => {
    const d = el("div", { class: "abs", style: `left:${x - 6}px;top:${BY + 49}px;width:12px;height:12px;border-radius:50%;background:${LC[i]};box-shadow:0 0 14px 4px ${LC[i]};opacity:0` }, $("#a2-flarehost"));
    tl.fromTo(d, { opacity: 1, x: 0, y: 0 }, { keyframes: [{ x: (960 - x) * 0.5, y: -200, duration: 0.3, ease: "power1.out" }, { x: 960 - x, y: -315, duration: 0.3, ease: "power2.in" }, { opacity: 0, duration: 0.05 }], ...IR }, t12 + 0.15 + i * 0.05);
  });
  show(t12 + 0.55, "#a2-formula", { scale: 0.9 }, 0.4);
  flash(t12 + 0.7, 0.2);
  tl.fromTo("#a2-ftext", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "steps(9)", ...IR }, t12 + 0.75);
  tl.fromTo("#a2-fcursor", { opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.01 }, { opacity: 0, duration: 0.18, delay: 0.18 }, { opacity: 1, duration: 0.01, delay: 0.18 }, { opacity: 0, duration: 0.01, delay: 0.2 }], ...IR }, t12 + 1.35);

  // ---- shot 13: 1888, only the last digit rolls ----
  const t13 = S(13);
  tl.to(["#a2-sci", "#a2-formula"], { opacity: 0.15, filter: "blur(6px)", duration: 0.4 }, t13);
  show(t13 + 0.05, "#a2-y1888", { scale: 1.1, filter: "blur(10px)" }, 0.5);
  const ld = $("#a2-lastd"), dA = ld.children[0], dB = ld.children[1], roll = { v: 5 };
  function drawRoll() {
    const d = Math.floor(roll.v), q = roll.v - d;
    dA.textContent = String(d % 10); dB.textContent = String((d + 1) % 10);
    dA.style.transform = `translateY(${-q * 1.05}em)`; dA.style.opacity = 1 - q; dA.style.filter = `blur(${q * 6}px)`;
    dB.style.transform = `translateY(${(1 - q) * 1.05}em)`; dB.style.opacity = q; dB.style.filter = `blur(${(1 - q) * 6}px)`;
  }
  drawRoll();
  tl.fromTo(roll, { v: 5 }, { v: 18, duration: 1.0, ease: "power3.out", onUpdate: drawRoll, ...IR }, t13 + 0.3);
  show(t13 + 0.35, "#a2-rydberg", { x: 80, rotationY: -30, transformPerspective: 900 }, 0.6);

  // ---- shot 14: the formula upgrades ----
  const t14 = S(14);
  hide(t14, ["#a2-y1888", "#a2-rydberg"], 0.3);
  tl.to("#a2-formula", { opacity: 1, filter: "blur(0px)", duration: 0.3 }, t14 + 0.1);
  tl.to("#a2-formula", { opacity: 0, scaleX: 1.3, filter: "blur(8px)", duration: 0.35, ease: "power2.in" }, t14 + 0.45);
  show(t14 + 0.6, "#a2-formula2", { scaleX: 0.75, filter: "blur(8px)" }, 0.5);
  show(t14 + 0.6, "#a2-hexes", { scale: 0.6 }, 0.8);
  show(t14 + 0.95, "#a2-upgrade", { scale: 1.6, rotation: -6 }, 0.3, "power4.in");

  // ---- shot 15: other elements' light fits too ----
  const t15 = S(15), sb = $("#a2-sbands"), beams = $("#a2-sbeams");
  hide(t15, ["#a2-sci", "#a2-hexes"], 0.3);
  tl.set("#a2-samples", { opacity: 1 }, t15);
  const SETS = [[520, 760, 1080, 1300], [480, 650, 900, 1180, 1420], [600, 820, 870, 1250]];
  [400, 520, 640].forEach((y, k) => {
    const g = el("g", { opacity: 0 }, sb);
    el("rect", { x: 410, y, width: 1100, height: 70, rx: 4, fill: "#02030b", stroke: "rgba(127,232,255,.35)" }, g);
    SETS[k].forEach((x, j) => el("rect", { x: x - 2.5, y: y + 4, width: 5, height: 62, fill: LC[(j + k) % 4], style: `filter:drop-shadow(0 0 8px ${LC[(j + k) % 4]})` }, g));
    el("text", { x: 390, y: y + 44, "text-anchor": "end", fill: "#7fe8ff", "font-family": "JBMono", "font-size": 20, "letter-spacing": 3 }, g).textContent = `SAMPLE ${"ABC"[k]}`;
    show(t15 + 0.15 + k * 0.15, g, { y: 60 }, 0.5);
    const b = el("line", { x1: 960, y1: 262, x2: 960 + (k - 1) * 260, y2: y + 6, stroke: "#7fe8ff", "stroke-width": 2, "stroke-opacity": 0.7, pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 }, beams);
    drawLine(t15 + 0.5, b, 0.35, "power2.out");
  });
  tl.fromTo("#a2-sampleplane", { rotationX: 16, scale: 1.1 }, { rotationX: 16, scale: 1, duration: 1.4, ease: "expo.out", ...IR }, t15);

  // ---- shot 16: predicted lines nobody has seen ----
  const t16 = S(16), gh = $("#a2-ghosthost");
  hide(t16, ["#a2-samples", "#a2-formula2", "#a2-upgrade"], 0.3);
  tl.to("#a2-sci", { opacity: 1, filter: "blur(0px)", duration: 0.4 }, t16 + 0.2);
  tl.set("#a2-ext", { opacity: 1 }, t16 + 0.25);
  tl.fromTo("#a2-extsvg rect", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "expo.out", transformOrigin: (i) => (i ? "1510px 525px" : "410px 525px"), ...IR }, t16 + 0.25);
  const GX = [190, 300, 1600, 1730], solids = [];
  GX.forEach((x, i) => {
    const g = el("div", { class: "abs", style: `left:${x - 3}px;top:${BY + 4}px;width:6px;height:${BH - 8}px;border-left:3px dashed ${i < 2 ? "#b69cff" : "#ff7a9a"};opacity:0` }, gh);
    tl.fromTo(g, { opacity: 0 }, { keyframes: Array.from({ length: 10 }, (_, k) => ({ opacity: 0.25 + hr(70 + i, k) * 0.75, duration: 0.09 })), ...IR }, t16 + 0.6 + i * 0.05);
    solids.push(el("div", { class: "abs", style: `left:${x - 3}px;top:${BY + 4}px;width:6px;height:${BH - 8}px;background:${i < 2 ? "#b69cff" : "#ff7a9a"};box-shadow:0 0 14px ${i < 2 ? "#b69cff" : "#ff7a9a"};opacity:0` }, gh));
    tl.to(g, { opacity: 0, duration: 0.01 }, S(17) + 0.1);
  });
  tl.to(".a2-unseen", { y: -6, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, t16 + 0.5);

  // ---- shot 17: they really were found ----
  const t17 = S(17);
  tl.set(solids, { opacity: 1 }, t17 + 0.1);
  flash(t17 + 0.1, 0.6, 0.2);
  GX.forEach((x) => shock(gh, x, BY + BH / 2, t17 + 0.1, "#e9fff7", "rgba(108,255,200,.8)", 3));
  hide(t17 + 0.1, ".a2-unseen", 0.2);
  show(t17 + 0.35, "#a2-confirm", { scale: 0.6 }, 0.45, "back.out(2)");
  tl.to("#a2-lines rect", { opacity: 1, duration: 0.3 }, t17 + 0.1);

  // ---- shot 18: push into the analogy (amber bus board) ----
  const t18 = S(18);
  tl.to(["#a2-sci", "#a2-ext", "#a2-confirm"], { x: -1500, opacity: 0, filter: "blur(10px)", duration: 0.7, ease: "expo.inOut" }, t18);
  show(t18 + 0.05, "#a2-board", { x: 1500, filter: "blur(10px)" }, 0.75, "expo.inOut");
  const leds = $("#a2-leds"), LEDS = [];
  for (let i = 0; i < 64; i++) {
    const p = i / 64, per = 2 * (900 + 580), d = p * per;
    const [x, y] = d < 900 ? [10 + d, 10] : d < 1480 ? [910, 10 + d - 900] : d < 2380 ? [910 - (d - 1480), 590] : [10, 590 - (d - 2380)];
    LEDS.push(el("circle", { cx: x, cy: y, r: 3, fill: "#ffad42", opacity: 0.15 }, leds));
  }
  tl.to(LEDS, { opacity: 1, duration: 0.05, stagger: 0.012 }, t18 + 0.6);
  $$(".a2-row").forEach((r, i) => decodeText(r, r.textContent, t18 + 0.55 + i * 0.12, 0.5, "0123456789"));

  // ---- shot 19: who made the schedule? (glitch) ----
  const t19 = S(19);
  [0, 0.5].forEach((dt, k) => {
    tl.to("#a2-board", { keyframes: [{ x: -18, filter: "drop-shadow(10px 0 0 rgba(255,92,138,.85)) drop-shadow(-10px 0 0 rgba(127,232,255,.85))", duration: F1 },
      { x: 14, duration: F1 }, { x: -6, duration: F1 }, { x: 0, filter: "none", duration: F1 }] }, t19 + 0.1 + dt);
  });
  show(t19 + 0.25, "#a2-who", { x: -20 }, 0.4);
  const wq = $("#a2-whoq"), wo = { p: 0 }, GL = "？■□◆◇＃％＆";
  tl.fromTo(wo, { p: 0 }, { p: 1, duration: AE(2) - t19 - 0.3, ease: "none", ...IR, onUpdate: () => {
    const fr = Math.floor(wo.p * 200);
    wq.textContent = wo.p >= 1 ? "？？？" : [0, 1, 2].map((k) => GL[Math.floor(hr(fr, k) * GL.length)]).join("");
  } }, t19 + 0.3);

  // exit into act 3
  tl.to("#a2-board", { scale: 0.6, opacity: 0, filter: "blur(8px)", duration: 0.35, ease: "power2.in" }, A(3) - 0.35);
  warp(A(3), true);
})();
