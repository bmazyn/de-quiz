import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsPath = path.join(__dirname, '../src/data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const counts = {};
data.forEach(q => {
  counts[q.deckId] = (counts[q.deckId] || 0) + 1;
});

console.log('Card counts per deck:');
Object.entries(counts)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([deckId, count]) => {
    console.log(`  ${deckId}: ${count} cards`);
  });

console.log(`\nTotal cards: ${data.length}`);
