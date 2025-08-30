import { CanvasRenderingContext2D, createCanvas, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

try {
  // Opcional: registre uma fonte TTF sua (adicione em ./assets)
  const fontPath = path.join(process.cwd(), 'assets', 'Inter.ttf');
  if (fs.existsSync(fontPath)) registerFont(fontPath, { family: 'Inter' });
} catch {}

export async function renderCard(title: string, items: string[]) {
  const cols = 4, rows = 3; // 12 células
  const cellW = 320, cellH = 180;
  const pad = 40;
  const width = pad*2 + cols*cellW + (cols-1)*10;
  const height = pad*2 + rows*cellH + (rows-1)*10 + 120; // espaço pro título

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // fundo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,width,height);

  // título
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 48px Inter, Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, pad, pad + 50);

  // grid
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c*(cellW + 10);
      const y = pad + 100 + r*(cellH + 10);

      // célula
      ctx.fillStyle = '#f3f4f6';
      roundRect(ctx, x, y, cellW, cellH, 16, true, false);

      // texto centralizado
      const text = items[idx++] || '';
      ctx.fillStyle = '#111';
      ctx.font = 'bold 26px Inter, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      wrapText(ctx, text, x + cellW/2, y + cellH/2, cellW - 32, 30);
    }
  }

  return canvas.toBuffer('image/png');
}

function roundRect(ctx: CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number, fill:boolean, stroke:boolean) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let offsetY = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y + offsetY);
      line = words[n] + ' ';
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y + offsetY);
}
