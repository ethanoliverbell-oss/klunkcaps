/* Klunk Caps site script. No third-party code; card details are never handled here (checkout runs on Shopify). */
import * as THREE from "three";
import { RoundedBoxGeometry } from "./vendor/RoundedBoxGeometry.js";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";

/* Refuse to run inside someone else's frame (clickjacking protection; GitHub Pages can't send X-Frame-Options). */
if (window.top !== window.self) { document.documentElement.style.display = "none"; try { window.top.location.replace(window.self.location.href); } catch (e) {} throw new Error("framed"); }

/* ===================== Store settings ===================== */
const STORE = { email: "hello@klunkcaps.com", checkoutUrl: "",
  /* Set shopifyCheckout to true once Shopify Payments is active and the store password is removed.
     The cart then goes straight to Shopify's secure checkout with these variants. */
  shopifyCheckout: false, shopifyDomain: "x0trmf-7b.myshopify.com" };
/* Shopify variant IDs, keyed "productId|option|size" */
const VARIANT = {
  "script|Cyrillic|": 54793729442120, "script|Spirit|": 54793729474888, "script|Handmade|": 54793729507656, "script|Katakana|": 54793729540424,
  "script|Cyrillic, white|": 54793729573192, "script|Greek|": 54793729605960, "script|Fate|": 54793729638728,
  "phantom|Grey|": 54793730064712, "phantom|Black|": 54793730097480, "phantom|Pink|": 54793730130248, "phantom|Green|": 54793730163016,
  "phantom|Red|": 54793730195784, "phantom|Purple|": 54793730228552, "phantom|White|": 54793730261320,
  "topo|Green Vine|133": 54793728229704, "topo|Red Bean|133": 54793728262472, "topo|Blush|133": 54793728295240, "topo|Lucky Red|133": 54793728328008,
  "topo|Sky Blue|133": 54793728360776, "topo|White|97": 54793728393544, "topo|Blackberry|97": 54793728426312, "topo|Red|97": 54793728459080,
  "topo|Blue|97": 54793728491848, "topo|Black|97": 54793728524616, "topo|White|133": 54793728557384, "topo|Pink|97": 54793728590152,
  "topo|Blackberry|133": 54793728622920, "topo|Green|97": 54793728655688, "topo|Black|133": 54793728688456, "topo|Purple|97": 54793728721224,
  "topo|Matcha Green|133": 54793728753992, "topo|Lavender|133": 54793728786760, "topo|Polar Day|133": 54793728819528, "topo|Violet|133": 54793728852296
};

