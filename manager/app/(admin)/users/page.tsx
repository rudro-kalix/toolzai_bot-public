import { EmptyState, ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getUsers, taka } from "@/lib/data";
import { refreshProfiles, updateBalance } from "./actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  try {
    const users = await getUsers();
    return <><PageHeader eyebrow="Audience" title="Bot users" description="Names, usernames, wallet balances, and access status in one place." action={<form action={refreshProfiles}><button className="primary-action" type="submit">Refresh names</button></form>} />
      <div className="table-panel users-panel"><div className="table-scroll"><table className="users-table"><thead><tr><th>User</th><th>Telegram ID</th><th>Balance</th><th>Language</th><th>Verified</th><th>Joined</th></tr></thead><tbody>{users.map((user) => {
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
        const displayName = fullName || (user.username ? `@${user.username}` : "Name not captured");
        return <tr key={user.telegram_id}>
          <td data-label="User"><strong>{displayName}</strong>{user.username && fullName ? <span className="cell-sub">@{user.username}</span> : null}</td>
          <td data-label="Telegram ID"><code>{user.telegram_id}</code></td>
          <td data-label="Balance"><form className="balance-form" action={updateBalance}><input type="hidden" name="telegram_id" value={user.telegram_id} /><label className="sr-only" htmlFor={`balance-${user.telegram_id}`}>Balance for {displayName}</label><input id={`balance-${user.telegram_id}`} name="balance_bdt" type="number" min="0" max="100000000" step="1" defaultValue={user.balance_bdt} /><button type="submit">Save</button><span>Current: {taka(user.balance_bdt)}</span></form></td>
          <td data-label="Language">{user.language === "bn" ? "বাংলা" : "English"}</td>
          <td data-label="Verified"><StatusPill ok={Boolean(user.human_verified)}>{user.human_verified ? "Verified" : "Pending"}</StatusPill></td>
          <td data-label="Joined">{formatDate(user.created_at)}</td>
        </tr>;
      })}</tbody></table></div>{!users.length && <EmptyState label="No users yet." />}</div></>;
  } catch (error) { return <><PageHeader eyebrow="Audience" title="Bot users" description="User balances and access status." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>; }
}
