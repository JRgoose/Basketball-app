
let homeScore = 0;
let guestScore = 0;
let timeLeft = 12 * 60;
let timerInterval = null;


const homeScoreEl = document.getElementById("home-score");
const guestScoreEl = document.getElementById("guest-score");
const timerEl = document.getElementById("timer");
const resetBtn = document.getElementById("reset-btn");
const screenImage = document.getElementById("screen-image");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");


function addHome(points) {
  if (timeLeft <= 0) return;
  homeScore += points;
  homeScoreEl.textContent = homeScore;
  flashScore(homeScoreEl);
  showResetBtnIfNeeded();
}

function addGuest(points) {
  if (timeLeft <= 0) return;
  guestScore += points;
  guestScoreEl.textContent = guestScore;
  flashScore(guestScoreEl);
  showResetBtnIfNeeded();
}


function startTimer() {
  if (timerInterval || timeLeft < 12 * 60) return;

  stopBtn.disabled = false;
  stopBtn.textContent = "PAUSE";
  stopBtn.setAttribute("data-state", "pause");
  startBtn.classList.add("hidden");

  startSlideshow();
  timerInterval = setInterval(tick, 1000);

  showResetBtnIfNeeded();
}

function togglePause() {
  if (stopBtn.disabled) return;

  const isPaused = stopBtn.getAttribute("data-state") === "pause";

  if (isPaused) {
    clearInterval(timerInterval);
    timerInterval = null;
    pauseSlideshow();
    stopBtn.textContent = "CONTINUE";
    stopBtn.setAttribute("data-state", "resume");
    timerEl.classList.add("timer-paused");
  } else {
    stopBtn.textContent = "PAUSE";
    stopBtn.setAttribute("data-state", "pause");
    timerEl.classList.remove("timer-paused");
    resumeSlideshow();
    timerInterval = setInterval(tick, 1000);
  }
}

function tick() {
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 0;
  } else {
    timeLeft--;
  }
  updateTimerDisplay();
}

function resetScores() {
  homeScore = 0;
  guestScore = 0;
  homeScoreEl.textContent = "0";
  guestScoreEl.textContent = "0";

  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 12 * 60;
  updateTimerDisplay();

  stopSlideshow();
  screenImage.src = tempImage;

  startBtn.classList.remove("hidden");
  stopBtn.disabled = true;
  stopBtn.textContent = "PAUSE";
  stopBtn.setAttribute("data-state", "pause");
  timerEl.classList.remove("timer-paused");

  const indicator = document.getElementById("possession-indicator");
  const possessionRow = document.querySelector(".possession-row");
  possessionRow.insertBefore(indicator, possessionRow.children[1]);

  resetBtn.style.display = "none";
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function showResetBtnIfNeeded() {
  if (homeScore > 0 || guestScore > 0 || timerInterval) {
    resetBtn.style.display = "inline-block";
  }
}


const gifList = [
  "gifs/basketball.gif",
  "gifs/lola.gif",
  "gifs/melo.gif",
  "gifs/michael.gif",
  "gifs/nets.gif",
  "gifs/new.gif",
  "gifs/roko.gif",
  "gifs/shoot.gif",
  "gifs/sml.gif"
];

const tempImage = "images/blogo.webp";
let currentGifIndex = 0;
let slideshowTimeout = null;
let slideshowActive = false;

function startSlideshow() {
  stopSlideshow();
  slideshowActive = true;
  currentGifIndex = 0;
  screenImage.src = tempImage;
  slideshowTimeout = setTimeout(showNextGif, 5000);
}

function pauseSlideshow() {
  clearTimeout(slideshowTimeout);
  slideshowTimeout = null;
  slideshowActive = false;
}

function resumeSlideshow() {
  if (slideshowActive) return;
  slideshowActive = true;
  slideshowTimeout = setTimeout(showNextGif, 1000);
}

function stopSlideshow() {
  clearTimeout(slideshowTimeout);
  slideshowTimeout = null;
  slideshowActive = false;
  currentGifIndex = 0;
  screenImage.src = tempImage;
}

function showNextGif() {
  if (!slideshowActive) return;

  screenImage.src = gifList[currentGifIndex];

  slideshowTimeout = setTimeout(() => {
    if (!slideshowActive) return;
    screenImage.src = tempImage;

    slideshowTimeout = setTimeout(() => {
      if (!slideshowActive) return;
      currentGifIndex = (currentGifIndex + 1) % gifList.length;
      showNextGif();
    }, 10000);
  }, 6000);
}


function setPossession(team) {
  const indicator = document.getElementById("possession-indicator");
  const target = document.getElementById(`poss-${team}`);

  if (indicator.parentElement) {
    indicator.parentElement.removeChild(indicator);
  }
  target.insertBefore(indicator, target.firstChild);
}


function flashScore(element) {
  element.classList.add("flash");
  setTimeout(() => {
    element.classList.remove("flash");
  }, 300);
}


updateTimerDisplay();
screenImage.src = tempImage;
stopBtn.disabled = true;
