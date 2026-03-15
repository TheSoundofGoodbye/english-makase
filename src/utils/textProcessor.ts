import { StorageService } from '../services/storage';

export const TextProcessor = {
  /**
   * Splits a sentence into segments, highlighting exact target idioms/phrases.
   * Prevents multi-word idioms from being broken up.
   */
  highlightPhrases(sentence: string, phrases: string[]) {
    if (!phrases || phrases.length === 0) {
      return [{ text: sentence, isHighlighted: false, id: 0 }];
    }

    // Sort phrases by length descending to match longest (most specific) phrases first
    const sortedPhrases = [...phrases].sort((a, b) => b.length - a.length);
    
    // Build a regex that matches any of the phrases exactly, case-insensitive
    const escapedPhrases = sortedPhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');

    const parts = sentence.split(regex);
    
    return parts.map((part, index) => {
      // Check if this part matches one of our target phrases
      const isHighlighted = sortedPhrases.some(p => p.toLowerCase() === part.toLowerCase());
      return { text: part, isHighlighted, id: index };
    }).filter(part => part.text.length > 0);
  },

  /**
   * Mark an array of whole phrases/idioms as "seen" in the local storage.
   */
  markWordsAsSeen(phrases: string[]) {
    const cleanPhrases = phrases.map(p => p.toLowerCase().trim()).filter(Boolean);
    StorageService.addSeenVocabulary(cleanPhrases);
  }
};
