import { readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import { getAdapter, normalizeRow, CSV_ADAPTERS } from '../adapters/csv-maps.js';
/**
 * Read a workspace CSV, optionally remap columns, return headers + sample rows.
 * @param filePath - absolute or cwd-relative path
 * @param adapterId - column map id
 * @param sampleSize - max sample rows
 * @param cwd - resolve relative paths against this directory
 */
export async function previewCsv(options) {
    const cwd = options.cwd ?? process.cwd();
    const abs = isAbsolute(options.filePath) ? options.filePath : resolve(cwd, options.filePath);
    const adapter = getAdapter(options.adapterId);
    const sampleSize = Math.min(Math.max(options.sampleSize ?? 5, 1), 50);
    const text = await readFile(abs, { encoding: 'utf8', signal: options.signal });
    const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
    });
    const normalized = records.map(row => normalizeRow(row, adapter));
    const headers = normalized[0] ? Object.keys(normalized[0]) : [];
    return {
        path: abs,
        adapter: adapter.id,
        adapterLabel: adapter.label,
        headers,
        rowCount: normalized.length,
        sampleRows: normalized.slice(0, sampleSize),
        availableAdapters: CSV_ADAPTERS.map(a => ({ id: a.id, label: a.label })),
    };
}
