/**
 * Pluggable CSV column maps so Taobao / Pinduoduo / Shopify exports share one preview tool.
 */
export interface CsvColumnMap {
    /** Adapter id, e.g. `generic`, `taobao-review`, `shopify-product`. */
    id: string;
    /** Human label. */
    label: string;
    /** Canonical field → possible header names (first match wins). */
    columns: Record<string, string[]>;
}
export declare const CSV_ADAPTERS: readonly CsvColumnMap[];
/**
 * Resolve an adapter by id; unknown ids fall back to generic.
 * @param id - adapter id from tool args or config
 */
export declare function getAdapter(id: string | undefined): CsvColumnMap;
/**
 * Rename row keys using the adapter map.
 * @param row - raw CSV row
 * @param adapter - column map
 */
export declare function normalizeRow(row: Record<string, string>, adapter: CsvColumnMap): Record<string, string>;
