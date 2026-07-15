import { PageHeader } from "@/components/ui";
import { botContentFields } from "@/lib/bot-content";
import { getBotSettings } from "@/lib/data";
import { saveBotContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const rows = await getBotSettings();
  const saved = new Map(rows.map((row) => [row.key, row.value]));
  return <form className="content-editor" action={saveBotContent}>
    <PageHeader eyebrow="No-code controls" title="Bot setup content" description="Edit welcome/access messages, links, and payment accounts. Button responses now live inside the interactive Bot menu studio." action={<button className="primary-action" type="submit">Save all changes</button>} />
    <div className="notice info"><div><strong>✨ Attractive formatting is automatic</strong><p>The bot automatically adds a clear bold heading and keeps your emoji and spacing. Optional: write <code>**bold**</code>, <code>__italic__</code>, <code>`code`</code>, or <code>~~strike~~</code>.</p></div></div>
    <div className="notice info"><div><strong>Menu responses moved to Bot menu</strong><p>Open Bot menu and click any preview button to view and edit the exact response with live data.</p></div></div>
    <div className="content-grid">{botContentFields.map((field) => <label className="content-field" key={field.key}><span>{field.label}</span>{field.kind === "text" ? <textarea name={field.key} maxLength={2000} rows={6} defaultValue={saved.get(field.key) || field.defaultValue} /> : <input name={field.key} inputMode={field.kind === "phone" ? "numeric" : "url"} defaultValue={saved.get(field.key) || field.defaultValue} />}<small>{field.group} · {field.help}</small></label>)}</div>
  </form>;
}
