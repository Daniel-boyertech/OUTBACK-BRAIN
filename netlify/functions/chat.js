const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const reply = response.data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ reply: "Brain Error: " + error.message }) };
  }
};