/* ===================== Products (same three lines) ===================== */
/* Product photos are served from Shopify's CDN (our store platform), not from the supplier. */
const IMG = (id, w = 960) => "https://cdn.shopify.com/s/files/1/0996/5702/3816/files/" + id.replace(/\.(jpg|png|webp)$/, "") + ".webp?width=" + w;
const PHOTO = {
  topo: { "Matcha Green":"Sa9da428e0c954f8996a5a831684d92ddR", "Black":"Sc9470d7b5f1a49cab10993d3bb4375f2d", "White":"Sc4c59fca0a354ca5b86b1f6537adfb7eu", "Blackberry":"S22dc2f52fcca4f34a45bed8db17b230ef", "Polar Day":"Sa6be2f33a0f34ee4aacc0db7eb25d189R", "Sky Blue":"Sc2b52c34a4e344c58692a924498a5a6cY", "Lavender":"S7c400ddec95a4a8ab4449fb4ab2c06d6z", "Violet":"Sdbfd17b6617349238fcfdee636dc61d25", "Blush":"S206b550017ee46138b74600862a4ee1cU", "Lucky Red":"S48f4c2473ee1490abf64aaec3fc27f09O", "Red Bean":"S2c673b76a02744ed86bad193cd0f16fb5", "Green Vine":"S9fd5c19059f641e8aee8175cea2072e7q", "Red":"S3c9629e4c3194bb8b6cf1e65ef1631f6m", "Pink":"Se0bb4b2ff70142e18a2aa9d2a8db9f038", "Purple":"S597e4cf9fc394cd8866ba6998de881818", "Blue":"Sf8ed291715bd471b82ccfd691ba7efcfr", "Green":"S0ce35850ea9f44b28f0e25cb64609878T" },
  phantom: { "Black":"Sb72f27057c414b81a89ba2d5b5b7a961X.png", "Grey":"Sb72f27057c414b81a89ba2d5b5b7a961X.png", "White":"Sb72f27057c414b81a89ba2d5b5b7a961X.png", "Purple":"Sb72f27057c414b81a89ba2d5b5b7a961X.png", "Red":"Sb72f27057c414b81a89ba2d5b5b7a961X.png", "Green":"Sb72f27057c414b81a89ba2d5b5b7a961X.png", "Pink":"Sb72f27057c414b81a89ba2d5b5b7a961X.png" },
  script: { "Greek":"S6fef42d908084ab6b08a56331c7ead01j", "Katakana":"Sc4d2ac37414443a790e55ac0d92774b5W", "Cyrillic":"S77c7bd1c6e744fefa81fa70836d62ca2U", "Cyrillic, white":"S64f375bef2704b35839decc51fbd3e5d3", "Handmade":"Sd3007ca21b294a409af93cd71602e85e9", "Spirit":"S4d1be74673454f3ca23d08bf92f0155cA", "Fate":"Sd879a2a6cc714bd98557f86a61d97224g" }
};
const PRODUCTS = [
  {
    id: "script", name: "Script", optionLabel: "Theme", price: { USD: 65, EUR: 59 }, blurb: "Retro keys, second alphabet",
    tag: "Retro cream and grey keys with dye-sublimated legends that won't wear off. Pick a second alphabet or another theme.",
    image: IMG("S6bf2d1509ae44a6496434ea84c163f550.jpg"),
    finish: { kind: "pbt", pattern: "script", sideLegend: false },
    options: [
      { name: "Katakana", hex: "#E7E1D2", sub: "キ" }, { name: "Greek", hex: "#E7E1D2", sub: "Κ" },
      { name: "Cyrillic", hex: "#E7E1D2", sub: "К" }, { name: "Cyrillic, white", hex: "#F3F2EE", sub: "К" },
      { name: "Handmade", hex: "#E7E1D2", sub: "✱", soldOut: true }, { name: "Spirit", hex: "#E7E1D2", sub: "◐", soldOut: true },
      { name: "Fate", hex: "#E7E1D2", sub: "✦", soldOut: true }
    ],
    specs: [["Profile","Cherry"],["Material","PBT"],["Legends","Dye-sublimated"],["Keys","142"]]
  },
  {
    id: "topo", name: "Topo", optionLabel: "Colour", blurb: "Map pattern, 17 colours",
    tag: "A topographic map pattern with legends printed on the front edge, so your backlight glows through.",
    image: IMG("S9a317d0bd35f472098bce26df3ec522cD.jpg"),
    finish: { kind: "pbt", pattern: "topo", sideLegend: true },
    sizes: [{ id: "97", label: "97 keys", price: { USD: 27, EUR: 25 } }, { id: "133", label: "133 keys", price: { USD: 35, EUR: 32 } }],
    options: [
      { name: "Matcha Green", hex: "#A9C18C", sizes: ["133"] },
      { name: "Black", hex: "#2B2D33", sizes: ["97","133"] },
      { name: "White", hex: "#E9ECEF", sizes: ["97","133"] },
      { name: "Blackberry", hex: "#463452", sizes: ["97","133"] },
      { name: "Polar Day", hex: "#CFE2F0", sizes: ["133"] },
      { name: "Sky Blue", hex: "#8EC3E6", sizes: ["133"] },
      { name: "Lavender", hex: "#BBAEDC", sizes: ["133"] },
      { name: "Violet", hex: "#7B5EA7", sizes: ["133"] },
      { name: "Blush", hex: "#F0C3CB", sizes: ["133"] },
      { name: "Lucky Red", hex: "#C3363A", sizes: ["133"] },
      { name: "Red Bean", hex: "#8E3B3F", sizes: ["133"] },
      { name: "Green Vine", hex: "#5E8C61", sizes: ["133"] },
      { name: "Red", hex: "#D6403F", sizes: ["97"] },
      { name: "Pink", hex: "#F2A7BC", sizes: ["97"] },
      { name: "Purple", hex: "#8A55C2", sizes: ["97"] },
      { name: "Blue", hex: "#3D6FD1", sizes: ["97"] },
      { name: "Green", hex: "#53A36B", sizes: ["97"] }
    ],
    specs: [["Profile","Cherry"],["Material","PBT"],["Legends","Front, shine-through"],["Keys","97 or 133"]]
  },
  {
    id: "phantom", name: "Phantom", optionLabel: "Colour", price: { USD: 49, EUR: 45 }, blurb: "XVX gradient, 7 colours",
    tag: "XVX double-shot PBT. Each key fades from deep colour to dark, with see-through letters on the top and side.",
    image: IMG("Sb72f27057c414b81a89ba2d5b5b7a961X.png"),
    finish: { kind: "pbt", pattern: "gradient", sideLegend: true },
    options: [
      { name: "Black", hex: "#3A3D44" }, { name: "Grey", hex: "#8D929A" }, { name: "White", hex: "#ECEDEF" },
      { name: "Purple", hex: "#7353B0" }, { name: "Red", hex: "#C04A3B" }, { name: "Green", hex: "#5D9A63" }, { name: "Pink", hex: "#E7A9BA" }
    ],
    specs: [["Brand","XVX"],["Material","PBT, double-shot"],["Legends","Top and side, shine-through"],["Keys","Full set"]]
  }

];

