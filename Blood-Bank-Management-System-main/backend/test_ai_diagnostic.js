import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking API Key format...");
    if (!key) {
        console.error("ERROR: GEMINI_API_KEY not found in process.env");
        return;
    }
    console.log(`Key starts with: ${key.substring(0, 10)}...`);
    console.log(`Key length: ${key.length}`);

    const genAI = new GoogleGenerativeAI(key);

    try {
        console.log("Testing model 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        const response = await result.response;
        console.log("SUCCESS! Response:", response.text());
    } catch (error) {
        console.error("--- DETAILED API ERROR ---");
        console.error("Message:", error.message);
        if (error.status) console.error("Status:", error.status);
        if (error.response) {
            console.error("Response data:", JSON.stringify(error.response, null, 2));
        }
        console.error("--------------------------");
    }
}

testGemini();
