import { getRandomFloat } from "./random.js";

export function generatePromptedFloat() {
    const prompts = [
        { prompt: "เงิน: ", value: getRandomFloat(1, 100000, 2) + " บาท" },
        { prompt: "น้ำหนัก: ", value: getRandomFloat(1, 100, 2) + " กิโลกรัม" },
        { prompt: "ส่วนสูง: ", value: getRandomFloat(1, 200, 2) + " เซนติเมตร" },
        { prompt: "ระยะทางเดินทาง: ", value: getRandomFloat(1, 1000, 2) + " กิโลเมตร" },
        { prompt: "พื้นที่: ", value: getRandomFloat(1, 100, 2) + " ตารางเมตร" },
        { prompt: "เวลาที่ใช้เดินทาง: ", value: getRandomFloat(1, 24, 2) + " ชั่วโมง" },
        { prompt: "อุณหภูมิห้อง: ", value: getRandomFloat(1, 40, 2) + " องศาเซลเซียส" },
        { prompt: "ปริมาณน้ำ: ", value: getRandomFloat(1, 10, 2) + " ลิตร" },
        { prompt: "ความเร็วเฉลี่ย: ", value: getRandomFloat(1, 100, 2) + " กิโลเมตรต่อชั่วโมง" },
        { prompt: "อัตราดอกเบี้ย: ", value: getRandomFloat(1, 10, 2) + " เปอร์เซ็นต์" },
        { prompt: "น้ำหนักสัมภาระ: ", value: getRandomFloat(1, 50, 2) + " กิโลกรัม" },
        { prompt: "ค่าใช้จ่ายต่อเดือน: ", value: getRandomFloat(0, 50000, 2) + " บาท" },
        { prompt: "ระดับน้ำทะเล: ", value: getRandomFloat(1, 10, 2) + " เมตร" },
        { prompt: "อัตราแลกเปลี่ยน: ", value: getRandomFloat(1, 50, 2) + " บาทต่อดอลลาร์" },
        { prompt: "คะแนนสอบ: ", value: getRandomFloat(1, 100, 2) + " คะแนน" },
        { prompt: "อัตราการเต้นของหัวใจ: ", value: getRandomFloat(1, 200, 2) + " ครั้งต่อนาที" },
        { prompt: "ระดับความสูง: ", value: getRandomFloat(1, 3000, 2) + " เมตรเหนือระดับน้ำทะเล" },
        { prompt: "ความชันของถนน: ", value: getRandomFloat(0, 20, 2) + " องศา" },
        { prompt: "การใช้พลังงานต่อวัน: ", value: getRandomFloat(1, 3000, 2) + " กิโลแคลอรี" },
        { prompt: "อัตราเติบโตทางเศรษฐกิจ: ", value: getRandomFloat(1, 10, 2) + " เปอร์เซ็นต์" },
        { prompt: "ตัวเลขที่มีการหาร", value: ""}
    ];
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return `${selectedPrompt.prompt}${selectedPrompt.value}`;
}
