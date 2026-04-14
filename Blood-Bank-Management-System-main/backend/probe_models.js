import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    try {
        // We can't easily list models without a valid key and proper auth? 
        // Actually the SDK might not have a direct listModels method in some versions.
        // Let's try the standard model names one by one.
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        
        for(const m of modelsToTry) {
            console.log(`Checking model: ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                const response = await result.response;
                console.log(`SUCCESS with ${m}:`, response.text().substring(0, 10));
                break;
            } catch (e) {
                console.log(`FAIL with ${m}:`, e.message);
            }
        }
    } catch (error) {
        console.error("ListModels failed:", error.message);
    }
}

listModels();
