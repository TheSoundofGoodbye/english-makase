import 'dotenv/config'; // must be first to load .env before anything else
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'idioms.json');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FATAL ERROR: GEMINI_API_KEY is missing. Cannot update idioms.");
  process.exit(1);
}

console.log(`[Init] Using API key: ${apiKey.slice(0, 8)}...`);
const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-2.5-flash";

interface IdiomEntry {
  sentences: string[];
  sentenceTranslations: string[];
  translationHighlights: string[];
  newWords: {
    word: string;
    meaning: string;
    context: string;
  }[];
}

interface IdiomDatabase {
  categories: {
    [key: string]: IdiomEntry[];
  };
}

// ─── 카테고리별 뉴스 검색 쿼리 (Gemini에게 맥락을 주는 키워드) ─────────────────
const CATEGORIES: { name: string; context: string }[] = [
  {
    name: "일상 (Daily Life)",
    context: "lifestyle, social trends, health, relationships, personal finance, technology in everyday life",
  },
  {
    name: "비즈니스 (Business)",
    context: "global economy, stock markets, startups, corporate strategy, AI industry, trade policy",
  },
  {
    name: "여행 (Travel)",
    context: "travel destinations, airline industry, tourism trends, cultural experiences, visa policies",
  },
  {
    name: "스포츠 및 취미 (Sports & Hobbies)",
    context: "major sports events, athlete news, esports, outdoor recreation, popular hobbies",
  },
];

// ─── 1단계: 현재 날짜 기반으로 시사 맥락 생성 ────────────────────────────────
async function generateNewsContext(category: string, context: string): Promise<string> {
  const today = new Date().toISOString().split("T")[0];
  const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });

  console.log(`  [Context] Generating news-like context for: ${category}`);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `
Today is ${dayOfWeek}, ${today}.

You are a news briefing assistant. Based on your knowledge of recent global trends and events in the domain of: ${context}

Write a realistic, specific 3-sentence news briefing IN ENGLISH, as if it's happening today. 
Include:
- Realistic proper nouns (organizations, places, or public figures)
- Specific details that feel current and grounded
- At least one quote or data point

The goal is to provide authentic context for English expression learning. Be specific, not generic.
`,
  });

  const text = response.text ?? "";
  console.log(`  [Context] Generated ${text.length} chars of context.`);
  return text;
}

// ─── 2단계: 뉴스 콘텍스트 기반 표현 생성 ────────────────────────────────────
async function generateIdiomFromContext(
  category: string,
  newsContext: string
): Promise<IdiomEntry> {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `
You are an expert English teacher for Korean speakers.
Target Category: ${category}
Today's Date: ${today}

Below is a news-style scenario from today that you should use as CONTEXT and INSPIRATION:
---
${newsContext}
---

Task: Based on the context above, create exactly ONE educational English entry.
The sentences must feel naturally connected to the scenario above - reference the topic, situation, or theme.
Use advanced, native-sounding English idioms and expressions that a Korean learner would find valuable.
Do NOT repeat expressions already commonly found in textbooks.

You MUST output valid JSON ONLY, with this exact structure, nothing else:
{
  "sentences": [
    "First sentence using an idiom, directly related to the news scenario.",
    "Second sentence following up, using another idiom, continuing the same theme."
  ],
  "sentenceTranslations": [
    "첫 번째 문장의 자연스러운 한국어 번역.",
    "두 번째 문장의 자연스러운 한국어 번역."
  ],
  "translationHighlights": ["한국어 번역에서 강조할 핵심 표현1", "핵심 표현2", "핵심 표현3"],
  "newWords": [
    {
      "word": "the exact idiom/phrase used in the sentence",
      "meaning": "Korean translation/meaning of the idiom",
      "context": "Short snippet from the English sentence showing where it was used"
    }
  ]
}

Requirements:
- 2 sentences total in "sentences".
- 2 Korean translations in "sentenceTranslations" (natural, not literal).
- 2–4 highlighted Korean phrases in "translationHighlights".
- 2–3 idioms in "newWords".
- No markdown. Just the raw JSON object.
`;

  const result = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let responseText = result.text ?? "";

  // Clean up any accidental markdown fences
  responseText = responseText
    .replace(/^```json\s*/m, "")
    .replace(/^```\s*/m, "")
    .replace(/```$/m, "")
    .trim();

  const entry: IdiomEntry = JSON.parse(responseText);

  if (
    !entry.sentences ||
    !entry.newWords ||
    !Array.isArray(entry.sentences) ||
    !Array.isArray(entry.sentenceTranslations) ||
    !Array.isArray(entry.translationHighlights)
  ) {
    throw new Error("Invalid AI response structure.");
  }

  return entry;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function updateIdioms() {
  const today = new Date().toISOString().split("T")[0];
  console.log(`🚀 Starting News-Grounded Daily Idiom Update [${today}]...\n`);

  // 1. Load existing database
  let db: IdiomDatabase = { categories: {} };
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    db = JSON.parse(data);
  } catch (err) {
    console.error("Failed to read idioms.json", err);
    process.exit(1);
  }

  for (const { name, context } of CATEGORIES) {
    console.log(`\n📰 Category: ${name}`);

    try {
      // Step 1: Generate a fresh, specific news-like context for today
      const newsContext = await generateNewsContext(name, context);

      // Step 2: Generate idiom entry inspired by that context
      const newEntry = await generateIdiomFromContext(name, newsContext);

      // Prepend to keep newest first
      if (!db.categories[name]) {
        db.categories[name] = [];
      }
      db.categories[name].unshift(newEntry);

      console.log(`  ✅ Added new entry:`);
      console.log(`     ${newEntry.sentences.join(" ")}`);
      console.log(`     새 표현: ${newEntry.newWords.map((w) => w.word).join(", ")}`);
    } catch (error) {
      console.error(`  ❌ Failed for category "${name}":`, error);
      // Continue with remaining categories
    }

    // Avoid rate limits between categories
    await new Promise((r) => setTimeout(r, 2000));
  }

  // 3. Save updated database
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  console.log(`\n🎉 Update complete [${today}]. idioms.json has been written successfully.`);
}

updateIdioms();
