(function() {
  const startPauseBtn = document.getElementById('start-pause-btn');
  const lapBtn = document.getElementById('lap-btn');
  const resetBtn = document.getElementById('reset-btn');
  const timeDisplay = document.getElementById('time-display');
  const lapsList = document.getElementById('laps-list');

  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval = null;
  let running = false;
  let laps = [];

  function formatTime(ms) {
    const totalMs = ms;
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = totalMs % 1000;

    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    const mmm = milliseconds.toString().padStart(3, '0');

    return `${mm}:${ss}.${mmm}`;
  }

  function updateTime() {
    const now = Date.now();
    elapsedTime = now - startTime;
    timeDisplay.textContent = formatTime(elapsedTime);
  }

  function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => updateTime(), 50);
    running = true;
    startPauseBtn.innerHTML = '<span class="material-icons" aria-hidden="true">pause</span> Pause';
    startPauseBtn.classList.remove('btn-start');
    startPauseBtn.classList.add('btn-pause');
    startPauseBtn.setAttribute('aria-label', 'Pause stopwatch');
    startPauseBtn.setAttribute('aria-pressed', 'true');
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    running = false;
    startPauseBtn.innerHTML = '<span class="material-icons" aria-hidden="true">play_arrow</span> Start';
    startPauseBtn.classList.remove('btn-pause');
    startPauseBtn.classList.add('btn-start');
    startPauseBtn.setAttribute('aria-label', 'Start stopwatch');
    startPauseBtn.setAttribute('aria-pressed', 'false');
  }

  function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    elapsedTime = 0;
    timeDisplay.textContent = '00:00.000';
    laps = [];
    lapsList.innerHTML = '';
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    startPauseBtn.innerHTML = '<span class="material-icons" aria-hidden="true">play_arrow</span> Start';
    startPauseBtn.classList.remove('btn-pause');
    startPauseBtn.classList.add('btn-start');
    startPauseBtn.setAttribute('aria-label', 'Start stopwatch');
    startPauseBtn.setAttribute('aria-pressed', 'false');
  }

  function recordLap() {
    const lapTime = elapsedTime - (laps.length > 0 ? laps.reduce((a,b) => a + b, 0) : 0);
    laps.push(lapTime);
    const lapNumber = laps.length;

    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.setAttribute('role', 'listitem');

    const lapLabel = document.createElement('span');
    lapLabel.textContent = `Lap ${lapNumber}`;

    const lapTimeSpan = document.createElement('span');
    lapTimeSpan.textContent = formatTime(lapTime);

    lapItem.appendChild(lapLabel);
    lapItem.appendChild(lapTimeSpan);

    lapsList.prepend(lapItem);
  }

  startPauseBtn.addEventListener('click', () => {
    if (!running) {
      startTimer();
    } else {
      pauseTimer();
    }
  });

  resetBtn.addEventListener('click', () => {
    resetTimer();
  });

  lapBtn.addEventListener('click', () => {
    if (running) {
      recordLap();
    }
  });

  startPauseBtn.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      startPauseBtn.click();
    }
  });
})();