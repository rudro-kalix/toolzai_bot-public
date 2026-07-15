import { KeyRound, PlugZap, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getSellerApiConfig } from "@/lib/data";
import { sellerEndpointFields, sellerMappingFields } from "@/lib/seller-api";
import { resetSellerApi, saveSellerApi, testSellerApiConnection } from "./actions";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  seller_test_unauthorized: "The seller rejected the API key. Paste the new key and save again.",
  seller_test_failed: "The seller connection or response test failed. Check the URL, endpoint paths, and response mapping.",
  seller_api_key_required: "No seller API key is configured. Paste your key before saving.",
  seller_invalid_base_url: "Enter a public HTTPS base URL, such as https://www.quantumvault.me/api/v1.",
  seller_product_placeholder_required: "The single-product endpoint must contain {productKey}.",
  seller_invalid_config: "One or more fields are invalid. Check the endpoint and mapping values.",
};

export default async function ProviderPage({ searchParams }: {
  searchParams: Promise<{ saved?: string; tested?: string; reset?: string; products?: string; error?: string }>;
}) {
  const query = await searchParams;
  let config;
  try {
    config = await getSellerApiConfig();
  } catch (error) {
    return <><PageHeader eyebrow="Integration" title="Seller API" description="Change the supplier connection without editing or redeploying bot code." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>;
  }
  const count = Number(query.products || 0);
  return <>
    <PageHeader eyebrow="No-code integration" title="Seller API" description="Update the supplier URL, endpoints, authentication, and JSON field names. Saved changes are used by the bot on its very next API call." action={<form action={testSellerApiConnection}><button className="primary-action" type="submit"><PlugZap size={16} /> Test saved connection</button></form>} />
    {query.saved && <div className="notice success"><ShieldCheck size={20} /><div><strong>{query.reset ? "Quantum Vault defaults restored" : "Seller API updated"}</strong><p>Connection test passed and {count} live product{count === 1 ? " was" : "s were"} found. No bot redeploy is needed.</p></div></div>}
    {query.tested && <div className="notice success"><PlugZap size={20} /><div><strong>Connection is working</strong><p>The saved configuration returned {count} live product{count === 1 ? "" : "s"}.</p></div></div>}
    {query.error && <ErrorPanel message={errors[query.error] || errors.seller_invalid_config} />}
    <div className="notice info"><KeyRound size={20} /><div><strong>Your API key stays private</strong><p>The key is encrypted by the Cloudflare Worker before storage. This page can replace it but can never read it back. Leaving the key field blank keeps the current key.</p></div></div>

    <form className="provider-editor" action={saveSellerApi}>
      <section className="panel provider-section">
        <div className="panel-head"><div><span className="eyebrow">Connection</span><h2>Seller account</h2></div><StatusPill ok={config.api_key_configured}>{config.api_key_configured ? `Key ready · ${config.api_key_source}` : "Key missing"}</StatusPill></div>
        <div className="provider-grid">
          <label><span>Provider name</span><input name="provider_name" defaultValue={config.provider_name} required maxLength={80} /></label>
          <label className="wide"><span>Base URL</span><input name="base_url" type="url" defaultValue={config.base_url} required /></label>
          <label><span>Authentication header</span><input name="auth_header" defaultValue={config.auth_header} required /></label>
          <label><span>Authentication prefix</span><input name="auth_prefix" defaultValue={config.auth_prefix} placeholder="Blank for X-API-Key; Bearer if required" /></label>
          <label className="wide"><span>New API key</span><input name="api_key" type="password" autoComplete="new-password" placeholder={config.api_key_configured ? "Leave blank to keep the saved key" : "Paste the seller API key"} /><small>Never paste this key into public GitHub files.</small></label>
        </div>
      </section>

      <section className="panel provider-section">
        <div className="panel-head"><div><span className="eyebrow">Routes</span><h2>API endpoints</h2></div></div>
        <div className="provider-grid">{sellerEndpointFields.map(([key, label]) => <label key={key}><span>{label}</span><input name={`endpoint_${key}`} defaultValue={config.endpoints[key]} required /><small>{key === "product" ? "Keep {productKey} where the product key belongs." : "Starts with / and is added after the base URL."}</small></label>)}</div>
      </section>

      <details className="panel provider-section provider-advanced">
        <summary><span><strong>Advanced JSON mapping</strong><small>Open only when the seller renames response or request fields.</small></span><span>Configure</span></summary>
        <div className="notice warning"><div><strong>Match the seller documentation exactly</strong><p>Use dot paths for nested values, such as <code>data.products</code>. Comma-separated fallback paths are supported for order IDs and error messages.</p></div></div>
        <div className="provider-grid mapping-grid">{sellerMappingFields.map(([key, label, fallback]) => <label key={key}><span>{label}</span><input name={`mapping_${key}`} defaultValue={config.mapping[key] ?? fallback} /><small>Current default: <code>{fallback || "root"}</code></small></label>)}</div>
      </details>

      <div className="provider-actions"><button className="primary-action" type="submit"><Save size={16} /> Save and test safely</button><span>Last updated: {formatDate(config.updated_at)}</span></div>
    </form>
    <form className="provider-reset" action={resetSellerApi}><button type="submit"><RefreshCw size={15} /> Restore current Quantum Vault documentation defaults</button><small>Keeps your existing API key and tests the connection before saving.</small></form>
  </>;
}
