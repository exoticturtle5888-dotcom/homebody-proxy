import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_KEY; // store in Render env vars

app.post("/ask", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.json({ reply: "I need something to respond to!" });

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${AIzaSyDqv7jLtHx1QGSGSaMhBpfaBNaIQZTOfVs}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            }
        );

        const data = await response.json();
        console.log("Gemini response raw:", data); // debug
        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Hmm, I have no idea!";

        res.json({ reply });
    } catch (err) {
        console.error("AI request failed:", err);
        res.json({ reply: "Oops! Something went wrong." });
    }
});

app.listen(PORT, () => console.log(`Homebody AI server running on port ${PORT}`));

