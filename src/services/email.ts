// ============================================================================
// Email integration (STUB) — production uses Resend (3,000 free/month).
// ============================================================================

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ id: string }>;
}

/** Resend email provider — stub implementation for the demo. */
export const emailProvider: EmailProvider = {
  async send(message) {
    console.warn(
      "[email] send STUB — wire Resend with RESEND_API_KEY for production."
    );
    console.log(`[email] would send to "${message.to}": ${message.subject}`);
    return { id: `email-demo-${Date.now()}` };
  },
};

// Convenience helpers used by the business layer.
export async function sendOrderConfirmation(input: {
  to: string;
  orderNumber: number;
  total: number;
}): Promise<void> {
  await emailProvider.send({
    to: input.to,
    subject: `Pedido #${input.orderNumber} confirmado — Huellitas Pet Shop`,
    html: `<p>Gracias por tu compra. Tu pedido #${input.orderNumber} por $${input.total.toLocaleString("es-AR")} fue confirmado.</p>`,
  });
}