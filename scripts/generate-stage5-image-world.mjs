import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_ROOT = path.resolve("public/media/stage5");
const W = 1440;

const PALETTE = {
  paper: "#f7f3ea",
  paper2: "#fbfaf6",
  warm: "#eee6d8",
  line: "#d8cec0",
  ink: "#1f2937",
  ink2: "#4b5563",
  muted: "#8a8176",
  accent: "#b58a52",
  sage: "#87927c",
  blue: "#748ca5",
};

const assets = [
  { file: "home/service-websites.webp", kind: "website", label: "Websites", height: 1800, portrait: true },
  { file: "home/service-shops.webp", kind: "shop", label: "Configurator", height: 1800, portrait: true },
  { file: "home/service-software.webp", kind: "software", label: "Portal", height: 1800, portrait: true },
  { file: "home/service-automation.webp", kind: "automation", label: "Workflow", height: 1800, portrait: true },
  { file: "home/about-editorial.webp", kind: "workspace", label: "Studio", height: 1080 },

  { file: "services/websites/brand-system.webp", kind: "website", label: "Brand Site", height: 810 },
  { file: "services/websites/interface-detail.webp", kind: "websiteDetail", label: "Layout Detail", height: 810 },

  { file: "services/shops/pergola-configurator.webp", kind: "shop", label: "Pergola", height: 810 },
  { file: "services/shops/window-configurator.webp", kind: "window", label: "Window", height: 810 },
  { file: "services/shops/mobile-summary.webp", kind: "mobileShop", label: "Mobile", height: 1120 },

  { file: "services/web-software/portal-operations.webp", kind: "software", label: "Operations", height: 810 },
  { file: "services/web-software/workflow-detail.webp", kind: "workflowDetail", label: "Workflow", height: 810 },

  { file: "services/ki-automation/workflow-canvas.webp", kind: "automation", label: "Automation", height: 810 },
  { file: "services/ki-automation/handoff-detail.webp", kind: "handoff", label: "Handoff", height: 810 },

  { file: "pages/ueber-uns/studio-anchor.webp", kind: "workspace", label: "Studio", height: 980 },
  { file: "pages/webdesign-kassel/web-presence.webp", kind: "localWeb", label: "Webdesign", height: 810 },
  { file: "pages/landingpages-kassel/campaign-landing.webp", kind: "landing", label: "Landing", height: 810 },
];

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function paperTexture(width, height) {
  let dots = "";
  for (let i = 0; i < 240; i += 1) {
    const x = (i * 97) % width;
    const y = (i * 211) % height;
    const r = 0.7 + ((i * 13) % 16) / 10;
    const o = 0.025 + ((i * 7) % 14) / 1000;
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="${PALETTE.ink}" opacity="${o}"/>`;
  }
  return dots;
}

function defs() {
  return `
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${PALETTE.paper2}"/>
        <stop offset="100%" stop-color="${PALETTE.paper}"/>
      </linearGradient>
      <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="${PALETTE.warm}"/>
      </linearGradient>
      <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#edf0f2"/>
      </linearGradient>
      <linearGradient id="screenDark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#283241"/>
        <stop offset="100%" stop-color="#111827"/>
      </linearGradient>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="28" stdDeviation="32" flood-color="#233044" flood-opacity="0.15"/>
        <feDropShadow dx="0" dy="7" stdDeviation="10" flood-color="#233044" flood-opacity="0.10"/>
      </filter>
      <filter id="smallShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="14" stdDeviation="20" flood-color="#233044" flood-opacity="0.12"/>
      </filter>
    </defs>`;
}

function chrome(x, y, width, height, { dark = false } = {}) {
  const bg = dark ? "url(#screenDark)" : "url(#screen)";
  const line = dark ? "rgba(255,255,255,0.12)" : PALETTE.line;
  const text = dark ? "rgba(255,255,255,0.82)" : PALETTE.ink;
  return `
    <g filter="url(#softShadow)">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="30" fill="#d8d6d0"/>
      <rect x="${x + 10}" y="${y + 10}" width="${width - 20}" height="${height - 20}" rx="22" fill="${bg}"/>
      <rect x="${x + 38}" y="${y + 38}" width="${width - 76}" height="${height - 76}" rx="16" fill="none" stroke="${line}" stroke-width="2"/>
      <circle cx="${x + 58}" cy="${y + 58}" r="5" fill="${line}"/>
      <circle cx="${x + 78}" cy="${y + 58}" r="5" fill="${line}" opacity="0.65"/>
      <circle cx="${x + 98}" cy="${y + 58}" r="5" fill="${line}" opacity="0.42"/>
      <text x="${x + width - 190}" y="${y + 63}" font-family="Arial, sans-serif" font-size="18" letter-spacing="5" fill="${text}" opacity="0.42">MAGICKS</text>
    </g>`;
}

function browserLanding(x, y, width, height, opts = {}) {
  const dark = opts.dark ?? false;
  const text = dark ? "#ffffff" : PALETTE.ink;
  const muted = dark ? "rgba(255,255,255,0.58)" : PALETTE.muted;
  return `
    ${chrome(x, y, width, height, { dark })}
    <g transform="translate(${x + 86} ${y + 114})">
      <rect x="0" y="0" width="${width - 172}" height="${height - 194}" rx="18" fill="${dark ? "rgba(255,255,255,0.035)" : "#fffdfa"}"/>
      <text x="42" y="84" font-family="Georgia, serif" font-size="${Math.max(58, width / 10)}" fill="${text}" letter-spacing="-2">Digital presence</text>
      <text x="42" y="150" font-family="Georgia, serif" font-size="${Math.max(48, width / 12)}" fill="${dark ? "rgba(255,255,255,0.62)" : "#6b6258"}" font-style="italic">made clearer.</text>
      <rect x="42" y="202" width="${width * 0.22}" height="46" rx="23" fill="${text}" opacity="${dark ? "0.92" : "0.88"}"/>
      <rect x="${width * 0.55}" y="70" width="${width * 0.26}" height="${height * 0.34}" rx="24" fill="${PALETTE.warm}"/>
      <path d="M ${width * 0.58} ${height * 0.29} C ${width * 0.65} ${height * 0.18}, ${width * 0.75} ${height * 0.21}, ${width * 0.8} ${height * 0.14}" fill="none" stroke="${PALETTE.sage}" stroke-width="6" opacity="0.65"/>
      <rect x="42" y="${height * 0.47}" width="${width * 0.22}" height="16" rx="8" fill="${muted}" opacity="0.42"/>
      <rect x="42" y="${height * 0.53}" width="${width * 0.36}" height="14" rx="7" fill="${muted}" opacity="0.26"/>
      <rect x="${width * 0.52}" y="${height * 0.5}" width="${width * 0.26}" height="14" rx="7" fill="${muted}" opacity="0.28"/>
      <rect x="${width * 0.52}" y="${height * 0.56}" width="${width * 0.18}" height="14" rx="7" fill="${muted}" opacity="0.2"/>
    </g>`;
}

function pergola(x, y, scale = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <path d="M30 180 L310 118 L560 174 L280 252 Z" fill="#eef0ed" stroke="${PALETTE.line}" stroke-width="4"/>
      <path d="M80 165 L80 386 M502 165 L502 386 M290 238 L290 430" stroke="#49515a" stroke-width="10" stroke-linecap="round"/>
      <path d="M62 166 L308 112 L526 164" fill="none" stroke="#3f4650" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      ${Array.from({ length: 8 }).map((_, i) => {
        const xx = 100 + i * 47;
        return `<path d="M${xx} 155 L${xx + 210} 205" stroke="#b8b2a8" stroke-width="4" opacity="0.75"/>`;
      }).join("")}
      <rect x="140" y="330" width="190" height="56" rx="28" fill="#d9d0c4"/>
      <rect x="355" y="314" width="118" height="70" rx="16" fill="#e6ded2"/>
      <path d="M90 405 C190 430, 390 430, 520 402" fill="none" stroke="${PALETTE.sage}" stroke-width="7" opacity="0.42"/>
    </g>`;
}

function dashboard(x, y, width, height, { dense = false } = {}) {
  const rows = dense ? 7 : 5;
  return `
    ${chrome(x, y, width, height)}
    <g transform="translate(${x + 78} ${y + 112})">
      <rect x="0" y="0" width="190" height="${height - 186}" rx="20" fill="#f2eee7" stroke="${PALETTE.line}"/>
      ${["Overview", "Projects", "Status", "Reports"].map((t, i) => `
        <rect x="28" y="${42 + i * 62}" width="120" height="12" rx="6" fill="${i === 1 ? PALETTE.ink : PALETTE.muted}" opacity="${i === 1 ? 0.82 : 0.34}"/>`).join("")}
      <rect x="226" y="0" width="${width - 382}" height="120" rx="22" fill="#ffffff" stroke="${PALETTE.line}"/>
      <rect x="256" y="34" width="220" height="14" rx="7" fill="${PALETTE.ink}" opacity="0.72"/>
      <rect x="256" y="70" width="${width - 530}" height="12" rx="6" fill="${PALETTE.muted}" opacity="0.22"/>
      <rect x="226" y="152" width="${width - 382}" height="${height - 338}" rx="22" fill="#ffffff" stroke="${PALETTE.line}"/>
      ${Array.from({ length: rows }).map((_, i) => {
        const yy = 190 + i * 54;
        return `
          <line x1="258" y1="${yy + 34}" x2="${width - 220}" y2="${yy + 34}" stroke="${PALETTE.line}" opacity="0.7"/>
          <rect x="258" y="${yy}" width="160" height="13" rx="7" fill="${PALETTE.ink}" opacity="${0.6 - i * 0.035}"/>
          <rect x="${width - 430}" y="${yy - 4}" width="110" height="24" rx="12" fill="${i % 2 ? "#e7ece4" : "#ece7df"}" stroke="${PALETTE.line}"/>
          <rect x="${width - 286}" y="${yy}" width="74" height="13" rx="7" fill="${PALETTE.blue}" opacity="0.45"/>`;
      }).join("")}
    </g>`;
}

function automationCanvas(x, y, width, height) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const node = (nx, ny, title, sub, color = "#ffffff") => `
    <g filter="url(#smallShadow)">
      <rect x="${nx}" y="${ny}" width="230" height="112" rx="24" fill="${color}" stroke="${PALETTE.line}" stroke-width="2"/>
      <text x="${nx + 30}" y="${ny + 46}" font-family="Arial, sans-serif" font-size="22" fill="${PALETTE.ink}">${title}</text>
      <text x="${nx + 30}" y="${ny + 78}" font-family="Arial, sans-serif" font-size="14" letter-spacing="3" fill="${PALETTE.muted}">${sub}</text>
    </g>`;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="36" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#softShadow)"/>
    <path d="M${x + 260} ${cy - 150} C${cx - 100} ${cy - 150}, ${cx - 140} ${cy}, ${cx - 15} ${cy}" fill="none" stroke="${PALETTE.blue}" stroke-width="4" opacity="0.45"/>
    <path d="M${x + 260} ${cy + 120} C${cx - 120} ${cy + 120}, ${cx - 130} ${cy}, ${cx - 15} ${cy}" fill="none" stroke="${PALETTE.sage}" stroke-width="4" opacity="0.45"/>
    <path d="M${cx + 140} ${cy} C${cx + 260} ${cy}, ${x + width - 360} ${cy - 72}, ${x + width - 250} ${cy - 72}" fill="none" stroke="${PALETTE.accent}" stroke-width="4" opacity="0.45"/>
    <path d="M${cx + 140} ${cy} C${cx + 260} ${cy}, ${x + width - 360} ${cy + 112}, ${x + width - 250} ${cy + 112}" fill="none" stroke="${PALETTE.blue}" stroke-width="4" opacity="0.34"/>
    ${node(x + 82, cy - 208, "Form", "INPUT")}
    ${node(x + 82, cy + 58, "Data", "SOURCE")}
    <g filter="url(#smallShadow)">
      <rect x="${cx - 128}" y="${cy - 72}" width="256" height="144" rx="32" fill="#f1eee8" stroke="${PALETTE.line}" stroke-width="2"/>
      <text x="${cx}" y="${cy - 10}" font-family="Georgia, serif" font-size="38" text-anchor="middle" fill="${PALETTE.ink}">Logic</text>
      <text x="${cx}" y="${cy + 34}" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" letter-spacing="4" fill="${PALETTE.muted}">VALIDATE</text>
    </g>
    ${node(x + width - 312, cy - 132, "CRM", "OUTPUT", "#ffffff")}
    ${node(x + width - 312, cy + 50, "Team", "NOTIFY", "#ffffff")}
    <circle cx="${cx + 158}" cy="${cy}" r="6" fill="${PALETTE.accent}"/>`;
}

function configuratorSidebar(x, y, width, height, title) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="24" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
    <text x="${x + 32}" y="${y + 54}" font-family="Arial, sans-serif" font-size="17" letter-spacing="4" fill="${PALETTE.muted}">${esc(title)}</text>
    ${["Material", "Groesse", "Farbe", "Optionen"].map((t, i) => `
      <text x="${x + 32}" y="${y + 108 + i * 98}" font-family="Arial, sans-serif" font-size="19" fill="${PALETTE.ink}" opacity="0.78">${t}</text>
      <rect x="${x + 32}" y="${y + 130 + i * 98}" width="${width - 64}" height="12" rx="6" fill="${PALETTE.line}" opacity="0.7"/>
      <rect x="${x + 32}" y="${y + 156 + i * 98}" width="${(width - 64) * (0.45 + i * 0.1)}" height="10" rx="5" fill="${i % 2 ? PALETTE.sage : PALETTE.accent}" opacity="0.48"/>`).join("")}
    <rect x="${x + 32}" y="${y + height - 82}" width="${width - 64}" height="48" rx="24" fill="${PALETTE.ink}"/>
    <text x="${x + width / 2}" y="${y + height - 51}" font-family="Arial, sans-serif" font-size="15" text-anchor="middle" fill="#ffffff" letter-spacing="2">ANFRAGE</text>`;
}

