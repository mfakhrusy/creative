const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const SIZE = Math.min(window.innerWidth, window.innerHeight) - 40;
canvas.width = SIZE;
canvas.height = SIZE;

let time = 0;
const ZOOM_SPEED = 0.008;

function drawInfiniteGrid() {
  // Use fractional zoom - cycles 0 to 1, grid is self-similar so it loops seamlessly
  const fractionalZoom = (time % 1);
  const zoomMultiplier = Math.pow(2, fractionalZoom); // 1 → 2, then wraps to 1
  
  // Draw many grid levels for deep recursion
  for (let level = -8; level <= 4; level++) {
    const baseSize = SIZE * Math.pow(2, level);
    const cellSize = baseSize / zoomMultiplier;
    
    if (cellSize < 0.3 || cellSize > SIZE * 3) continue;
    
    // Alpha: fade out cells smoothly at both boundaries using smooth easing
    const ratio = cellSize / SIZE;
    let alpha;
    
    // Use smoothstep for gradual fade transitions
    const smoothstep = (edge0, edge1, x) => {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };
    
    // Fade in small cells (ratio 0.005 to 0.03)
    const fadeInAlpha = smoothstep(0.005, 0.03, ratio);
    // Fade out large cells (ratio 0.6 to 1.5)
    const fadeOutAlpha = 1 - smoothstep(0.6, 1.5, ratio);
    
    alpha = fadeInAlpha * fadeOutAlpha * 0.5;
    
    if (alpha < 0.02) continue;
    
    const hue = 180 + level * 20;
    ctx.strokeStyle = `hsla(${hue}, 50%, 50%, ${alpha})`;
    ctx.lineWidth = Math.max(0.5, Math.min(2.5, ratio * 3));
    
    // Draw grid centered on canvas
    const offsetX = (SIZE / 2) % cellSize;
    const offsetY = (SIZE / 2) % cellSize;
    
    // Vertical lines
    for (let x = offsetX; x <= SIZE; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, SIZE);
      ctx.stroke();
    }
    for (let x = offsetX - cellSize; x >= 0; x -= cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, SIZE);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = offsetY; y <= SIZE; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(SIZE, y);
      ctx.stroke();
    }
    for (let y = offsetY - cellSize; y >= 0; y -= cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(SIZE, y);
      ctx.stroke();
    }
  }
}

function animate() {
  ctx.fillStyle = 'rgba(4, 6, 14, 0.12)';
  ctx.fillRect(0, 0, SIZE, SIZE);
  
  time += ZOOM_SPEED;
  
  drawInfiniteGrid();
  
  requestAnimationFrame(animate);
}

animate();
