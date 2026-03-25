/* 
  SOVEREIGN v13.0 - AI PROXY FUNCTION
  Route: /functions/ai-proxy
*/

const axios = require('axios');

exports.handler = async (event, context) => {
    // 1. IP Whitelisting / Token Check (Placeholder for Institutional Security)
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'];
    console.log(`[SOVEREIGN SECURITY]: AI Access from ${clientIP}`);

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt, systemPrompt } = JSON.parse(event.body);
        
        // Retrieve API Key from Environment Variables (Netlify)
        const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

        if (!OPENROUTER_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: "Intelligence Service Uninitialized" }) };
        }

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemini-pro-1.5",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${OPENROUTER_KEY}`,
                "Content-Type": "application/json"
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data.choices[0].message)
        };

    } catch (error) {
        console.error("[AI PROXY ERROR]:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Cognitive Failure in Neural Mesh" })
        };
    }
};
