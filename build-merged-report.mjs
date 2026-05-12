import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const SOURCES_FILE = path.join(ROOT, 'sources.json');
const DOWNLOADS_DIR = path.join(ROOT, 'downloads');
const DIST_DIR = path.join(ROOT, 'dist');
const REPORTS_DIR = path.join(ROOT, 'reports');

fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const now = new Date();
const stamp = now.toISOString().replace(/[:.]/g, '-');
const latestMerged = path.join(DIST_DIR, 'merged-latest.txt');
const stampedMerged = path.join(DIST_DIR, `merged-${stamp}.txt`);
const generatedConfig = path.join(DIST_DIR, `hostlistcompiler-${stamp}.json`);
const latestConfig = path.join(DIST_DIR, 'hostlistcompiler-latest.json');
const reportMd = path.join(REPORTS_DIR, `report-${stamp}.md`);
const reportJson = path.join(REPORTS_DIR, `report-${stamp}.json`);
const latestReportMd = path.join(REPORTS_DIR, 'latest.md');
const latestReportJson = path.join(REPORTS_DIR, 'latest.json');

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function cleanRuleLines(text) {
  return text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith('!'))
    .filter((line) => !line.startsWith('#'))
    .filter((line) => !line.startsWith('['));
}

function looksLikeDomain(d) {
  if (!d) return false;
  if (d.length > 253) return false;
  if (d.includes('..')) return false;
  if (d.includes('*')) return false;
  if (d.includes('/')) return false;
  if (d.includes(':')) return false;
  if (!d.includes('.')) return false;
  return /^[a-z0-9_.-]+$/.test(d);
}

