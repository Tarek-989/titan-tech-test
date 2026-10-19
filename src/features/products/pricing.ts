/** Price after applying DummyJSON's `discountPercentage`, rounded to cents. */
export function getDiscountedPrice(price: number, discountPercentage: number): number {
  return Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
}

export type StockLevel = 'out' | 'low' | 'in';

export const LOW_STOCK_THRESHOLD = 10;

export function getStockLevel(stock: number): StockLevel {
  if (stock <= 0) return 'out';
  if (stock < LOW_STOCK_THRESHOLD) return 'low';
  return 'in';
}
