import { prisma } from "@/lib/prisma";

// Data-access layer for customers (demo scope: read + minimal create).

export async function findCustomerByEmail(email: string) {
  return prisma.customer.findUnique({ where: { email } });
}

export async function findOrCreateCustomer(input: {
  email: string;
  name: string;
  phone?: string;
  dni?: string;
}) {
  const existing = await findCustomerByEmail(input.email);
  if (existing) return existing;

  return prisma.customer.create({
    data: {
      email: input.email,
      name: input.name,
      phone: input.phone,
      dni: input.dni,
    },
  });
}

export async function findOrCreateAddress(
  customerId: string,
  address: {
    label: string;
    street: string;
    streetNumber: string;
    city: string;
    province: string;
    postalCode: string;
  }
) {
  return prisma.customerAddress.create({
    data: { customerId, ...address },
  });
}

export async function findActiveLocation() {
  return prisma.location.findFirst({
    where: { isActive: true, servesOnline: true },
  });
}