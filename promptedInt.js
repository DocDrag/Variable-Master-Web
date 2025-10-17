import { getRandomInt } from "./random.js";

export function generatePromptedInt() {
    const prompts = [
        { prompt: "อายุ: ", value: getRandomInt(1, 100) + " ปี" },
        { prompt: "จำนวนลูก: ", value: getRandomInt(1, 10) + " คน" },
        { prompt: "จำนวนพี่น้อง: ", value: getRandomInt(1, 10) + " คน" },
        { prompt: "วันที่: ", value: getRandomInt(1, 31) },
        { prompt: "เดือน: ", value: getRandomInt(1, 12) },
        { prompt: "ปี: ", value: getRandomInt(1, 2024) },
        { prompt: "จำนวนหนังสือที่มี: ", value: getRandomInt(1, 500) + " เล่ม" },
        { prompt: "คะแนนสอบ: ", value: getRandomInt(0, 100) },
        { prompt: "ชั่วโมงทำงานต่อสัปดาห์: ", value: getRandomInt(1, 60) },
        { prompt: "น้ำหนักสัมภาระ: ", value: getRandomInt(1, 50) },
        { prompt: "จำนวนเพื่อนในกลุ่ม: ", value: getRandomInt(1, 20) + " คน" },
        { prompt: "จำนวนสมาชิกในครอบครัว: ", value: getRandomInt(1, 10) + " คน" },
        { prompt: "จำนวนรถในบ้าน: ", value: getRandomInt(1, 5) + " คัน" },
        { prompt: "จำนวนบทเรียนที่เรียนในวันหนึ่ง: ", value: getRandomInt(1, 8) + " บท" },
        { prompt: "จำนวนห้องในบ้าน: ", value: getRandomInt(1, 10) + " ห้อง" },
        { prompt: "จำนวนอาหารที่กินในมื้อหนึ่ง: ", value: getRandomInt(1, 10) + " จาน" },
        { prompt: "จำนวนบทเพลงที่ฟังในวันหนึ่ง: ", value: getRandomInt(1, 20) + " เพลง" },
        { prompt: "จำนวนรูปภาพที่ถ่ายในทริปหนึ่ง: ", value: getRandomInt(1, 200) + " รูป" },
        { prompt: "จำนวนชั่วโมงที่นอนต่อคืน: ", value: getRandomInt(0, 12) + " ชั่วโมง" },
        { prompt: "จำนวนครั้งที่ออกกำลังกายในสัปดาห์: ", value: getRandomInt(0, 7) + " ครั้ง" }
    ];
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return `${selectedPrompt.prompt}${selectedPrompt.value}`;
}
