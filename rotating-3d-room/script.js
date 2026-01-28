const room = document.querySelector('.room');
const toggleBtn = document.getElementById('toggle-rotation');
const speedSlider = document.getElementById('speed');
const wallButtons = document.querySelectorAll('[data-wall]');

let isPaused = false;

toggleBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  room.classList.toggle('paused', isPaused);
  toggleBtn.textContent = isPaused ? 'Play' : 'Pause';
});

speedSlider.addEventListener('input', (e) => {
  const duration = 61 - parseInt(e.target.value);
  room.style.setProperty('--rotation-duration', `${duration}s`);
});

wallButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const wallName = btn.dataset.wall;
    const wall = document.querySelector(`.wall.${wallName}`);
    
    wall.classList.toggle('hidden');
    btn.classList.toggle('active');
  });
});
