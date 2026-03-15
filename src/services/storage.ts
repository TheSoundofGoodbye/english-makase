export interface DailySentence {
  date: string; // ISO date string portion 'YYYY-MM-DD'
  sentences: string[];
  newVocabulary: Array<{ word: string; meaning: string; context: string; }>;
}

const KEYS = {
  HOBBY: 'em_user_hobby',
  SEEN_VOCAB: 'em_seen_vocab',
  HISTORY: 'em_history',
  API_KEY: 'em_api_key'
};

export const StorageService = {
  // Config Management
  getApiKey(): string | null {
    return localStorage.getItem(KEYS.API_KEY);
  },
  
  setApiKey(key: string): void {
    localStorage.setItem(KEYS.API_KEY, key);
  },

  // Hobby Management
  getHobby(): string | null {
    return localStorage.getItem(KEYS.HOBBY);
  },
  
  setHobby(hobby: string): void {
    localStorage.setItem(KEYS.HOBBY, hobby);
  },

  // Vocabulary Management
  getSeenVocabulary(): Set<string> {
    const data = localStorage.getItem(KEYS.SEEN_VOCAB);
    if (!data) return new Set();
    try {
      return new Set(JSON.parse(data));
    } catch {
      return new Set();
    }
  },

  addSeenVocabulary(words: string[]): void {
    const seen = this.getSeenVocabulary();
    words.forEach(word => seen.add(word.toLowerCase()));
    localStorage.setItem(KEYS.SEEN_VOCAB, JSON.stringify(Array.from(seen)));
  },

  isWordNew(word: string): boolean {
    const seen = this.getSeenVocabulary();
    return !seen.has(word.toLowerCase());
  },

  // History Management
  getHistory(): DailySentence[] {
    const data = localStorage.getItem(KEYS.HISTORY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addDailySentence(sentenceObj: DailySentence): void {
    const history = this.getHistory();
    // Prevent duplicate entries for the same day entirely or just prepend
    const existingIndex = history.findIndex(h => h.date === sentenceObj.date);
    
    if (existingIndex >= 0) {
       history[existingIndex] = sentenceObj;
    } else {
       history.unshift(sentenceObj); // newest first
    }
    
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  }
};
