import Link from "next/link";
import { Database, FileJson, KeyRound, Plus, RotateCcw, Save, Search, Settings2, ShieldCheck, Trash2, TriangleAlert } from "lucide-react";
import { EmptyState, ErrorPanel, formatDate, PageHeader } from "@/components/ui";
import { getFirestoreDocuments, getFirestoreStatus, type FirestoreDocument, type FirestoreStatus } from "@/lib/data";
import { deleteFirestoreDocument, rollbackFirebaseProject, saveFirestoreDocument, switchFirebaseProject } from "./actions";

export const dynamic = "force-dynamic";

type FirestoreQuery = {
  collection?: string;
  document?: string;
  new?: string;
  saved?: string;
  deleted?: string;
  project_switched?: string;
  project_rolled_back?: string;
  config_error?: string;
};

const firebaseErrors: Record<string, string> = {
  firebase_invalid_service_account: "That service-account JSON file is incomplete or invalid.",
  firebase_invalid_database: "Enter a valid Firestore database ID, usually (default).",
  firebase_invalid_collections: "Check the collection names. Collection names cannot contain slashes.",
  firebase_project_confirmation_failed: "The confirmation project ID did not match.",
  firebase_credentials_rejected: "Google rejected those service-account credentials.",
  firebase_connection_failed: "The new Firebase project could not be reached. The current project was left unchanged.",
  firebase_connection_not_found: "That saved Firebase connection is no longer available.",
  firebase_invalid_connection: "Choose a valid saved Firebase connection.",
  firebase_encryption_not_configured: "Encrypted Firebase configuration storage is not configured on the Worker.",
};

function firestoreUrl(collection: string, document?: string, create = false) {
  const query = new URLSearchParams({ collection });
  if (document) query.set("document", document);
  if (create) query.set("new", "1");
  return `/firestore?${query.toString()}`;
}

function newDocumentTemplate(collection: string) {
  if (collection === "transactions" || collection === "notifications") {
    return { transactionId: "", amount: 0, provider: "bkash" };
  }
  if (collection === "transaction_claims") {
    return { transactionId: "", status: "used" };
  }
  return {};
}

function DocumentEditor({ collection, document, create }: { collection: string; document?: FirestoreDocument; create: boolean }) {
  const fields = document?.fields || newDocumentTemplate(collection);
  return <section className="panel firestore-editor">
    <div className="panel-head"><div><span className="eyebrow">{create ? "New document" : "Document editor"}</span><h2>{create ? `Add to ${collection}` : document?.id}</h2></div><FileJson size={22} /></div>
    <form action={saveFirestoreDocument} className="firestore-edit-form">
      <input type="hidden" name="collection" value={collection} />
      <input type="hidden" name="create" value={create ? "1" : "0"} />
      <input type="hidden" name="update_time" value={document?.updateTime || ""} />
      <label>Document ID<input name="document_id" defaultValue={document?.id || ""} readOnly={!create} placeholder="Enter a unique ID" required /></label>
      <label>Fields (JSON)<textarea name="fields_json" rows={18} defaultValue={JSON.stringify(fields, null, 2)} spellCheck={false} required /><small>Strings, numbers, booleans, null, arrays, and nested objects are supported. Existing Firestore timestamps appear as <code>{`{"$timestamp":"..."}`}</code> so their type stays intact.</small></label>
      <button className="primary-action" type="submit"><Save size={16} /> {create ? "Create document" : "Save changes"}</button>
    </form>
    {document && <div className="firestore-metadata"><span>Created {formatDate(document.createTime)}</span><span>Updated {formatDate(document.updateTime)}</span></div>}
    {document && <form action={deleteFirestoreDocument} className="firestore-delete-form">
      <input type="hidden" name="collection" value={collection} />
      <input type="hidden" name="document_id" value={document.id} />
      <input type="hidden" name="update_time" value={document.updateTime} />
      <div><strong>Delete this document</strong><small>This cannot be undone. Type the document ID to confirm.</small></div>
      <input name="confirm_document_id" aria-label="Confirm document ID" placeholder={`Type ${document.id}`} required />
      <button className="danger-button" type="submit"><Trash2 size={15} /> Delete</button>
    </form>}
  </section>;
}

