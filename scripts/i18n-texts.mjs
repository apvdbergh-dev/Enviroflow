// Vertaaltabel bijhouden voor de Engelse site.
//   node scripts/i18n-texts.mjs missing [bestand]   → lijst van nog niet vertaalde teksten (id<TAB>vindplaats<TAB>nl)
//   node scripts/i18n-texts.mjs merge <bestand>     → vertalingen (id<TAB>en per regel) toevoegen aan src/i18n/en-data.json
//   node scripts/i18n-texts.mjs prune               → vertalingen van teksten die niet meer bestaan verwijderen
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { collectTexts, textId } from '../src/lib/i18n-data.mjs';

const root = new URL('..', import.meta.url).pathname;
const TABLE = root + 'src/i18n/en-data.json';
const readJson = (f) => JSON.parse(readFileSync(root + f, 'utf8'));

export async function allTexts() {
  const out = new Map();
  for (const f of ['site', 'brands', 'categories', 'products']) collectTexts(readJson(`src/data/${f}.json`), f, out);
  for (const f of ['solutions', 'sectors']) collectTexts((await import(`../src/content/nl/${f}.mjs`)).default, f, out);
  return out;
}

const table = existsSync(TABLE) ? JSON.parse(readFileSync(TABLE, 'utf8')) : {};
const [cmd, file] = process.argv.slice(2);
const texts = await allTexts();

if (cmd === 'missing') {
  const lines = [];
  for (const [nl, where] of texts) { const id = textId(nl); if (!(table[id] && table[id].nl === nl && table[id].en)) lines.push(`${id}\t${where}\t${nl}`); }
  if (file) writeFileSync(file, lines.join('\n') + '\n'); else console.log(lines.join('\n'));
  console.error(`${lines.length} van ${texts.size} teksten nog te vertalen`);
} else if (cmd === 'merge') {
  const byId = new Map([...texts.keys()].map((nl) => [textId(nl), nl]));
  let added = 0, unknown = 0;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const tab = line.indexOf('\t'); const id = line.slice(0, tab).trim(); const en = line.slice(tab + 1).trim();
    if (!byId.has(id)) { console.error('onbekende id:', id); unknown++; continue; }
    table[id] = { nl: byId.get(id), en }; added++;
  }
  const sorted = Object.fromEntries(Object.entries(table).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(TABLE, JSON.stringify(sorted, null, 1) + '\n');
  console.error(`${added} vertalingen opgeslagen, ${unknown} onbekend`);
} else if (cmd === 'prune') {
  const ids = new Set([...texts.keys()].map(textId));
  for (const id of Object.keys(table)) if (!ids.has(id)) delete table[id];
  writeFileSync(TABLE, JSON.stringify(table, null, 1) + '\n');
} else {
  console.error('gebruik: missing [bestand] | merge <bestand> | prune');
}
