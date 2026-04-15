import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🛡️ LOCAL FALLBACK LOGIC (Bilingual)
// If the AI fails, we use this to ensure the user always gets a reply.
const getLocalResponse = (text) => {
  const lowerText = text.toLowerCase();
  
  const isHindi = lowerText.includes("kya") || lowerText.includes("hai") || lowerText.includes("khoon") || lowerText.includes("kaise");

  if (lowerText.includes("donate") || lowerText.includes("donor") || lowerText.includes("khoon")) {
    return isHindi 
      ? "Khoon daan karne ke liye aapki umar 18+ saal, wazan kam se kam 50kg hona chahiye."
      : "To donate blood, you must be 18+ years old, weigh at least 50kg, and be in good general health.";
  }
  if (lowerText.includes("urgent") || lowerText.includes("emergency") || lowerText.includes("need") || lowerText.includes("madad") || lowerText.includes("jarurat")) {
    return isHindi 
      ? "Agar emergency hai, toh kripya turant apne nazdiki hospital jayein, ya 104 par call karein."
      : "If this is a critical emergency, please rush to your nearest hospital emergency room, use our SOS portal, or call your local emergency services (104).";
  }
  if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("namaste")) {
    return isHindi 
      ? "Namaste! Enterprise Blood Bank platform mein aapka swagat hai. Main aapki kya madad kar sakta hu?"
      : "Hello! Welcome to the Enterprise Blood Bank platform. How can I assist you today?";
  }
  
  return isHindi 
    ? "Main ek AI assistant hu. Aap mujhse blood donation, eligibility, ya emergency se judi koi bhi jaankari le sakte hain!"
    : "I am an AI assistant. You can ask me anything about blood donation, eligibility guidelines, or how to handle emergency shortages!";
};

export const askChatbot = async (req, res) => {
  const { message } = req.body;

  // If no API Key, just use local logic immediately
  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({ reply: getLocalResponse(message) });
  }

  try {
    // Using gemini-flash-latest which is highly stable
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `You are "Blood-Sync AI Medical Expert". Your goal is to help donors determine if they are eligible to donate blood.
      
      RULES:
      1. CRITERIA: 
         - Age: 18-65 years.
         - Weight: Minimum 50kg.
         - Health: Must be in good general health (no fever, flu).
         - Tattoos/Piercings: Wait 6 months (or 12 months depending on local law).
         - Pregnancy: Wait 1 year after childbirth.
         - Medication: Antibiotics (wait 7 days), Aspirin (wait 48 hrs for platelets).
         - Travel: Wait 3-12 months after visiting malaria-prone areas.
      2. DISCLAIMER: Always mention that "The final decision is taken by the medical officer at the blood bank."
      3. BILINGUAL: If the user asks in Hindi/Hinglish, reply in Hindi/Hinglish. If in English, reply in English.
      4. STYLE: Professional, emphatic, and concise.`
    });

    const prompt = `User Message: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("DEBUG: AI Failed, using local fallback. Reason:", error.message);
    
    // 🚀 FALLBACK: Instead of showing error, we send a smart local reply
    const fallbackText = getLocalResponse(message);
    res.status(200).json({ reply: fallbackText });
  }
};
