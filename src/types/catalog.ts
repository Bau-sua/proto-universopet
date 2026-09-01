// Shared catalog types. These mirror the Prisma domain but stay plain so mock
// data, seed and UI can share them without depending on the ORM.

export interface DemoCategory {
  id: string;
  parentSlug: string | null;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface DemoProductImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface DemoProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  attributes: Record<string, string>;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface DemoProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categorySlug: string;
  weightGrams: number | null;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  images: DemoProductImage[];
  variants: DemoProductVariant[];
}

export interface DemoStockEntry {
  id: string;
  productSlug: string;
  variantSku: string | null;
  locationSlug: string;
  quantityAvailable: number;
  quantityReserved: number;
  reorderThreshold: number;
}

export interface DemoLocation {
  id: string;
  name: string;
  type: "STORE" | "WAREHOUSE" | "BOTH";
  servesOnline: boolean;
  addressLine1: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  phone: string | null;
}

export interface DemoCustomer {
  id: string;
  email: string;
  name: string;
  phone: string;
  dni: string;
}

export interface DemoCustomerAddress {
  id: string;
  customerId: string;
  label: string;
  street: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface DemoOrderItem {
  id: string;
  productSlug: string;
  variantSku: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  variantName: string | null;
}

// Order statuses mirror Prisma enums (literal unions keep both seed and UI
// type-safe against the generated Prisma enums).
type DemoOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

type DemoPaymentStatus =
  | "PENDING"
  | "PAID"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED"
  | "FAILED"
  | "CANCELLED";

type DemoPaymentMethod = "MERCADOPAGO" | "CASH" | "TRANSFER" | "CARD";

export interface DemoOrder {
  id: string;
  orderNumber: number;
  customerId: string;
  status: DemoOrderStatus;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: DemoPaymentMethod;
  paymentStatus: DemoPaymentStatus;
  invoiceType: string | null;
  invoiceNumber: string | null;
  invoiceCae: string | null;
  daysAgo: number;
  items: DemoOrderItem[];
}

// ---------------------------------------------------------------------------
// View models (DTOs) consumed by the UI
// ---------------------------------------------------------------------------

export interface CategoryView {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  children: CategoryView[];
}

export interface VariantView {
  id: string;
  sku: string;
  name: string;
  price: number;
  attributes: Record<string, string>;
  imageUrl: string | null;
  stockAvailable: number;
}

export interface ImageView {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface ProductView {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categorySlug: string;
  categoryName: string;
  weightGrams: number | null;
  isFeatured: boolean;
  tags: string[];
  images: ImageView[];
  variants: VariantView[];
  stockAvailable: number;
  source: "db" | "mock";
}

export interface CatalogResult {
  source: "db" | "mock";
  products: ProductView[];
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  variantId: string | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
}

export type CouponKind = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";

export interface CouponInput {
  code: string;
  type: CouponKind;
  value: number;
  minimumOrderAmount: number | null;
}

export interface CartTotals {
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  freeShippingApplied: boolean;
  couponApplied: CouponInput | null;
  couponErrorMessage: string | null;
}