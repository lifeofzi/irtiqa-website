const PRINTROVE_API = 'https://api.printrove.com/api/external';

async function getToken(): Promise<string> {
  const res = await fetch(`${PRINTROVE_API}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email: process.env.PRINTROVE_EMAIL!,
      password: process.env.PRINTROVE_PASSWORD!,
    }),
  });
  if (!res.ok) throw new Error(`Printrove token fetch failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

export interface PrintroveOrderParams {
  referenceNumber: string;
  retailPrice: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    state: string;
    pincode: string;
  };
  printroveProductId: number;
  variantId: number;
}

export async function createPrintroveOrder(
  params: PrintroveOrderParams
): Promise<{ success: boolean; printroveOrderId?: number; error?: string }> {
  try {
    const token = await getToken();

    const res = await fetch(`${PRINTROVE_API}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        reference_number: params.referenceNumber,
        retail_price: params.retailPrice,
        customer: {
          name: params.customer.name,
          email: params.customer.email,
          number: params.customer.phone,
          address1: params.customer.address1,
          pincode: parseInt(params.customer.pincode, 10),
          state: params.customer.state,
          city: params.customer.city,
          country: 'India',
        },
        order_products: [
          {
            product_id: params.printroveProductId,
            variant_id: params.variantId,
            quantity: 1,
            is_plain: false,
          },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data.message || data.error || 'Printrove order creation failed';
      return { success: false, error: msg };
    }
    return { success: true, printroveOrderId: data.id ?? data.order_id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
