import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3001;

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY missing. Check server/.env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Skill2Project AI Mentor" });
});

app.post("/api/mentor", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    if (message.length > 4000) {
      return res.status(400).json({ error: "Message is too long." });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message.trim(),
      config: {
        systemInstruction:
          "You are Skill2Project AI Mentor. Help college students turn skills into practical software projects. Give clear step-by-step advice. Reply in the language the student uses, including Telugu-English when appropriate.",
        maxOutputTokens: 350
      }
    });

    res.json({
      reply: result.text || "Please try asking another question."
    });
  } catch (error) {
    console.error("Gemini API error details:", error);
    res.status(500).json({
      error: "AI request failed. Check API key, model availability and quota."
    });
  }
});

app.listen(port, () => {
  console.log(`Skill2Project backend running at http://localhost:${port}`);
});




