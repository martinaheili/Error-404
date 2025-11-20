
document.addEventListener("DOMContentLoaded", () => {
  // --- Canvas Glitch ---
  const canvas = document.getElementById("glitchCanvas");
  const ctx = canvas.getContext("2d");
  let cw, ch;

  function resizeCanvas() {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawGlitchFrame() {
    ctx.clearRect(0,0,cw,ch);

    // Rectángulos verdes/azules
    const rectCount = 50;
    for (let i = 0; i < rectCount; i++) {
      const w = Math.random()*200;
      const h = Math.random()*50;
      const x = Math.random()*cw;
      const y = Math.random()*ch;
      const green = Math.floor(100 + Math.random()*155);
      const blue = Math.floor(100 + Math.random()*155);
      ctx.fillStyle = `rgba(0,${green},${blue},${Math.random()*0.5})`;
      ctx.fillRect(x,y,w,h);
    }

    // Líneas horizontales glitch
    const lineCount = 20;
    for (let i=0; i<lineCount; i++){
      const y = Math.random()*ch;
      const h = Math.random()*5+1;
      const shift = (Math.random()-0.5)*50;
      ctx.drawImage(canvas,0,y,cw,h,shift,y,cw,h);
    }

    // Ruido tipo scanline
    const noiseCount = 1500;
    for (let i=0; i<noiseCount; i++){
      const x = Math.random()*cw;
      const y = Math.random()*ch;
      const alpha = Math.random()*0.05;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x,y,1,1);
    }

    requestAnimationFrame(drawGlitchFrame);
  }
  drawGlitchFrame();

  // --- Texto RGB Shift ---
  const glitchElements = [document.getElementById("center404"), document.getElementById("terminal")];
  function glitchText() {
    glitchElements.forEach(el=>{
      el.style.textShadow = `
        ${Math.random()*6-3}px 0px #ff0000,
        ${Math.random()*6-3}px 0px #00ff00,
        ${Math.random()*6-3}px 0px #0000ff
      `;
    });
    setTimeout(glitchText, Math.random()*100+50);
  }
  glitchText();

  // --- Terminal y modales (tu código original) ---
  const terminal = document.getElementById("terminal");
  const errorSound = document.getElementById("errorSound");
  const firstModal = document.getElementById("modal");
  let countdownTime = 10*60;

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

  setTimeout(() => {
    errorSound.play().catch(()=>console.log("Autoplay blocked"));
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
      const minutes = Math.floor(localCountdown/60);
      const seconds = localCountdown%60;
      countdownEl.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      localCountdown--;
      if (localCountdown<0) clearInterval(timer);
    },1000);

    firstModal.querySelector(".closeModal").onclick = () => {
      firstModal.classList.remove("show");
      setTimeout(()=>firstModal.style.display="none",500);
    };

    firstModal.querySelector(".contactBtn").onclick = () => createModal(false);

    makeDraggable(firstModal);
  }

  function createModal(isFirst=false) {
    const modalClone = document.createElement("div");
    modalClone.classList.add("modal-base");

    const modalWidth = 500;
    const modalHeight = 350;

    if(isFirst){
      modalClone.style.top="50%";
      modalClone.style.left="50%";
      modalClone.style.transform="translate(-50%, -50%)";
    } else {
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      const randomTop = Math.random()*(winHeight-modalHeight);
      const randomLeft = Math.random()*(winWidth-modalWidth);
      modalClone.style.top=`${randomTop}px`;
      modalClone.style.left=`${randomLeft}px`;
      modalClone.style.transform="translate(0,0)";
    }

    modalClone.innerHTML=`
      <span class="closeModal">✖</span>
      <h1>MARS NOT FOUND</h1>
      <p>Cannot contact mission control!</p>
      <div class="countdown-box">
        <p>Self-destruct in <span class="countdown">10:00</span></p>
      </div>
      <button class="contactBtn">CONTACT BASE</button>
    `;
    document.body.appendChild(modalClone);
    setTimeout(()=>modalClone.classList.add("show"),10);

    const countdownEl = modalClone.querySelector(".countdown");
    let localCountdown = 10*60;
    const timer = setInterval(()=>{
      const minutes=Math.floor(localCountdown/60);
      const seconds=localCountdown%60;
      countdownEl.textContent=`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      localCountdown--;
      if(localCountdown<0) clearInterval(timer);
    },1000);

    modalClone.querySelector(".closeModal").onclick=()=>{modalClone.classList.remove("show");setTimeout(()=>modalClone.remove(),500)};
    modalClone.querySelector(".contactBtn").onclick=()=>createModal(false);
    makeDraggable(modalClone);
  }

  function makeDraggable(el){
    let isDragging=false, offsetX=0, offsetY=0;
    const header = el.querySelector("h1")||el;
    header.style.cursor="move";
    header.onmousedown=(e)=>{
      isDragging=true;
      const rect=el.getBoundingClientRect();
      offsetX=e.clientX-rect.left;
      offsetY=e.clientY-rect.top;
      el.style.transition="none";
    };
    document.onmousemove=(e)=>{
      if(!isDragging) return;
      el.style.left=e.clientX-offsetX+"px";
      el.style.top=e.clientY-offsetY+"px";
      el.style.transform="translate(0,0)";
    };
    document.onmouseup=()=>{if(isDragging)isDragging=false;el.style.transition=""};
  }
});


// --------------------
setInterval(() => {
  document.body.style.transform = "translateX(3px)";
  setTimeout(()=> document.body.style.transform = "", 60);
}, 2500);


setInterval(() => {
  document.body.classList.add("corrupt");
  setTimeout(() => document.body.classList.remove("corrupt"), 120);
}, 2000);


function flashGeometry() {
  const geo = document.createElement("div");
  geo.className = "geoFlash";
  document.body.appendChild(geo);
  setTimeout(()=> geo.remove(), 180);
}

setInterval(flashGeometry, 900);


function corruptText(el) {
  const original = el.innerText;
  el.innerText = "@#%€//!!";
  setTimeout(()=> el.innerText = original, 40);
}

setInterval(()=> corruptText(document.querySelector("#center404")), 800);