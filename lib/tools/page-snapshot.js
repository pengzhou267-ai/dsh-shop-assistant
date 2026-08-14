/**
 * Fetch a public product page and extract a lightweight text snapshot.
 * No login, cookies, or marketplace private APIs.
 */
const MAX_BYTES = 512_000;
const EXCERPT_CHARS = 4_000;
function stripTags(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function metaContent(html, property) {
    const re = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
    const alt = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i');
    return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}
function extractTitle(html) {
    return metaContent(html, 'og:title')
        ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim()
        ?? null;
}
function extractPriceHints(text) {
    const hints = new Set();
    const patterns = [
        /¥\s*[\d,]+(?:\.\d{1,2})?/g,
        /￥\s*[\d,]+(?:\.\d{1,2})?/g,
        /\$\s*[\d,]+(?:\.\d{1,2})?/g,
        /EUR\s*[\d,]+(?:\.\d{1,2})?/gi,
        /价格[：:]\s*[\d,]+(?:\.\d{1,2})?/g,
    ];
    for (const re of patterns) {
        for (const m of text.match(re) ?? []) {
            hints.add(m.trim());
            if (hints.size >= 12)
                return [...hints];
        }
    }
    return [...hints];
}
/**
 * @param url - public http(s) URL
 * @param signal - abort signal from tool execution
 */
export async function snapshotPublicPage(url, signal) {
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        throw new Error(`无效 URL：${url}`);
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('仅支持 http/https 公开页面');
    }
    const res = await fetch(parsed, {
        signal,
        redirect: 'follow',
        headers: {
            'user-agent': 'dsh-shop-assistant/0.1 (+https://github.com/pengzhou267-ai/dsh-shop-assistant)',
            accept: 'text/html,application/xhtml+xml',
        },
    });
    const buf = new Uint8Array(await res.arrayBuffer());
    const truncatedBytes = buf.byteLength > MAX_BYTES;
    const slice = truncatedBytes ? buf.subarray(0, MAX_BYTES) : buf;
    const html = new TextDecoder('utf-8', { fatal: false }).decode(slice);
    const title = extractTitle(html);
    const description = metaContent(html, 'og:description') ?? metaContent(html, 'description');
    const text = stripTags(html);
    const truncated = truncatedBytes || text.length > EXCERPT_CHARS;
    const textExcerpt = text.slice(0, EXCERPT_CHARS);
    return {
        url: parsed.href,
        status: res.status,
        title,
        description,
        priceHints: extractPriceHints(`${title ?? ''} ${description ?? ''} ${textExcerpt}`),
        textExcerpt,
        truncated,
    };
}
