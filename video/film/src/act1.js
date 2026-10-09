// ================= ACT 1 拋出問題 (shots 1–6) =================
(function act1() {
  const T1 = S(1), T2 = S(2), T3 = S(3), T4 = S(4), T5 = S(5), T6 = S(6), END = AE(1);
  const CX = 960, CY = 430, RX = 380, RY = 150, TILT = (-20 * Math.PI) / 180, W0 = (Math.PI * 2) / 2.4;
  const C0 = T4 + 0.1, CD = 1.35, SLOW_AT = C0 + 1.2, SLOW = 0.25;
  const IMPACT = SLOW_AT + (C0 + CD - SLOW_AT) / SLOW;
  const RW0 = T5, RW1 = T5 + 0.5;

  // ---- electron physics, sampled once (pure function of time) ----
  const DT = 1 / 240, hist = [];
  const simTime = (t) => (t < SLOW_AT ? t : t < IMPACT ? SLOW_AT + (t - SLOW_AT) * SLOW : C0 + CD + (t - IMPACT));
  function radiusAt(t) {
    if (t < C0) return 1;
    if (t < IMPACT) { const p = Math.min(1, (simTime(t) - C0) / CD); return 1 - Math.pow(p, 2.2) * 0.98; }
    if (t < RW0) return 0.02;
    if (t < RW1) { const p = (t - RW0) / (RW1 - RW0); return 0.02 + 0.98 * (1 - Math.pow(1 - p, 3)); }
    return 1;
  }
  for (let t = 0, ang = -0.6; t <= END + 0.5; t += DT) {
    const r = radiusAt(t), rate = t >= SLOW_AT && t < IMPACT ? SLOW : 1;
    const w = t < RW0 ? W0 / Math.pow(Math.max(r, 0.18), 1.4) : t < RW1 ? -W0 * 3.2 : W0;
    hist.push({ ang, r }); ang += w * DT * rate;
  }
  const at = (t) => hist[Math.max(0, Math.min(hist.length - 1, Math.round(t / DT)))];
  const pos = (a, r) => { const x = RX * r * Math.cos(a), y = RY * r * Math.sin(a); return [CX + x * Math.cos(TILT) - y * Math.sin(TILT), CY + x * Math.sin(TILT) + y * Math.cos(TILT)]; };

  const eNode = $("#a1-electron"), lb = $("#a1-elabel"), NG = 12, NP = 54, ghosts = [], parts = [];
  for (let i = 0; i < NG; i++) ghosts.push(el("div", { class: "abs ghost" }, $("#a1-ghosts")));
  for (let i = 0; i < NP; i++) {
    const born = T3 + 0.15 + (i / NP) * (IMPACT - T3 - 0.3) + hr(31, i) * 0.05;
    parts.push({ p: el("div", { class: "abs pt" }, $("#a1-parts")), born, a: hr(32, i) * Math.PI * 2, v: 40 + hr(33, i) * 90, life: 0.9 + hr(34, i) * 0.8 });
  }
  const trailAmt = (t) => (t < T3 ? 0.25 : t < T3 + 0.5 ? 0.25 + 0.75 * ((t - T3) / 0.5) : t < RW1 ? 1 : 0.25);
  const alive = (t) => (t < IMPACT ? 1 : t < RW0 ? 0 : Math.min(1, (t - RW0) / 0.15));
  const labelOn = (t) => (t < 1.4 ? 0 : Math.min(1, (t - 1.4) / 0.4)) * (t > T4 ? Math.max(0, 1 - (t - T4) / 0.3) : 1);
  const place = (n, x, y, s) => { n.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${s})`; };
  onClock((t) => {
    if (t > END + 0.1) return;
    const st = at(t), [x, y] = pos(st.ang, st.r), a = alive(t);
    place(eNode, x, y, 0.4 + 0.6 * st.r); eNode.style.opacity = a;
    place(lb, x, y, 1); lb.style.opacity = a * labelOn(t);
    const tr = trailAmt(t);
    ghosts.forEach((g, k) => {
      const sg = at(Math.max(0, t - (k + 1) * (0.018 + 0.03 * tr))), [gx, gy] = pos(sg.ang, sg.r);
      place(g, gx, gy, (0.35 + 0.6 * sg.r) * (1 - k / (NG + 2)));
      g.style.opacity = a * (k < 3 + 9 * tr ? 1 : 0) * (0.7 - k * 0.05) * (0.35 + 0.65 * tr);
    });
    parts.forEach((q) => {
      const age = t - q.born;
      if (age < 0 || age > q.life || t > RW0) { q.p.style.opacity = 0; return; }
      const sb = at(q.born), [bx, by] = pos(sb.ang, sb.r);
      place(q.p, bx + Math.cos(q.a) * q.v * age, by + Math.sin(q.a) * q.v * age + 18 * age * age, 1 - (age / q.life) * 0.5);
      q.p.style.opacity = (1 - age / q.life) * 0.9;
    });
  });

  // ---- shot 1: point -> push-in, orbit draws ----
  tl.fromTo("#a1-obj", { scale: 0.28, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: "expo.out", ...IR }, 0.25);
  tl.fromTo("#stars", { scale: 0.75 }, { scale: 1, duration: 1.4, ease: "expo.out", ...IR }, 0.2);
  tl.fromTo("#streaks", { scale: 0.5, opacity: 0 }, { keyframes: [{ scale: 1.1, opacity: 0.9, duration: 0.35, ease: "power2.in" }, { scale: 1.9, opacity: 0, duration: 0.6, ease: "expo.out" }], ...IR }, 0.2);
  tl.fromTo("#grid", { opacity: 0 }, { opacity: 0.3, duration: 1.2, ...IR }, 0.6);
  tl.fromTo("#a1-bgword", { opacity: 0, x: 80 }, { opacity: 0.08, x: 0, duration: 1.4, ease: "expo.out", ...IR }, 0.5);
  tl.to("#a1-bgword", { x: -110, duration: END - 1.9, ease: "none" }, 1.9);
  drawLine(0.55, ".a1-orb", 0.9);
  drawLine(1.3, "#a1-nleader", 0.3, "power2.out");
  show(1.45, "#a1-nlabel", { y: 8 }, 0.4);
  hide(T4, ["#a1-nlabel", "#a1-nleader"], 0.25);
  tl.to("#a1-halo1", { attr: { r: 86 }, duration: 1.2, yoyo: true, repeat: 5, ease: "sine.inOut" }, 1);

  // ---- shot 2: classical sim panel + camera pan ----
  tl.to("#world", { x: -80, duration: 0.9, ease: "expo.inOut" }, T2 + 0.1);
  tl.set("#a1-panel", { opacity: 1 }, T2 + 0.15);
  tl.fromTo("#a1-glass", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.45, ease: "expo.out", ...IR }, T2 + 0.15);
  tl.fromTo(".a1-scan", { opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.08 }, { opacity: 0, duration: 0.3 }], stagger: 0.05, ...IR }, T2 + 0.15);
  show(T2 + 0.3, ".a1-br", { scale: 1.8 }, 0.4);
  show(T2 + 0.4, ["#a1-plabel", "#a1-pbar", "#a1-pnum", "#a1-pstream"], { x: 20 }, 0.4);
  decodeText($("#a1-ptitle"), "CLASSICAL / SIM", T2 + 0.3, 0.7);
  let rows = []; for (let i = 0; i < 24; i++) { let r = ""; for (let j = 0; j < 4; j++) r += Math.floor(hr(77 + i, j) * 65536).toString(16).toUpperCase().padStart(4, "0") + "  "; rows.push(r.trim()); }
  $("#a1-pstream-in").textContent = rows.join("\n");
  tl.fromTo("#a1-pstream-in", { y: 0 }, { y: -400, duration: 7, ease: "none", ...IR }, T2 + 0.4);

  // energy odometer (fade-roll digits) + bar
  const energy = { v: 100 };
  function roll(id, off) {
    const col = $(id), a = col.children[0], b = col.children[1], d = Math.floor(off), q = off - d;
    a.textContent = String(d % 10); b.textContent = String((d + 1) % 10);
    a.style.transform = `translateY(${-q * 50}px)`; a.style.opacity = 1 - q;
    b.style.transform = `translateY(${(1 - q) * 50}px)`; b.style.opacity = q;
  }
  function drawEnergy() {
    const v = energy.v, fl = Math.floor(v), fr = v - fl, sm = (x) => x * x * (3 - 2 * x);
    const ones = (fl % 10) + sm(Math.max(0, Math.min(1, (fr - 0.85) / 0.15)));
    roll("#a1-d2", ones); roll("#a1-d1", (Math.floor(fl / 10) % 10) + Math.max(0, ones - 9));
    $("#a1-d0").style.opacity = v >= 99.5 ? 1 : 0;
    $("#a1-pfill").style.transform = `scaleX(${v / 100})`;
  }
  drawEnergy();
  tl.to(energy, { v: 35, duration: IMPACT - T3 - 0.1, ease: "power1.in", onUpdate: drawEnergy }, T3 + 0.1);

  // ---- shot 3: weight morph on 漏掉能量 ----
  tl.fromTo("#sub-03 em .ch", { fontWeight: 900 }, { fontWeight: 300, duration: 1.1, ease: "power2.inOut", stagger: 0.08, ...IR }, T3 + 0.55);

  // ---- shot 4: collapse, slow-mo, impact ----
  tl.to("#a1-obj", { scale: 1.32, duration: IMPACT - (T4 + 0.6), ease: "power2.in" }, T4 + 0.6);
  tl.to(".a1-orb", { opacity: 0.25, duration: 0.6 }, T4 + 0.2);
  hudColor(T4 + 0.3, "#ff5c8a");
  tl.to("#a1-pwarn", { opacity: 1, duration: 0.1, repeat: 5, yoyo: true }, T4 + 0.3);
  impact(IMPACT, "掉進", "#ff5c8a", 0.65);
  tl.fromTo("#a1-nucleus", { scale: 1 }, { keyframes: [{ scale: 1.35, duration: 0.08 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }], ...IR }, IMPACT);
  shock($("#a1-shockhost"), CX, CY, IMPACT, "#ffe3f0", "rgba(255,92,138,.8)");
  flare($("#a1-flarehost"), CY, IMPACT);
  shake("#stage", IMPACT, 0.3, 10, 41);
  tl.to("#a1-obj", { scale: 1.12, duration: 0.4, ease: "expo.out" }, IMPACT + 0.05);

  // ---- shot 5: VHS rewind ----
  show(T5, "#a1-rewind", { scaleX: 1.5 }, 0.35);
  tl.to("#a1-rewind", { opacity: 0.35, duration: 0.12, repeat: 3, yoyo: true }, T5 + 0.35);
  hide(T5 + 1.6, "#a1-rewind", 0.3);
  tl.fromTo(".a1-tear", { opacity: 0, y: 0 }, { keyframes: [{ opacity: 0.9, duration: 0.05 }, { y: 120, duration: 0.45, ease: "none" }, { opacity: 0, duration: 0.05 }], stagger: 0.03, ...IR }, RW0);
  tl.set("#a1-obj", { filter: "drop-shadow(8px 0 0 rgba(255,92,138,.75)) drop-shadow(-8px 0 0 rgba(127,232,255,.75))" }, RW0);
  tl.set("#a1-obj", { filter: "none" }, RW1);
  tl.to("#a1-obj", { scale: 1, duration: 0.5, ease: "expo.out" }, RW0);
  tl.to(".a1-orb", { opacity: 1, duration: 0.3 }, RW1 - 0.2);
  tl.to("#a1-panel", { opacity: 0, duration: 0.06 }, IMPACT);
  tl.to("#a1-panel", { opacity: 1, duration: 0.25 }, IMPACT + 0.98);
  tl.to(energy, { v: 100, duration: 0.5, ease: "expo.out", onUpdate: drawEnergy }, IMPACT + 1.05);
  tl.to("#a1-pwarn", { opacity: 0, duration: 0.1 }, RW0);
  flash(RW1, 0.55);
  hudColor(RW1, "#7fe8ff");

  // ---- shot 6: atom recedes, giant question mark ----
  hide(T6, "#a1-panel", 0.4, { x: 40 });
  tl.to("#world", { x: 0, duration: 0.8, ease: "expo.inOut" }, T6);
  tl.to("#a1-obj", { x: -330, scale: 0.8, opacity: 0.4, filter: "blur(4px)", duration: 0.7, ease: "expo.inOut" }, T6);
  tl.set("#a1-qmark", { opacity: 1 }, T6 + 0.2);
  drawLine(T6 + 0.2, "#a1-qline", 0.7, "power2.inOut");
  tl.fromTo("#a1-qfill", { opacity: 0 }, { opacity: 0.9, duration: 0.5, ...IR }, T6 + 0.8);
  tl.fromTo("#a1-qmark", { scale: 0.85, transformOrigin: "1480px 430px" }, { scale: 1, duration: 0.9, ease: "back.out(1.6)", ...IR }, T6 + 0.2);
  tl.to("#a1-qline", { opacity: 0.4, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, T6 + 1.3);

  // exit into act 2
  warp(A(2));
  tl.to(["#a1-obj", "#a1-qmark"], { scale: 1.6, opacity: 0, duration: 0.35, ease: "power2.in" }, A(2) - 0.35);
})();
