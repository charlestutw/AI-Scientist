"""Assemble index.html for the HyperFrames film from src/ modules.

Timing comes from src/storyboard_data.py (the same data that generated 分鏡.md),
so subtitles stay frame-exact with the storyboard.

Usage: python3 build.py [--fonts]   (--fonts re-downloads font subsets)
"""
import hashlib, json, os, re, sys, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
FONTS = os.path.join(HERE, "fonts")
FPS = 30

# ---------- storyboard ----------
code = open(os.path.join(SRC, "storyboard_data.py"), encoding="utf-8").read().split("\ndef plain")[0]
ns = {}
exec(code, ns)
ACTS = ns["ACTS"]

REVEAL = {"浮現": "rise", "解碼": "decode", "掃描": "scan", "重擊": "slam"}
SPECIAL = {24: "stairs", 43: "drop"}


def frames(text, extra):
    n = len(text.replace("<", "").replace(">", ""))
    return round((max(2.6, 1.3 + 0.17 * n) + extra * 1.4) * FPS)


shots, acts, f = [], [], 0
for ai, (acode, aname, _intent, _trans, rows) in enumerate(ACTS):
    a0 = f
    for text, extra, reveal, *_ in rows:
        n = len(shots) + 1
        d = frames(text, extra)
        shots.append(dict(n=n, act=ai + 1, text=text, reveal=SPECIAL.get(n, REVEAL[reveal]), f0=f, fd=d))
        f += d
    acts.append(dict(n=ai + 1, code=acode, name=aname, f0=a0, fd=f - a0))
TOTAL = f


def sec(fr):
    return round(fr / FPS, 4)


def tc(fr):
    return f"T+{fr // FPS // 60:02d}:{fr // FPS % 60:02d}:{fr % FPS:02d}"


def sub_html(s):
    body = re.sub(r"<(.+?)>", r"<em>\1</em>", s["text"])
    return (f'<div id="sub-{s["n"]:02d}" class="sub clip" data-start="{sec(s["f0"])}" data-duration="{sec(s["fd"])}" '
            f'data-track-index="9" data-reveal="{s["reveal"]}">'
            f'<div class="meta">{s["n"]:02d} ／ {len(shots)}</div>'
            f'<div class="line"><span class="txt">{body}</span></div></div>')


# ---------- sources ----------
def read(name):
    return open(os.path.join(SRC, name), encoding="utf-8").read()


act_html = "\n".join(read(f"act{i}.html") for i in range(1, 7))
act_js = "\n".join(read(f"act{i}.js") for i in range(1, 7))
core_css, core_js, shell = read("core.css"), read("core.js"), read("shell.html")

# ---------- fonts (subset to the characters actually used) ----------
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"


def fetch_font(family, axes, text, out):
    css_url = f"https://fonts.googleapis.com/css2?family={family}:{axes}&text={urllib.parse.quote(text)}"
    css = urllib.request.urlopen(urllib.request.Request(css_url, headers={"User-Agent": UA})).read().decode()
    url = re.search(r"url\((https://[^)]+)\)", css).group(1)
    data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA})).read()
    open(os.path.join(FONTS, out), "wb").write(data)


all_text = "".join(s["text"] for s in shots) + act_html + act_js + core_js + shell
cjk = sorted({c for c in all_text if ord(c) > 0x2000})
cjk = sorted(set(cjk) | set("壹貳參肆伍陸第幕"))
cjk_text = "".join(cjk) + "■□◆◇０１２３４５６７８９"
ascii_text = "".join(chr(c) for c in range(32, 127)) + "—·◀▶×→✓"
stamp = hashlib.md5((cjk_text + ascii_text).encode()).hexdigest()[:10]
stamp_file = os.path.join(FONTS, ".stamp")
if "--fonts" in sys.argv or not os.path.exists(stamp_file) or open(stamp_file).read() != stamp:
    fetch_font("Noto+Serif+TC", "wght@200..900", cjk_text, "notoseriftc-var.woff2")
    fetch_font("Noto+Sans+TC", "wght@100..900", cjk_text, "notosanstc-var.woff2")
    fetch_font("Cormorant+Garamond", "wght@300..700", ascii_text, "cormorant-var.woff2")
    open(stamp_file, "w").write(stamp)
    print("fonts refreshed", len(cjk), "CJK glyphs")

# ---------- glyph outlines for decorative type ----------
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.pointInsidePen import PointInsidePen
from fontTools.pens.boundsPen import BoundsPen

_fonts = {}


