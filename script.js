import { generatePromptedInt } from "./promptedInt.js";
import { generatePromptedFloat } from "./promptedFloat.js";
import { generatePromptedString } from "./promptedString.js";
import { generatePromptedBool } from "./promptedBool.js";
import { getRandomInt, getRandomFloat } from "./random.js";

document.addEventListener("DOMContentLoaded", function () {
  const answerZone = document.getElementById("answer-zone");
  const resetBtn = document.getElementById("reset-btn");
  const resultDiv = document.getElementById("result");
  const modeSelect = document.getElementById("mode-select");
  const langSelect = document.getElementById("lang-select");
  const totalQuestionsEl = document.getElementById("total-questions");
  const correctAnswersEl = document.getElementById("correct-answers");
  const incorrectAnswersEl = document.getElementById("incorrect-answers");

  // เมื่อหน้าเว็บโหลดขึ้นมา ให้ปุ่ม Reset มีชื่อว่า "Start"
  resetBtn.innerHTML = '<i class="fas fa-random"></i> Start';
  resetBtn.className = "container-fluid btn btn-success btn-lg";

  let randomValue = null;
  let valueType = null;
  let totalQuestions = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let skipAnswers = 0;
  let streak = 0;

  const streakContainer = document.getElementById("streak-container");
  const streakVal = document.getElementById("streak-val");

  // ==========================================
  // Sound Effects (Web Audio API - Offline/Static friendly)
  // ==========================================
  let soundEnabled = true;
  let audioCtx = null;

  function playSound(type) {
    if (!isTeachingMode || !soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "correct") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (type === "incorrect") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.setValueAtTime(164.81, now + 0.1); // E3
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      // AudioContext not supported or restricted
    }
  }

  const btnSound = document.getElementById("btn-sound-toggle");
  if (btnSound) {
    btnSound.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      btnSound.innerHTML = soundEnabled
        ? '<i class="fas fa-volume-up"></i>'
        : '<i class="fas fa-volume-mute text-danger"></i>';
      btnSound.title = soundEnabled ? "เปิด/ปิด เสียงเอฟเฟกต์ (เปิดอยู่)" : "เปิด/ปิด เสียงเอฟเฟกต์ (ปิดอยู่)";
    });
  }

  // จำนวนปุ่มทั้งหมดในเว็บ
  let buttonCount = 0;

  // ตรวจสอบว่าเกมหยุดอยู่หรือไม่
  let stopGame = false;

  generateButtons();

  function generateRandomString(length) {
    let result = "";
    const randomChoice = getRandomInt(1, 100);

    if (randomChoice < 50) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
    } else {
      const words = ["apple", "banana", "cherry", "date", "fig", "grape"];
      result = words[Math.floor(Math.random() * words.length)];
    }

    return result;
  }

  function resetGame() {
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    skipAnswers = 0;
    streak = 0;
    if (streakContainer) streakContainer.style.display = "none";
    totalQuestionsEl.textContent = "Total: " + totalQuestions;
    correctAnswersEl.textContent = "Correct: " + correctAnswers;
    incorrectAnswersEl.textContent = "Incorrect: " + incorrectAnswers;
    resultDiv.textContent = "???";
  }

  function generateAnswer() {
    let id_trueBtn;
    switch (valueType) {
      case "int":
        id_trueBtn = 0;
        break;
      case "float":
        id_trueBtn = 1;
        break;
      case "char":
        id_trueBtn = 2;
        break;
      case "string":
        id_trueBtn = 3;
        break;
      case "bool":
        if (randomValue[1]) {
          id_trueBtn = 4;
        } else {
          id_trueBtn = 5;
        }
        break;
    }

    return id_trueBtn;
  }

  function checkAnswer(i) {
    let Answer = false;
    // ตรวจสอบว่าคำตอบถูกหรือไม่
    if (i == generateAnswer()) {
      correctAnswers++;
      streak++;
      Answer = true;
      playSound("correct");
    } else {
      incorrectAnswers++;
      streak = 0;
      Answer = false;
      playSound("incorrect");
    }

    if (streakContainer && streakVal) {
      if (streak >= 2) {
        streakContainer.style.display = "block";
        streakVal.textContent = streak;
      } else {
        streakContainer.style.display = "none";
      }
    }

    const trueBtn = document.getElementById(`box-${generateAnswer()}`);
    if (trueBtn) {
      trueBtn.className = "btn btn-success btn-lg";
    }

    updateProgressBar();
    return Answer;
  }

  function generateButtons() {
    const mode = modeSelect.value;
    const lang = langSelect.value;
    answerZone.innerHTML = ""; // ล้างปุ่มเก่า

    // reset ค่าปุ่มเดิม
    buttonCount = 0;
    if (mode === "basic" || mode === "intermediate") {
      buttonCount = 3;
    } else {
      buttonCount = 6;
    }

    let nameBtn;
    if (lang === "c") {
      nameBtn = [
        "Type: int, Format: %d",
        "Type: float, Format: %f",
        "Type: char, Format: %c",
        "Type: string, Format: %s",
        "Type: bool/int, Format: %d (true, 1)",
        "Type: bool/int, Format: %d (false, 0)",
      ];
    } else {
      nameBtn = [
        "Type: int",
        "Type: float",
        "Type: char",
        "Type: string",
        "Type: bool (true, 1)",
        "Type: bool (false, 0)",
      ];
    }

    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container"; // เพิ่มคลาสสำหรับการจัดการ layout ของปุ่ม
    answerZone.appendChild(btnContainer);

    for (let i = 0; i < buttonCount; i++) {
      // สร้างปุ่ม
      const button = document.createElement("button");
      button.id = `box-${i}`;
      button.className = "btn btn-dark btn-lg";
      button.textContent = `${nameBtn[i]}`;

      // เพิ่มปุ่มเข้าไปใน container
      btnContainer.appendChild(button);

      // ผูก Event Listener กับปุ่มหลังจากที่ปุ่มถูกสร้างแล้ว
      button.addEventListener("click", () => {
        if (!stopGame) {
          if (totalQuestions > 0) {
            // สั่งหยุดเกมชั่วคราวเมื่อกดปุ่ม
            stopGame = true;
            // เปลี่ยนชื่อปุ่มเป็นปุ่ม Next ชั่วคราว
            resetBtn.innerHTML = '<i class="fa-solid fa-forward"></i> Next';
            resetBtn.className = "container-fluid btn btn-warning btn-lg";
            // ตรวจสอบคำตอบ
            if (!checkAnswer(i)) {
              button.className = "btn btn-danger btn-lg";
            }
            syncStateToRemote();
          }
        }
      });
    }
  }

  function generateQuestion() {
    // สั่งให้เกมดำเนินการต่อเมื่อมีคำถามใหม่
    stopGame = false;
    // เปลี่ยนชื่อปุ่มคืนเป็น Reset
    resetBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reset';
    resetBtn.className = "container-fluid btn btn-secondary btn-lg";

    generateButtons();

    const mode = modeSelect.value;
    let randomType;

    if (mode === "basic") {
      randomType = ["integer", "float", "char"][Math.floor(Math.random() * 3)];
    } else if (mode === "intermediate") {
      randomType = ["integer", "float", "char"][Math.floor(Math.random() * 3)];
    } else if (mode === "advanced") {
      randomType = ["integer", "float", "char", "string", "bool"][
        Math.floor(Math.random() * 5)
      ];
    } else if (mode === "master") {
      randomType = ["integer", "float", "char", "string", "bool"][
        Math.floor(Math.random() * 5)
      ];
    }

    let usd_prompt = getRandomInt(1, 100);
    switch (randomType) {
      case "integer":
        if (
          (mode === "intermediate" || mode === "master") &&
          usd_prompt >= 50
        ) {
          randomValue = generatePromptedInt();
        } else {
          randomValue = getRandomInt(-32768, 32767);
        }
        valueType = "int";
        break;
      case "float":
        if (
          (mode === "intermediate" || mode === "master") &&
          usd_prompt >= 50
        ) {
          randomValue = generatePromptedFloat();
        } else {
          randomValue = getRandomFloat(-32768, 32767, 6);
        }
        valueType = "float";
        break;
      case "char":
        randomValue = "'" + String.fromCharCode(getRandomInt(65, 90)) + "'";
        valueType = "char";
        break;
      case "string":
        if (mode === "master" && usd_prompt >= 50) {
          randomValue = generatePromptedString();
        } else {
          randomValue = '"' + generateRandomString(10) + '"';
        }
        valueType = "string";
        break;
      case "bool":
        if (mode === "master" && usd_prompt >= 50) {
          randomValue = generatePromptedBool();
        } else {
          randomValue = Math.random() < 0.5;
          randomValue = [randomValue, randomValue];
        }
        valueType = "bool";
        break;
    }

    totalQuestions++;
    totalQuestionsEl.textContent = "Total: " + totalQuestions;
    if (valueType === "bool") {
      resultDiv.textContent = `${randomValue[0]}`;
    } else {
      resultDiv.textContent = `${randomValue}`;
    }
    updateProgressBar();
    syncStateToRemote();
  }

  resetBtn.addEventListener("click", () => {
    if (!stopGame) {
      // reset คะแนนกลับเป็นค่าเริ่มต้น
      resetGame();
    }
    // สุ่มคำถามขึ้นมาใหม่
    generateQuestion();
    updateProgressBar();
    syncStateToRemote();
  });

  function updateProgressBar() {
    correctAnswersEl.textContent = `Correct: ${correctAnswers}`;
    incorrectAnswersEl.textContent = `Incorrect: ${incorrectAnswers}`;

    let total_questions = correctAnswers + incorrectAnswers;
    const correctPercentage =
      total_questions > 0 ? (correctAnswers / total_questions) * 100 : 0;
    const incorrectPercentage =
      total_questions > 0 ? (incorrectAnswers / total_questions) * 100 : 0;

    const correctProgressBar = document.getElementById("correct-progress-bar");
    const incorrectProgressBar = document.getElementById(
      "incorrect-progress-bar"
    );

    correctProgressBar.style.width = correctPercentage + "%";
    correctProgressBar.setAttribute("aria-valuenow", correctPercentage);
    correctProgressBar.textContent = Math.round(correctPercentage) + "%";

    incorrectProgressBar.style.width = incorrectPercentage + "%";
    incorrectProgressBar.setAttribute("aria-valuenow", incorrectPercentage);
    incorrectProgressBar.textContent = Math.round(incorrectPercentage) + "%";
  }

  function changeModeSelect() {
    resetGame();
    generateQuestion();
    syncStateToRemote();
  }

  modeSelect.addEventListener("change", changeModeSelect);
  langSelect.addEventListener("change", changeModeSelect);

  // ==========================================
  // Remote Control & Live Teaching Sync
  // ==========================================
  let isTeachingMode = false;
  let eventSource = null;

  function syncStateToRemote() {
    if (!isTeachingMode || !window.location.protocol.startsWith("http")) return;

    const buttonsData = [];
    const buttons = answerZone.querySelectorAll("button");
    buttons.forEach((btn, idx) => {
      buttonsData.push({
        id: btn.id,
        index: idx,
        text: btn.textContent,
        className: btn.className,
      });
    });

    const state = {
      questionText: resultDiv.textContent,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      incorrectAnswers: incorrectAnswers,
      stopGame: stopGame,
      resetBtnText: resetBtn.innerText.trim(),
      resetBtnClass: resetBtn.className,
      lang: langSelect.value,
      mode: modeSelect.value,
      buttons: buttonsData,
    };

    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    }).catch(() => {});
  }

  function handleRemoteAction(data) {
    if (data.action === "request_state") {
      syncStateToRemote();
      return;
    }

    if (data.action === "click") {
      const el = document.getElementById(data.target);
      if (el) {
        // Visual indicator of remote click on screen
        el.classList.add("remote-click-active");
        setTimeout(() => el.classList.remove("remote-click-active"), 250);
        el.click();
      }
    } else if (data.action === "set_lang") {
      if (data.value && langSelect.value !== data.value) {
        langSelect.value = data.value;
        changeModeSelect();
      }
    } else if (data.action === "set_mode") {
      if (data.value && modeSelect.value !== data.value) {
        modeSelect.value = data.value;
        changeModeSelect();
      }
    }
  }

  function updateClientCountUI(count) {
    const remoteCountBadge = document.getElementById("remote-badge-count");
    const remotePillText = document.getElementById("remote-pill-text");
    const modalStatusText = document.getElementById("modal-status-text");
    const modalStatusDot = document.getElementById("modal-status-dot");

    // Client count in SSE includes the PC itself, so remote devices = Math.max(0, count - 1)
    const remoteDevices = Math.max(0, count - 1);

    if (remoteCountBadge) {
      remoteCountBadge.textContent = remoteDevices;
      if (remoteDevices > 0) {
        remoteCountBadge.className = "badge bg-success ms-1";
      } else {
        remoteCountBadge.className = "badge bg-secondary ms-1";
      }
    }

    if (remotePillText) {
      if (remoteDevices > 0) {
        remotePillText.textContent = `รีโมท: ${remoteDevices} เครื่อง 🟢`;
      } else {
        remotePillText.textContent = `รีโมทมือถือ (Remote)`;
      }
    }

    if (modalStatusText) {
      if (remoteDevices > 0) {
        modalStatusText.textContent = `เชื่อมต่อแล้ว ${remoteDevices} เครื่อง (พร้อมควบคุมระยะไกล)`;
        if (modalStatusDot) modalStatusDot.className = "fas fa-circle text-success me-2 fs-6";
      } else {
        modalStatusText.textContent = "ยังไม่มีเครื่องเชื่อมต่อ (รอสแกน QR Code)";
        if (modalStatusDot) modalStatusDot.className = "fas fa-circle text-muted me-2 fs-6";
      }
    }
  }

  function initSSE() {
    if (!isTeachingMode || !window.location.protocol.startsWith("http")) return;
    if (eventSource) return;

    eventSource = new EventSource("/api/events");

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "action") {
          handleRemoteAction(data);
        } else if (data.type === "client_count") {
          updateClientCountUI(data.count);
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = () => {
      // Reconnect handled automatically by EventSource
    };
  }

  function populateServerInfo(info) {
    const urlTs = document.getElementById("url-tailscale");
    const urlWifi = document.getElementById("url-wifi");
    const qrTs = document.getElementById("qr-img-tailscale");
    const qrWifi = document.getElementById("qr-img-wifi");

    if (urlTs && info.tailscale_url) {
      urlTs.value = info.tailscale_url;
    } else if (urlTs) {
      urlTs.value = "ไม่พบ Tailscale IP (โปรดตรวจสอบการเปิด Tailscale)";
    }

    if (urlWifi && info.wifi_url) {
      urlWifi.value = info.wifi_url;
    } else if (urlWifi) {
      urlWifi.value = info.local_url + "/remote";
    }

    if (qrTs && info.tailscale_url) {
      qrTs.src = "/api/qrcode?target=tailscale";
      qrTs.style.display = "block";
    }
    if (qrWifi && info.wifi_url) {
      qrWifi.src = "/api/qrcode?target=wifi";
      qrWifi.style.display = "block";
    }

    setupCopyButtons();
  }

  function enableTeachingMode(info) {
    isTeachingMode = true;

    // แสดงแถบเครื่องมือสำหรับผู้สอน
    const teacherBar = document.getElementById("teacher-control-bar");
    if (teacherBar) {
      teacherBar.classList.remove("d-none");
      teacherBar.classList.add("d-flex");
    }

    populateServerInfo(info);
    initSSE();
    syncStateToRemote();
  }

  function setupCopyButtons() {
    const btnTs = document.getElementById("btn-copy-tailscale");
    const btnWifi = document.getElementById("btn-copy-wifi");

    if (btnTs) {
      btnTs.onclick = () => {
        const input = document.getElementById("url-tailscale");
        if (input && input.value) {
          navigator.clipboard.writeText(input.value);
          btnTs.innerHTML = '<i class="fas fa-check text-success"></i>';
          setTimeout(() => (btnTs.innerHTML = '<i class="fas fa-copy"></i>'), 1500);
        }
      };
    }

    if (btnWifi) {
      btnWifi.onclick = () => {
        const input = document.getElementById("url-wifi");
        if (input && input.value) {
          navigator.clipboard.writeText(input.value);
          btnWifi.innerHTML = '<i class="fas fa-check text-success"></i>';
          setTimeout(() => (btnWifi.innerHTML = '<i class="fas fa-copy"></i>'), 1500);
        }
      };
    }
  }

  // Fullscreen button toggle
  const btnFullscreen = document.getElementById("btn-fullscreen");
  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
      } else {
        document.exitFullscreen().catch(() => {});
        btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
      } else {
        btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
      }
    });
  }

  // ==========================================
  // Auto-detect Python Server (run_server.py)
  // ถ้าไม่ได้กด run ผ่าน .py จะคงสถานะหน้าเว็บแบบเดิม
  // ==========================================
  function detectPythonServer() {
    const hostname = window.location.hostname;
    const isStaticHost =
      window.location.protocol === "file:" ||
      hostname.endsWith("github.io") ||
      hostname.includes("github.io");

    if (isStaticHost) {
      // เปิดจาก GitHub Pages (*.github.io) หรือเปิดไฟล์ตรงๆ (file://)
      // ให้แสดงหน้าเว็บแบบเดิม (Classic Mode) 100% ไม่ส่ง request ใดๆ ออกไป
      return;
    }

    // เมื่อเปิดผ่าน HTTP ทั่วไป ให้ตรวจสอบว่ามี run_server.py ทำงานอยู่หรือไม่
    fetch("/api/info", { cache: "no-store" })
      .then((res) => {
        if (res.ok && res.headers.get("content-type")?.includes("json")) {
          return res.json();
        }
        throw new Error("Not run_server.py");
      })
      .then((info) => {
        if (info && info.port) {
          // ตรวจพบว่ารันผ่าน run_server.py จริง -> เปิดโหมดรีโมทและการสอน
          enableTeachingMode(info);
        }
      })
      .catch(() => {
        // ไม่ใช่ run_server.py (เช่น รันผ่าน Live Server ทั่วไป) -> แสดงหน้าเว็บแบบเดิม
      });
  }

  detectPythonServer();
});
