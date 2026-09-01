// ============================================================================
// MercadoPago integration (STUB).
//
// The guide requires: single entry point per integration, verified webhooks,
// idempotency, exponential-backoff retries and Sentry error logging. This
// mockup only logs the intent with the exact production interface, so wiring
// the real SDK later is a drop-in change.
// ============================================================================

export interface PaymentPreferenceInput {
  orderNumber: number;
  total: number;
  description: string;
  customerEmail: string;
  externalReference: string;
}

export interface PaymentPreference {
  id: string;
  initPoint: string;
  sandbox: boolean;
}

export interface PaymentGateway {
  createPreference(input: PaymentPreferenceInput): Promise<PaymentPreference>;
  verifyPayment(paymentId: string): Promise<{ status: string }>;
}

/** MercadoPago gateway — stub implementation for the demo. */
export const mercadopago: PaymentGateway = {
  async createPreference(input) {
    console.warn(
      "[mercadopago] createPreference STUB — wire the real SDK (mp-pro) with MERCADOPAGO_ACCESS_TOKEN for production."
    );
    // Real implementation: POST /checkout/preferences with the access token,
    // returning { id, init_point }. Webhook events are persisted idempotently
    // and ALWAYS verified with a follow-up GET before marking orders paid.
    return {
      id: `mp-demo-${input.externalReference}`,
      initPoint: `https://demo.mercadopago.com.ar/checkout/preference/${input.externalReference}`,
      sandbox: true,
    };
  },

  async verifyPayment(paymentId) {
    console.warn(
      "[mercadopago] verifyPayment STUB — verify status with GET /v1/payments/{id}"
    );
    return { status: "approved" };
  },
};