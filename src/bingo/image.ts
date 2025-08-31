import { createCanvas, registerFont, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

/** 1) Fonte opcional (coloque um .ttf em assets/) */
try {
  const fontPath = path.join(process.cwd(), 'assets', 'Inter.ttf');
  if (fs.existsSync(fontPath)) registerFont(fontPath, { family: 'Inter' });
} catch {}

/** 2) Temas prontos (edite cores aqui) */
export type Theme = {
  name: string;
  bg: string;
  titleColor: string;
  gridBg: string;
  cellBg: string;
  cellText: string;
  strokeColor?: string;
  strokeWidth?: number;
  headerBar?: { enabled: boolean; height: number; from: string; to?: string };
  watermark?: { text?: string; color: string; size: number; opacity: number };
  gap?: number;
  radius?: number;
};

export const themes: Record<string, Theme> = {
  light: {
    name: 'light',
    bg: '#ffffff',
    titleColor: '#111111',
    gridBg: '#ffffff',
    cellBg: '#f3f4f6',
    cellText: '#111111',
    strokeColor: '#e5e7eb',
    strokeWidth: 1,
    headerBar: { enabled: true, height: 84, from: '#111827', to: '#374151' },
    watermark: { text: 'alfibet', color: '#111827', size: 52, opacity: 0.05 },
    gap: 12,
    radius: 16,
  },
  dark: {
    name: 'dark',
    bg: '#0b0f14',
    titleColor: '#ffffff',
    gridBg: '#0b0f14',
    cellBg: '#101826',
    cellText: '#f8fafc',
    strokeColor: '#1f2937',
    strokeWidth: 1,
    headerBar: { enabled: true, height: 84, from: '#0f172a', to: '#111827' },
    watermark: { text: 'alfibet', color: '#ffffff', size: 52, opacity: 0.05 },
    gap: 12,
    radius: 16,
  },
};

export type RenderOptions = {
  title?: string;
  items: string[];
  /** grid */
  cols?: number;         // default 4
  rows?: number;         // default 3
  cellW?: number;        // default 320
  cellH?: number;        // default 180
  padding?: number;      // default 40
  dpiScale?: number;     // default 2 (retina)
  theme?: Theme | keyof typeof themes;
  fontFamily?: string;   // default 'Inter, Arial'
  logoPath?: string;     // opcional: assets/logo.png
  footerText?: string;   // opcional
  freeCenter?: boolean;  // se true e grid for ímpar x ímpar, central vira "FREE"
};

function getTheme(t?: Theme | keyof typeof themes): Theme {
  if (!t) return themes.light!;
  return typeof t === 'string' ? themes[t]! : t;
}

export async function renderCard(opts: RenderOptions) {
  const {
    title = 'Alfibet',
    items,
    cols = 4,
    rows = 3,
    cellW = 320,
    cellH = 180,
    padding = 40,
    dpiScale = 2,
    fontFamily = 'Inter, Arial',
    logoPath,
    footerText,
    freeCenter = false,
  } = opts;

  const theme = getTheme(opts.theme);

  // canvas base
  const width = padding * 2 + cols * cellW + (cols - 1) * (theme.gap ?? 12);
  const headerH = theme.headerBar?.enabled ? theme.headerBar.height : 0;
  const gridTop = padding + headerH + 24;
  const height = gridTop + rows * cellH + (rows - 1) * (theme.gap ?? 12) + padding + (footerText ? 40 : 0);

  const canvas = createCanvas(width * dpiScale, height * dpiScale);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpiScale, dpiScale);

  // fundo
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, width, height);

  // header (barra)
  if (theme.headerBar?.enabled) {
    const grd = ctx.createLinearGradient(0, 0, width, 0);
    grd.addColorStop(0, theme.headerBar.from);
    grd.addColorStop(1, theme.headerBar.to ?? theme.headerBar.from);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, headerH);
  }

  // título
  ctx.fillStyle = theme.headerBar?.enabled ? '#ffffff' : theme.titleColor;
  ctx.font = 'bold 48px ' + fontFamily;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, padding, (theme.headerBar?.enabled ? headerH / 2 : padding + 24));

  // logo opcional (canto direito do header)
  if (logoPath && fs.existsSync(logoPath)) {
    try {
      const img = await loadImage(logoPath);
      const maxH = theme.headerBar?.enabled ? headerH * 0.6 : 56;
      const ratio = img.width / img.height;
      const h = maxH;
      const w = h * ratio;
      ctx.drawImage(img, width - padding - w, (theme.headerBar?.enabled ? (headerH - h) / 2 : padding), w, h);
    } catch {}
  }

  // grid bg (opcional)
  if (theme.gridBg) {
    ctx.fillStyle = theme.gridBg;
    // nada especial aqui; mantido para temas que queiram mudar a base do grid
  }

  // WATERMARK
  if (theme.watermark?.text) {
    ctx.save();
    ctx.globalAlpha = theme.watermark.opacity;
    ctx.fillStyle = theme.watermark.color;
    ctx.font = `bold ${theme.watermark.size}px ${fontFamily}`;
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 8);
    ctx.textAlign = 'center';
    ctx.fillText(theme.watermark.text, 0, 0);
    ctx.restore();
  }

  // desenhar células
  const gap = theme.gap ?? 12;
  const radius = theme.radius ?? 16;
  const strokeW = theme.strokeWidth ?? 0;

  // “FREE” central se grid for ímpar
  const hasFree = freeCenter && cols % 2 === 1 && rows % 2 === 1;
  const midIndex = hasFree ? Math.floor(rows / 2) * cols + Math.floor(cols / 2) : -1;

  const effectiveItems = [...items];
  // garante tamanho (corta ou completa com vazio)
  const totalCells = cols * rows;
  if (effectiveItems.length > totalCells) effectiveItems.length = totalCells;
  while (effectiveItems.length < totalCells) effectiveItems.push('');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const x = padding + c * (cellW + gap);
      const y = gridTop + r * (cellH + gap);

      // célula
      ctx.fillStyle = theme.cellBg;
      roundRect(ctx as unknown as CanvasRenderingContext2D, x, y, cellW, cellH, radius, true, false);

      if (strokeW > 0 && theme.strokeColor) {
        ctx.lineWidth = strokeW;
        ctx.strokeStyle = theme.strokeColor;
        roundRect(ctx as unknown as CanvasRenderingContext2D, x, y, cellW, cellH, radius, false, true);
      }

      // texto
      const text = (idx === midIndex) ? 'FREE' : (effectiveItems[idx] || '');
      ctx.fillStyle = theme.cellText;
      drawWrappedCenter(ctx as unknown as CanvasRenderingContext2D, text, x + cellW / 2, y + cellH / 2, cellW - 32, cellH - 32, { fontFamily, max: 28, min: 16, step: 2, lineHeight: 1.25, bold: true });
    }
  }

  // footer pequeno
  if (footerText) {
    ctx.fillStyle = theme.titleColor;
    ctx.font = 'normal 20px ' + fontFamily;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(footerText, width / 2, height - padding / 2);
  }

  return canvas.toBuffer('image/png');
}

