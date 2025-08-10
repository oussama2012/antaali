import { Stock, OrderItem } from '../types';
import { mockStock } from '../data/mockData';

const STOCK_STORAGE_KEY = 'antaali_stock';

export class InventoryService {
  private static instance: InventoryService;
  private stock: Stock[] = [];

  private constructor() {
    this.loadStock();
  }

  public static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  private loadStock(): void {
    const savedStock = localStorage.getItem(STOCK_STORAGE_KEY);
    if (savedStock) {
      this.stock = JSON.parse(savedStock);
    } else {
      this.stock = [...mockStock];
      this.saveStock();
    }
  }

  private saveStock(): void {
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(this.stock));
  }

  public getAllStock(): Stock[] {
    return [...this.stock];
  }

  public getStock(perfumeId: string, size: string): Stock | null {
    return this.stock.find(s => s.perfumeId === perfumeId && s.size === size) || null;
  }

  public getAvailableQuantity(perfumeId: string, size: string): number {
    const stockItem = this.getStock(perfumeId, size);
    return stockItem?.quantity || 0;
  }

  public updateStock(perfumeId: string, size: string, newQuantity: number): boolean {
    const index = this.stock.findIndex(s => s.perfumeId === perfumeId && s.size === size);
    if (index !== -1) {
      this.stock[index].quantity = Math.max(0, newQuantity);
      this.saveStock();
      return true;
    }
    return false;
  }

  public deductStock(perfumeId: string, size: string, quantity: number): boolean {
    const stockItem = this.getStock(perfumeId, size);
    if (!stockItem || stockItem.quantity < quantity) {
      return false; // Insufficient stock
    }
    
    return this.updateStock(perfumeId, size, stockItem.quantity - quantity);
  }

  public addStock(perfumeId: string, size: string, quantity: number): boolean {
    const stockItem = this.getStock(perfumeId, size);
    if (stockItem) {
      return this.updateStock(perfumeId, size, stockItem.quantity + quantity);
    } else {
      // Create new stock entry if it doesn't exist
      const newStock: Stock = {
        perfumeId,
        size: size as '30ml' | '50ml' | '100ml',
        quantity,
        minQuantity: 5 // Default minimum quantity
      };
      this.stock.push(newStock);
      this.saveStock();
      return true;
    }
  }

  public processOrderItems(orderItems: OrderItem[]): { success: boolean; errors: string[] } {
    const errors: string[] = [];
    const stockUpdates: { perfumeId: string; size: string; originalQuantity: number }[] = [];

    // First, check if all items are available
    for (const item of orderItems) {
      const availableQuantity = this.getAvailableQuantity(item.perfumeId, item.size);
      if (availableQuantity < item.quantity) {
        errors.push(`كمية غير كافية من ${item.perfumeName} (${item.size}). المتوفر: ${availableQuantity}, المطلوب: ${item.quantity}`);
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // If all items are available, deduct them from stock
    for (const item of orderItems) {
      const stockItem = this.getStock(item.perfumeId, item.size);
      if (stockItem) {
        stockUpdates.push({
          perfumeId: item.perfumeId,
          size: item.size,
          originalQuantity: stockItem.quantity
        });
        
        if (!this.deductStock(item.perfumeId, item.size, item.quantity)) {
          // Rollback previous updates if any item fails
          for (const update of stockUpdates) {
            this.updateStock(update.perfumeId, update.size, update.originalQuantity);
          }
          return { success: false, errors: [`فشل في خصم ${item.perfumeName} من المخزون`] };
        }
      }
    }

    return { success: true, errors: [] };
  }

  public getLowStockItems(): Stock[] {
    return this.stock.filter(item => item.quantity <= item.minQuantity);
  }

  public restoreStock(orderItems: OrderItem[]): boolean {
    // Used for cancelling orders - restore stock quantities
    for (const item of orderItems) {
      this.addStock(item.perfumeId, item.size, item.quantity);
    }
    return true;
  }
}

export const inventoryService = InventoryService.getInstance();
