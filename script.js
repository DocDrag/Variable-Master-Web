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
      Answer = true;
    } else {
      incorrectAnswers++;
      Answer = false;
    }
    const trueBtn = document.getElementById(`box-${generateAnswer()}`);
    trueBtn.className = "btn btn-success btn-lg";

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
  }

  resetBtn.addEventListener("click", () => {
    if (!stopGame) {
      // reset คะแนนกลับเป็นค่าเริ่มต้น
      resetGame();
    }
    // สุ่มคำถามขึ้นมาใหม่
    generateQuestion();
    updateProgressBar();
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
  }

  modeSelect.addEventListener("change", changeModeSelect);
  langSelect.addEventListener("change", changeModeSelect);
});
