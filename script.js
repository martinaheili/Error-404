const terminal = document.getElementById("terminal");
const errorSound = document.getElementById("errorSound");
const firstModal = document.getElementById("modal");
let countdownTime = 10 * 60; // 10 minutos

const messages = [
  "ATTEMPTING TO LOCATE MARS >>>>>>>>>> ERROR 404",
  "                                                                    SCANNING SOLAR SYSTEM COORDINATES ---------",
  "                                                                                                                                         MARS NOT FOUND",
  "ACTIVATING AUTOMATED TRACKING SYSTEMS -------->",
  "                                                                                                                                                                         ERROR: PLANET MARS MISSING >>>>>>ERROR: PLANET MARS MISSING >>>>>>ERROR: PLANET MARS MISSING >>>>>>ERROR: PLANET MARS MISSING >>>>>>",
  "WARNING: COMMUNICATION DELAY 10 SEC ----",
  "     REDIRECTING SENSORS TO BACKUP SATELLITES >>>>>",
  "                                                                                                                                                                                                                                                                                                                         CALCULATING TRAJECTORY ANOMALIES ---------",
  " EMERGENCY PROTOCOL ENGAGED >>>>>>> ERROR 404",
  "LOG SAVED TO MISSION DATABASE <<<<<<<"
];

function typeMessage(message, callback) {
  let i = 0;
  const interval = setInterval(() => {
    terminal.textContent += message[i];
    i++;
    if (i >= message.length) {
      clearInterval(interval);
      const lineBreaks = Math.floor(Math.random() * 3) + 1;
      terminal.textContent += "\n".repeat(lineBreaks);
      if (callback) callback();
    }
  }, 10);
}

function startTerminal(index = 0) {
  typeMessage(messages[index], () => {
    const nextIndex = (index + 1) % messages.length;
    setTimeout(() => startTerminal(nextIndex), Math.random() * 500 + 200);
  });
}

// iniciar terminal y sonido
setTimeout(() => {
  errorSound.play().catch(() => console.log("Autoplay blocked"));
  startTerminal();
  showFirstModal();
}, 1000);

function showFirstModal() {
  firstModal.style.top = "50%";
  firstModal.style.left = "50%";
  firstModal.style.transform = "translate(-50%, -50%)";

  setTimeout(() => firstModal.classList.add("show"), 10);

  const countdownEl = firstModal.querySelector(".countdown");
  let localCountdown = countdownTime;
  const timer = setInterval(() => {
    const minutes = Math.floor(localCountdown / 60);
    const seconds = localCountdown % 60;
    countdownEl.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    localCountdown--;
    if (localCountdown < 0) clearInterval(timer);
  }, 1000);

  firstModal.querySelector(".closeModal").onclick = () => {
    firstModal.classList.remove("show");
    setTimeout(() => firstModal.style.display = "none", 500);
  };

  firstModal.querySelector(".contactBtn").onclick = () => createModal(false);

  makeDraggable(firstModal);
}

function createModal(isFirst = false) {
  const modalClone = document.createElement("div");
  modalClone.classList.add("modal-base");

  const modalWidth = 500;
  const modalHeight = 350;

  if (isFirst) {
    modalClone.style.top = "50%";
    modalClone.style.left = "50%";
    modalClone.style.transform = "translate(-50%, -50%)";
  } else {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const randomTop = Math.random() * (winHeight - modalHeight);
    const randomLeft = Math.random() * (winWidth - modalWidth);
    modalClone.style.top = `${randomTop}px`;
    modalClone.style.left = `${randomLeft}px`;
    modalClone.style.transform = "translate(0,0)";
  }

  modalClone.innerHTML = `
    <span class="closeModal">✖</span>
    <h1>MARS NOT FOUND</h1>
    <p>Cannot contact mission control!</p>
    <div class="countdown-box">
      <p>Self-destruct in <span class="countdown">10:00</span></p>
    </div>
    <button class="contactBtn">CONTACT BASE</button>
  `;

  document.body.appendChild(modalClone);
  setTimeout(() => modalClone.classList.add("show"), 10);

  const countdownEl = modalClone.querySelector(".countdown");
  let localCountdown = 10 * 60;
  const timer = setInterval(() => {
    const minutes = Math.floor(localCountdown / 60);
    const seconds = localCountdown % 60;
    countdownEl.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    localCountdown--;
    if (localCountdown < 0) clearInterval(timer);
  }, 1000);

  modalClone.querySelector(".closeModal").onclick = () => {
    modalClone.classList.remove("show");
    setTimeout(() => modalClone.remove(), 500);
  };

  modalClone.querySelector(".contactBtn").onclick = () => createModal(false);

  makeDraggable(modalClone);
}

function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const header = el.querySelector("h1") || el;
  header.style.cursor = "move";

  header.onmousedown = (e) => {
    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    el.style.transition = "none";
  };

  document.onmousemove = (e) => {
    if (!isDragging) return;
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
    el.style.transform = "translate(0,0)";
  };

  document.onmouseup = () => {
    if (isDragging) isDragging = false;
    el.style.transition = "";
  };
}