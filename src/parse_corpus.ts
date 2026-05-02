import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const corpus = (fs.readFileSync('./corpus_part1.txt', 'utf8') + '\n' + fs.readFileSync('./corpus_part2.txt', 'utf8')).replace(/\r\n/g, '\n');

// Split by '## FILE: '
const parts = corpus.split(/^## FILE:\s+/m);
// The first part is the header, ignore it.
const fileParts = parts.slice(1);

const parsedFiles: { path: string; content: string; title: string; id: string }[] = [];

const getCategory = (filePath: string) => {
  if (filePath.startsWith('docs/en/')) {
    if (filePath.includes('v2')) return 'YNX v2 Web4';
    if (filePath.includes('TESTNET') || filePath.includes('DEVNET') || filePath.includes('EXPLORER') || filePath.includes('FAUCET') || filePath.includes('INDEXER') || filePath.includes('MONITORING')) return 'Testnet & Devnet';
    return 'Core Specs (v0)';
  }
  if (filePath.startsWith('docs/zh/')) return '中文文档 (Chinese)';
  if (filePath.startsWith('docs/sk/')) return 'Slovak Docs';
  if (filePath.startsWith('infra/openapi/')) return 'OpenAPI Specs';
  return 'Other';
};

fileParts.forEach(part => {
  const lines = part.split('\n');
  const filePath = lines[0].trim();
  // The content starts from the second line. 
  // We MUST NOT trim it to maintain exact raw body bytes.
  // However, we should ensure line endings are normalized to LF.
  const content = lines.slice(1).join('\n');
  
  const id = filePath.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  
  let title = filePath.split('/').pop() || filePath;
  const firstLine = content.split('\n')[0];
  if (firstLine && firstLine.startsWith('# ')) {
    title = firstLine.replace('# ', '').trim();
  } else if (firstLine && firstLine.startsWith('openapi:')) {
    title = filePath.split('/').pop() || filePath;
  }

  parsedFiles.push({
    id,
    title,
    path: filePath,
    content
  });
});

// Ensure no slug collisions
const idMap = new Map<string, number>();
parsedFiles.forEach(f => {
  if (idMap.has(f.id)) {
    const count = idMap.get(f.id)! + 1;
    idMap.set(f.id, count);
    f.id = `${f.id}-${count}`;
  } else {
    idMap.set(f.id, 1);
  }
});

// Deterministic sort by path
parsedFiles.sort((a, b) => a.path.localeCompare(b.path));

// Filter out v0 BEFORE calculating SHA and counts
const filteredFiles = parsedFiles.filter(f => !getCategory(f.path).includes('(v0)'));

// Compute SHA256 of concatenated raw contents with boundary
const concatenatedContents = filteredFiles.map(f => f.content).join('\n---FILE_BOUNDARY---\n');
const expectedCorpusSha256 = crypto.createHash('sha256').update(concatenatedContents).digest('hex');
const expectedCorpusBytes = Buffer.byteLength(concatenatedContents, 'utf8');

const fileShas: Record<string, string> = {};
filteredFiles.forEach(f => {
  fileShas[f.path] = crypto.createHash('sha256').update(f.content).digest('hex');
});

const categoriesMap = new Map<string, any>();
filteredFiles.forEach(f => {
  const categoryTitle = getCategory(f.path);
  
  if (!categoriesMap.has(categoryTitle)) {
    categoriesMap.set(categoryTitle, { title: categoryTitle, items: [] });
  }
  categoriesMap.get(categoryTitle).items.push(f);
});

const finalData = Array.from(categoriesMap.values());

const buildStamp = {
  generatedAt: new Date().toISOString(),
  commitHash: 'f9d314e' // Placeholder or actual if available
};

const tsContent = `export type DocSection = {
  id: string;
  title: string;
  path: string;
  content: string;
};

export type DocCategory = {
  title: string;
  items: DocSection[];
};

export const expectedFilesCount = ${filteredFiles.length};
export const expectedWordsCount = ${corpus.split(/\s+/).length};
export const expectedCorpusSha256 = "${expectedCorpusSha256}";
export const expectedCorpusBytes = ${expectedCorpusBytes};
export const expectedFilePaths = ${JSON.stringify(filteredFiles.map(f => f.path))};
export const expectedFileShas: Record<string, string> = ${JSON.stringify(fileShas, null, 2)};
export const buildStamp = ${JSON.stringify(buildStamp, null, 2)};

export const docsData: DocCategory[] = ${JSON.stringify(finalData, null, 2)};
`;

fs.writeFileSync('./src/data/docs.ts', tsContent);
console.log('Generated src/data/docs.ts with ' + parsedFiles.length + ' files.');
console.log('Expected SHA256: ' + expectedCorpusSha256);
