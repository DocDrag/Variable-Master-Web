import { getRandomInt } from "./random.js";

export function generatePromptedString() {
    const prompts = [
        "หมายเลขบัตรประชาชน: 1-1234-56789-12-3", 
        "เบอร์โทรศัพท์: 081-000-0000", 
        '"เก้าอี้เป็นสีดำ"', 
        "อีเมล: example@example.com", 
        `บ้านเลขที่ ${getRandomInt(1, 99)} / ${getRandomInt(1, 99)}`, 
        `รหัสไปรษณีย์: ${getRandomInt(10000, 99999)}`, 
        `ชื่อผู้ใช้: user${getRandomInt(1, 10000)}`, 
        `หมายเลขบัญชีธนาคาร: 123-456-7890`, 
        `สถานที่ทำงาน: บริษัท ABC จำกัด`, 
        `หมายเลขอ้างอิง: REF${getRandomInt(1000, 9999)}`, 
        `หมายเลขประกันสังคม: 123-45-6789`, 
        `รหัสสินค้า: ${getRandomInt(10000, 99999)}`, 
        `หมายเลขซีเรียล: SER${getRandomInt(1000, 9999)}`, 
        `หมายเลขการสั่งซื้อ: PO${getRandomInt(10000, 99999)}`, 
        `ชื่อร้านค้า: ร้าน ABC`, 
        `หมายเลขการจอง: BOOK${getRandomInt(1000, 9999)}`, 
        `เลขที่ใบเสร็จ: RECEIPT${getRandomInt(1000, 9999)}`, 
        `เว็บไซต์: www.example.com`, 
        `หมายเลขบัตรเครดิต: 1234-5678-9012-3456`, 
        `รหัสผ่าน: ${Math.random().toString(36).slice(-8)}` 
    ];
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return `${selectedPrompt}`;
}
