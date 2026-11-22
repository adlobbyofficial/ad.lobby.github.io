const $ = (s) => document.querySelector(s), app = $("#app"), S = SITE;
const wa = `https://wa.me/${S.whatsapp}`, ig = `https://instagram.com/${S.instagram}`;
const pad = (n) => String(n).padStart(2, "0"), br = (t) => t.replace(/\n/g, "<br>");
const L = (t) => `<p class="label rv">${t}</p>`;
const B = (t, h, c = "") => `<a class="btn ${c}" href="${h}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;

/* ---------- media discovery: finds files by name, any common extension ---------- */
const EXT_I = ["jpg", "JPG", "jpeg", "png", "webp", "PNG", "JPEG"], EXT_V = ["mp4", "MP4", "mov", "MOV", "m4v", "webm"];
const cache = new Map(), once = (k, f) => (cache.has(k) || cache.set(k, f()), cache.get(k));
const probeImg = (base) => once("i:" + base, () => new Promise((res) => {
  let i = 0; const t = () => { if (i >= EXT_I.length) return res(null); const im = new Image(), u = `${base}.${EXT_I[i++]}`; im.onload = () => res(u); im.onerror = t; im.src = u; }; t();
}));
const probeVid = (base) => once("v:" + base, () => new Promise((res) => {
  let i = 0; const t = () => { if (i >= EXT_V.length) return res(null); const v = document.createElement("video"), u = `${base}.${EXT_V[i++]}`; v.preload = "metadata"; v.muted = true; v.onloadedmetadata = () => { v.removeAttribute("src"); v.load(); res(u); }; v.onerror = t; v.src = u + "#t=0.1"; }; t();
}));
const CATS = [
  { key: "cinematic", label: "CINEMATIC VIDEOS", type: "video", noun: "Cinematic Film", prefix: "cinematic", dir: "videos/cinematic" },
  { key: "reels", label: "REELS", type: "video", noun: "Reel", prefix: "reel", dir: "videos/reels" },
  { key: "posters", label: "POSTERS", type: "image", noun: "Poster", prefix: "poster", dir: "images/posters" },
  { key: "branding", label: "BRANDING", type: "brand", noun: "Brand Identity", prefix: "brand", dir: "images/branding" }
];
const getItems = () => once("items", async () => (await Promise.all(CATS.map((c) => Promise.all(Array.from({ length: SLOTS[c.key] }, async (_, k) => {
  const id = `${c.prefix}-${pad(k + 1)}`, base = `${c.dir}/${id}`, m = META[id] || {};
  const it = { id, cat: c.key, type: c.type, label: c.label, title: m.title || `${c.noun} ${pad(k + 1)}`, description: m.description || "", services: m.services || [], client: m.client || "" };
  if (c.type === "image") { it.src = await probeImg(base); return it.src ? it : null; }
  if (c.type === "video") { it.src = await probeVid(base); if (!it.src) return null; it.poster = await probeImg(`images/thumbs/${id}`); return it; }
  it.cover = await probeImg(`${base}/cover`); if (!it.cover) return null;
  it.pages = (await Promise.all(Array.from({ length: SLOTS.brandPages }, (_, j) => probeImg(`${base}/page-${pad(j + 1)}`)))).filter(Boolean);
  return it;
}))))).flat().filter(Boolean));
const getMotion = () => once("motion", async () => (await Promise.all(Array.from({ length: SLOTS.motion }, (_, k) => probeVid(k ? `videos/motion-graphics-${k + 1}` : "videos/motion-graphics")))).filter(Boolean).map((src, i) => ({ src, title: `Motion Graphics ${pad(i + 1)}` })));

/* ---------- shared pieces ---------- */
const media = (it) => it.type === "image" ? `<img src="${it.src}" alt="${it.title}" loading="lazy">` : it.type === "brand" ? `<img src="${it.cover}" alt="${it.title}" loading="lazy">` : `<video src="${it.src}#t=0.1" preload="metadata" muted playsinline${it.poster ? ` poster="${it.poster}"` : ""} aria-label="${it.title}"></video>`;
const card = (it, c = "in") => `<a class="card ${c}" href="#/work/${it.id}"><div class="thumb nat">${media(it)}${it.type === "video" ? '<span class="pi">▶</span>' : ""}<span class="ov">VIEW</span></div><div class="meta"><div><h3>${it.title}</h3><p>${it.label}</p></div><span class="arr">↗</span></div></a>`;
const cta = (l, h, d, b, href, bg) => `<section class="cta">${bg ? `<img class="bgimg" src="${bg}" alt=""><div class="shade"></div>` : ""}<div class="wrap">${l ? L(l) : ""}<h2 class="big rv">${br(h)}</h2>${d ? `<p class="lead rv">${br(d)}</p>` : ""}<div class="rv">${B(b, href)}</div></div></section>`;
const phero = (l, h, d) => `<section class="phero"><div class="wrap">${L(l)}<h1 class="up">${br(h)}</h1><p class="lead up d1">${d}</p></div></section>`;
const vcard = (v) => `<figure class="vc"><video src="${v.src}#t=0.1"${v.poster ? ` poster="${v.poster}"` : ""} preload="metadata" playsinline loop aria-label="${v.title}"></video><button class="vp" aria-label="Play ${v.title}">▶</button></figure>`;
function initVideos() {
  const all = [...document.querySelectorAll(".vc")];
  all.forEach((c) => {
    const v = c.querySelector("video"), b = c.querySelector(".vp");
    v.addEventListener("play", () => c.classList.add("on")); v.addEventListener("pause", () => c.classList.remove("on"));
    const toggle = () => { if (v.paused) { all.forEach((o) => { const x = o.querySelector("video"); if (x !== v) x.pause(); }); v.muted = false; v.play().catch(() => {}); } else v.pause(); };
    b.onclick = toggle; v.onclick = toggle;
  });
}

/* ---------- pages ---------- */
async function home() {
  const [items, hv, hi, ci, ...pv] = await Promise.all([getItems(), probeVid("videos/hero"), probeImg("images/hero"), probeImg("images/cta"), probeImg("images/service-video"), probeImg("images/service-reels"), probeImg("images/service-design")]);
  const feat = CATS.map((c) => items.find((i) => i.cat === c.key)).filter(Boolean).slice(0, 3);
  const fb = ["cinematic", "reels", "posters"].map((k) => items.find((i) => i.cat === k));
  const bg = hv ? `<video class="bgimg" autoplay muted loop playsinline src="${hv}"></video>` : hi ? `<img class="bgimg" src="${hi}" alt="ad.lobby showreel still">` : "";
  return `<section class="hero">${bg}<div class="shade"></div><img class="mark" src="images/icon-mark.png" alt="" aria-hidden="true">
  <div class="wrap hin"><p class="label up">CREATIVE VIDEO + DESIGN STUDIO</p><h1 class="up d1"><img class="wm" src="images/wordmark.svg" alt="ad.lobby"></h1>
  <p class="tag up d2">IDEAS IN MOTION.<br>BRANDS IN FOCUS.</p>
  <p class="lead up d3">Video. Design. Marketing.<br>Built to make brands impossible to ignore.</p><div class="up d3">${B("VIEW OUR WORK →", "#/work")}</div></div>
  <button class="scroll" data-scroll="intro">SCROLL TO EXPLORE ↓</button></section>
  <section class="sec" id="intro"><div class="wrap two"><div>${L("WHAT WE DO")}<h2 class="rv">WE TURN IDEAS INTO<br>CONTENT PEOPLE REMEMBER.</h2></div>
  <div class="rv end"><p class="lead">Adlobby is a creative video + design marketing studio focused on creating content that looks good, feels right, and gets noticed.</p><br>${B("EXPLORE SERVICES →", "#/services")}</div></div></section>
  <section class="sec alt"><div class="wrap">${L("OUR EXPERTISE")}<h2 class="rv">WHAT WE CREATE</h2><div class="svc">
  ${services.map((s, i) => { const t = pv[i] ? `<img src="${pv[i]}" alt="${s.title}" loading="lazy">` : fb[i] ? media(fb[i]) : ""; return `<a class="scard rv" href="#/services">${t ? `<div class="thumb">${t}</div>` : ""}<div class="meta"><span class="no">${s.no}</span><div><h3>${s.title}</h3><p>${s.short}</p></div><span class="arr">→</span></div></a>`; }).join("")}</div></div></section>
  ${feat.length ? `<section class="sec"><div class="wrap">${L("SELECTED WORK")}<h2 class="rv">MADE TO BE SEEN.</h2><div class="grid3">${feat.map((f) => card(f, "rv")).join("")}</div><div class="rv mt">${B("VIEW ALL WORK →", "#/work", "ghost")}</div></div></section>` : ""}
  ${cta("", "GOT A PROJECT?\nLET’S TALK.", "Tell us what you’re working on.\nWe’ll help turn it into something people remember.", "LET’S WORK TOGETHER →", "#/contact", ci)}`;
}

async function servicesPage() {
  const [items, motion, imgC, imgR] = await Promise.all([getItems(), getMotion(), probeImg("images/services-cinematic"), probeImg("images/services-reels")]);
  const posters = items.filter((i) => i.cat === "posters"), reels = items.filter((i) => i.cat === "reels"), brand = items.find((i) => i.cat === "branding");
  const blocks = services.map((s, i) => {
    let lead = "", extra = "";
    if (s.id === "cinematic" && imgC) lead = `<div class="thumb"><img src="${imgC}" alt="${s.title}"></div>`;
    if (s.id === "reels") {
      if (motion[0]) lead = `<div class="thumb reel" style="aspect-ratio:9/16"><video autoplay muted loop playsinline controls preload="metadata" src="${motion[0].src}"${imgR ? ` poster="${imgR}"` : ""} aria-label="Motion graphics showreel"></video></div>`;
      const parts = [];
      if (motion.length > 1) parts.push(`<p class="label">MORE MOTION GRAPHICS</p><div class="vgrid">${motion.slice(1).map(vcard).join("")}</div>`);
      if (reels.length) parts.push(`<p class="label${parts.length ? " bl" : ""}">INSTAGRAM REELS</p><div class="vgrid">${reels.map((r) => vcard({ src: r.src, title: r.title, poster: r.poster })).join("")}</div><a class="arrl" href="${ig}" target="_blank" rel="noopener">FOLLOW ON INSTAGRAM ↗</a>`);
      extra = parts.length ? `<div class="railrow">${parts.join("")}</div>` : "";
    }
    if (s.id === "design") {
      if (posters[0]) lead = `<div class="thumb tall nat"><img src="${posters[0].src}" alt="${posters[0].title} poster"></div>`;
      const parts = [];
      if (posters.length > 1) parts.push(`<p class="label">POSTERS</p><div class="rail" aria-label="Poster designs">${posters.slice(1).map((p) => `<a class="pc" href="#/work/${p.id}"><img src="${p.src}" alt="${p.title} — poster design" loading="lazy"></a>`).join("")}</div>`);
      if (posters.length) parts.push(`<a class="arrl" href="#/work?f=posters">VIEW ALL POSTERS →</a>`);
      if (brand) parts.push(`<p class="label bl">BRANDING</p><a class="bcard" href="#/work/${brand.id}"><img src="${brand.cover}" alt="${brand.title} — brand identity"><div class="txt"><h3>${brand.title}</h3><p>${brand.description}</p><span class="arrl">VIEW CASE STUDY →</span></div></a>`);
      extra = parts.length ? `<div class="railrow">${parts.join("")}</div>` : "";
    }
    return `<article class="sd ${i % 2 ? "flip" : ""} ${lead ? "" : "nolead"} rv"><div><span class="no">${s.no}</span><h2>${s.title}</h2><p class="lead">${s.desc}</p><ul>${s.items.map((x) => `<li>${x}</li>`).join("")}</ul><a class="arrl" href="#/contact">START A PROJECT →</a></div>${lead}${extra}</article>`;
  });
  return { html: phero("OUR SERVICES", "CREATIVE CONTENT\nBUILT FOR BRANDS.", "From cinematic productions to short-form content and visual design, we create content that helps brands communicate, connect and stand out.") + `<section class="wrap">${blocks.join("")}</section>` + cta("START SOMETHING", "YOUR BRAND DESERVES\nBETTER CONTENT.", "Have an idea? Let’s turn it into something worth watching.", "START A PROJECT →", "#/contact"), init: initVideos };
}

async function work() {
  const items = await getItems(), cats = CATS.filter((c) => items.some((i) => i.cat === c.key));
  const filters = cats.length > 1 ? `<div class="filters" role="group" aria-label="Filter work">${[["all", "ALL"], ...cats.map((c) => [c.key, c.label])].map(([k, t], i) => `<button data-f="${k}" aria-pressed="${!i}" class="${i ? "" : "on"}">${t}</button>`).join("")}</div>` : "";
  const html = phero("OUR WORK", "FEATURED WORK.", "A selection of videos, campaigns and designs created to make brands stand out.") +
    (items.length ? `<section class="wrap">${filters}<div class="mason" id="grid"></div></section><div class="gap"></div>` : `<section class="wrap"><p class="empty">New work is on its way. Check back soon.</p></section><div class="gap"></div>`) +
    cta("", "GOT A PROJECT?\nLET’S TALK.", "", "LET’S WORK TOGETHER →", "#/contact");
  return { html, init() {
    if (!items.length) return;
    const g = $("#grid"), btns = document.querySelectorAll("[data-f]");
    const draw = (k, fade) => { g.style.opacity = 0; setTimeout(() => { g.innerHTML = items.filter((i) => k === "all" || i.cat === k).map((i) => card(i)).join(""); g.style.opacity = 1; }, fade ? 220 : 0); };
    const set = (k) => btns.forEach((x) => { x.classList.toggle("on", x.dataset.f === k); x.setAttribute("aria-pressed", x.dataset.f === k); });
    btns.forEach((b) => (b.onclick = () => { set(b.dataset.f); draw(b.dataset.f, true); }));
    const f0 = new URLSearchParams(location.hash.split("?")[1] || "").get("f"), k0 = cats.some((c) => c.key === f0) ? f0 : "all";
    set(k0); draw(k0);
  } };
}

async function project(id) {
  const items = await getItems(), i = items.findIndex((p) => p.id === id), p = items[i];
  if (!p) return phero("NOT FOUND", "PROJECT NOT FOUND.", "That project doesn’t exist.") + `<div class="wrap gap">${B("← ALL WORK", "#/work")}</div>`;
  const pr = items[(i + items.length - 1) % items.length], nx = items[(i + 1) % items.length];
  const main = p.type === "video" ? `<div class="media-n"><video src="${p.src}" controls playsinline preload="metadata"${p.poster ? ` poster="${p.poster}"` : ""} aria-label="${p.title}"></video></div>`
    : `<div class="media-n"><img src="${p.type === "brand" ? p.cover : p.src}" alt="${p.title}"></div>`;
  const gal = p.type === "brand" && p.pages.length ? `<div class="gal">${p.pages.map((g, k) => `<img src="${g}" alt="${p.title} — page ${k + 1}" loading="lazy">`).join("")}</div>` : "";
  return `<section class="phero"><div class="wrap">${L(p.label)}<h1 class="up">${p.title}</h1>${p.description ? `<p class="lead up d1">${p.description}</p>` : ""}</div></section>
  <section class="wrap">${main}
  ${p.client || p.services.length ? `<div class="facts">${p.client ? `<div><span class="label">CLIENT</span><p>${p.client}</p></div>` : ""}${p.services.length ? `<div><span class="label">SERVICES</span><p>${p.services.join(" · ")}</p></div>` : ""}</div>` : '<div class="gap"></div>'}
  ${gal}${items.length > 1 ? `<div class="pn"><a href="#/work/${pr.id}">← ${pr.title}</a><a href="#/work/${nx.id}">${nx.title} →</a></div>` : ""}</section>` +
  cta("", "LIKE WHAT YOU SEE?\nLET’S TALK.", "", "START A PROJECT →", "#/contact");
}

async function about() {
  const [img, vid, poster] = await Promise.all([probeImg("images/about-studio"), probeVid("videos/adlobby-introduction"), probeImg("images/adlobby-introduction-poster")]);
  const nm = S.name.replace(".", "").toUpperCase();
  const head = `${L("ABOUT " + nm)}<h1 class="up">SMALL TEAM.<br>BIG IDEAS.</h1><p class="lead up d1">We are a creative team focused on video, design and digital storytelling. We help brands communicate better, connect with people and create work worth remembering.</p>`;
  const html = `<section class="phero"><div class="wrap${img ? " two" : ""}">${img ? `<div>${head}</div><div class="thumb nat rv"><img src="${img}" alt="The ad.lobby studio"></div>` : head}</div></section>
  ${vid ? `<section class="sec alt"><div class="wrap">${L("MEET " + nm)}<h2 class="rv">THIS IS WHO WE ARE.</h2><div class="vbox rv" id="vbox"><video src="${vid}#t=0.1" preload="metadata" playsinline${poster ? ` poster="${poster}"` : ""} aria-label="ad.lobby introduction video"></video><button class="pbtn" id="play" aria-label="Play introduction video">▶</button></div></div></section>` : ""}
  <section class="sec"><div class="wrap">${L("WHAT DRIVES US")}<h2 class="rv">GOOD WORK STARTS<br>WITH GOOD IDEAS.</h2><div class="prin">${principles.map(([t, d], i) => `<div class="rv"><span class="no">0${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>
  ${cta("", "LET’S CREATE SOMETHING\nWORTH REMEMBERING.", "", "WORK WITH US →", "#/contact")}`;
  return { html, init() { const b = $("#play"); if (!b) return; const v = $("#vbox video"); b.onclick = () => { b.hidden = true; v.controls = true; v.muted = false; v.play().catch(() => {}); }; } };
}

const OPTS = ["Cinematic Video", "Reels & Short-Form Content", "Posters & Design", "Branding", "Social Media Content", "Motion Graphics", "Other"];
function contact() {
  const f = (id, label, type, extra = "") => `<div class="fld"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${extra}><span class="err" data-e="${id}" role="alert"></span></div>`;
  return { init: initContact, html: phero("LET’S WORK TOGETHER", "GOT A PROJECT?\nLET’S TALK.", "Have an idea, campaign or brand that needs better content? Tell us what you’re building.") +
  `<section class="wrap two cf"><form id="f" novalidate>${f("name", "Full name", "text", 'autocomplete="name"')}${f("email", "Email address", "email", 'autocomplete="email"')}${f("phone", "Phone or WhatsApp number", "tel", 'autocomplete="tel"')}
  <div class="fld"><label for="service">Service required</label><select id="service" name="service"><option value="">Select a service</option>${OPTS.map((o) => `<option>${o}</option>`).join("")}</select><span class="err" data-e="service" role="alert"></span></div>
  <div class="fld"><label for="details">Project details</label><textarea id="details" name="details" rows="5"></textarea><span class="err" data-e="details" role="alert"></span></div>
  <button class="btn" id="sb" type="submit">SEND INQUIRY →</button><p class="st" id="st" role="status"></p></form>
  <div class="direct"><div><span class="label">EMAIL</span><a href="mailto:${S.email}">${S.email}</a></div><div><span class="label">INSTAGRAM</span><a href="${ig}" target="_blank" rel="noopener">@${S.instagram} ↗</a></div><div><span class="label">WHATSAPP</span><a href="${wa}" target="_blank" rel="noopener">${S.phoneDisplay} ↗</a></div></div></section>` +
  cta("", "EVERY GREAT PROJECT STARTS\nWITH A CONVERSATION.", "", "LET’S CREATE →", wa + "?text=" + encodeURIComponent("Hi, I'd like to start a project.")) };
}
function initContact() {
  const f = $("#f"), st = $("#st"), sb = $("#sb");
  f.onsubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)); let ok = true;
    const chk = (k, bad, m) => { f.querySelector(`[data-e=${k}]`).textContent = bad ? m : ""; if (bad) ok = false; };
    chk("name", !d.name.trim(), "Please enter your name.");
    chk("email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email), "Enter a valid email address.");
    chk("phone", d.phone.replace(/\D/g, "").length < 8, "Enter a valid phone or WhatsApp number.");
    chk("service", !d.service, "Please choose a service.");
    chk("details", d.details.trim().length < 10, "Tell us a little about your project.");
    if (!ok) return;
    sb.disabled = true; st.textContent = "";
    if (S.formEndpoint) {
      try { const r = await fetch(S.formEndpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(d) }); if (!r.ok) throw 0; st.textContent = "Thank you — your inquiry has been sent."; f.reset(); }
      catch { st.textContent = "Couldn’t send your inquiry. Please message us on WhatsApp or email instead."; }
    } else {
      const m = `Hi, I'd like to discuss a project.\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nService: ${d.service}\nDetails: ${d.details}`;
      window.open(`${wa}?text=${encodeURIComponent(m)}`, "_blank", "noopener");
      st.textContent = "WhatsApp has opened with your message. Press send there to complete your inquiry.";
    }
    setTimeout(() => (sb.disabled = false), 4000);
  };
}

