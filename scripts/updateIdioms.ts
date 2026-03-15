import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables if running locally (dotenv not needed in Github Actions if we pass secrets directly, but good for local dev)
import 'dotenv/config';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the API key exists
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FATAL ERROR: GEMINI_API_KEY is missing. Cannot update idioms.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Using a fast, cheap model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Path to our local static database
const DB_PATH = path.join(__dirname, '../src/data/idioms.json');

interface IdiomEntry {
  sentences: string[];
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

const CATEGORIES = [
  "일상 (Daily Life)",
  "비즈니스 (Business)",
  "여행 (Travel)",
  "스포츠 및 취미 (Sports & Hobbies)"
];

async function updateIdioms() {
  console.log("Starting Daily Idiom Update Script...");

  // 1. Read existing database
  let db: IdiomDatabase = { categories: {} };
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    db = JSON.parse(data);
  } catch (err) {
    console.error("Failed to read idioms.json", err);
    process.exit(1);
  }

  // 2. We will generate ONE new entry per category to avoid blowing up the DB too fast, but keeping it fresh daily.
  for (const category of CATEGORIES) {
    console.log(`\nFetching new expressions for: ${category}`);

    const prompt = `
    You are an expert English teacher for Korean speakers.
    Target Category: ${category}
    
    Task: Create exactly ONE new educational entry containing advanced or highly native-sounding English idioms/phrases relevant to the category. Do not repeat basic phrases.
    
    You MUST output valid JSON ONLY, with this exact structure, nothing else:
    {
      "sentences": [
        "First sentence establishing context and using an idiom.",
        "Second sentence following up, maybe using another idiom."
      ],
      "newWords": [
        {
          "word": "the exact idiom/phrase used in the sentence",
          "meaning": "Korean translation/meaning of the idiom",
          "context": "Short snippet from the sentence (English) showing where it was used"
        }
      ]
    }
    
    Requirements:
    - 2 sentences total in the "sentences" array.
    - 2 to 3 idioms defined in the "newWords" array.
    - No markdown formatting like \`\`\`json. Just the raw JSON object.
    `;

    try {
      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      
      // Clean up markdown just in case the AI wraps it
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      // Parse the AI response
      const newEntry: IdiomEntry = JSON.parse(responseText);

      // Validate the structure roughly
      if (!newEntry.sentences || !newEntry.newWords || !Array.isArray(newEntry.sentences)) {
        throw new Error("Invalid AI response structure.");
      }

      // Ensure the category array exists
      if (!db.categories[category]) {
        db.categories[category] = [];
      }

      // Append the new entry to the start of the array to prioritize newer content, or just push to end
      db.categories[category].unshift(newEntry);
      
      console.log(`✅ Successfully added new entry for ${category}:`);
      console.log(newEntry.sentences.join(' '));

    } catch (error) {
      console.error(`❌ Failed to fetch or parse response for ${category}:`, error);
      // We don't fail the whole script if one category fails, just continue
    }
    
    // Slight delay to avoid any rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  // 3. Save the updated database back to the file
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  console.log("\n🎉 Update complete. idioms.json has been written successfully.");
}

updateIdioms();
