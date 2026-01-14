/**
 * Export quiz cards to CSV for human review
 * Usage: node scripts/exportToCsv.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'quizCards.json');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'quizCards.csv');

try {
  const data = fs.readFileSync(jsonPath, 'utf8');
  const cards = JSON.parse(data);

  // CSV header
  const header = 'id,level,unit,kind,promptLine,correct,correctText\n';

  // Convert each card to CSV row
  const rows = cards.map(card => {
    const id = card.id || '';
    const level = card.level || '';
    const unit = card.unit || ''; // Optional field
    const kind = card.kind || '';
    const promptLine = card.promptLine || '';
    const correct = card.correct || '';
    const correctText = card.choices && card.correct ? card.choices[card.correct] : '';

    // Escape CSV values (handle commas and quotes)
    const escape = (str) => {
      if (typeof str !== 'string') return '';
      // If contains comma, quote, or newline, wrap in quotes and escape quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      escape(id),
      escape(level),
      escape(unit),
      escape(kind),
      escape(promptLine),
      escape(correct),
      escape(correctText)
    ].join(',');
  });

  // Write CSV file with UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csv = BOM + header + rows.join('\n');
  fs.writeFileSync(outputPath, csv, 'utf8');

  console.log(`✓ Exported ${cards.length} cards to ${outputPath}`);
  console.log(`  Columns: id, level, unit, kind, promptLine, correct, correctText`);

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
