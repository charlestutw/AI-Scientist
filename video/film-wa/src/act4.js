// ================= ACT 4 反轉 (shots 32–35) =================
(function act4() {
  // the frozen frame repeats the last frame of act 3 (wave included)
  let d = "M850 568"; for (let x = 0; x <= 860; x += 6) d += ` L${850 + x} ${568 + Math.sin(x / 26) * 22 * Math.min(1, x / 60)}`;
  $("#a4-wave").setAttribute("d", d);

  // ---- shot 32: hard freeze — no transition, just stop ----
  const t32 = S(32);
  tl.set("#a4-frozen", { filter: "sepia(.55) saturate(.6) contrast(.92)" }, t32);
  tl.to("#a4-frozen", { keyframes: [
    { filter: "sepia(.55) saturate(.6) contrast(.92) drop-shadow(10px 0 0 rgba(200,68,47,.8)) drop-shadow(-10px 0 0 rgba(43,76,126,.8))", x: -70, duration: F1 },
    { x: -48, duration: F1 }, { x: -66, duration: F1 },
    { filter: "sepia(.55) saturate(.6) contrast(.92)", x: -60, duration: F1 }] }, t32);
  tl.fromTo("#grain", { opacity: 0 }, { opacity: 1, duration: 0.01, ...IR }, t32);
  tl.to("#grain", { y: 3, duration: 0.1, repeat: Math.round((AE(4) - t32) / 0.1) - 1, yoyo: true, ease: "steps(1)" }, t32);
  tl.set("#a4-pause", { opacity: 1 }, t32 + 0.1);
  tl.to("#a4-pause", { opacity: 0.25, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.4 }, t32 + 0.6);
  hudColor(t32, "#1e1b18", 0.01);

  // ---- shot 33: the stamp "規定" slams down ----
  const t33 = S(33), land = t33 + 0.3;
  hide(t33, "#a4-pause", 0.15);
  tl.set("#a4-stampwrap", { opacity: 1 }, t33 + 0.08);
  tl.fromTo("#a4-stamp", { scale: 2.4, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: 0.22, ease: "power4.in", ...IR }, t33 + 0.08);
  tl.set("#neg", { opacity: 1 }, land);
  tl.set("#neg", { opacity: 0 }, land + 2 * F1);
  shake("#stage", land, 0.35, 12, 33);
  hudColor(land, "#c8442f", 0.01);
  tl.fromTo("#a4-frozen", { scale: 0.86 }, { keyframes: [{ scale: 0.8, duration: 0.06 }, { scale: 0.86, duration: 0.4, ease: "elastic.out(1,0.5)" }], ...IR }, land);
  for (let i = 0; i < 46; i++) {
    const a = hr(330, i) * Math.PI * 2, r0 = 300 + hr(331, i) * 200, sz = 4 + hr(332, i) * 12;
    const p = el("div", { class: "abs", style: `left:${960 + Math.cos(a) * r0 * 1.6}px;top:${430 + Math.sin(a) * r0 * 0.8}px;width:${sz}px;height:${sz}px;border-radius:50%;background:#c8442f;opacity:0` }, $("#a4-ink"));
    tl.fromTo(p, { opacity: 1, x: 0, y: 0, scale: 1 }, { opacity: 0, x: Math.cos(a) * (120 + hr(333, i) * 220), y: Math.sin(a) * (80 + hr(334, i) * 160), scale: 0.3, duration: 0.6 + hr(335, i) * 0.4, ease: "expo.out", ...IR }, land);
  }

  // ---- shot 34: not derived — assumed ----
  const t34 = S(34);
  tl.to("#a4-stamp", { scale: 0.52, x: 360, y: 0, rotation: -4, duration: 0.5, ease: "expo.inOut" }, t34);
  tl.to("#a4-w1", { rotationX: 90, opacity: 0, duration: 0.2, ease: "power2.in", transformPerspective: 900 }, t34 + 0.45);
  tl.fromTo("#a4-w2", { rotationX: -90, opacity: 0, transformPerspective: 900 }, { rotationX: 0, opacity: 1, duration: 0.25, ease: "power2.out", ...IR }, t34 + 0.65);
  show(t34 + 0.35, "#a4-derive", { x: -40 }, 0.4);
  drawLine(t34 + 0.95, "#a4-strike", 0.18, "power3.in");
  hudColor(t34, "#1e1b18", 0.3);

  // ---- shot 35: useful — but is it real? (hologram flicker) ----
  const t35 = S(35);
  hide(t35, ["#a4-stampwrap", "#a4-derive"], 0.4);
  tl.to("#grain", { opacity: 0.45, duration: 0.4 }, t35);
  tl.to("#a4-frozen", { filter: "sepia(0) saturate(1) contrast(1)", duration: 0.4 }, t35);
  tl.to("#a4-frozen", { keyframes: Array.from({ length: 22 }, (_, k) => ({ opacity: 0.25 + hr(350, k) * 0.45, duration: 0.07 + hr(351, k) * 0.06 })) }, t35 + 0.2);
  tl.fromTo("#a4-scan", { opacity: 0, y: 420 }, { opacity: 1, y: -60, duration: 1.2, ease: "none", repeat: 1, ...IR }, t35 + 0.2);
  hudColor(t35, "#2b4c7e", 0.4);

  // exit into act 5: blinds
  tl.to("#grain", { opacity: 0, duration: 0.2 }, AE(4) - 0.1);
  blinds(A(5));
})();