function phone(x, y, width, height) {
  return `
    <g filter="url(#softShadow)">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="46" fill="#d6d4ce"/>
      <rect x="${x + 14}" y="${y + 14}" width="${width - 28}" height="${height - 28}" rx="36" fill="#fffdfa"/>
      <rect x="${x + width / 2 - 45}" y="${y + 32}" width="90" height="10" rx="5" fill="#d6d0c7"/>
      <text x="${x + 42}" y="${y + 104}" font-family="Georgia, serif" font-size="36" fill="${PALETTE.ink}">Summary</text>
      ${["Modell", "Material", "Mass", "Anfrage"].map((t, i) => `
        <rect x="${x + 40}" y="${y + 150 + i * 78}" width="${width - 80}" height="50" rx="18" fill="${i === 3 ? PALETTE.ink : "#f2eee7"}"/>
        <text x="${x + 64}" y="${y + 181 + i * 78}" font-family="Arial, sans-serif" font-size="18" fill="${i === 3 ? "#ffffff" : PALETTE.ink}" opacity="${i === 3 ? 1 : 0.76}">${t}</text>`).join("")}
    </g>`;
}

function workspace(x, y, width, height) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="38" fill="#efe8dc" filter="url(#softShadow)"/>
    <rect x="${x + 58}" y="${y + 72}" width="${width * 0.48}" height="${height * 0.58}" rx="30" fill="#fffdfa" stroke="${PALETTE.line}"/>
    ${browserLanding(x + 92, y + 110, width * 0.42, height * 0.42)}
    <rect x="${x + width * 0.58}" y="${y + 96}" width="${width * 0.28}" height="${height * 0.52}" rx="18" fill="#ffffff" stroke="${PALETTE.line}"/>
    <line x1="${x + width * 0.61}" y1="${y + 170}" x2="${x + width * 0.82}" y2="${y + 170}" stroke="${PALETTE.ink}" stroke-width="10" opacity="0.58" stroke-linecap="round"/>
    <line x1="${x + width * 0.61}" y1="${y + 224}" x2="${x + width * 0.78}" y2="${y + 224}" stroke="${PALETTE.muted}" stroke-width="7" opacity="0.35" stroke-linecap="round"/>
    <line x1="${x + width * 0.61}" y1="${y + 272}" x2="${x + width * 0.84}" y2="${y + 272}" stroke="${PALETTE.muted}" stroke-width="7" opacity="0.26" stroke-linecap="round"/>
    <circle cx="${x + width * 0.82}" cy="${y + height * 0.72}" r="54" fill="#ddd4c6" stroke="${PALETTE.line}"/>
    <rect x="${x + width * 0.2}" y="${y + height * 0.76}" width="${width * 0.32}" height="18" rx="9" fill="${PALETTE.ink}" opacity="0.46"/>
    <rect x="${x + width * 0.54}" y="${y + height * 0.73}" width="${width * 0.18}" height="14" rx="7" fill="${PALETTE.accent}" opacity="0.5"/>`;
}

