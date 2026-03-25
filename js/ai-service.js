/**
 * SOVEREIGN v9.1 - AI INTELLIGENCE HUB
 * Handles multi-agent routing (Lumi, Chaplin) with dynamic Firestore key retrieval.
 */

const AIService = {
    apiKey: null,

    async init() {
        if (this.apiKey) return;
        try {
            // Retrieve from Firestore admin/settings
            const doc = await db.collection('admin').doc('settings').get();
            if (doc.exists) {
                this.apiKey = doc.data().OPENROUTER_API_KEY;
                console.log("AI_SERVICE: Dynamic Key Loaded.");
            } else {
                console.error("AI_SERVICE: Settings doc not found. Using fallback if available.");
            }
        } catch (e) {
            console.error("AI_SERVICE_INIT_ERROR:", e);
        }
    },

    async chat(agent, message) {
        await this.init();
        if (!this.apiKey) throw new Error("AI_KEY_MISSING");

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "TradeSovereign v9.1"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: this.getPrompt(agent) },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    },

    getPrompt(agent) {
        if (agent === 'lumi') return "You are Lumi, a high-authority AI tutor for students class 1-12. Be adaptive, encouraging, and highly educational.";
        if (agent === 'chaplin') return "You are Chaplin, an institutional trading forecaster. Provide macro-driven, objective, and strategic market analysis.";
        return "You are a Sovereign AI assistant.";
    }
};
