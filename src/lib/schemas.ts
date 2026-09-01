import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod validation schemas. These live in the shared lib because both the API
// layer (route handlers) and the business layer use them. Validation itself
// happens in the API layer, per the arquitectural guide.
// ---------------------------------------------------------------------------

export const productQuerySchema = z.object({
  categoria: z
    .string()
    .trim()
    .max(80)
    .optional()
    .describe("Category slug to filter by (includes child categories)"),
  q: z.string().trim().max(120).optional().describe("Full-text-ish search"),
  destacados: z
    .enum(["true", "false"])
    .optional()
    .describe("Only featured products"),
  limite: z.coerce.number().int().min(1).max(100).default(24),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().max(160),
  customerPhone: z.string().trim().max(30).optional(),
  customerDni: z.string().trim().regex(/^\d{7,8}$/).optional(),
  shippingAddress: z.object({
    label: z.string().trim().min(2).max(60),
    street: z.string().trim().min(2).max(120),
    streetNumber: z.string().trim().min(1).max(12),
    city: z.string().trim().min(2).max(80),
    province: z.string().trim().min(2).max(80),
    postalCode: z.string().trim().min(3).max(10),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1).nullable().optional(),
        quantity: z.number().int().min(1).max(99),
        unitPrice: z.number().positive(),
      })
    )
    .min(1)
    .max(50),
  couponCode: z.string().trim().max(40).optional(),
  paymentMethod: z.enum(["MERCADOPAGO", "CASH", "TRANSFER", "CARD"]),
});

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;