function renderScene(asset) {
  const width = W;
  const height = asset.height;
  const cx = width / 2;
  const title = esc(asset.label);
  let scene = "";

  if (asset.kind === "website") {
    scene = `${browserLanding(200, asset.portrait ? 460 : 130, 1040, asset.portrait ? 680 : 540)}
      <rect x="120" y="${height - 410}" width="460" height="172" rx="34" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      <text x="168" y="${height - 328}" font-family="Georgia, serif" font-size="54" fill="${PALETTE.ink}">Open by design.</text>
      <rect x="168" y="${height - 270}" width="280" height="12" rx="6" fill="${PALETTE.muted}" opacity="0.32"/>`;
  } else if (asset.kind === "websiteDetail") {
    scene = `${browserLanding(154, 132, 780, 500)}
      ${phone(990, 176, 250, 500)}
      <rect x="170" y="694" width="910" height="54" rx="27" fill="#fffdfa" stroke="${PALETTE.line}"/>
      <rect x="210" y="715" width="210" height="12" rx="6" fill="${PALETTE.ink}" opacity="0.54"/>
      <rect x="470" y="715" width="160" height="12" rx="6" fill="${PALETTE.muted}" opacity="0.28"/>`;
  } else if (asset.kind === "shop") {
    scene = `<rect x="128" y="${asset.portrait ? 360 : 92}" width="820" height="${asset.portrait ? 640 : 600}" rx="42" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#softShadow)"/>
      ${pergola(204, asset.portrait ? 494 : 226, asset.portrait ? 1.18 : 1.05)}
      ${configuratorSidebar(1010, asset.portrait ? 402 : 122, 300, asset.portrait ? 560 : 560, "CONFIG")}
      ${asset.portrait ? `<rect x="176" y="1140" width="900" height="190" rx="34" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      <text x="226" y="1220" font-family="Georgia, serif" font-size="62" fill="${PALETTE.ink}">Product, clearly configured.</text>` : ""}`;
  } else if (asset.kind === "window") {
    scene = `<rect x="142" y="108" width="760" height="590" rx="42" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#softShadow)"/>
      <g transform="translate(250 178)">
        <rect x="0" y="0" width="350" height="420" rx="12" fill="#eef0ed" stroke="#515b65" stroke-width="18"/>
        <line x1="175" y1="8" x2="175" y2="412" stroke="#515b65" stroke-width="12"/>
        <line x1="8" y1="205" x2="342" y2="205" stroke="#515b65" stroke-width="10"/>
        <rect x="32" y="32" width="286" height="146" fill="#f8fbfd" opacity="0.8"/>
        <rect x="32" y="238" width="286" height="146" fill="#f8fbfd" opacity="0.8"/>
      </g>
      ${configuratorSidebar(964, 118, 320, 560, "WINDOW")}`;
  } else if (asset.kind === "mobileShop") {
    scene = `${phone(540, 120, 360, 760)}
      <rect x="160" y="240" width="320" height="360" rx="38" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      ${pergola(204, 330, 0.46)}
      <rect x="970" y="300" width="270" height="190" rx="32" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      <text x="1014" y="374" font-family="Georgia, serif" font-size="42" fill="${PALETTE.ink}">Send</text>
      <text x="1014" y="426" font-family="Arial, sans-serif" font-size="18" letter-spacing="4" fill="${PALETTE.muted}">REQUEST</text>`;
  } else if (asset.kind === "software") {
    scene = `${dashboard(158, asset.portrait ? 400 : 108, 1124, asset.portrait ? 720 : 600, { dense: true })}
      ${asset.portrait ? `<rect x="190" y="1220" width="780" height="146" rx="32" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      <text x="242" y="1304" font-family="Georgia, serif" font-size="58" fill="${PALETTE.ink}">Operational calm.</text>` : ""}`;
  } else if (asset.kind === "workflowDetail") {
    scene = `${dashboard(140, 112, 1160, 590, { dense: false })}
      <rect x="244" y="268" width="790" height="74" rx="28" fill="#f2eee7"/>
      ${["New", "Check", "Release", "Archive"].map((t, i) => `<rect x="${282 + i * 178}" y="288" width="126" height="34" rx="17" fill="${i === 1 ? PALETTE.ink : "#ffffff"}" stroke="${PALETTE.line}"/><text x="${345 + i * 178}" y="311" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${i === 1 ? "#ffffff" : PALETTE.ink}">${t}</text>`).join("")}`;
  } else if (asset.kind === "automation") {
    scene = `${automationCanvas(126, asset.portrait ? 430 : 116, 1188, asset.portrait ? 620 : 590)}
      ${asset.portrait ? `<rect x="204" y="1190" width="680" height="150" rx="32" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      <text x="254" y="1274" font-family="Georgia, serif" font-size="58" fill="${PALETTE.ink}">Useful automation.</text>` : ""}`;
  } else if (asset.kind === "handoff") {
    scene = `<rect x="128" y="134" width="1184" height="540" rx="40" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#softShadow)"/>
      <rect x="204" y="220" width="360" height="340" rx="30" fill="#f7f4ef" stroke="${PALETTE.line}"/>
      <rect x="876" y="220" width="360" height="340" rx="30" fill="#f7f4ef" stroke="${PALETTE.line}"/>
      <path d="M596 390 C690 320, 786 320, 852 390" fill="none" stroke="${PALETTE.accent}" stroke-width="5" opacity="0.54"/>
      <circle cx="724" cy="344" r="34" fill="#fffdfa" stroke="${PALETTE.line}"/>
      <text x="384" y="288" font-family="Georgia, serif" font-size="48" fill="${PALETTE.ink}" text-anchor="middle">Form</text>
      <text x="1056" y="288" font-family="Georgia, serif" font-size="48" fill="${PALETTE.ink}" text-anchor="middle">CRM</text>
      ${[0, 1, 2].map((i) => `<rect x="256" y="${338 + i * 54}" width="244" height="14" rx="7" fill="${PALETTE.muted}" opacity="${0.34 - i * 0.04}"/><rect x="930" y="${338 + i * 54}" width="244" height="14" rx="7" fill="${PALETTE.blue}" opacity="${0.36 - i * 0.03}"/>`).join("")}
      <text x="724" y="438" font-family="Arial, sans-serif" font-size="17" text-anchor="middle" letter-spacing="4" fill="${PALETTE.muted}">VALIDATED</text>`;
  } else if (asset.kind === "workspace") {
    scene = `${workspace(124, asset.file.includes("home/") ? 190 : 128, 1190, asset.file.includes("home/") ? 700 : 690)}`;
  } else if (asset.kind === "localWeb") {
    scene = `${browserLanding(156, 108, 860, 560)}
      <rect x="1054" y="160" width="230" height="420" rx="30" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      <path d="M1100 452 C1138 330, 1198 302, 1236 196" fill="none" stroke="${PALETTE.sage}" stroke-width="5" opacity="0.5"/>
      <circle cx="1148" cy="346" r="10" fill="${PALETTE.accent}" opacity="0.72"/>
      <text x="1170" y="644" font-family="Arial, sans-serif" font-size="16" letter-spacing="4" fill="${PALETTE.muted}" text-anchor="middle">KASSEL / WEB</text>`;
  } else if (asset.kind === "landing") {
    scene = `${browserLanding(160, 108, 760, 560)}
      <rect x="966" y="140" width="300" height="496" rx="32" fill="#fffdfa" stroke="${PALETTE.line}" filter="url(#smallShadow)"/>
      <text x="1012" y="230" font-family="Georgia, serif" font-size="50" fill="${PALETTE.ink}">Campaign</text>
      ${[0, 1, 2, 3].map((i) => `<rect x="1016" y="${280 + i * 64}" width="${190 - i * 22}" height="14" rx="7" fill="${i === 0 ? PALETTE.ink : PALETTE.muted}" opacity="${i === 0 ? 0.66 : 0.28}"/>`).join("")}
      <rect x="1016" y="544" width="178" height="42" rx="21" fill="${PALETTE.ink}"/>`;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${defs()}
      <rect width="${width}" height="${height}" fill="url(#paper)"/>
      <circle cx="${width * 0.2}" cy="${height * 0.1}" r="${width * 0.38}" fill="#ffffff" opacity="0.62"/>
      <circle cx="${width * 0.86}" cy="${height * 0.88}" r="${width * 0.42}" fill="${PALETTE.warm}" opacity="0.55"/>
      ${paperTexture(width, height)}
      <text x="92" y="102" font-family="Arial, sans-serif" font-size="17" letter-spacing="7" fill="${PALETTE.muted}" opacity="0.58">MAGICKS / FIELD SYSTEM</text>
      <text x="92" y="156" font-family="Georgia, serif" font-size="${asset.portrait ? 70 : 56}" fill="${PALETTE.ink}" opacity="0.9">${title}</text>
      <line x1="92" y1="${asset.portrait ? 212 : 188}" x2="310" y2="${asset.portrait ? 212 : 188}" stroke="${PALETTE.line}" stroke-width="2"/>
      ${scene}
      <rect x="26" y="26" width="${width - 52}" height="${height - 52}" rx="52" fill="none" stroke="#ffffff" stroke-opacity="0.48"/>
    </svg>`;
}

async function renderAsset(asset) {
  const outPath = path.join(OUT_ROOT, asset.file);
  await mkdir(path.dirname(outPath), { recursive: true });
  const svg = renderScene(asset);
  await sharp(Buffer.from(svg))
    .webp({
      quality: asset.portrait ? 82 : 84,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outPath);
  return outPath;
}

for (const asset of assets) {
  const out = await renderAsset(asset);
  console.log(`created ${path.relative(process.cwd(), out)}`);
}
