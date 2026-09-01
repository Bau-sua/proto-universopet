// ============================================================================
// AFIP / ARCA electronic invoicing integration (STUB).
//
// Production: emit valid "Factura B/C" with CAE via the Afip SDK REST API
// (tier: 1,000 requests/month). Certificates live in files; env holds the
// CUIT and identifiers. This mockup only logs the call shape.
// ============================================================================

export interface InvoiceInput {
  orderNumber: number;
  customerDni?: string;
  customerName: string;
  total: number;
  paymentMethod: string;
}

export interface InvoiceResult {
  invoiceType: string;
  invoiceNumber: string;
  cae: string;
  caeExpiration: string;
}

export interface InvoiceProvider {
  createInvoice(input: InvoiceInput): Promise<InvoiceResult>;
}

/** AFIP/ARCA invoice provider — stub implementation for the demo. */
export const afip: InvoiceProvider = {
  async createInvoice(input) {
    console.warn(
      "[afip] createInvoice STUB — wire Afip SDK (CAE) with AFIP_CUIT/AFIP_CERT/AFIP_PRIVATE_KEY for production."
    );
    // Real implementation: WSFEv1 → CAE + vto; store invoiceType/invoiceNumber/
    // invoiceCae alongside the order (already in the Order model).
    return {
      invoiceType: "B",
      invoiceNumber: "00001-0000" + String(input.orderNumber).padStart(6, "0"),
      cae: String(Math.floor(Math.random() * 1e14)).padStart(14, "0"),
      caeExpiration: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    };
  },
};

// Named export so business services can call it without coupling to the
// provider object shape.
export const createInvoice: InvoiceProvider["createInvoice"] = (input) =>
  afip.createInvoice(input);