import { EmptyState, ErrorPanel, formatDate, PageHeader } from "@/components/ui";
import { getOrders, taka } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  try {
    const orders = await getOrders();
    return <><PageHeader eyebrow="Fulfilment" title="Customer orders" description="Recent purchases and the exact BDT amount charged." />
      <div className="table-panel"><div className="table-scroll"><table><thead><tr><th>Order</th><th>User</th><th>Product</th><th>Source</th><th>Delivery</th><th>Qty</th><th>Charged</th><th>Created</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><code>{order.provider_order_id || `#${order.id}`}</code></td><td><code>{order.telegram_id}</code></td><td><strong>{order.product_key}</strong>{order.variant_key && <small className="cell-sub">{order.variant_key}</small>}</td><td>{order.fulfillment_source || "api"}</td><td><strong>{order.delivery_status}</strong>{order.delivery_attempts != null && <small className="cell-sub">{order.delivery_attempts} attempt(s)</small>}</td><td>{order.quantity}</td><td className="money">{taka(order.charged_bdt)}</td><td>{formatDate(order.created_at)}</td></tr>)}</tbody></table></div>{!orders.length && <EmptyState label="No completed orders yet." />}</div></>;
  } catch (error) { return <><PageHeader eyebrow="Fulfilment" title="Customer orders" description="Recent purchases and charges." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>; }
}
