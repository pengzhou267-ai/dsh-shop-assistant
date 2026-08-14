export interface CsvPreviewResult {
    path: string;
    adapter: string;
    adapterLabel: string;
    headers: string[];
    rowCount: number;
    sampleRows: Record<string, string>[];
    availableAdapters: {
        id: string;
        label: string;
    }[];
}
/**
 * Read a workspace CSV, optionally remap columns, return headers + sample rows.
 * @param filePath - absolute or cwd-relative path
 * @param adapterId - column map id
 * @param sampleSize - max sample rows
 * @param cwd - resolve relative paths against this directory
 */
export declare function previewCsv(options: {
    filePath: string;
    adapterId?: string;
    sampleSize?: number;
    cwd?: string;
    signal?: AbortSignal;
}): Promise<CsvPreviewResult>;