function FirebaseProjectSettings({ status, query }: { status: FirestoreStatus; query: FirestoreQuery }) {
  const previous = status.connections.filter((connection) => connection.status !== "active");
  return <>
    {query.project_switched === "1" && <div className="notice success"><ShieldCheck size={20} /><div><strong>Firebase project switched</strong><p>The bot and website are now using {status.projectId}. The previous connection was saved for rollback.</p></div></div>}
    {query.project_rolled_back === "1" && <div className="notice success"><RotateCcw size={20} /><div><strong>Firebase project restored</strong><p>{status.projectId} is active again.</p></div></div>}
    {query.config_error && <div className="notice danger"><TriangleAlert size={20} /><div><strong>Project was not changed</strong><p>{firebaseErrors[query.config_error] || firebaseErrors.firebase_connection_failed}</p></div></div>}
    <section className="panel firebase-project-card">
      <div className="firebase-project-current">
        <span className="service-icon"><Database size={21} /></span>
        <div><span className="eyebrow">Active Firebase project</span><h2>{status.projectId}</h2><p>{status.clientEmail || "Service account from Worker environment"} · {status.databaseId}</p></div>
        <span className="firebase-source">{status.source === "website" ? "Website managed" : "Worker default"}</span>
      </div>
      <details className="firebase-switcher" open={Boolean(query.config_error)}>
        <summary><span><Settings2 size={17} /><strong>Change the entire Firebase project</strong></span><small>The new connection is tested before anything changes.</small></summary>
        <form action={switchFirebaseProject} className="firebase-project-form">
          <div className="notice warning"><KeyRound size={19} /><div><strong>Private, encrypted credential storage</strong><p>Paste a Firebase service-account JSON key. It is sent only to the private Worker, encrypted before storage, and never returned to your browser.</p></div></div>
          <label className="wide">Service-account JSON<textarea name="service_account_json" rows={9} placeholder={'{"type":"service_account","project_id":"your-project",...}'} autoComplete="off" spellCheck={false} required /></label>
          <label>Confirm new project ID<input name="confirm_project_id" placeholder="Must match project_id in the JSON" autoComplete="off" required /></label>
          <label>Firestore database ID<input name="database_id" defaultValue="(default)" required /></label>
          <label>Payment collections<input name="payments_collections" defaultValue={status.paymentsCollections.join(", ")} required /></label>
          <label>Claims collection<input name="claims_collection" defaultValue={status.claimsCollection} required /></label>
          <label>Referrals collection<input name="referrals_collection" defaultValue={status.referralsCollection} required /></label>
          <label>Additional manager collections<input name="manager_collections" defaultValue={status.managerCollections.join(", ")} placeholder="Optional, comma separated" /></label>
          <button className="primary-action wide" type="submit"><ShieldCheck size={16} /> Test and activate project</button>
        </form>
      </details>
      {previous.length > 0 && <div className="firebase-history">
        <div><span className="eyebrow">Recovery connections</span><h3>Rollback to a previous project</h3></div>
        {previous.map((connection) => <form action={rollbackFirebaseProject} key={connection.id}>
          <input type="hidden" name="connection_id" value={connection.id} />
          <input type="hidden" name="project_id" value={connection.projectId} />
          <span><strong>{connection.projectId}</strong><small>{connection.clientEmail} · Last active {formatDate(connection.activatedAt)}</small></span>
          <input name="confirm_project_id" aria-label={`Type ${connection.projectId} to confirm rollback`} placeholder={`Type ${connection.projectId}`} required />
          <button type="submit"><RotateCcw size={14} /> Test & restore</button>
        </form>)}
      </div>}
    </section>
  </>;
}