/* ===================== Helpers ===================== */
const $ = (s, el = document) => el.querySelector(s);
const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const store = {
  get(k, f) { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
/* Currency: whole-number prices in US dollars or euros. Guessed from the visitor's time zone, switchable in the nav, remembered. */
const CURRENCIES = { USD: { locale: "en-US", note: "Prices in US dollars. Sales tax, if any, is shown at checkout. Free shipping." },
                     EUR: { locale: "en-IE", note: "Prices in euros, VAT included. Free shipping." } };
const guessCur = () => { try { return /^America\//.test(Intl.DateTimeFormat().resolvedOptions().timeZone) ? "USD" : "EUR"; } catch (e) { return "USD"; } };
let CUR = store.get("klunk-cur", null); if (!CURRENCIES[CUR]) CUR = guessCur();
const money = n => new Intl.NumberFormat(CURRENCIES[CUR].locale, { style: "currency", currency: CUR, maximumFractionDigits: 0 }).format(n);
const priceOf = (p, size) => (p.sizes ? p.sizes.find(s => s.id === size).price : p.price)[CUR];
const minPrice = p => p.sizes ? Math.min(...p.sizes.map(s => s.price[CUR])) : p.price[CUR];
document.querySelectorAll(".js-email").forEach(a => { a.href = "mailto:" + STORE.email; if (a.textContent.includes("@")) a.textContent = STORE.email; });
$("#year").textContent = new Date().getFullYear();

/* ===================== Sound (synthesised, only on user action) ===================== */
let actx;
const SOUND = { topo: { f: 150, click: 1800, decay: .14 }, phantom: { f: 190, click: 2600, decay: .12 }, script: { f: 130, click: 1500, decay: .16 } };
function playKey(setId) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const s = SOUND[setId] || SOUND.topo, t = actx.currentTime;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(s.f * 1.4, t); o.frequency.exponentialRampToValueAtTime(s.f * .55, t + s.decay * .7);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.5, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + s.decay);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + s.decay + .02);
    const len = Math.floor(actx.sampleRate * .028), buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const n = actx.createBufferSource(); n.buffer = buf;
    const f = actx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = s.click; f.Q.value = .9;
    const ng = actx.createGain(); ng.gain.value = .28;
    n.connect(f).connect(ng).connect(actx.destination); n.start(t);
  } catch (e) {}
}

/* ===================== Textures ===================== */
function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
function shade(hex, amt) {
  const c = new THREE.Color(hex), hsl = {}; c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amt))); return "#" + c.getHexString();
}
function luminance(hex) { const c = new THREE.Color(hex); return .2126 * c.r + .7152 * c.g + .0722 * c.b; }
function canvasTex(draw, size = 512) {
  const cv = document.createElement("canvas"); cv.width = cv.height = size;
  const ctx = cv.getContext("2d"); draw(ctx, size);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function topTexture(product, opt) {
  return canvasTex((ctx, S) => {
    ctx.fillStyle = opt.hex; ctx.fillRect(0, 0, S, S);
    if (product.finish.pattern === "topo") {
      const r = rng(7), dark = luminance(opt.hex) > .5;
      ctx.strokeStyle = dark ? shade(opt.hex, -.22) : shade(opt.hex, .2); ctx.lineWidth = 3;
      const cx = S * .58, cy = S * .46, phase = [r() * 6, r() * 6, r() * 6];
      for (let k = 1; k <= 16; k++) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + .01; a += .05) {
          const rad = k * S * .045 * (1 + .18 * Math.sin(a * 3 + phase[0] + k * .2) + .1 * Math.sin(a * 5 + phase[1]) + .06 * Math.sin(a * 2 + phase[2] - k * .3));
          const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad * .9;
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else if (product.finish.pattern === "gradient") {
      const g = ctx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, shade(opt.hex, -.28)); g.addColorStop(1, opt.hex);
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = luminance(opt.hex) > .5 ? "rgba(30,32,38,.8)" : "rgba(245,245,245,.92)";
      ctx.font = "600 130px 'Inter Display', Arial, sans-serif"; ctx.textBaseline = "top"; ctx.fillText("K", S * .2, S * .16);
    } else if (product.finish.pattern === "script") {
      ctx.fillStyle = "#3A3A3D";
      ctx.font = "600 150px 'Inter Display', Arial, sans-serif"; ctx.textBaseline = "top"; ctx.fillText("K", S * .2, S * .16);
      ctx.fillStyle = "#B4532A"; ctx.font = "500 110px 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', Arial, sans-serif";
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "right"; ctx.fillText(opt.sub || "キ", S * .8, S * .8);
    }
  });
}
function frontEmissive(product) {
  return canvasTex((ctx, S) => {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, S, S);
    if (!product.finish.sideLegend) return;
    ctx.fillStyle = "#fff"; ctx.font = "600 150px 'Inter Display', Arial, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("K", S / 2, S * .5);
  });
}
function frontMap(product, opt) {
  return canvasTex((ctx, S) => {
    ctx.fillStyle = opt.hex; ctx.fillRect(0, 0, S, S);
    if (!product.finish.sideLegend) return;
    ctx.fillStyle = luminance(opt.hex) > .5 ? "rgba(30,32,38,.85)" : "rgba(240,242,246,.9)";
    ctx.font = "600 150px 'Inter Display', Arial, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("K", S / 2, S * .5);
  });
}
function shadowTexture() {
  return canvasTex((ctx, S) => {
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  }, 256);
}

