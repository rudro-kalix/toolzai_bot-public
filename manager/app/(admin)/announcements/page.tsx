import { EmptyState, ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getAnnouncements } from "@/lib/data";
import { Megaphone, Send } from "lucide-react";
import { createAnnouncement } from "./actions";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  try {
    const announcements = await getAnnouncements();
    return <>
      <PageHeader eyebrow="Broadcast" title="Announcements" description="Write once and the bot safely delivers the announcement to every saved user in controlled batches." />
      <div className="announcement-layout">
        <form className="panel announcement-form" action={createAnnouncement}>
          <div className="panel-head"><div><span className="eyebrow">New post</span><h2>Message all users</h2></div><Megaphone size={22} /></div>
          <label><span>Announcement</span><textarea name="message_text" maxLength={3500} rows={9} required placeholder="Write the announcement users should receive…" /><small>Formatting is automatic. You can optionally use **bold**, __italic__, `code`, and ~~strike~~. Line breaks and emoji are preserved safely.</small></label>
          <div className="announcement-button-fields">
            <label><span>Optional button label</span><input name="button_label" maxLength={64} placeholder="Open offer" /></label>
            <label><span>Optional HTTPS URL</span><input name="button_url" type="url" placeholder="https://…" /></label>
          </div>
          <button className="primary-action" type="submit"><Send size={16} /> Post announcement</button>
        </form>
        <div className="notice info announcement-note"><div><strong>Reliable delivery</strong><p>A queued campaign continues automatically every minute. Blocked or deleted Telegram accounts are recorded as failed without stopping delivery to everyone else.</p></div></div>
      </div>
      <div className="table-panel compact"><div className="panel-head"><h2>Delivery history</h2></div><div className="table-scroll"><table><thead><tr><th>Message</th><th>Status</th><th>Recipients</th><th>Delivered</th><th>Failed</th><th>Created</th></tr></thead><tbody>{announcements.map((item) => <tr key={item.id}><td><strong className="announcement-preview">{item.message_text}</strong>{item.button_label && <small className="cell-sub">Button: {item.button_label}</small>}</td><td><StatusPill ok={item.status === "completed"}>{item.status}</StatusPill></td><td>{item.recipient_count}</td><td>{item.delivered_count}</td><td>{item.failed_count}</td><td>{formatDate(item.created_at)}</td></tr>)}</tbody></table></div>{!announcements.length && <EmptyState label="No announcements have been posted." />}</div>
    </>;
  } catch (error) {
    return <><PageHeader eyebrow="Broadcast" title="Announcements" description="Message every bot user." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>;
  }
}
