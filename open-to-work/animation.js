const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const playBtn = document.getElementById('playBtn');
const charCount = document.getElementById('charCount');

// Canvas setup
canvas.width = 900;
canvas.height = 400;

// Lego brick colors (vibrant palette)
const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e63'];

// Letter definitions - each letter is a grid of 1s and 0s
// Grid is 5 wide x 7 tall for each letter
const LETTER_MAPS = {
  'O': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'P': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  'E': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  'N': [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'T': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  'W': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1],
  ],
  'R': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  'K': [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  ' ': [
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
  ],
  // Lowercase letters
  'o': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'p': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  'e': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,0],
    [0,1,1,1,0],
  ],
  'n': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  't': [
    [0,0,0,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,1,0],
  ],
  'w': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [0,1,0,1,0],
  ],
  'r': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,1,1,0],
    [1,1,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  'k': [
    [0,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
  ],
  'a': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,1,1,1,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
  ],
  'b': [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  'c': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
  ],
  'd': [
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
  ],
  'f': [
    [0,0,0,0,0],
    [0,0,1,1,0],
    [0,1,0,0,0],
    [1,1,1,0,0],
    [0,1,0,0,0],
    [0,1,0,0,0],
    [0,1,0,0,0],
  ],
  'g': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,1,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
    [0,0,0,0,1],
    [0,1,1,1,0],
  ],
  'h': [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'i': [
    [0,0,0],
    [0,1,0],
    [0,0,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
  ],
  'j': [
    [0,0,0,0],
    [0,0,0,1],
    [0,0,0,0],
    [0,0,0,1],
    [0,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ],
  'l': [
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
  ],
  'm': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,0,1,0],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
  ],
  's': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,1,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  'u': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'v': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
  ],
  'x': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
  ],
  'y': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
    [0,0,0,0,1],
    [0,1,1,1,0],
  ],
  'z': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,1,1,1,1],
  ],
  'A': [
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'B': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  'C': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'D': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  'F': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  'G': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'H': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'I': [
    [1,1,1],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1],
  ],
  'J': [
    [0,0,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [1,0,0,1,0],
    [1,0,0,1,0],
    [0,1,1,0,0],
  ],
  'L': [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  'M': [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'Q': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,0],
    [0,1,1,0,1],
  ],
  'S': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'U': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'V': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
  ],
  'X': [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
  ],
  'Y': [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  'Z': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
};

let TEXT = "OPEN TO WORK";
const BRICK_SIZE = 10;
const BRICK_GAP = 2;
const LETTER_GAP = 15;

let bricks = [];
let startTime = null;
let animationId = null;

class Brick {
  constructor(targetX, targetY, color, delay) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = targetX + (Math.random() - 0.5) * 50;
    this.y = -50 - Math.random() * 300;
    this.color = color;
    this.delay = delay;
    this.started = false;
    this.velocity = 0;
    this.gravity = 0.5;
    this.bounce = 0.3;
    this.settled = false;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  update(time) {
    if (time < this.delay) return;
    this.started = true;

    if (this.settled) return;

    // Apply gravity
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.rotation += this.rotationSpeed;

    // Move horizontally toward target
    this.x += (this.targetX - this.x) * 0.1;

    // Check if reached target
    if (this.y >= this.targetY) {
      this.y = this.targetY;
      if (Math.abs(this.velocity) > 1) {
        this.velocity = -this.velocity * this.bounce;
        this.rotationSpeed *= 0.5;
      } else {
        this.velocity = 0;
        this.rotation = 0;
        this.settled = true;
      }
    }
  }

  draw(ctx) {
    if (!this.started) return;

    ctx.save();
    ctx.translate(this.x + BRICK_SIZE / 2, this.y + BRICK_SIZE / 2);
    ctx.rotate(this.rotation);
    
    // Main brick body
    ctx.fillStyle = this.color;
    ctx.fillRect(-BRICK_SIZE / 2, -BRICK_SIZE / 2, BRICK_SIZE, BRICK_SIZE);
    
    // Highlight (top-left)
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-BRICK_SIZE / 2, -BRICK_SIZE / 2, BRICK_SIZE, 2);
    ctx.fillRect(-BRICK_SIZE / 2, -BRICK_SIZE / 2, 2, BRICK_SIZE);
    
    // Shadow (bottom-right)
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-BRICK_SIZE / 2, BRICK_SIZE / 2 - 2, BRICK_SIZE, 2);
    ctx.fillRect(BRICK_SIZE / 2 - 2, -BRICK_SIZE / 2, 2, BRICK_SIZE);
    
    // Lego stud on top
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(-0.5, -0.5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

function createBricks(text) {
  bricks = [];
  
  // Calculate total width first to center the text
  let totalWidth = 0;
  for (const char of text) {
    const letterMap = LETTER_MAPS[char];
    if (!letterMap) continue;
    totalWidth += letterMap[0].length * (BRICK_SIZE + BRICK_GAP) + LETTER_GAP;
  }
  totalWidth -= LETTER_GAP; // Remove trailing gap

  let offsetX = (canvas.width - totalWidth) / 2;
  let letterDelay = 0;
  const LETTER_DURATION = 350; // Overlap: next letter starts while previous is still dropping

  for (const char of text) {
    const letterMap = LETTER_MAPS[char];
    if (!letterMap) continue;
    
    const letterColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Build from bottom up - bottom row drops first, then rows above
    const totalRows = letterMap.length;
    
    for (let row = totalRows - 1; row >= 0; row--) {
      for (let col = 0; col < letterMap[row].length; col++) {
        if (letterMap[row][col] === 1) {
          const x = offsetX + col * (BRICK_SIZE + BRICK_GAP);
          const y = 150 + row * (BRICK_SIZE + BRICK_GAP);
          // Bottom rows (higher row index) drop first
          const rowFromBottom = totalRows - 1 - row;
          const delay = letterDelay + (rowFromBottom * 60) + (col * 15) + Math.random() * 20;
          bricks.push(new Brick(x, y, letterColor, delay));
        }
      }
    }
    
    offsetX += letterMap[0].length * (BRICK_SIZE + BRICK_GAP) + LETTER_GAP;
    
    // Only add delay for non-space characters
    if (char !== ' ') {
      letterDelay += LETTER_DURATION;
    } else {
      letterDelay += 200; // Smaller pause for spaces
    }
  }
}

function startAnimation(text) {
  TEXT = text;
  startTime = null;
  createBricks(text);
}

// Animation loop
function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  // Clear canvas
  ctx.fillStyle = 'rgba(10, 10, 20, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw all bricks
  for (const brick of bricks) {
    brick.update(elapsed);
    brick.draw(ctx);
  }

  animationId = requestAnimationFrame(animate);
}

// Only allow alphabet and space
function sanitizeInput(value) {
  return value.replace(/[^a-zA-Z ]/g, '');
}

// Event listeners
textInput.addEventListener('input', (e) => {
  const sanitized = sanitizeInput(textInput.value);
  if (sanitized !== textInput.value) {
    textInput.value = sanitized;
    textInput.style.animation = 'shake 0.3s';
    setTimeout(() => textInput.style.animation = '', 300);
  }
  charCount.textContent = textInput.value.length;
});

playBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (text.length > 0) {
    startAnimation(text);
  }
});

textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const text = textInput.value.trim();
    if (text.length > 0) {
      startAnimation(text);
    }
  }
});

// Initial animation
startAnimation(TEXT);
requestAnimationFrame(animate);
