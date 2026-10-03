// Validates every locale file in src/i18n against the source-of-truth en.json:
//   1. duplicate keys inside a single object
//   2. same keys, nesting and key order as en.json
//   3. matching article section IDs and order in both languages
// Dev/CI tooling only - never imported by the app runtime.
// Run with: npm run i18n:check  (Node 24 runs .ts via type stripping)

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = resolve(SCRIPT_DIR, 'src/i18n');
const BASE_FILE = 'en.json';
const MAX_LIST = 50;

function sectionIds(filePath: string): string[] {
    const source = readFileSync(filePath, 'utf8');
    return [...source.matchAll(/\bid:\s*'([^']+)'\s*,/g)].map((match) => match[1]);
}

interface OrderMismatch {
    position: number;
    expected: string;
    found: string;
}

interface ComparisonResult {
    missing: string[];
    extra: string[];
    orderMismatch: OrderMismatch | null;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function loadJson(filePath: string): unknown {
    let raw: string;
    try {
        raw = readFileSync(filePath, 'utf8');
    } catch (error) {
        throw new Error(`Could not read "${filePath}": ${errorMessage(error)}`, { cause: error });
    }
    try {
        return JSON.parse(raw);
    } catch (error) {
        throw new Error(
            `Invalid JSON in "${filePath}": ${errorMessage(error)}`,
            { cause: error }
        );
    }
}

// Duplicate keys have to be found in the RAW TEXT: JSON.parse silently keeps
// only the last occurrence, so by the time the file is an object the earlier
// copy is gone and no structural comparison can see it. The scanner below
// walks the source tracking one Set of key names per open object; a name seen
// twice in the same object is reported with its dotted path. Callers run it
// only after loadJson has proved the file parses, so the input is well-formed
// JSON and a minimal scanner is enough (these files contain no arrays).
function findDuplicateKeys(raw: string): string[] {
    const duplicates: string[] = [];
    const stack: { path: string; seen: Set<string> }[] = [];
    let pendingKey: string | null = null;
    let index = 0;

    const readString = (start: number): { value: string; next: number } => {
        let value = '';
        let cursor = start + 1;
        while (cursor < raw.length) {
            const char = raw[cursor];
            if (char === '\\') {
                value += raw[cursor + 1] ?? '';
                cursor += 2;
                continue;
            }
            if (char === '"') {
                return { value, next: cursor + 1 };
            }
            value += char;
            cursor++;
        }
        return { value, next: cursor };
    };

    while (index < raw.length) {
        const char = raw[index];

        if (char === '"') {
            const { value, next } = readString(index);
            let after = next;
            while (after < raw.length && /\s/.test(raw[after])) after++;
            // A string is a key only when the next non-space character is ':'.
            if (raw[after] === ':' && stack.length > 0) {
                const frame = stack[stack.length - 1];
                if (frame.seen.has(value)) {
                    duplicates.push(
                        frame.path ? `${frame.path}.${value}` : value
                    );
                } else {
                    frame.seen.add(value);
                }
                pendingKey = value;
            }
            index = next;
            continue;
        }

        if (char === '{') {
            const parent = stack.length ? stack[stack.length - 1].path : '';
            const path = pendingKey
                ? parent
                    ? `${parent}.${pendingKey}`
                    : pendingKey
                : parent;
            stack.push({ path, seen: new Set() });
            pendingKey = null;
            index++;
            continue;
        }

        if (char === '}') {
            stack.pop();
            pendingKey = null;
            index++;
            continue;
        }

        index++;
    }

    return duplicates;
}

// Pre-order traversal: records the dotted path of every key (branch and leaf)
// in the exact order it appears in the file, e.g.
// "translation.general.language.changeLanguage". JSON.parse preserves
// insertion order for non-integer string keys, which all i18n keys are.
function extractKeys(value: unknown, prefix: string, out: string[]): string[] {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return out;
    }
    const record = value as Record<string, unknown>;
    for (const key of Object.keys(record)) {
        const path = prefix ? `${prefix}.${key}` : key;
        out.push(path);
        extractKeys(record[key], path, out);
    }
    return out;
}

function formatList(items: string[]): string {
    const lines = items.slice(0, MAX_LIST).map((item) => `    - ${item}`);
    if (items.length > MAX_LIST) {
        lines.push(`    ... and ${items.length - MAX_LIST} more`);
    }
    return lines.join('\n');
}

