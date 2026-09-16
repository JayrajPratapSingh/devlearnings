const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'server', 'prisma', 'seed-data');
let totalLessons = 0;
const issues = [];
const fields = [
  'vocabulary:',
  'readingPassage:',
  'readingPassageHi:',
  'examples:',
  'mistakes:',
  'realWorld:',
  'interviewQA:',
  'exercises:',
  'keyTakeaways:',
  'keyTakeawaysHi:',
];

const TOTAL_MODULES = 22;

for (let m = 1; m <= TOTAL_MODULES; m++) {
  const filePath = path.join(baseDir, `course-english-module${m}.ts`);
  const src = fs.readFileSync(filePath, 'utf8');
  const slugMatches = [...src.matchAll(/slug: '([a-z0-9-]+)'/g)].map((x) => x[1]);
  if (slugMatches.length !== 3) {
    issues.push(`Module ${m}: expected 3 lessons, found ${slugMatches.length}`);
  }
  totalLessons += slugMatches.length;

  for (const field of fields) {
    const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    const count = (src.match(re) || []).length;
    if (count < 3) {
      issues.push(`Module ${m}: field '${field}' appears only ${count} times (expected >= 3)`);
    }
  }

  // Check every vocabulary word has a pronunciation field
  const vocabBlocks = src.split('vocabulary:').length - 1;
  const pronunciationCount = (src.match(/pronunciation:/g) || []).length;
  if (pronunciationCount < 12) {
    issues.push(`Module ${m}: only ${pronunciationCount} pronunciation fields (expected ~12, 4 words x 3 lessons)`);
  }

  // Duplicate slug check within module
  const dupSlugs = slugMatches.filter((s, i) => slugMatches.indexOf(s) !== i);
  if (dupSlugs.length) {
    issues.push(`Module ${m}: duplicate slug(s) ${dupSlugs.join(', ')}`);
  }
}

console.log(`Total lessons found across all ${TOTAL_MODULES} modules:`, totalLessons);
console.log(issues.length ? issues.join('\n') : 'No structural issues found.');

// Global duplicate slug check across all modules
const allSlugs = [];
for (let m = 1; m <= TOTAL_MODULES; m++) {
  const filePath = path.join(baseDir, `course-english-module${m}.ts`);
  const src = fs.readFileSync(filePath, 'utf8');
  const slugMatches = [...src.matchAll(/slug: '([a-z0-9-]+)'/g)].map((x) => x[1]);
  allSlugs.push(...slugMatches);
}
const seen = new Set();
const globalDupes = [];
for (const s of allSlugs) {
  if (seen.has(s)) globalDupes.push(s);
  seen.add(s);
}
console.log(globalDupes.length ? `GLOBAL DUPLICATE SLUGS: ${globalDupes.join(', ')}` : 'No global duplicate slugs.');
console.log('Total unique slugs:', seen.size);
