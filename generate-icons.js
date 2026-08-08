// سكريبت لتوليد أيقونات PWA بأحجام مختلفة
// يستخدم Canvas API عبر node-canvas
// تشغيل: node generate-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, 'icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  // --- خلفية متدرجة ---
  const bg = ctx.createRadialGradient(cx, cy * 0.8, 0, cx, cy, s * 0.75);
  bg.addColorStop(0, '#0d3024');
  bg.addColorStop(0.5, '#0a2218');
  bg.addColorStop(1, '#050f0a');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, s, s, s * 0.18);
  ctx.fill();

  // --- حلقة ذهبية خارجية ---
  ctx.beginPath();
  ctx.arc(cx, cy * 0.92, s * 0.38, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,160,23,0.5)';
  ctx.lineWidth = s * 0.025;
  ctx.stroke();

  // --- حلقة ذهبية داخلية ---
  ctx.beginPath();
  ctx.arc(cx, cy * 0.92, s * 0.30, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,160,23,0.25)';
  ctx.lineWidth = s * 0.015;
  ctx.stroke();

  // --- دائرة داخلية خضراء ---
  const innerGrad = ctx.createRadialGradient(cx - s * 0.05, cy * 0.82, 0, cx, cy * 0.92, s * 0.27);
  innerGrad.addColorStop(0, '#1a4a2a');
  innerGrad.addColorStop(1, '#0a2218');
  ctx.beginPath();
  ctx.arc(cx, cy * 0.92, s * 0.26, 0, Math.PI * 2);
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // --- إيموجي الفهد ---
  const emojiSize = s * 0.35;
  ctx.font = `${emojiSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐆', cx, cy * 0.88);

  // --- نص "تحدي الفهد" ---
  const fontSize = s * 0.1;
  ctx.font = `900 ${fontSize}px Arial`;
  ctx.fillStyle = '#D4A017';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('تحدي الفهد', cx, s * 0.97);

  // --- نجوم صغيرة ---
  ctx.fillStyle = 'rgba(212,160,23,0.6)';
  const stars = [
    [cx - s * 0.38, cy * 0.55],
    [cx + s * 0.36, cy * 0.6],
    [cx - s * 0.28, cy * 1.18],
    [cx + s * 0.3, cy * 1.2],
  ];
  stars.forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, s * 0.018, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas;
}

sizes.forEach(size => {
  const canvas = drawIcon(size);
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), buf);
  console.log(`✅ icon-${size}.png`);
});

console.log('\n🎉 جميع الأيقونات جاهزة في مجلد icons/');
