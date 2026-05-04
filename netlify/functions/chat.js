const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = (body.message || "").toLowerCase();

    // BRAND IDENTITY & DISPATCHER GREETING
    const headliner = "TO TAKE THE WEIGHT OFF YOUR HEAD SO YOU CAN ENJOY YOUR STAY INSTEAD.";
    const greeting = "Hi! I'm your Outback AI dispatcher. I handle the logistics for repairs between Cranbrook, Revelstoke, and Canmore so Daniel can stay on the tools. The more you tell me about your rig's issues, the faster I can get you scheduled. How can I help today?";

    // Initial Trigger
    if (userMessage === "" || userMessage.includes("book") || userMessage.includes("schedule") || userMessage.includes("hi")) {
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: `${headliner}\n\n${greeting}` })
        };
    }

    // AI Dispatcher Logic
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{ 
        parts: [{ 
          text: `You are the lead dispatcher for Outback Solutions. 
          Service Corridor: Cranbrook, Revelstoke, and Canmore. 
          Goal: Get the customer's name, RV type, location, and issue details. 
          Tone: Professional, helpful, and efficient. 
          User says: ${userMessage}` 
        }] 
      }]
    });

    const reply = response.data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Dispatcher line is busy. Please try again shortly." })
    };
  }
};