function normalizeDomainFromRule(rule) {
  let s = rule.trim().toLowerCase();

  if (!s || s.startsWith('!') || s.startsWith('#') || s.startsWith('@@')) return null;
  if (s.includes('$badfilter')) return null;

  // hosts format: 0.0.0.0 domain / 127.0.0.1 domain / ::1 domain
  let m = s.match(/^(?:0\.0\.0\.0|127\.0\.0\.1|::1)\s+([^\s#]+)/);
  if (m) {
    let d = m[1].replace(/\.$/, '').replace(/^\*\./, '');
    return looksLikeDomain(d) ? d : null;
  }

  // dnsmasq format: address=/domain/0.0.0.0
  m = s.match(/^address=\/([^/]+)\//);
  if (m) {
    let d = m[1].replace(/\.$/, '').replace(/^\*\./, '');
    return looksLikeDomain(d) ? d : null;
  }

  // Adblock DNS rule: ||domain^ or ||domain^$important
  if (s.startsWith('||')) {
    let d = s.slice(2);
    d = d.split('$')[0];
    d = d.split('^')[0];
    d = d.split('/')[0];
    d = d.replace(/\.$/, '').replace(/^\*\./, '');
    return looksLikeDomain(d) ? d : null;
  }

  // URL-ish rule
  if (s.startsWith('|http://') || s.startsWith('|https://')) {
    s = s.slice(1);
  }

  if (s.startsWith('http://') || s.startsWith('https://')) {
    try {
      const u = new URL(s);
      let d = u.hostname.toLowerCase().replace(/\.$/, '').replace(/^\*\./, '');
      return looksLikeDomain(d) ? d : null;
    } catch {
      return null;
    }
  }

  // plain domain
  let d = s.split(/\s+/)[0];
  d = d.split('$')[0];
  d = d.replace(/\.$/, '').replace(/^\*\./, '');

  return looksLikeDomain(d) ? d : null;
}

function statsForText(text) {
  const rawLines = cleanRuleLines(text);
  const textualSet = new Set(rawLines);
  const domainSet = new Set();

  for (const line of rawLines) {
    const d = normalizeDomainFromRule(line);
    if (d) domainSet.add(d);
  }

  return {
    rawNonCommentRules: rawLines.length,
    uniqueTextualRules: textualSet.size,
    normalizedDomains: domainSet.size,
    textualSet,
    domainSet
  };
}

async function download(url, file) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'adguardhome-local-compiler/1.0'
    },
    redirect: 'follow'
  });

  if (!res.ok) {
    throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(file, buffer);
  return buffer.length;
}

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${cmd} exited with status ${result.status}`);
  }
}

function pct(part, total) {
  if (!total) return '0.00';
  return ((part * 100) / total).toFixed(2);
}

function fmt(n) {
  return Number(n).toLocaleString('en-US');
}

const sourceConfig = readJson(SOURCES_FILE);
const enabledSources = sourceConfig.sources.filter((s) => s.enabled !== false);

console.log(`Enabled sources: ${enabledSources.length}`);
console.log(`Compiled at: ${now.toISOString()}`);

const sourceResults = [];
const globalDomainCounts = new Map();
const globalTextCounts = new Map();

for (const src of enabledSources) {
  const fileName = `${src.id}-${slugify(src.name)}.txt`;
  const filePath = path.join(DOWNLOADS_DIR, fileName);

  console.log(`Downloading: ${src.name}`);
  const bytes = await download(src.url, filePath);
  const text = fs.readFileSync(filePath, 'utf8');
  const st = statsForText(text);

  for (const d of st.domainSet) {
    globalDomainCounts.set(d, (globalDomainCounts.get(d) || 0) + 1);
  }

  for (const r of st.textualSet) {
    globalTextCounts.set(r, (globalTextCounts.get(r) || 0) + 1);
  }

  sourceResults.push({
    ...src,
    filePath,
    bytes,
    rawNonCommentRules: st.rawNonCommentRules,
    uniqueTextualRules: st.uniqueTextualRules,
    normalizedDomains: st.normalizedDomains,
    textualSet: st.textualSet,
    domainSet: st.domainSet
  });
}

for (const r of sourceResults) {
  let uniqueDomainsOnly = 0;
  let overlappingDomains = 0;
  for (const d of r.domainSet) {
    if (globalDomainCounts.get(d) === 1) uniqueDomainsOnly++;
    else overlappingDomains++;
  }

  let uniqueTextOnly = 0;
  let overlappingText = 0;
  for (const t of r.textualSet) {
    if (globalTextCounts.get(t) === 1) uniqueTextOnly++;
    else overlappingText++;
  }

  r.uniqueDomainsOnly = uniqueDomainsOnly;
  r.overlappingDomains = overlappingDomains;
  r.uniqueDomainPct = pct(uniqueDomainsOnly, r.normalizedDomains);

  r.uniqueTextOnly = uniqueTextOnly;
  r.overlappingText = overlappingText;
  r.uniqueTextPct = pct(uniqueTextOnly, r.uniqueTextualRules);
}

const compilerConfig = {
  name: sourceConfig.name,
  description: `${sourceConfig.description || ''}\nGenerated: ${now.toISOString()}`.trim(),
  homepage: sourceConfig.homepage || 'https://local.invalid/',
  license: sourceConfig.license || 'mixed',
  version: `${sourceConfig.version || '1.0.0'}-${stamp}`,
  sources: sourceResults.map((s) => ({
    name: s.name,
    source: s.url,
    type: s.type || 'adblock'
  })),
  transformations: [
    'ConvertToAscii',
    'TrimLines',
    'RemoveComments',
    'Compress',
    'ValidateAllowIp',
    'Deduplicate',
    'RemoveEmptyLines',
    'InsertFinalNewLine'
  ]
};

fs.writeFileSync(generatedConfig, JSON.stringify(compilerConfig, null, 2));
fs.copyFileSync(generatedConfig, latestConfig);

console.log('Running HostlistCompiler...');
run('hostlist-compiler', ['-c', generatedConfig, '-o', stampedMerged]);

fs.copyFileSync(stampedMerged, latestMerged);

const mergedText = fs.readFileSync(stampedMerged, 'utf8');
const mergedStats = statsForText(mergedText);
const mergedBytes = fs.statSync(stampedMerged).size;

const globalRawRules = sourceResults.reduce((sum, s) => sum + s.rawNonCommentRules, 0);
const globalUniqueText = globalTextCounts.size;
const globalRawUniquePerFileText = sourceResults.reduce((sum, s) => sum + s.uniqueTextualRules, 0);
const globalRawDomains = sourceResults.reduce((sum, s) => sum + s.normalizedDomains, 0);
const globalUniqueDomains = globalDomainCounts.size;
const duplicateDomainEntries = globalRawDomains - globalUniqueDomains;
const duplicateTextEntries = globalRawUniquePerFileText - globalUniqueText;

const topDuplicateDomains = [...globalDomainCounts.entries()]
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 50);

const report = {
  compiledAt: now.toISOString(),
  sourcesFile: SOURCES_FILE,
  generatedConfig,
  output: {
    latestMerged,
    stampedMerged,
    bytes: mergedBytes,
    rawNonCommentRules: mergedStats.rawNonCommentRules,
    uniqueTextualRules: mergedStats.uniqueTextualRules,
    normalizedDomains: mergedStats.normalizedDomains
  },
  inputSummary: {
    sourceCount: sourceResults.length,
    rawNonCommentRules: globalRawRules,
    rawUniquePerFileTextualRules: globalRawUniquePerFileText,
    uniqueTextualRulesGlobal: globalUniqueText,
    duplicateTextualEntriesAcrossSources: duplicateTextEntries,
    duplicateTextualPctAcrossSources: pct(duplicateTextEntries, globalRawUniquePerFileText),
    rawDomainEntriesPerSourceSum: globalRawDomains,
    uniqueDomainsGlobal: globalUniqueDomains,
    duplicateDomainEntriesAcrossSources: duplicateDomainEntries,
    duplicateDomainPctAcrossSources: pct(duplicateDomainEntries, globalRawDomains)
  },
  sources: sourceResults.map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    type: s.type || 'adblock',
    bytes: s.bytes,
    rawNonCommentRules: s.rawNonCommentRules,
    uniqueTextualRules: s.uniqueTextualRules,
    uniqueTextOnly: s.uniqueTextOnly,
    overlappingText: s.overlappingText,
    uniqueTextPct: s.uniqueTextPct,
    normalizedDomains: s.normalizedDomains,
    uniqueDomainsOnly: s.uniqueDomainsOnly,
    overlappingDomains: s.overlappingDomains,
    uniqueDomainPct: s.uniqueDomainPct
  })),
  topDuplicateDomains: topDuplicateDomains.map(([domain, count]) => ({ domain, count }))
};

fs.writeFileSync(reportJson, JSON.stringify(report, null, 2));
fs.copyFileSync(reportJson, latestReportJson);

let md = '';
md += `# AdGuardHome merged list report\n\n`;
md += `Compiled at: \`${report.compiledAt}\`\n\n`;
md += `## Output\n\n`;
md += `- Latest merged file: \`${latestMerged}\`\n`;
md += `- Stamped merged file: \`${stampedMerged}\`\n`;
md += `- Output bytes: **${fmt(mergedBytes)}**\n`;
md += `- Output non-comment rules: **${fmt(mergedStats.rawNonCommentRules)}**\n`;
md += `- Output unique textual rules: **${fmt(mergedStats.uniqueTextualRules)}**\n`;
md += `- Output normalized domains: **${fmt(mergedStats.normalizedDomains)}**\n\n`;

md += `## Input summary before HostlistCompiler\n\n`;
md += `- Sources: **${fmt(report.inputSummary.sourceCount)}**\n`;
md += `- Raw non-comment rules: **${fmt(globalRawRules)}**\n`;
md += `- Sum of unique textual rules per source: **${fmt(globalRawUniquePerFileText)}**\n`;
md += `- Global unique textual rules: **${fmt(globalUniqueText)}**\n`;
md += `- Duplicate textual entries across sources: **${fmt(duplicateTextEntries)}** (${report.inputSummary.duplicateTextualPctAcrossSources}%)\n`;
md += `- Sum of normalized domains per source: **${fmt(globalRawDomains)}**\n`;
md += `- Global unique normalized domains: **${fmt(globalUniqueDomains)}**\n`;
md += `- Duplicate normalized-domain entries across sources: **${fmt(duplicateDomainEntries)}** (${report.inputSummary.duplicateDomainPctAcrossSources}%)\n\n`;

md += `## List usefulness\n\n`;
md += `Sorted by unique normalized domains contributed.\n\n`;

const readableSources = [...report.sources].sort((a, b) => b.uniqueDomainsOnly - a.uniqueDomainsOnly);

for (const s of readableSources) {
  const overlapPct = pct(s.overlappingDomains, s.normalizedDomains);

  md += `### ${s.name}\n\n`;
  md += `- Raw rules: **${fmt(s.rawNonCommentRules)}**\n`;
  md += `- Normalized domains: **${fmt(s.normalizedDomains)}**\n`;
  md += `- Unique domains contributed: **${fmt(s.uniqueDomainsOnly)}** (${s.uniqueDomainPct}%)\n`;
  md += `- Overlap with other lists: **${fmt(s.overlappingDomains)}** (${overlapPct}%)\n\n`;
}

md += `\n## Top duplicate normalized domains\n\n`;
for (const item of report.topDuplicateDomains.slice(0, 30)) {
  md += `- ${item.count}x \`${item.domain}\`\n`;
}

md += `\n## Notes\n\n`;
md += `- Domain overlap is approximate normalization. HostlistCompiler may optimize further through Compress and validation.\n`;
md += `- The final output count is the important number for what AdGuardHome will ingest as a single list.\n`;
md += `- This build includes HaGeZi TIF Full. Test router RAM carefully before disabling the separate lists.\n`;

fs.writeFileSync(reportMd, md);
fs.copyFileSync(reportMd, latestReportMd);

console.log('');
console.log('Done.');
console.log(`Merged list: ${latestMerged}`);
console.log(`Report:      ${latestReportMd}`);
console.log('');
console.log('Quick summary:');
console.log(`Input raw non-comment rules:       ${fmt(globalRawRules)}`);
console.log(`Input unique normalized domains:   ${fmt(globalUniqueDomains)}`);
console.log(`Merged output non-comment rules:   ${fmt(mergedStats.rawNonCommentRules)}`);
console.log(`Merged output normalized domains:  ${fmt(mergedStats.normalizedDomains)}`);
