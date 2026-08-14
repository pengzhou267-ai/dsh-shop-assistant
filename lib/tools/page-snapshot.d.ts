/**
 * Fetch a public product page and extract a lightweight text snapshot.
 * No login, cookies, or marketplace private APIs.
 */
export interface PageSnapshot {
    url: string;
    status: number;
    title: string | null;
    description: string | null;
    priceHints: string[];
    textExcerpt: string;
    truncated: boolean;
}
/**
 * @param url - public http(s) URL
 * @param signal - abort signal from tool execution
 */
export declare function snapshotPublicPage(url: string, signal?: AbortSignal): Promise<PageSnapshot>;