export default async function FirestorePage({ searchParams }: { searchParams: Promise<FirestoreQuery> }) {
  const query = await searchParams;
  try {
    const status = await getFirestoreStatus();
    if (!status.projectId) throw new Error("FIREBASE_PROJECT_ID is not configured on the bot Worker.");
    if (!status.collections.length) throw new Error("No Firestore collections are configured for the website.");

    const collection = status.collections.includes(query.collection || "") ? String(query.collection) : status.collections[0];
    let documents: FirestoreDocument[] = [];
    let dataError = "";
    try { documents = await getFirestoreDocuments(collection); }
    catch (error) { dataError = error instanceof Error ? error.message : "The active Firestore project could not be loaded."; }
    let selected = query.document ? documents.find((item) => item.id === query.document) : undefined;
    if (query.document && !selected && !dataError) selected = (await getFirestoreDocuments(collection, query.document))[0];
    const create = query.new === "1";

    return <>
      <PageHeader eyebrow="Firebase" title="Firestore data" description="Browse, search, create, edit, and delete Firestore documents without leaving the bot manager." action={<Link className="primary-action" href={firestoreUrl(collection, undefined, true)}><Plus size={16} /> New document</Link>} />
      <div className="notice success"><ShieldCheck size={20} /><div><strong>Private connection</strong><p>The website talks to Firestore through the authenticated Worker. Firebase credentials are never sent to your browser.</p></div></div>
      <FirebaseProjectSettings status={status} query={query} />
      {query.saved === "1" && <div className="notice success"><Save size={20} /><div><strong>Document saved</strong><p>Your Firestore change is live.</p></div></div>}
      {query.deleted === "1" && <div className="notice success"><Trash2 size={20} /><div><strong>Document deleted</strong><p>The selected document was removed.</p></div></div>}
      <section className="firestore-toolbar panel">
        <div><Database size={20} /><span><small>Connected project</small><strong>{status.projectId}</strong><code>{status.databaseId}</code></span></div>
        <form method="get">
          <label>Collection<select name="collection" defaultValue={collection}>{status.collections.map((name) => <option value={name} key={name}>{name}</option>)}</select></label>
          <label>Document ID<input name="document" defaultValue={query.document || ""} placeholder="Optional exact ID" /></label>
          <button type="submit"><Search size={15} /> Open</button>
        </form>
      </section>
      {dataError ? <ErrorPanel message={`${dataError} You can switch or restore the Firebase project above.`} /> :
      <div className="firestore-layout">
        <aside className="panel firestore-browser">
          <div className="panel-head"><div><span className="eyebrow">Collection</span><h2>{collection}</h2></div><span>{documents.length} shown</span></div>
          <div className="firestore-document-list">{documents.map((document) => <Link className={selected?.id === document.id && !create ? "active" : ""} href={firestoreUrl(collection, document.id)} key={document.id}><FileJson size={16} /><span><strong>{document.id}</strong><small>{Object.keys(document.fields).length} field(s) · {formatDate(document.updateTime)}</small></span></Link>)}</div>
          {!documents.length && <EmptyState label="This collection has no documents." />}
          {documents.length === 50 && <small className="firestore-limit-note">Showing the first 50 documents. Use exact document ID search to open another one.</small>}
        </aside>
        {create ? <DocumentEditor collection={collection} create /> : selected ? <DocumentEditor collection={collection} document={selected} create={false} /> : query.document ? <section className="panel"><EmptyState label={`No document named ${query.document} was found.`} /></section> : <section className="panel"><EmptyState label="Choose a document to edit, or create a new one." /></section>}
      </div>}
    </>;
  } catch (error) {
    return <><PageHeader eyebrow="Firebase" title="Firestore data" description="Manage Firestore from this private website." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>;
  }
}
