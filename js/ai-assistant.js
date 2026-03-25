/**
 * TradeSovereign v8.0 – AI Assistant Service
 *
 * Reads the OpenRouter API key from Firestore admin/settings at runtime.
 * This means the key is NEVER hard-coded. The admin rotates it any time
 * from the Admin Panel → API Matrix tab, and it takes effect instantly.
 *
 * Supports:
 *   - Lumi AI Tutor (student zone)
 *   - Chaplin Trading Assistant (trader zone)
 */

import { db, auth } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let OPENROUTER_API_KEY = null;

// ─── Init: pull key from Firestore on page load ───────────────────────────
export async function initAIAssistant() {
    if (!auth.currentUser) return;
    try {
        const settingsDoc = await getDoc(doc(db, 'admin', 'settings'));
        if (settingsDoc.exists()) {
            OPENROUTER_API_KEY = settingsDoc.data().openrouterApiKey || null;
        }
    } catch (err) {
        console.warn('[AI] Could not load API key from Firestore:', err.message);
    }
}

// ─── Core AI call via OpenRouter ──────────────────────────────────────────
export async function askAI(prompt, systemPrompt = "You are a helpful AI assistant.") {
    if (!OPENROUTER_API_KEY) {
        return "⚠️ AI assistant is not configured. Please ask the admin to set the OpenRouter API key in the Admin Panel → API Matrix.";
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type':  'application/json',
                'HTTP-Referer':  window.location.origin,
                'X-Title':       'TradeSovereign'
            },
            body: JSON.stringify({
                model:    'openai/gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user',   content: prompt }
                ]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content;

    } catch (error) {
        console.error('[AI] Error:', error);
        return "Sorry, the AI assistant is temporarily unavailable. Please try again later.";
    }
}

// ─── Preconfigured Personas ──────────────────────────────────────────────
export const PERSONAS = {
    lumi: "You are Lumi, a friendly AI tutor for K-12 students. Explain concepts clearly and encourage curiosity. Keep answers concise and age-appropriate.",
    chaplin: "You are Chaplin, an expert AI trading assistant. Provide sharp technical analysis, strategy suggestions, and PineScript or Python code when asked. Be professional and data-driven."
};

// ─── Student Tutor ────────────────────────────────────────────────────────
export async function askLumi(prompt) {
    return askAI(prompt, PERSONAS.lumi);
}

// ─── Trading Assistant ────────────────────────────────────────────────────
export async function askChaplin(prompt) {
    return askAI(prompt, PERSONAS.chaplin);
}
