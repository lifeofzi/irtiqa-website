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
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Printrove auth failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error(`Printrove auth: no access_token in response — ${JSON.stringify(data)}`);
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
  const tag = `[Printrove] ref=${params.referenceNumber} product=${params.printroveProductId} variant=${params.variantId}`;
  console.log(`${tag} — attempting order creation`);

  try {
    const token = await getToken();
    console.log(`${tag} — auth OK`);

    const payload = {
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
      cod: 0,
      order_products: [
        {
          product_id: params.printroveProductId,
          variant_id: params.variantId,
          quantity: 1,
          is_plain: false,
        },
      ],
    };

    const res = await fetch(`${PRINTROVE_API}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.message || data.error || 'Printrove order creation failed';
      console.error(`${tag} — FAILED (${res.status}): ${msg}`, JSON.stringify(data));
      return { success: false, error: msg };
    }

    const printroveOrderId = data.id ?? data.order_id;
    console.log(`${tag} — SUCCESS printroveOrderId=${printroveOrderId}`);
    return { success: true, printroveOrderId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`${tag} — EXCEPTION: ${msg}`);
    return { success: false, error: msg };
  }
}