/* ===================== Keycap geometry (procedural Cherry-style cap) ===================== */
function keycapGeometry() {
  const W = 1, H = .62, D = 1;
  const g = new RoundedBoxGeometry(W, H, D, 8, .11);
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const t = (v.y + H / 2) / H;                 // 0 bottom → 1 top
    const s = 1 - .26 * t;                       // taper toward the top
    v.x *= s; v.z *= s * .98;
    if (t > .9) {                                // cylindrical dish across the top
      const nx = v.x / (W * .5 * (1 - .26));
      v.y -= .045 * Math.max(0, 1 - nx * nx) * ((t - .9) / .1);
    }
    v.z += .03 * t;                              // lean the top back slightly, like a sculpted row
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* ===================== Viewer ===================== */
function createViewer(canvas, stageEl, { follow = "window", drag = false, autoSpin = false, scale = 1 } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { stageEl.classList.add("no-webgl"); return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .5;
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 50);
  camera.position.set(0, 1.35, 3.6); camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2.5, 4, 3); scene.add(key);
  const rimA = new THREE.PointLight(0xC9CED6, 16, 8); rimA.position.set(-2.2, .8, -1.2); scene.add(rimA);
  const rimB = new THREE.PointLight(0xFFFFFF, 9, 8); rimB.position.set(2.4, -.3, -1.6); scene.add(rimB);
  scene.add(new THREE.AmbientLight(0xffffff, .25));

  const rig = new THREE.Group(); scene.add(rig);
  const cap = new THREE.Group(); rig.add(cap); cap.scale.setScalar(scale);
  const geo = keycapGeometry();
  const mats = Array.from({ length: 6 }, () => new THREE.MeshPhysicalMaterial({ roughness: .7, metalness: 0 }));
  const body = new THREE.Mesh(geo, mats); cap.add(body);
  // MX cross stem under the cap
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: .6 });
  const s1 = new THREE.Mesh(new THREE.BoxGeometry(.06, .22, .2), stemMat), s2 = new THREE.Mesh(new THREE.BoxGeometry(.2, .22, .06), stemMat);
  s1.position.y = s2.position.y = -.42; cap.add(s1, s2);
  // Contact shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.72; rig.add(shadow);

  let backlight = false, spinning = autoSpin, current = null;
  function setConfig(product, opt, light = backlight) {
    backlight = light; current = { product, opt };
    const translucent = product.finish.kind === "translucent";
    const base = new THREE.Color(opt.hex);
    mats.forEach((m, i) => {
      m.map && m.map.dispose(); m.emissiveMap && m.emissiveMap.dispose();
      m.map = null; m.emissiveMap = null; m.emissive.set(0x000000); m.emissiveIntensity = 1;
      m.color.copy(base);
      m.roughness = translucent ? .32 : .72;
      m.transmission = translucent ? .55 : 0; m.thickness = translucent ? .8 : 0; m.ior = 1.5;
      m.clearcoat = 0; m.sheen = translucent ? 0 : .08; m.sheenRoughness = .8; m.sheenColor.set(0xffffff);
      m.needsUpdate = true;
    });
    // group order: px, nx, py(top), ny, pz(front), nz
    const top = mats[2], front = mats[4];
    top.map = topTexture(product, opt); top.color.set(0xffffff);
    front.map = frontMap(product, opt); front.color.set(0xffffff);
    if (product.finish.sideLegend && backlight) {
      front.emissiveMap = frontEmissive(product); front.emissive.set(0xFFFFFF); front.emissiveIntensity = 3.6;
    }
    if (translucent && backlight) mats.forEach(m => { if (m !== front) { m.emissive.set(0xFFFFFF); m.emissiveIntensity = .08; } });
    stemMat.color.copy(base).multiplyScalar(.85);
    rimB.intensity = backlight ? 22 : 9;
    pressAnim = 1;
  }
  const setBacklight = on => current && setConfig(current.product, current.opt, on);
  const setSpin = on => { spinning = on; };

  // Pointer follow + drag
  const target = { x: 0, y: 0 }, rot = { x: 0, y: 0 };
  let dragYaw = 0, dragging = false, lastX = 0, dragVel = 0;
  const followEl = follow === "window" ? window : stageEl;
  followEl.addEventListener("pointermove", e => {
    const r = follow === "window" ? { left: 0, top: 0, width: innerWidth, height: innerHeight } : stageEl.getBoundingClientRect();
    target.y = ((e.clientX - r.left) / r.width - .5) * .9;
    target.x = ((e.clientY - r.top) / r.height - .5) * .5;
    if (dragging) { const dx = e.clientX - lastX; dragYaw += dx * .01; dragVel = dx * .01; lastX = e.clientX; }
  });
  if (follow !== "window") stageEl.addEventListener("pointerleave", () => { target.x = target.y = 0; });
  let pressAnim = 0, downAt = 0, downX = 0;
  if (drag) {
    canvas.addEventListener("pointerdown", e => { dragging = true; lastX = downX = e.clientX; downAt = performance.now(); canvas.setPointerCapture(e.pointerId); });
    const end = e => {
      if (!dragging) return; dragging = false;
      if (Math.abs(e.clientX - downX) < 5 && performance.now() - downAt < 350) { pressAnim = 1; current && playKey(current.product.id); }
    };
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", () => { dragging = false; });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const a = w / h; camera.position.set(0, 1.35 * Math.max(1, 1 / a) * .9, 3.6 * Math.max(1, 1.15 / a)); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  let t = 0, last = performance.now();
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const now = performance.now(), dt = Math.min((now - last) / 1000, .05); last = now; t += dt;
    rot.x += (target.x - rot.x) * .06; rot.y += (target.y - rot.y) * .06;
    if (!dragging) { dragYaw += dragVel; dragVel *= .92; if (spinning && !reduceMotion) dragYaw += dt * .35; }
    const float = reduceMotion ? 0 : Math.sin(t * 1.4) * .05;
    rig.position.y = float;
    rig.rotation.set(.22 + rot.x, -.55 + rot.y + dragYaw + (reduceMotion ? 0 : Math.sin(t * .5) * .06), 0);
    pressAnim = Math.max(0, pressAnim - dt * 5);
    cap.position.y = -Math.sin(pressAnim * Math.PI) * .06;
    shadow.material.opacity = .85 - float * 2;
    renderer.render(scene, camera);
  });
  return { setConfig, setBacklight, setSpin };
}