def lining(f):
    """glyph-name substitutions of the font's 'lnum' feature (Cormorant defaults to old-style figures)."""
    m = {}
    if "GSUB" not in f:
        return m
    gs = f["GSUB"].table
    for fr in gs.FeatureList.FeatureRecord:
        if fr.FeatureTag == "lnum":
            for li in fr.Feature.LookupListIndex:
                for st in gs.LookupList.Lookup[li].SubTable:
                    m.update(getattr(st, "mapping", None) or {})
    return m


def font(name, wght):
    key = (name, wght)
    if key not in _fonts:
        _fonts[key] = instancer.instantiateVariableFont(TTFont(os.path.join(FONTS, name)), {"wght": wght})
    return _fonts[key]


def glyph_path(fname, wght, text, size, x, base, track=0):
    """SVG path data for text set at (x, baseline)."""
    f = font(fname, wght)
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    sc, pen = size / upm, SVGPathPen(None)
    pen = SVGPathPen(gs)
    for ch in text:
        g = lining(f).get(cmap[ord(ch)], cmap[ord(ch)])
        gs[g].draw(TransformPen(pen, (sc, 0, 0, -sc, x, base)))
        x += gs[g].width * sc + track
    return pen.getCommands(), x


def glyph_points(fname, wght, text, size, x, base, step, track=0):
    """Grid-sample points inside the glyph outlines (for particle targets)."""
    f = font(fname, wght)
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    sc, pts = size / upm, []
    for ch in text:
        g = lining(f).get(cmap[ord(ch)], cmap[ord(ch)])
        bp = BoundsPen(gs); gs[g].draw(bp)
        x0, y0, x1, y1 = bp.bounds
        gy = y0
        while gy <= y1:
            gx = x0
            while gx <= x1:
                pp = PointInsidePen(gs, (gx, gy)); gs[g].draw(pp)
                if pp.getResult():
                    pts.append([round(x + gx * sc, 1), round(base - gy * sc, 1)])
                gx += step / sc
            gy += step / sc
        x += gs[g].width * sc + track
    return pts, x


PATHS = {}
PATHS["atom"], _ = glyph_path("notoseriftc-var.woff2", 900, "原子", 720, 1000, 860)
PATHS["pattern"], _ = glyph_path("notoseriftc-var.woff2", 900, "規律", 720, 180, 860)
PATHS["qmark"], _ = glyph_path("notoseriftc-var.woff2", 900, "？", 820, 1080, 790)
PATHS["hydrogen"], _ = glyph_path("notoseriftc-var.woff2", 900, "氫", 480, 720, 500)
P1885, x_end = glyph_points("cormorant-var.woff2", 600, "1885", 500, 0, 0, 7, 4)
off_x = 960 - x_end / 2
P1885 = [[round(p[0] + off_x, 1), round(p[1] + 570, 1)] for p in P1885]
PATHS["y1885"], _ = glyph_path("cormorant-var.woff2", 600, "1885", 500, off_x, 570, 4)

data_js = (f"const FPS = {FPS}, FILM = {TOTAL} / FPS;\n"
           f"const SHOTS = {json.dumps([dict(n=s['n'], act=s['act'], t=sec(s['f0']), d=sec(s['fd'])) for s in shots])};\n"
           f"const ACTS = {json.dumps([dict(n=a['n'], code=a['code'], name=a['name'], t=sec(a['f0']), d=sec(a['fd'])) for a in acts])};\n"
           f"const P1885 = {json.dumps(P1885)};\n")

html = (shell.replace("/*CORE_CSS*/", core_css)
        .replace("<!--ACTS-->", act_html)
        .replace("<!--ACTLABELS-->", "\n        ".join(
            f'<div id="actlbl-{a["n"]}" class="actlbl abs clip" data-start="{sec(a["f0"])}" data-duration="{sec(a["fd"])}" data-track-index="8">'
            f'<span class="actno">第{"壹貳參肆伍陸"[a["n"] - 1]}幕</span><span class="actrule"></span><span class="actname">{a["name"]}</span></div>' for a in acts))
        .replace("<!--SUBS-->", "\n      ".join(sub_html(s) for s in shots))
        .replace("/*DATA_JS*/", data_js)
        .replace("/*CORE_JS*/", core_js)
        .replace("/*ACTS_JS*/", act_js)
        .replace("{{FILM}}", str(sec(TOTAL))))
for k, v in PATHS.items():
    html = html.replace("{{PATH_" + k.upper() + "}}", v)
for a in acts:
    html = html.replace(f"{{{{ACT{a['n']}_T}}}}", str(sec(a["f0"]))).replace(f"{{{{ACT{a['n']}_D}}}}", str(sec(a["fd"])))
assert "{{" not in html, re.findall(r"\{\{\w+\}\}", html)
open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(html)
print(f"index.html built: {len(shots)} shots, {TOTAL} frames ({TOTAL / FPS:.2f}s), {len(P1885)} particles")
