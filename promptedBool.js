import { getRandomInt, getRandomFloat} from "./random.js";

export function generatePromptedBool() {
    const prompts = [
        { prompt: 1, value: "สถานะการเข้าสู่ระบบ: สำเร็จ" },
        { prompt: 0, value: "สถานะการเข้าสู่ระบบ: ล้มเหลว" },
        { prompt: 1, value: "สถานะการชำระเงิน: ชำระแล้ว" },
        { prompt: 0, value: "สถานะการชำระเงิน: ยังไม่ชำระ" },
        { prompt: 1, value: "สถานะการเปิดหลอดไฟ: เปิดอยู่" },
        { prompt: 0, value: "สถานะการเปิดหลอดไฟ: ปิดอยู่" },
        { prompt: 1, value: "สินค้ามีในสต็อก: มีสินค้า" },
        { prompt: 0, value: "สินค้ามีในสต็อก: สินค้าหมด" },
        { prompt: 0, value: `${getRandomFloat(1, 10, 2)} เป็นเลขจำนวนเต็ม` },
        { prompt: 0, value: `${getRandomInt(1, 10)} เป็นเลขทศนิยม` }
    ];
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return [selectedPrompt.value, selectedPrompt.prompt];
}
