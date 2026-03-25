/**
 * SOVEREIGN v9.2 - AI ASSISTANT ORCHESTRATION
 * Interfaces with OpenRouter to provide Lumi (Tutor) and Chaplin (Trader) intelligence.
 */

const AIAssistant = {
    apiKey: null,

    async init() {
        if (this.apiKey) return;
        try {
            // Retrieve from Firestore admin/settings
            const doc = await db.collection('admin').doc('settings').get();
            if (doc.exists) {
                this.apiKey = doc.data().OPENROUTER_API_KEY;
                console.log("AI_ASSISTANT: Dynamic Cloud-Key Loaded.");
            }
        } catch (e) {
            console.error("AI_INIT_ERROR:", e);
        }
    },

    async ask(agent, prompt) {
        await this.init();
        if (!this.apiKey) throw new Error("AI_KEY_UNAVAILABLE");

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "TradeSovereign v9.2"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: this.getRole(agent) },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    },

    getRole(agent) {
        const roles = {
            lumi: "You are Lumi, a high-authority AI tutor for students class 1-12. Be adaptive, encouraging, and highly educational.",
            chaplin: "You are Chaplin, an institutional trading forecaster. Provide macro-driven, objective, and strategic market analysis."
        };
        return roles[agent] || "You are a Sovereign AI assistant.";
    }
};