function compareKeys(
    baseKeys: string[],
    targetKeys: string[]
): ComparisonResult {
    const baseSet = new Set(baseKeys);
    const targetSet = new Set(targetKeys);

    const missing = baseKeys.filter((key) => !targetSet.has(key));
    const extra = targetKeys.filter((key) => !baseSet.has(key));

    // Order is compared over keys present in BOTH files so a pure reordering is
    // reported separately from missing/extra keys.
    const baseCommon = baseKeys.filter((key) => targetSet.has(key));
    const targetCommon = targetKeys.filter((key) => baseSet.has(key));

    let orderMismatch: OrderMismatch | null = null;
    for (let i = 0; i < baseCommon.length; i++) {
        if (baseCommon[i] !== targetCommon[i]) {
            orderMismatch = {
                position: i,
                expected: baseCommon[i],
                found: targetCommon[i]
            };
            break;
        }
    }

    return { missing, extra, orderMismatch };
}

function main(): number {
    const basePath = join(I18N_DIR, BASE_FILE);
    const baseJson = loadJson(basePath);
    const baseKeys = extractKeys(baseJson, '', []);

    const baseDuplicates = findDuplicateKeys(readFileSync(basePath, 'utf8'));

    const localeFiles = readdirSync(I18N_DIR)
        .filter((file) => file.endsWith('.json') && file !== BASE_FILE)
        .sort();

    if (localeFiles.length === 0) {
        console.log(`No locale files to check in ${I18N_DIR}.`);
        return 0;
    }

    console.log(
        `Checking ${localeFiles.length} locale file(s) against ` +
            `"${BASE_FILE}" (${baseKeys.length} keys)...\n`
    );

    let failedFiles = 0;

    if (baseDuplicates.length) {
        failedFiles++;
        console.log(`FAIL  ${BASE_FILE}`);
        console.log(`  Duplicate keys (${baseDuplicates.length}):`);
        console.log(formatList(baseDuplicates));
        console.log('');
    }

    for (const file of localeFiles) {
        const filePath = join(I18N_DIR, file);
        const targetJson = loadJson(filePath);
        const targetKeys = extractKeys(targetJson, '', []);
        const { missing, extra, orderMismatch } = compareKeys(
            baseKeys,
            targetKeys
        );
        const duplicates = findDuplicateKeys(readFileSync(filePath, 'utf8'));

        const failed =
            missing.length > 0 ||
            extra.length > 0 ||
            orderMismatch !== null ||
            duplicates.length > 0;

        if (!failed) {
            console.log(`OK    ${file}`);
            continue;
        }

        failedFiles++;
        console.log(`FAIL  ${file}`);

        if (duplicates.length) {
            console.log(`  Duplicate keys (${duplicates.length}):`);
            console.log(formatList(duplicates));
        }
        if (missing.length) {
            console.log(`  Missing keys (${missing.length}):`);
            console.log(formatList(missing));
        }
        if (extra.length) {
            console.log(`  Extra keys (${extra.length}):`);
            console.log(formatList(extra));
        }
        if (orderMismatch) {
            console.log('  Order mismatch (first differing shared key):');
            console.log(`    position    : ${orderMismatch.position}`);
            console.log(`    expected    : ${orderMismatch.expected}`);
            console.log(`    found       : ${orderMismatch.found}`);
        }
        console.log('');
    }

    const spanishIds = sectionIds(join(SCRIPT_DIR, 'src/content/es.tsx'));
    const englishIds = sectionIds(join(SCRIPT_DIR, 'src/content/en.tsx'));
    if (spanishIds.length !== new Set(spanishIds).size ||
        englishIds.length !== new Set(englishIds).size ||
        spanishIds.join('\n') !== englishIds.join('\n')) {
        failedFiles++;
        console.log('FAIL  article sections: English and Spanish IDs must match in order without duplicates');
        console.log(`  Spanish: ${spanishIds.join(', ')}`);
        console.log(`  English: ${englishIds.join(', ')}`);
    } else {
        console.log(`OK    article sections (${englishIds.length} in each language)`);
    }

    if (failedFiles > 0) {
        console.error(
            `\ni18n check failed: ${failedFiles} file(s) differ from ` +
                `"${BASE_FILE}".`
        );
        return 1;
    }

    console.log(
        `\ni18n check passed: all ${localeFiles.length} file(s) match ` +
            `"${BASE_FILE}".`
    );
    return 0;
}

try {
    process.exit(main());
} catch (error) {
    console.error(`i18n check error: ${errorMessage(error)}`);
    process.exit(1);
}
