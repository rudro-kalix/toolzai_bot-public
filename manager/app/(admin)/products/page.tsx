import { Boxes, KeyRound, PackagePlus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { EmptyState, ErrorPanel, PageHeader } from "@/components/ui";
import { getLocalProducts, taka } from "@/lib/data";
import { addLocalInventory, deleteAvailableInventory, saveLocalProduct } from "./actions";

export const dynamic = "force-dynamic";

function ProductForm({ product }: { product?: Awaited<ReturnType<typeof getLocalProducts>>[number] }) {
  return <form action={saveLocalProduct} className="product-editor">
    {product && <input type="hidden" name="original_product_key" value={product.productKey} />}
    <div className="product-form-grid">
      <label>Product key<input name="product_key" defaultValue={product?.productKey || ""} readOnly={Boolean(product)} placeholder="e.g. outlook_account" required /></label>
      <label>Name<input name="name" defaultValue={product?.name || ""} maxLength={100} required /></label>
      <label>Price (BDT)<input name="price_bdt" type="number" min="1" max="10000000" step="1" defaultValue={product?.priceBdt || ""} required /></label>
      <label>Sort order<input name="sort_order" type="number" min="-10000" max="10000" defaultValue={product?.sortOrder || 0} /></label>
      <label className="wide">Delivery fields, comma separated<input name="delivery_fields" defaultValue={(product?.deliveryFields || ["Email", "Password"]).join(", ")} required /><small>These labels map to each pipe-separated value you upload below.</small></label>
      <label className="wide">Description<textarea name="description" rows={3} maxLength={1500} defaultValue={product?.description || ""} /></label>
      <label className="wide">Warranty / instructions<textarea name="warranty" rows={2} maxLength={300} defaultValue={product?.warranty || ""} /></label>
    </div>
    <div className="product-toggles"><label><input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Visible in bot</label><label><input type="checkbox" name="allow_bulk" defaultChecked={product?.allowBulk ?? true} /> Allow bulk buying</label></div>
    <button className="primary-action" type="submit"><Save size={16} /> {product ? "Save product" : "Create product"}</button>
  </form>;
}

export default async function ProductsPage() {
  try {
    const products = await getLocalProducts();
    return <>
      <PageHeader eyebrow="Inventory" title="Products & automatic delivery" description="Create products without an external API, securely load credentials, and let the bot deliver each purchase automatically." />
      <div className="notice success"><ShieldCheck size={20} /><div><strong>Credentials stay protected</strong><p>Stock is encrypted inside the Worker before it reaches the database. This website shows counts only; purchased values are decrypted only for delivery to the buyer&apos;s Telegram chat.</p></div></div>
      <section className="panel product-create"><div className="panel-head"><div><span className="eyebrow">New local product</span><h2>Add a product without an API</h2></div><PackagePlus size={22} /></div><ProductForm /></section>
      <section className="local-product-list">
        {products.map((product) => <article className="local-product-card" key={product.productKey}>
          <header><div><span className={product.active ? "stock-live" : "stock-off"}>{product.active ? "Live" : "Hidden"}</span><h2>{product.name}</h2><code>{product.productKey}</code></div><div className="stock-metrics"><strong>{product.stock}</strong><small>available</small><span>{taka(product.priceBdt || 0)}</span></div></header>
          <ProductForm product={product} />
          <div className="inventory-box">
            <div><KeyRound size={18} /><span><strong>Load encrypted stock</strong><small>One item per line · fields in this order: {product.deliveryFields.join(" | ")}</small></span></div>
            <form action={addLocalInventory}><input type="hidden" name="product_key" value={product.productKey} /><textarea name="inventory_lines" rows={6} placeholder={product.deliveryFields.map((field) => field.toLowerCase()).join("|")} required /><button type="submit"><Boxes size={15} /> Add stock</button></form>
            <p>For custom fields, you can also use one JSON object per line, such as {`{"Email":"user@example.com","Password":"secret"}`}.</p>
          </div>
          <footer><span>{product.delivered} item(s) delivered historically</span>{product.stock > 0 && <form action={deleteAvailableInventory} className="stock-delete-form"><input type="hidden" name="product_key" value={product.productKey} /><input name="confirm_key" aria-label="Confirm product key" placeholder={`Type ${product.productKey}`} required /><button className="danger-button" type="submit"><Trash2 size={14} /> Delete all {product.stock} unsold item(s)</button></form>}</footer>
        </article>)}
      </section>
      {!products.length && <EmptyState label="No local products yet. Create the first one above." />}
      <div className="notice info"><PackagePlus size={20} /><div><strong>API products still work</strong><p>Configure the external supplier under Seller API and set its BDT prices under Prices. The bot merges those products with this local inventory automatically.</p></div></div>
    </>;
  } catch (error) {
    return <><PageHeader eyebrow="Inventory" title="Products & automatic delivery" description="Manage local products and encrypted stock." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>;
  }
}