/* ===================== Hero ===================== */
const hero = createViewer($("#heroCanvas"), $("#heroStage"), { follow: "window", scale: 1.05 });
const heroTag = $(".stage-tag");
let heroIdx = 0;
const HERO_CYCLE = [["script", "Katakana"], ["script", "Greek"], ["phantom", "Purple"], ["script", "Cyrillic"], ["topo", "Matcha Green"]];
function heroShow([pid, oname]) {
  const p = PRODUCTS.find(x => x.id === pid), o = p.options.find(x => x.name === oname);
  hero && hero.setConfig(p, o, pid !== "script");
  heroTag.textContent = `${p.name.toUpperCase()} · `; const hb = document.createElement("b"); hb.textContent = o.name; heroTag.append(hb);
}
heroShow(HERO_CYCLE[0]);
if (!reduceMotion) setInterval(() => { if (document.hidden) return; heroIdx = (heroIdx + 1) % HERO_CYCLE.length; heroShow(HERO_CYCLE[heroIdx]); }, 4200);

/* ===================== Configurator ===================== */
const cfgView = createViewer($("#cfgCanvas"), $("#cfgStage"), { follow: "stage", drag: true, autoSpin: true, scale: 1.05 });
const state = { pid: "script", opt: "Katakana", size: "133", light: false };
const setTabs = $("#setTabs");
const drawTabs = () => { setTabs.innerHTML = PRODUCTS.map(p => `<button class="set-tab" role="tab" type="button" data-pid="${p.id}" aria-selected="false">${p.name}${p.id === "script" ? '<span class="pick">OUR PICK</span>' : ""}<small>${p.sizes ? "from " : ""}${esc(money(minPrice(p)))}</small></button>`).join(""); };
drawTabs();

