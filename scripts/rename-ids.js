// Script to rename card IDs and normalize field order
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'src', 'data', 'quizCards.json');
const cards = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Deck name to ID prefix mapping
const deckPrefixes = {
  'Foundation 1': 'fnd-foundation1',
  'Numbers': 'fnd-numbers',
  'Time 1': 'fnd-time1',
  'Greetings 1': 'fnd-greetings1'
};

// Count cards per deck for sequential numbering
const deckCounters = {};

const updatedCards = cards.map(card => {
  const deckPrefix = deckPrefixes[card.deck];
  if (!deckPrefix) {
    throw new Error(`Unknown deck: ${card.deck}`);
  }
  
  // Initialize or increment counter for this deck
  if (!deckCounters[card.deck]) {
    deckCounters[card.deck] = 0;
  }
  deckCounters[card.deck]++;
  
  // Generate new ID with zero-padded 3-digit number
  const newId = `${deckPrefix}-${String(deckCounters[card.deck]).padStart(3, '0')}`;
  
  // Reconstruct object with normalized field order
  // Order: id, kind, section, deck, then everything else
  const { id, kind, level, deck, section, ...rest } = card;
  
  return {
    id: newId,
    kind,
    section,
    deck,
    level,
    ...rest
  };
});

// Write back to quizCards.json
fs.writeFileSync(dataPath, JSON.stringify(updatedCards, null, 2), 'utf8');

console.log('Card IDs renamed and field order normalized:');
Object.entries(deckCounters).forEach(([deck, count]) => {
  console.log(`  ${deck}: ${count} cards (${deckPrefixes[deck]}-001 to ${deckPrefixes[deck]}-${String(count).padStart(3, '0')})`);
});
console.log(`\nTotal: ${updatedCards.length} cards`);
