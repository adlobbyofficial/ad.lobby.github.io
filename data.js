/* ===== EDIT SITE DETAILS AND TEXT HERE =====
   Photos and videos are NOT listed here. Just put files in the folders described in MEDIA-GUIDE.md
   and they appear on the site automatically. Empty folders = that section is hidden. */
const SITE = {
  name: "ad.lobby",                       // shown in capitals
  email: "adlobbyofficial@gmail.com",
  instagram: "ad.lobbby",                 // handle only (check spelling)
  whatsapp: "919143242220",               // country code + number, no + or spaces
  phoneDisplay: "+91 91432 42220",
  youtube: "",                            // full URL, "" hides it
  formEndpoint: ""                        // optional: Formspree URL. Empty = WhatsApp fallback
};

/* How many files the site looks for in each folder (reel-01 ... reel-12). Raise a number to allow more. */
const SLOTS = { cinematic: 12, reels: 12, motion: 6, posters: 12, branding: 6, brandPages: 12 };

/* OPTIONAL names for items. Key = file name without extension (poster-01, reel-03, cinematic-02, brand-01).
   Items without an entry get an automatic name such as "Poster 05". */
const META = {
  "poster-01": { title: "Beyond Form", description: "Editorial portrait poster exploring bold type over a soft-focus photograph.", services: ["Editorial Design", "Typography"] },
  "poster-02": { title: "Logistics & Supply Chain", description: "Social media poster promoting job-ready logistics and supply chain training.", services: ["Social Media Creative", "Poster Design"] },
  "poster-03": { title: "Obsession", description: "Minimal typographic poster built on a monochrome image triptych.", services: ["Poster Design", "Typography"] },
  "poster-04": { title: "Pause.", description: "Minimal concept poster contrasting stillness with motion blur.", services: ["Poster Design", "Concept"] },
  "brand-01": { title: "Odore — Brand Identity", description: "Brand identity for a premium scented candle brand: logo, colour and type, stationery, packaging, brochure and ad campaign.", services: ["Logo Design", "Brand Identity", "Packaging", "Print & Campaign Design"] }
};

const services = [
  { id: "cinematic", no: "01", title: "CINEMATIC VIDEO",
    short: "Story-driven visuals designed to give your brand a stronger presence.",
    desc: "Visual stories designed to give your brand a stronger presence.",
    items: ["Brand Films", "Product Videos", "Commercials", "Event Films", "Storytelling Videos"] },
  { id: "reels", no: "02", title: "REELS & SHORT-FORM",
    short: "Engaging content built to capture attention on social platforms.",
    desc: "Fast, engaging content designed for modern social platforms.",
    items: ["Instagram Reels", "Product Reels", "Motion Graphics"] },
  { id: "design", no: "03", title: "VISUAL DESIGN",
    short: "Posters, campaign creatives and motion graphics that communicate clearly.",
    desc: "Visual communication that makes your brand look as good as it feels.",
    items: ["Posters", "Social Media Creatives", "Campaign Designs", "Branding"] }
];

const principles = [
  ["CREATIVITY", "Fresh ideas, always."], ["QUALITY", "Every frame matters."],
  ["STORY", "Content with something to say."], ["IMPACT", "Creative work built around brand goals."]
];