function renderCfg() {
  const p = PRODUCTS.find(x => x.id === state.pid);
  let opt = p.options.find(o => o.name === state.opt) || p.options.find(o => !o.soldOut) || p.options[0]; state.opt = opt.name;
  setTabs.querySelectorAll("[data-pid]").forEach(b => { const on = b.dataset.pid === p.id; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
  document.querySelectorAll("[data-pick]").forEach(b => b.setAttribute("aria-pressed", b.dataset.pick === p.id));
  $("#cfgName").textContent = p.name; $("#cfgTag").textContent = p.tag;
  $("#optLabel").firstChild.textContent = p.optionLabel; $("#optName").textContent = opt.name;
  const group = $("#optGroup");
  if (p.optionLabel === "Colour") {
    group.className = "swatches";
    group.innerHTML = p.options.map(o => `<button type="button" class="sw" role="radio" aria-checked="${o.name === opt.name}" aria-label="${o.name}" title="${o.name}" data-opt="${o.name}" style="--c:${o.hex}"></button>`).join("");
  } else {
    group.className = "opts";
    group.innerHTML = p.options.map(o => `<button type="button" class="opt${o.soldOut ? " sold" : ""}" role="radio" aria-checked="${o.name === opt.name}" data-opt="${o.name}"${o.soldOut ? ' title="Sold out for now"' : ""}>${o.name}${o.soldOut ? " · sold out" : ""}</button>`).join("");
  }
  const sizeWrap = $("#sizeWrap");
  if (p.sizes) {
    sizeWrap.hidden = false;
    const allowed = opt.sizes || p.sizes.map(s => s.id);
    if (!allowed.includes(state.size)) state.size = allowed[allowed.length - 1];
    $("#sizeGroup").innerHTML = p.sizes.map(s => {
      const ok = allowed.includes(s.id);
      return `<button type="button" class="opt" role="radio" data-size="${s.id}" aria-checked="${s.id === state.size}" aria-disabled="${!ok}" title="${ok ? "" : opt.name + " isn't made in this size"}">${s.label}</button>`;
    }).join("");
  } else { sizeWrap.hidden = true; state.size = null; }
  const ph = (PHOTO[p.id] || {})[opt.name], photo = $("#cfgPhoto"), wrapP = $("#cfgPhotoWrap");
  if (ph) { wrapP.classList.remove("no-img"); photo.src = IMG(ph, 640); photo.alt = `${p.name} in ${opt.name} on a full keyboard`; }
  $("#cfgPhotoLbl").textContent = p.id === "phantom" ? "PHANTOM · 4 OF 7 COLOURS" : `${p.name.toUpperCase()} · ${opt.name.toUpperCase()}`;
  $("#cfgPrice").textContent = money(priceOf(p, state.size));
  state.light = !!p.finish.sideLegend;
  const addBtn = $("#addBtn"); addBtn.disabled = !!opt.soldOut; addBtn.textContent = opt.soldOut ? "Sold out" : "Add to cart";
  cfgView && cfgView.setConfig(p, opt, state.light);
}
setTabs.addEventListener("click", e => { const b = e.target.closest("[data-pid]"); if (!b) return; state.pid = b.dataset.pid; state.opt = null; renderCfg(); });
setTabs.addEventListener("keydown", e => {
  if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const ids = PRODUCTS.map(p => p.id); let i = ids.indexOf(state.pid);
  i = (i + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length;
  state.pid = ids[i]; state.opt = null; renderCfg(); setTabs.querySelector(`[data-pid="${ids[i]}"]`).focus();
});
$("#optGroup").addEventListener("click", e => { const b = e.target.closest("[data-opt]"); if (!b) return; state.opt = b.dataset.opt; renderCfg(); });
$("#sizeGroup").addEventListener("click", e => { const b = e.target.closest("[data-size]"); if (!b || b.getAttribute("aria-disabled") === "true") return; state.size = b.dataset.size; renderCfg(); });
$("#cfgPhoto").addEventListener("error", () => $("#cfgPhotoWrap").classList.add("no-img"));
renderCfg();

/* ===================== Set picker: Script first, the others one tap away ===================== */
const SET_PHOTO = { script: IMG(PHOTO.script.Katakana, 480), topo: IMG(PHOTO.topo["Matcha Green"], 480), phantom: IMG(PHOTO.phantom.Purple, 480) };
const drawPicker = () => { $("#setPicker").innerHTML = PRODUCTS.map(p => `<button type="button" class="set-card${p.id === "script" ? " is-pick" : ""}" data-pick="${p.id}" aria-pressed="${p.id === state.pid}">
  <span class="set-card-img"><img src="${SET_PHOTO[p.id]}" alt="" loading="lazy" referrerpolicy="no-referrer"></span>
  <span class="set-card-txt"><b>${p.name}</b>${p.id === "script" ? '<em>Our pick</em>' : ""}<span>${esc(p.blurb)}</span></span>
  <span class="set-card-price">${p.sizes ? "<small>from</small>" : ""}${esc(money(minPrice(p)))}</span></button>`).join(""); };
drawPicker();
$("#setPicker").addEventListener("click", e => {
  const b = e.target.closest("[data-pick]"); if (!b) return;
  state.pid = b.dataset.pick; state.opt = null; renderCfg();
  $(".cfg-panel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
});
$("#setPicker").addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.parentElement.classList.add("no-img"); }, true);

/* ===================== Featured Script themes ===================== */
const FEAT_THEMES = ["Cyrillic", "Katakana", "Greek", "Cyrillic, white"];
$("#themes").innerHTML = FEAT_THEMES.map(t => `<button type="button" class="theme" data-theme="${t}" aria-label="Choose Script in ${t}"><img src="${IMG(PHOTO.script[t], 240)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span>${t}</span></button>`).join("");
const goScript = t => { state.pid = "script"; state.opt = t; renderCfg(); $("#configurator").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); };
$("#themes").addEventListener("click", e => { const b = e.target.closest("[data-theme]"); if (b) goScript(b.dataset.theme); });
$("#featGo").addEventListener("click", e => { e.preventDefault(); goScript(state.pid === "script" ? state.opt : "Katakana"); });
document.querySelectorAll(".feat-photo img, .theme img").forEach(img => { const f = () => img.parentElement.classList.add("no-img"); img.addEventListener("error", f); if (img.complete && img.naturalWidth === 0) f(); });

/* ===================== Cart ===================== */
/* Never trust what comes back from storage: keep only lines that match a real product, option and size. */
const validLine = l => {
  if (!l || typeof l !== "object") return false;
  const p = PRODUCTS.find(x => x.id === l.id); if (!p) return false;
  if (!p.options.some(o => o.name === l.option && !o.soldOut)) return false;
  if (p.sizes ? !p.sizes.some(z => z.id === l.size) : l.size != null) return false;
  return Number.isInteger(l.qty) && l.qty >= 1 && l.qty <= 20;
};
const rawCart = store.get("klunk-cart-v2", []);
let cart = Array.isArray(rawCart) ? rawCart.filter(validLine).map(l => ({ id: l.id, option: l.option, size: l.size ?? null, qty: l.qty })) : [];
const keyOf = l => [l.id, l.option, l.size].join("|");
const optText = l => { const p = PRODUCTS.find(x => x.id === l.id); return l.option + (p.sizes ? ", " + p.sizes.find(s => s.id === l.size).label : ""); };
const total = () => cart.reduce((s, l) => { const p = PRODUCTS.find(x => x.id === l.id); return p ? s + priceOf(p, l.size) * l.qty : s; }, 0);
$("#addBtn").addEventListener("click", () => {
  const p = PRODUCTS.find(x => x.id === state.pid);
  if (p.options.find(o => o.name === state.opt)?.soldOut) return;
  const line = { id: p.id, option: state.opt, size: state.size, qty: 1 };
  const f = cart.find(l => keyOf(l) === keyOf(line)); f ? (f.qty = Math.min(20, f.qty + 1)) : cart.push(line);
  saveCart(); playKey(p.id);
  const n = $("#addedNote"); n.textContent = `Added ${p.name}, ${optText(line)}.`;
  clearTimeout(n._t); n._t = setTimeout(() => n.textContent = "", 3500);
  openCart();
});
function saveCart() { store.set("klunk-cart-v2", cart); renderCart(); }
function renderCart() {
  cart = cart.filter(validLine);
  const count = cart.reduce((n, l) => n + l.qty, 0);
  $("#cartCount").textContent = count; $("#cartBtn").setAttribute("aria-label", `Cart, ${count} item${count === 1 ? "" : "s"}`);
  const body = $("#cartBody");
  if (!cart.length) {
    body.innerHTML = `<div class="empty"><p>Your cart is empty. Pick a set to get started.</p><a class="btn btn-ghost btn-sm" href="#configurator" id="emptyGo">Go to the shop</a></div>`;
    $("#cartFoot").hidden = true; $("#emptyGo").addEventListener("click", closeCart); return;
  }
  $("#cartFoot").hidden = false;
  body.innerHTML = cart.map((l, i) => { const p = PRODUCTS.find(x => x.id === l.id); return `<div class="line">
    <img src="${esc(p.image.replace(/width=\d+/, "width=240"))}" alt="" referrerpolicy="no-referrer">
    <div><div class="line-name">${esc(p.name)}</div><div class="line-opt">${esc(optText(l))}</div>
    <div class="qty"><button type="button" data-dec="${i}" aria-label="One fewer ${esc(p.name)}">−</button><span>${esc(l.qty)}</span><button type="button" data-inc="${i}" aria-label="One more ${esc(p.name)}">+</button></div></div>
    <div><div class="line-price">${esc(money(priceOf(p, l.size) * l.qty))}</div><button type="button" class="rm" data-rm="${i}">Remove</button></div></div>`; }).join("");
  body.querySelectorAll(".line img").forEach(img => img.addEventListener("error", () => { const d = document.createElement("div"); d.className = "thumb"; img.replaceWith(d); }, { once: true }));
  $("#cartSub").textContent = $("#cartTotal").textContent = money(total());
}
$("#cartBody").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.inc && cart[+b.dataset.inc]) cart[+b.dataset.inc].qty = Math.min(20, cart[+b.dataset.inc].qty + 1);
  if (b.dataset.dec) { const l = cart[+b.dataset.dec]; if (--l.qty < 1) cart.splice(+b.dataset.dec, 1); }
  if (b.dataset.rm) cart.splice(+b.dataset.rm, 1);
  saveCart();
});
function openCart() { document.body.classList.add("cart-open"); $("#cart").setAttribute("aria-hidden", "false"); $("#cartBtn").setAttribute("aria-expanded", "true"); $("#checkoutNote").classList.remove("show"); setTimeout(() => $("#cartClose").focus(), 50); }
function closeCart() { document.body.classList.remove("cart-open"); $("#cart").setAttribute("aria-hidden", "true"); $("#cartBtn").setAttribute("aria-expanded", "false"); $("#cartBtn").focus({ preventScroll: true }); }
$("#cartBtn").addEventListener("click", openCart); $("#cartClose").addEventListener("click", closeCart); $("#scrim").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("cart-open")) closeCart(); });
$("#checkoutBtn").addEventListener("click", () => {
  if (STORE.shopifyCheckout) {
    const items = cart.map(l => { const v = VARIANT[[l.id, l.option, l.size || ""].join("|")]; return v ? v + ":" + l.qty : null; });
    if (items.length && items.every(x => x && /^\d+:\d+$/.test(x))) { location.assign(`https://${STORE.shopifyDomain}/cart/${items.join(",")}`); return; }
  }
  if (STORE.checkoutUrl) { location.href = STORE.checkoutUrl; return; }
  const lines = cart.map(l => { const p = PRODUCTS.find(x => x.id === l.id); return `${l.qty} x ${p.name} (${optText(l)}): ${money(priceOf(p, l.size) * l.qty)}`; });
  $("#mailOrder").href = `mailto:${STORE.email}?subject=${encodeURIComponent("Order from klunkcaps.com")}&body=${encodeURIComponent(`Hi Klunk Caps,\n\nI'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${money(total())}\n\nShipping address:\n\n`)}`;
  $("#checkoutNote").classList.add("show");
});
renderCart();
window.__klunk = { PRODUCTS, state };

/* ===================== Currency display ===================== */
function renderPrices() {
  $("#heroFrom").textContent = "From " + money(Math.min(...PRODUCTS.map(minPrice)));
  $("#featPrice").textContent = money(minPrice(PRODUCTS.find(p => p.id === "script")));
  $("#curNote").textContent = CURRENCIES[CUR].note;
  document.querySelectorAll("[data-cur]").forEach(b => b.setAttribute("aria-pressed", b.dataset.cur === CUR));
  drawTabs(); drawPicker(); renderCfg(); renderCart();
}
$("#curToggle").addEventListener("click", e => {
  const b = e.target.closest("[data-cur]"); if (!b || !CURRENCIES[b.dataset.cur]) return;
  CUR = b.dataset.cur; store.set("klunk-cur", CUR); renderPrices();
});
renderPrices();
