const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function makeSVG(size) {
  const s = size;
  const r = Math.round(s * 0.18);
  const cheetah = String.fromCodePoint(0x1F406);
  const text = '\u062a\u062d\u062f\u064a \u0627\u0644\u0641\u0647\u062f';
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">`,
    `<defs>`,
    `<radialGradient id="bg" cx="50%" cy="45%" r="70%">`,
    `<stop offset="0%" stop-color="#0d3024"/>`,
    `<stop offset="50%" stop-color="#0a2218"/>`,
    `<stop offset="100%" stop-color="#050f0a"/>`,
    `</radialGradient>`,
    `<radialGradient id="cir" cx="40%" cy="40%" r="60%">`,
    `<stop offset="0%" stop-color="#1a4a2a"/>`,
    `<stop offset="100%" stop-color="#0a2218"/>`,
    `</radialGradient>`,
    `</defs>`,
    `<rect width="${s}" height="${s}" rx="${r}" fill="url(#bg)"/>`,
    `<circle cx="${s/2}" cy="${s*0.44}" r="${s*0.38}" fill="none" stroke="rgba(212,160,23,0.35)" stroke-width="${s*0.025}"/>`,
    `<circle cx="${s/2}" cy="${s*0.44}" r="${s*0.32}" fill="url(#cir)" stroke="rgba(212,160,23,0.6)" stroke-width="${s*0.022}"/>`,
    `<text x="${s/2}" y="${s*0.57}" text-anchor="middle" dominant-baseline="middle" font-size="${s*0.34}" font-family="serif">${cheetah}</text>`,
    `<text x="${s/2}" y="${s*0.92}" text-anchor="middle" font-size="${s*0.1}" font-family="Arial" font-weight="900" fill="#D4A017">${text}</text>`,
    `<circle cx="${s*0.15}" cy="${s*0.28}" r="${s*0.018}" fill="rgba(212,160,23,0.6)"/>`,
    `<circle cx="${s*0.85}" cy="${s*0.32}" r="${s*0.018}" fill="rgba(212,160,23,0.6)"/>`,
    `<circle cx="${s*0.12}" cy="${s*0.6}" r="${s*0.015}" fill="rgba(212,160,23,0.4)"/>`,
    `<circle cx="${s*0.88}" cy="${s*0.62}" r="${s*0.015}" fill="rgba(212,160,23,0.4)"/>`,
    `</svg>`
  ].join('\n');
}

sizes.forEach(size => {
  const svg = makeSVG(size);
  fs.writeFileSync(path.join(outDir, `icon-${size}.svg`), svg, 'utf8');
  console.log(`icon-${size}.svg done`);
});
console.log('All icons generated!');
