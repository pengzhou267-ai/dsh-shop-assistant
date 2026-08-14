/**
 * Pluggable CSV column maps so Taobao / Pinduoduo / Shopify exports share one preview tool.
 */
export const CSV_ADAPTERS = [
    {
        id: 'generic',
        label: '通用（首行即表头）',
        columns: {},
    },
    {
        id: 'taobao-review',
        label: '淘宝/天猫评价导出（常见列名）',
        columns: {
            rating: ['评分', '星级', 'rating', 'Rate'],
            content: ['评价内容', '评价', 'content', 'Review', '评论'],
            sku: ['SKU', '货号', '商家编码', 'sku'],
            date: ['评价时间', '时间', 'date', 'Date'],
            orderId: ['订单号', '主订单编号', 'order_id'],
        },
    },
    {
        id: 'pdd-review',
        label: '拼多多评价导出（常见列名）',
        columns: {
            rating: ['描述相符', '评分', '星级'],
            content: ['评价内容', '买家评价'],
            sku: ['商品规格', 'SKU'],
            date: ['评价时间'],
            orderId: ['订单号'],
        },
    },
    {
        id: 'shopify-product',
        label: 'Shopify 商品导出',
        columns: {
            title: ['Title', '标题'],
            sku: ['Variant SKU', 'SKU'],
            price: ['Variant Price', 'Price', '售价'],
            cost: ['Cost per item', '成本'],
            inventory: ['Variant Inventory Qty', '库存'],
        },
    },
    {
        id: 'generic-product',
        label: '通用商品表',
        columns: {
            title: ['标题', '商品名称', 'title', 'name', 'Name'],
            sku: ['SKU', '货号', '商家编码', 'sku'],
            price: ['售价', '价格', 'price', 'Price'],
            cost: ['成本', 'cost', 'Cost'],
            inventory: ['库存', 'inventory', 'stock'],
        },
    },
];
/**
 * Resolve an adapter by id; unknown ids fall back to generic.
 * @param id - adapter id from tool args or config
 */
export function getAdapter(id) {
    if (!id)
        return CSV_ADAPTERS[0];
    return CSV_ADAPTERS.find(a => a.id === id) ?? CSV_ADAPTERS[0];
}
/**
 * Rename row keys using the adapter map.
 * @param row - raw CSV row
 * @param adapter - column map
 */
export function normalizeRow(row, adapter) {
    if (Object.keys(adapter.columns).length === 0)
        return { ...row };
    const out = { ...row };
    for (const [canonical, aliases] of Object.entries(adapter.columns)) {
        for (const alias of aliases) {
            if (row[alias] !== undefined && row[alias] !== '') {
                out[canonical] = row[alias];
                break;
            }
        }
    }
    return out;
}
