/* 
  SOVEREIGN v13.0 - AI ASSISTANT (SECURE PROXY)
  Institutional Logic Mesh
*/

class AIAssistant {
    constructor() {
        this.proxyUrl = "/.netlify/functions/ai-proxy";
    }

    async ask(prompt, context = "generic") {
        console.log(`[SOVEREIGN AI]: Routing prompt via Secure Proxy (${context})...`);
        
        // 1. Local Host Logic (Mocking for v13.0 Autonomy)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.getMockResponse(prompt, context);
        }

        const systemPrompt = this.getSystemPrompt(context);
        
        try {
            const response = await fetch(this.proxyUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, systemPrompt })
            });

            if (!response.ok) throw new Error("Proxy Synchronization Failure");

            const data = await response.json();
            return data.content;
        } catch (e) {
            console.error("[AI]: Orchestration failure.", e);
            return "Cognitive Failure: Connection to Neural Mesh severed.";
        }
    }

    getMockResponse(prompt, context) {
        console.log("[SOVEREIGN AI]: MOCKED RESPONSE (Local Dev Mode Active)");
        if (context === 'trader') return "Analysis: Volatility shows institutional absorption. Bullish bias remains.";
        if (context === 'student') return "Insight: Mastery of this module correlates with higher portfolio performance.";
        return "Local logic mesh initialized. Systems nominal.";
    }

    getSystemPrompt(context) {
        switch(context) {
            case 'student': return "You are the Sovereign Executive Tutor. Provide high-level academic analysis.";
            case 'trader': return "You are the Sovereign Trading Assistant. Provide market telemetry.";
            default: return "You are the Sovereign Platform Intelligence. Professional and concise.";
        }
    }
}

const sovereignAI = new AIAssistant();
export default sovereignAI;
window.askAI = (p, c) => sovereignAI.ask(p, c);