/** helpers */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
  fill: boolean, stroke: boolean
) {
  let radius = r;
  if (w < 2 * radius) radius = w / 2;
  if (h < 2 * radius) radius = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/**
 * Desenha texto central, adaptando o font-size (shrink-to-fit) e quebrando linhas.
 */
function drawWrappedCenter(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  maxW: number,
  maxH: number,
  opts: { fontFamily: string; max: number; min: number; step: number; lineHeight: number; bold?: boolean }
) {
  const { fontFamily, max, min, step, lineHeight, bold } = opts;
  let fontSize = max;
  let lines: string[] = [];

  for (; fontSize >= min; fontSize -= step) {
    ctx.font = `${bold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
    lines = wrap(ctx, text, maxW);
    const totalH = lines.length * fontSize * lineHeight;
    if (totalH <= maxH) break;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalH = lines.length * fontSize * lineHeight;
  let y = cy - totalH / 2 + fontSize * lineHeight / 2;
  for (const line of lines) {
    ctx.fillText(line, cx, y);
    y += fontSize * lineHeight;
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';

  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width <= maxW) {
      cur = test;
    } else {
      if (cur) lines.push(cur);
      // se a palavra isolada passa do limite, força quebra “dura”
      if (ctx.measureText(w).width > maxW) {
        let chunk = '';
        for (const ch of w) {
          if (ctx.measureText(chunk + ch).width <= maxW) chunk += ch;
          else { lines.push(chunk); chunk = ch; }
        }
        cur = chunk;
      } else {
        cur = w;
      }
    }
  }
  if (cur) lines.push(cur);
  return lines;
}
