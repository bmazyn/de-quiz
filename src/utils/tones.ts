/**
 * Extracts tone numbers from pinyin text
 * Maps: ā=1, á=2, ǎ=3, à=4, no accent=neutral (blank)
 */

// Map of tone-marked vowels to their tone numbers
const toneMap: Record<string, number> = {
  // First tone (ā)
  'ā': 1, 'ē': 1, 'ī': 1, 'ō': 1, 'ū': 1, 'ǖ': 1,
  'Ā': 1, 'Ē': 1, 'Ī': 1, 'Ō': 1, 'Ū': 1, 'Ǖ': 1,
  
  // Second tone (á)
  'á': 2, 'é': 2, 'í': 2, 'ó': 2, 'ú': 2, 'ǘ': 2,
  'Á': 2, 'É': 2, 'Í': 2, 'Ó': 2, 'Ú': 2, 'Ǘ': 2,
  
  // Third tone (ǎ)
  'ǎ': 3, 'ě': 3, 'ǐ': 3, 'ǒ': 3, 'ǔ': 3, 'ǚ': 3,
  'Ǎ': 3, 'Ě': 3, 'Ǐ': 3, 'Ǒ': 3, 'Ǔ': 3, 'Ǚ': 3,
  
  // Fourth tone (à)
  'à': 4, 'è': 4, 'ì': 4, 'ò': 4, 'ù': 4, 'ǜ': 4,
  'À': 4, 'È': 4, 'Ì': 4, 'Ò': 4, 'Ù': 4, 'Ǜ': 4,
};

/**
 * Extract the tone number from a single pinyin syllable
 * Returns 1-4 for tones, or null for neutral tone
 */
function getToneFromSyllable(syllable: string): number | null {
  for (const char of syllable) {
    if (toneMap[char]) {
      return toneMap[char];
    }
  }
  return null; // No tone mark found = neutral tone
}

/**
 * Extract tone numbers from pinyin text
 * For single words: returns a single tone or empty string
 * For sentences: returns space-separated tone numbers, one per word
 */
export function extractToneNumbers(pinyin: string): string {
  if (!pinyin || !pinyin.trim()) {
    return '';
  }
  
  // Split by spaces to handle multi-word phrases/sentences
  const syllables = pinyin.trim().split(/\s+/);
  
  const tones = syllables.map(syllable => {
    const tone = getToneFromSyllable(syllable);
    // Return tone number as string, or empty string for neutral
    return tone !== null ? tone.toString() : '';
  });
  
  return tones.join(' ');
}
