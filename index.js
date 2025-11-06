import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  const userMsg = req.body.message;
  if (!userMsg) return res.json({ reply: "I need something to respond to!" });

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMsg }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Hmm... I’m not sure how to respond.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Oops! Something went wrong." });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("AI proxy running"));
