export * from "./catalog";

// ---------------------------------------------------------------------------
// Admin / orders view models
// ---------------------------------------------------------------------------

export interface OrderView {
  id: string;
  orderNumber: number;
  customerName: string;
  createdAt: Date;
  total: number;
  status: string;
  paymentStatus: string;
  itemsCount: number;
  source: "db" | "mock";
}

export interface StockAlertView {
  id: string;
  productName: string;
  variantName: string | null;
  sku: string;
  quantityAvailable: number;
  reorderThreshold: number;
  locationName: string;
}

export interface DashboardStats {
  revenue7d: number;
  orders7d: number;
  averageTicket7d: number;
  lowStockCount: number;
  recentOrders: OrderView[];
  stockAlerts: StockAlertView[];
  source: "db" | "mock";
}

// ---------------------------------------------------------------------------
// Orders API (create order payload shown in /api/orders)
// ---------------------------------------------------------------------------

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDni?: string;
  shippingAddress: {
    label: string;
    street: string;
    streetNumber: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    unitPrice: number;
  }>;
  couponCode?: string;
  paymentMethod: "MERCADOPAGO" | "CASH" | "TRANSFER" | "CARD";
}