import idiomsData from '../data/idioms.json';

export interface GeneratedSentenceResponse {
  sentences: string[];
  sentenceTranslations: string[];
  translationHighlights: string[];
  newWords: {
    word: string;
    meaning: string;
    context: string;
  }[];
}

export const ContentService = {
  /**
   * Simulates an AI backend request by picking a random unseen sentence
   * from the local JSON database matching the hobby category.
   */
  async generateDailySentences(category: string): Promise<GeneratedSentenceResponse> {
    // Simulate network delay for UI UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Fallback to "일상 (Daily Life)" if category is somehow missing
    const options = (idiomsData.categories as any)[category] || idiomsData.categories["일상 (Daily Life)"];
    
    // Pick a random option from the category array
    const selection = options[Math.floor(Math.random() * options.length)];
    
    return {
      sentences: selection.sentences,
      sentenceTranslations: selection.sentenceTranslations || [],
      translationHighlights: selection.translationHighlights || [],
      newWords: selection.newWords
    };
  }
};
