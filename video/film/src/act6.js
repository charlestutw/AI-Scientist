// ================= ACT 6 落到你身上 (shots 50–56) =================
(function act6() {
  gsap.set("#a6-pulse", { xPercent: -50, yPercent: -50 });
  const yrs = $$(".a6-yr"), lbs = $$(".a6-lb"), nodes = $$(".a6-node");
  const NX = [480, 960, 1440];
  nodes.forEach((n, i) => gsap.set(n, { opacity: 0, svgOrigin: `${NX[i]} 470` }));
  const pop = (i, t) => {
    tl.fromTo(nodes[i], { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)", ...IR }, t);
    show(t + 0.1, yrs[i], { y: 14 }, 0.4);
    show(t + 0.2, lbs[i], { y: -10 }, 0.4);
    shock($("#act6"), NX[i], 470, t + 0.05, "#e9fbff", "rgba(127,232,255,.7)", 2.4);
  };
  const flow = (t, x0, x1, d = 0.45) => {
    tl.fromTo("#a6-pulse", { opacity: 1, x: x0, y: 470 }, { x: x1, duration: d, ease: "power2.inOut", ...IR }, t);
    tl.to("#a6-pulse", { opacity: 0, duration: 0.1 }, t + d);
  };

  // ---- shot 50: first, find the pattern ----
  const t50 = S(50);
  drawLine(t50 + 0.2, "#a6-line", 1.2, "power2.inOut");
  pop(0, t50 + 0.45);
  tl.fromTo(".a6-ic1", { opacity: 0.15 }, { opacity: 1, duration: 0.1, stagger: 0.1, ...IR }, t50 + 0.8);

  // ---- shot 51: then someone explains it ----
  const t51 = S(51);
  flow(t51 + 0.05, 550, 890);
  pop(1, t51 + 0.45);

  // ---- shot 52: finally an experiment proves it ----
  const t52 = S(52);
  flow(t52 + 0.05, 1030, 1370);
  pop(2, t52 + 0.45);
  tl.to(nodes, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, stagger: 0 }, t52 + 1.0);
  flash(t52 + 1.0, 0.15, 0.2);

  // ---- shot 53: the first step was just a 60-year-old ----
  const t53 = S(53);
  tl.to("#a6-tl", { scale: 1.6, x: 480, y: -40, duration: 0.9, ease: "expo.inOut" }, t53);
  tl.to([nodes[1], nodes[2], yrs[1], yrs[2], lbs[1], lbs[2]], { opacity: 0, duration: 0.4 }, t53 + 0.1);
  const ticks = $("#a6-ticks");
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2 - Math.PI / 2, r0 = i % 10 ? 98 : 90;
    el("line", { x1: 130 + Math.cos(a) * r0, y1: 130 + Math.sin(a) * r0, x2: 130 + Math.cos(a) * 114, y2: 130 + Math.sin(a) * 114, stroke: "#7fe8ff", "stroke-width": i % 10 ? 1.5 : 2.5, opacity: 0.15, class: i < 72 ? "a6-on" : "" }, ticks);
  }
  show(t53 + 0.7, "#a6-age", { x: 30 }, 0.5);
  tl.to(".a6-on", { opacity: 1, duration: 0.05, stagger: 0.008 }, t53 + 0.8);
  countTo($("#a6-agenum"), 0, 60, t53 + 0.8, 0.6, (v) => String(Math.round(v)), "none");

  // ---- shot 54: staring at a few lines to find a pattern ----
  const t54 = S(54), big = $("#a6-biglines"), LC = ["#b69cff", "#8c9bff", "#7fe8ff", "#ff7a9a"];
  [380, 640, 1180, 1560].forEach((x, i) => el("div", { class: "abs a6-bl", style: `left:${x - 4}px;top:0;width:8px;height:1080px;background:${LC[i]};box-shadow:0 0 30px 8px ${LC[i]};opacity:.0` }, big));
  hide(t54, "#a6-age", 0.3);
  tl.to("#a6-all", { opacity: 0.25, filter: "blur(4px)", duration: 0.6 }, t54);
  tl.set("#a6-biglines", { opacity: 1 }, t54 + 0.1);
  tl.fromTo(".a6-bl", { opacity: 0, scaleY: 0 }, { opacity: 0.55, scaleY: 1, duration: 0.6, stagger: 0.1, ease: "expo.out", ...IR }, t54 + 0.1);
  tl.to(".a6-bl", { opacity: 0.25, duration: 0.6, yoyo: true, repeat: 1, stagger: 0.15, ease: "sine.inOut" }, t54 + 0.8);
  tl.fromTo("#a6-bgword", { opacity: 0, x: 60 }, { opacity: 0.08, x: 0, duration: 1, ease: "expo.out", ...IR }, t54 + 0.2);
  tl.to("#a6-bgword", { x: -80, duration: AE(6) - t54 - 1.2, ease: "none" }, t54 + 1.2);

  // ---- shot 55: the answer came 28 years later ----
  const t55 = S(55);
  hide(t55, "#a6-biglines", 0.4);
  tl.to("#a6-all", { opacity: 1, filter: "blur(0px)", duration: 0.5 }, t55);
  tl.to("#a6-tl", { scale: 1, x: 0, y: 0, duration: 0.8, ease: "expo.inOut" }, t55);
  tl.to([nodes[1], yrs[1], lbs[1]], { opacity: 1, duration: 0.4 }, t55 + 0.3);
  tl.to([nodes[2], yrs[2], lbs[2]], { opacity: 0.35, duration: 0.4 }, t55 + 0.3);
  drawLine(t55 + 0.7, "#a6-arc", 1.0, "power2.inOut");
  show(t55 + 0.65, "#a6-28", { y: 20 }, 0.4);
  countTo($("#a6-28n"), 0, 28, t55 + 0.7, 1.0, (v) => String(Math.round(v)).padStart(2, "0"), "power2.inOut");
  tl.fromTo("#a6-28n", { scale: 1 }, { keyframes: [{ scale: 1.15, duration: 0.12 }, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" }], transformOrigin: "50% 60%", ...IR }, t55 + 1.7);

  // ---- shot 56: write it down — everything collapses to one point of light ----
  const t56 = S(56);
  tl.to(["#a6-all", "#a6-28"], { scale: 0, opacity: 0, transformOrigin: "960px 470px", duration: 0.8, ease: "expo.in" }, t56 + 0.1);
  tl.to("#a6-bgword", { opacity: 0, duration: 0.8 }, t56 + 0.1);
  tl.fromTo("#a6-dot", { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: "expo.out", ...IR }, t56 + 0.85);
  tl.to("#a6-dot", { scale: 1.6, duration: 0.45, yoyo: true, repeat: 3, ease: "sine.inOut" }, t56 + 1.15);
  tl.to("#a6-dot", { scaleX: 70, scaleY: 0.15, duration: 0.5, ease: "expo.in" }, t56 + 3.0);
  tl.to("#a6-dot", { opacity: 0, duration: 0.35 }, t56 + 3.45);
})();
