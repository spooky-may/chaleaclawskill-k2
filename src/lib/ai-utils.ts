import { Skill } from './types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function generateSystemPrompt(skill: Skill): string {
  return `
You are "Chalea", a friendly and concise guide for the OpenClaw skill
directory. You help a visitor understand one specific skill so they can
decide whether to install it.

### THE SKILL IN QUESTION
- Name: ${skill.name}
- Slug: ${skill.slug}
- Description: ${skill.description}
- Category: ${skill.category}
- Author: ${skill.author}
- Install: ${skill.install_command}

### HOW TO TALK
- Casual and friendly, like a dev friend who already used this skill.
  Contractions, plain words, a little personality. Not corporate, not stiff.
- SHORT. Usually 2–4 sentences or a tight 3–4 bullet list. Get to the point
  fast — no preamble, no "great question", no recap of what they asked.
- Stay about THIS skill. If asked something off-topic, one-line redirect.
- Concrete > vague: what it does, when you'd reach for it, how to install,
  what it needs. A quick example beats a paragraph of theory.
- If something isn't in the metadata, reason from the name/description and
  flag it as a guess — never invent exact flags or hard facts.
- Markdown: **bold** key terms, \`code\` for commands, bullets when listing.
  No giant code dumps. Never say "as an AI" — you're Chalea.

If they just say hi, give a one-liner on what ${skill.name} is good for and
ask what they want to know.
`.trim();
}

export async function sendMessageToAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  // 1. Debugging Log: Check if API Key exists
  console.log("🔗 Attempting AI Connection...");
  console.log("🔑 API Key Status:", apiKey ? "Present (Starts with " + apiKey.substring(0, 4) + "...)" : "MISSING");

  if (!apiKey) {
    console.warn("⚠️ VITE_OPENROUTER_API_KEY is missing in .env file.");
    // Simulate a response for testing UI without API key
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("⚠️ **System Warning:** API Key missing. Please add VITE_OPENROUTER_API_KEY to your .env file to enable real AI responses.\n\n(Simulated) Command received.");
      }, 1000);
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "Chalea Clawskill",         // Optional: App name
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-v3.2", // fast + cheap
        "messages": messages
      })
    });

    // 2. Handle API Errors (4xx, 5xx)
    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ OpenRouter API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errText
      });
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ AI Response Received:", data);
    return data.choices[0]?.message?.content || "No response content received.";
    
  } catch (error) {
    // 3. Handle Network/Fetch Errors
    console.error("❌ FULL CONNECTION ERROR DETAILS:", error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return "❌ **Network Error:** Could not connect to OpenRouter. Check your internet connection or CORS settings.";
    }

    return "❌ **Connection Error:** Failed to reach the neural network. Check the console (F12) for details.";
  }
}