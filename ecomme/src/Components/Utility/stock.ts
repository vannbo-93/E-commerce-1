/** @format */

// المخزون يُعرض للعميل كرقم فقط حين يكون قليلًا:
// "143 in stock" لا يفيد العميل، ويكشف حجم المخزون للمنافسين
export const LOW_STOCK_THRESHOLD = 5;

export const isOutOfStock = (stock: number | undefined) => (stock ?? 0) <= 0;

// نص قصير للعرض، أو null حين لا داعي لأي تنبيه
export const stockLabel = (stock: number | undefined): string | null => {
  const s = stock ?? 0;
  if (s <= 0) return "Out of stock";
  if (s <= LOW_STOCK_THRESHOLD) return `Only ${s} left`;
  return null;
};
