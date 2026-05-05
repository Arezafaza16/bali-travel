const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function checkAvailability(slug: string, date: string, guests: number) {
  const res = await fetch(
    `${API_BASE}/services/${slug}/availability?date=${date}&guests=${guests}`,
  );
  if (!res.ok) throw new Error('Failed to check availability');
  return res.json() as Promise<{
    available: boolean;
    slotsLeft: number;
    totalCapacity: number;
    message: string;
  }>;
}

export async function createBooking(data: {
  serviceSlug: string;
  serviceName: string;
  date: string;
  guests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pricePerPerson: number;
}) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create booking');
  }
  return res.json() as Promise<{ orderId: string; _id: string }>;
}

export async function createPaymentTransaction(orderId: string) {
  const res = await fetch(`${API_BASE}/payments/create/${orderId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to create payment transaction');
  return res.json() as Promise<{ token: string; redirectUrl: string; clientKey: string }>;
}

export async function pollPaymentStatus(orderId: string) {
  const res = await fetch(`${API_BASE}/payments/status/${orderId}`);
  if (!res.ok) throw new Error('Failed to get payment status');
  return res.json() as Promise<{ status: string; otp: string | null }>;
}
