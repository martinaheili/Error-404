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

  // --- Terminal y modales ---
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
    // El modal ya está centrado por CSS, solo mostrarlo
    firstModal.style.display = "flex";
    firstModal.style.flexDirection = "column";
    firstModal.style.justifyContent = "space-between";
    
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

    firstModal.querySelector(".contactBtn").onclick = () => createModal();

    makeDraggable(firstModal);
  }

  function createModal() {
    const modalClone = document.createElement("div");
    modalClone.classList.add("modal-base");
    
    // Primero agregar el contenido HTML
    modalClone.innerHTML=`
      <span class="closeModal">✖</span>
      <h1>MARS NOT FOUND</h1>
      <p>Cannot contact mission control!</p>
      <div class="countdown-box">
        <p>Self-destruct in <span class="countdown">10:00</span></p>
      </div>
      <button class="contactBtn">CONTACT BASE</button>
    `;
    
    // Agregar al DOM para calcular dimensiones reales
    document.body.appendChild(modalClone);
    
    // Mostrar y forzar cálculo de dimensiones
    modalClone.style.display = "flex";
    modalClone.style.flexDirection = "column";
    modalClone.style.justifyContent = "space-between";
    
    // Obtener dimensiones REALES después de tener contenido y estar en el DOM
    const modalWidth = modalClone.offsetWidth;
    const modalHeight = modalClone.offsetHeight;

    // Calcular posición aleatoria sin tocar bordes
    const margin = window.innerWidth <= 576 ? 10 : 20;
    const maxX = window.innerWidth - modalWidth - margin;
    const maxY = window.innerHeight - modalHeight - margin;
    
    // REMOVER el centrado automático para modales secundarios
    modalClone.style.top = "auto";
    modalClone.style.left = "auto";
    modalClone.style.right = "auto";
    modalClone.style.bottom = "auto";
    modalClone.style.margin = "0";
    
    if (maxX > margin && maxY > margin) {
      const randomX = Math.max(margin, Math.random() * maxX);
      const randomY = Math.max(margin, Math.random() * maxY);
      
      modalClone.style.position = "fixed";
      modalClone.style.left = `${randomX}px`;
      modalClone.style.top = `${randomY}px`;
      modalClone.style.transform = "none";
    } else {
      // Si no hay espacio, poner en posición por defecto
      modalClone.style.position = "fixed";
      modalClone.style.left = `${margin}px`;
      modalClone.style.top = `${margin}px`;
      modalClone.style.transform = "none";
    }
    
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

    modalClone.querySelector(".closeModal").onclick=()=>{
      modalClone.classList.remove("show");
      setTimeout(()=>modalClone.remove(),500);
    };
    
    modalClone.querySelector(".contactBtn").onclick=()=>createModal();
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
      
      // Si es el modal principal, remover el centrado automático
      if(el === firstModal) {
        el.style.top = "auto";
        el.style.left = "auto";
        el.style.right = "auto";
        el.style.bottom = "auto";
        el.style.margin = "0";
        el.style.transform = "none";
      }
    };
    document.onmousemove=(e)=>{
      if(!isDragging) return;
      el.style.left=e.clientX-offsetX+"px";
      el.style.top=e.clientY-offsetY+"px";
      el.style.transform = "none";
    };
    document.onmouseup=()=>{
      if(isDragging) isDragging=false;
      el.style.transition="";
    };
  }
});

// --------------------
// Efectos visuales
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

// Corrupt text
setTimeout(() => {
  function corruptText(el) {
    if (!el) return;
    const original = el.innerText;
    el.innerText = "@#%€//!!";
    setTimeout(()=> {
      if (el) el.innerText = original;
    }, 40);
  }

  const center404 = document.querySelector("#center404");
  if (center404) {
    setInterval(() => corruptText(center404), 800);
  }
}, 100);
