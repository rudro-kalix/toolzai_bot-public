import { PackageOpen, Save, Trash2 } from "lucide-react";
import { EmptyState, ErrorPanel, formatDate, PageHeader } from "@/components/ui";
import { getCatalog, getPrices, taka } from "@/lib/data";
import { removePrice, setPrice } from "./actions";

export const dynamic = "force-dynamic";

export default async function PricesPage() {
  const [pricesResult, catalogResult] = await Promise.allSettled([getPrices(), getCatalog()]);
  if (pricesResult.status === "rejected") return <><PageHeader eyebrow="Pricing" title="Fixed product prices" description="Control exactly what customers pay in BDT." /><ErrorPanel message={pricesResult.reason instanceof Error ? pricesResult.reason.message : "Unknown error."} /></>;
  const prices = pricesResult.value;
  const catalog = catalogResult.status === "fulfilled" ? catalogResult.value : [];
  const priceMap = new Map(prices.map((price) => [`${price.product_key}:${price.variant_key}`, price]));
  return <>
    <PageHeader eyebrow="Pricing" title="Fixed product prices" description="Changes save directly to the bot database and apply to the next purchase." />
    <div className="notice info"><PackageOpen size={20} /><div><strong>Safe fixed pricing</strong><p>An unpriced product cannot be purchased. Provider cost and profit margin are never used for customer charges.</p></div></div>
    {catalogResult.status === "rejected" && <ErrorPanel message="Provider catalog is unavailable. Existing prices are still shown below." />}
    <section className="price-grid">
      {catalog.map((product) => {
        const current = priceMap.get(`${product.productKey}:`);
        return <article className="price-card" key={product.productKey}>
          <div className="price-title"><div><span>{product.stock ?? (product.inStock ? "∞" : 0)} in stock</span><h2>{product.name || product.productKey}</h2><code>{product.productKey}</code></div>{current && <strong>{taka(current.price_bdt)}</strong>}</div>
          <form action={setPrice} className="price-form"><input type="hidden" name="product_key" value={product.productKey} /><label>Customer price (BDT)<input name="price_bdt" type="number" min="1" step="1" defaultValue={current?.price_bdt || ""} placeholder="e.g. 495" required /></label><button type="submit"><Save size={16} /> Save price</button></form>
          {current && <form action={removePrice}><input type="hidden" name="product_key" value={product.productKey} /><button className="danger-button" type="submit"><Trash2 size={15} /> Remove price</button><small>Updated {formatDate(current.updated_at)}</small></form>}
        </article>;
      })}
    </section>
    {!catalog.length && <section className="panel"><h2>Manual fixed price</h2><p className="muted">Use this when the provider catalog is unavailable.</p><form action={setPrice} className="manual-price"><label>Product key<input name="product_key" required /></label><label>Variant key (optional)<input name="variant_key" /></label><label>Price (BDT)<input name="price_bdt" type="number" min="1" step="1" required /></label><button type="submit"><Save size={16} /> Save</button></form></section>}
    <section className="table-panel compact"><div className="panel-head"><div><span className="eyebrow">Database</span><h2>Configured prices</h2></div></div>{prices.length ? <div className="table-scroll"><table><thead><tr><th>Product</th><th>Variant</th><th>Price</th><th>Updated</th></tr></thead><tbody>{prices.map((price) => <tr key={`${price.product_key}:${price.variant_key}`}><td><code>{price.product_key}</code></td><td>{price.variant_key || "Default"}</td><td className="money">{taka(price.price_bdt)}</td><td>{formatDate(price.updated_at)}</td></tr>)}</tbody></table></div> : <EmptyState label="No fixed prices configured." />}</section>
  </>;
}
