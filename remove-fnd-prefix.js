// Script to remove 'fnd-' prefix from all card IDs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'src', 'data', 'quizCards.json');
const cards = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const updatedCards = cards.map(card => ({
  ...card,
  id: card.id.replace(/^fnd-/, '')
}));

// Write back to quizCards.json
fs.writeFileSync(dataPath, JSON.stringify(updatedCards, null, 2), 'utf8');

console.log('Card IDs updated (removed "fnd-" prefix):');
console.log(`Total: ${updatedCards.length} cards`);
console.log('\nSample IDs:');
console.log(`  ${updatedCards[0].id}`);
console.log(`  ${updatedCards[20].id}`);
console.log(`  ${updatedCards[30].id}`);
console.log(`  ${updatedCards[40].id}`);
