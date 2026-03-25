/**
 * TradeSovereign v9.0 – AI Orchestration Service
 * 
 * Handles all LLM requests via OpenRouter API.
 * Features: High-authority system prompts, graceful fallbacks, and multi-agent routing.
 */

import { db, getDoc, doc } from './firebase-config.js';

/**
 * Fetches the OpenRouter API key from Firestore admin settings.
 */
async function getApiKey() {
    try {
        const snap = await getDoc(doc(db, "admin", "settings"));
        if (snap.exists()) {
            return snap.data().apiKeys?.openrouter || null;
        }
    } catch (e) {
        console.error("AI_SERVICE_ERROR: Could not retrieve API key.", e);
    }
    return null;
}

/**
 * Generic chat completion requester.
 */
export async function getAICompletion(messages, agent = 'lumi') {
    const apiKey = await getApiKey();
    if (!apiKey) {
        return "I apologize, but my intelligence core is currently offline. Please configure the API Matrix in the Admin Command Center.";
    }

    // Agent-specific system instructions
    const systemPrompts = {
        lumi: "You are Lumi, a highly intelligent and encouraging AI Tutor for the TradeSovereign platform. You specialize in Classes 1-12 curriculum. Keep explanations clear, modular, and visual.",
        chaplin: "You are Chaplin, a high-authority AI orchestrator and market forecaster. You are concise, strategic, and use institutional trading terminology. Your goal is to guide the Admin or Trader to successful executions.",
        trader: "You are the TradeOS Market Agent. Analyze data feeds with precision. Identify liquidity zones and institutional order blocks. Be brief."
    };

    const finalMessages = [
        { role: "system", content: systemPrompts[agent] || systemPrompts.lumi },
        ...messages
    ];

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "TradeSovereign v9.0"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // Default model, admin can override via settings later
                messages: finalMessages,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "TRANSMISSION_ERROR: AI failed to respond.";
    } catch (error) {
        console.error("AI_SERVICE_FETCH_ERROR:", error);
        return "CONNECTION_INTERRUPTED: Check network or API quota.";
    }
}