/* ---------- router ---------- */
const R = { "": home, services: servicesPage, work, about, contact };
let io, rid = 0;
async function route() {
  const me = ++rid, [h, id] = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
  const slow = setTimeout(() => (app.innerHTML = '<p class="load">LOADING…</p>'), 350);
  let r = await (h === "work" && id ? project(id) : (R[h] || home)());
  clearTimeout(slow); if (me !== rid) return;
  if (typeof r === "string") r = { html: r };
  app.innerHTML = r.html; r.init && r.init();
  app.style.animation = "none"; void app.offsetWidth; app.style.animation = "";
  document.body.classList.toggle("home", !(h in R) || h === "");
  document.querySelectorAll("#menu a").forEach((a) => a.classList.toggle("active", a.dataset.r === (h in R ? h : "")));
  $("#menu").classList.remove("open"); $("#burger").setAttribute("aria-expanded", false);
  io && io.disconnect(); io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
  document.querySelectorAll(".rv").forEach((n) => io.observe(n));
  document.title = (h && h in R ? h[0].toUpperCase() + h.slice(1) + " — " : "") + `${S.name} — Creative Video + Design Studio`;
  scrollTo(0, 0); nav();
}
const nav = () => $("#nav").classList.toggle("solid", scrollY > 40);
document.querySelectorAll(".brandtxt").forEach((e) => (e.textContent = S.name));
[["INSTAGRAM", ig], ["YOUTUBE", S.youtube], ["WHATSAPP", wa]].filter(([, u]) => u).forEach(([n, u]) => { const a = document.createElement("a"); a.href = u; a.target = "_blank"; a.rel = "noopener"; a.textContent = n + " ↗"; $("#social").append(a); });
$("#burger").onclick = () => { const o = $("#menu").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); };
document.addEventListener("click", (e) => { const s = e.target.closest("[data-scroll]"); if (s) document.getElementById(s.dataset.scroll).scrollIntoView({ behavior: "smooth" }); });
addEventListener("scroll", nav, { passive: true });
addEventListener("hashchange", route);
route();
