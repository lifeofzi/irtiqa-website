'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, type Product } from '../lib/products';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
}

interface BuyerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  size: string;
}

type ModalState = 'form' | 'processing' | 'verifying';

interface OrderSuccess {
  email: string;
  productName: string;
  orderId: string;
}

function ProductVisual({ product, activeIdx, onThumbClick }: {
  product: Product;
  activeIdx: number;
  onThumbClick: (i: number) => void;
}) {
  const hasImages = product.images.length > 0;

  return (
    <div className="merch-gallery">
      <div className="merch-gallery-main">
        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[activeIdx]} alt={product.name} className="merch-gallery-img" />
        ) : (
          <div className="merch-gallery-placeholder">
            <span className="merch-gallery-placeholder-text">{product.name}</span>
            <span className="merch-gallery-placeholder-sub">{product.subtitle}</span>
          </div>
        )}
      </div>
      {hasImages && product.images.length > 1 && (
        <div className="merch-gallery-thumbs">
          {product.images.map((src, i) => (
            <button
              key={i}
              className={`merch-thumb${i === activeIdx ? ' active' : ''}`}
              onClick={() => onThumbClick(i)}
              aria-label={`Image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${product.name} view ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MerchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productParam = searchParams.get('p');

  const [detailProduct, setDetailProduct] = useState<Product | null>(
    () => PRODUCTS.find(p => p.id === productParam) ?? null
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [pickedSize, setPickedSize] = useState('');
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [outOfStock, setOutOfStock] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalState, setModalState] = useState<ModalState>('form');
  const [form, setForm] = useState<BuyerForm>({ name: '', email: '', phone: '', address: '', size: '' });
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccess | null>(null);

  // Sync state when browser back/forward changes ?p=
  useEffect(() => {
    const p = searchParams.get('p');
    setDetailProduct(PRODUCTS.find(prod => prod.id === p) ?? null);
  }, [searchParams]);

  function openDetail(product: Product) {
    setActiveImageIdx(0);
    setPickedSize('');
    setSizeChartOpen(false);
    setOutOfStock({});
    router.replace(`?s=merch&p=${product.id}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch(`/api/stock?productId=${product.id}`)
      .then(r => r.json())
      .then(d => setOutOfStock(d.outOfStock || {}))
      .catch(() => {});
  }

  function closeDetail() {
    setSizeChartOpen(false);
    router.replace('?s=merch', { scroll: false });
  }

  function openCheckout(product: Product) {
    setSelectedProduct(product);
    setForm({ name: '', email: '', phone: '', address: '', size: pickedSize || product.sizes[0] || '' });
    setModalState('form');
    setError('');
  }

  function closeModal() {
    setSelectedProduct(null);
    setError('');
  }

  function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.head.appendChild(script);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    setError('');
    setModalState('processing');

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          amount: selectedProduct.price,
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          buyerAddress: form.address,
          size: form.size || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.orderId) throw new Error(data.error || 'Failed to create order');

      await loadRazorpayScript();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Ali Saffudin — IRTIQA',
        description: `${selectedProduct.name} (${selectedProduct.subtitle})`,
        order_id: data.orderId,
        handler: async (response) => {
          setModalState('verifying');
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                productId: selectedProduct.id,
                productName: `${selectedProduct.name} — ${selectedProduct.subtitle}`,
                amount: selectedProduct.price,
                buyerName: form.name,
                buyerEmail: form.email,
                buyerPhone: form.phone,
                buyerAddress: form.address,
                size: form.size || undefined,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData.error || 'Verification failed');
            setSelectedProduct(null);
            setOrderSuccess({ email: form.email, productName: selectedProduct.name, orderId: response.razorpay_order_id });
          } catch {
            setError('Payment verification failed. Please contact alisaffudin@gmail.com.');
            setModalState('form');
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#c00000' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      // modal stays hidden while Razorpay widget is open
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setModalState('form');
    }
  }

  return (
    <section className="merch-section">
      {!orderSuccess && (
        <div className="merch-header">
          <span className="music-tag">Limited Edition</span>
          <span className="music-title">MERCH</span>
          {!detailProduct && <span className="music-ep">{PRODUCTS.length} Items</span>}
          {detailProduct && (
            <button className="merch-back-btn" onClick={closeDetail}>← Back</button>
          )}
        </div>
      )}

      {/* Product grid */}
      {!detailProduct && !orderSuccess && (
        <div className="merch-grid">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className={`merch-card${product.sizeChartType === 'none' ? ' merch-card--accessory' : ''}`}
              onClick={() => openDetail(product)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openDetail(product)}
            >
              <div className="merch-card-visual">
                {product.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} className="merch-card-visual-img" />
                ) : (
                  <span className="merch-card-visual-text">{product.subtitle}</span>
                )}
              </div>
              <div className="merch-card-body">
                <span className="merch-card-tag">{product.tag}</span>
                <div className="merch-card-name">{product.name}</div>
                <div className="merch-card-subtitle">{product.subtitle}</div>
                <div className="merch-card-price">₹{product.price}</div>
                <div className="merch-card-sizes">
                  {product.sizeChartType === 'none'
                    ? <span className="merch-size-pip">{product.sizes.length} models</span>
                    : product.sizes.map((s) => (
                        <span key={s} className="merch-size-pip">{s}</span>
                      ))
                  }
                </div>
                <div className="merch-card-cta">View →</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product detail */}
      {detailProduct && !orderSuccess && (
        <div className="merch-detail">
          <div className="merch-detail-left">
            <ProductVisual
              product={detailProduct}
              activeIdx={activeImageIdx}
              onThumbClick={setActiveImageIdx}
            />
          </div>

          <div className="merch-detail-info">
            <span className="merch-card-tag">{detailProduct.tag}</span>
            <h2 className="merch-detail-name">{detailProduct.name}</h2>
            <div className="merch-detail-subtitle">{detailProduct.subtitle}</div>
            <div className="merch-detail-price">₹{detailProduct.price}</div>
            <div className="merch-detail-hairline" />
            <p className="merch-detail-desc">{detailProduct.description}</p>

            <div className="merch-detail-sizes-wrap">
              <div className="merch-detail-sizes-header">
                <span className="merch-detail-sizes-label">{detailProduct.sizeLabel}</span>
                {detailProduct.sizeChartType !== 'none' && (
                  <button className="merch-size-guide-btn" onClick={() => setSizeChartOpen(true)}>
                    Size Guide
                  </button>
                )}
              </div>
              {detailProduct.sizeChartType === 'none' ? (
                <select
                  className="merch-model-select"
                  value={pickedSize}
                  onChange={e => setPickedSize(e.target.value)}
                >
                  <option value="">Select model</option>
                  {detailProduct.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <div className="merch-size-picker">
                  {detailProduct.sizes.map((s) => {
                    const oos = outOfStock[s];
                    return (
                      <button
                        key={s}
                        className={`merch-size-btn${pickedSize === s ? ' active' : ''}${oos ? ' sold-out' : ''}`}
                        onClick={() => !oos && setPickedSize(s)}
                        disabled={oos}
                        title={oos ? 'Sold out' : undefined}
                      >
                        {s}
                        {oos && <span className="merch-size-oos-line" />}
                      </button>
                    );
                  })}
                </div>
              )}
              {!pickedSize && <p className="merch-size-hint">Select a {detailProduct.sizeLabel.toLowerCase()}</p>}
            </div>

            <div className="merch-detail-note">Ships within 5–7 business days across India.</div>
            <button className="merch-buy-btn merch-detail-buy" onClick={() => openCheckout(detailProduct)}>
              Buy — ₹{detailProduct.price}
            </button>
          </div>
        </div>
      )}

      {/* Size chart modal */}
      {sizeChartOpen && detailProduct && (
        <div className="merch-modal-overlay" onClick={() => setSizeChartOpen(false)}>
          <div className="merch-size-chart-modal" onClick={(e) => e.stopPropagation()}>
            <button className="merch-modal-close" onClick={() => setSizeChartOpen(false)} aria-label="Close">✕</button>
            <div className="merch-size-chart-title">Size Guide</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={detailProduct.sizeChartType === 'women' ? '/size-chart-women.png' : '/size-chart-men.png'}
              alt="Size chart"
              className="merch-size-chart-img"
            />
            <p className="merch-size-chart-note">All measurements in inches. When in doubt, size up.</p>
          </div>
        </div>
      )}

      {/* Verifying spinner overlay — shown after Razorpay closes, before confirm */}
      {selectedProduct && modalState === 'verifying' && (
        <div className="merch-modal-overlay">
          <div className="merch-spinner-box">
            <div className="merch-spinner" />
            <span className="merch-spinner-label">Confirming order...</span>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {selectedProduct && modalState !== 'verifying' && (
        <div className="merch-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="merch-modal" role="dialog" aria-modal="true" aria-label={`Buy ${selectedProduct.name}`}>
            {modalState === 'form' && (
              <button className="merch-modal-close" onClick={closeModal} aria-label="Close">✕</button>
            )}
            <div className="merch-modal-product">
              <span className="merch-card-tag">{selectedProduct.tag}</span>
              <div className="merch-modal-name">{selectedProduct.name}</div>
              <div className="merch-modal-subtitle">{selectedProduct.subtitle}</div>
              <div className="merch-card-price">₹{selectedProduct.price}</div>
            </div>
            <form onSubmit={handleSubmit} className="merch-form">
              <div className="merch-form-field">
                <label>Name</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name" />
              </div>
              <div className="merch-form-field">
                <label>Email</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com" />
              </div>
              <div className="merch-form-field">
                <label>Phone</label>
                <input type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="merch-form-field">
                <label>Delivery Address</label>
                <textarea required value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Full address with PIN code" rows={3} />
              </div>
              <div className="merch-form-field">
                <label>{selectedProduct.sizeLabel}</label>
                <select required value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}>
                  {selectedProduct.sizeChartType === 'none' && <option value="">Select model</option>}
                  {selectedProduct.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {error && <div className="merch-form-error">{error}</div>}
              <button type="submit" className="merch-buy-btn merch-submit-btn"
                disabled={modalState === 'processing'}>
                {modalState === 'processing'
                  ? <span className="merch-btn-spinner"><span className="merch-spinner-inline" /> Opening payment...</span>
                  : `Pay ₹${selectedProduct.price}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Full-page order success */}
      {orderSuccess && (
        <div className="merch-order-success">
          <div className="merch-order-success-icon">✓</div>
          <h2 className="merch-order-success-title">Order Placed</h2>
          <p className="merch-order-success-msg">
            Confirmation sent to <strong>{orderSuccess.email}</strong>.<br />
            You&apos;ll receive a tracking ID once shipped.
          </p>
          <div className="merch-order-id">
            <span className="merch-order-id-label">Order ID</span>
            <span className="merch-order-id-value">{orderSuccess.orderId}</span>
          </div>
          <button className="merch-buy-btn merch-order-success-btn"
            onClick={() => { setOrderSuccess(null); router.replace('?s=merch', { scroll: false }); }}>
            Back to Merch
          </button>
        </div>
      )}
    </section>
  );
}
