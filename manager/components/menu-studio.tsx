"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowUp, Check, ChevronRight, Copy, Eye, GripVertical, Languages,
  Loader2, MonitorSmartphone, PackageOpen, Plus, Redo2, Rocket, RotateCcw, Save, Send, Trash2, Undo2,
} from "lucide-react";
import {
  menuActionOptions,
  type MenuActionPreview,
  type MenuButton,
  type MenuDocument,
  type ProductButton,
  type MenuResponse,
  type MenuScreen,
  type MenuStudioState,
  type MenuVersion,
} from "@/lib/menu-studio";

type SaveStatus = "saved" | "saving" | "error";
type MobileTab = "build" | "preview" | "edit";
type PreviewRequest = { action: MenuButton["action"]; value?: string; callbackData?: string };

const errorLabels: Record<string, string> = {
  stale_menu_draft: "This draft changed in another tab. Refresh the page before editing again.",
  menu_duplicate_button_label: "Every English and Bangla button label must be unique.",
  menu_invalid_screen_target: "One button points to a menu screen that no longer exists.",
  menu_invalid_url: "Link buttons must use a valid https:// address.",
  menu_invalid_message: "Message buttons need a response of 1–2,000 characters.",
  menu_invalid_response: "Every bot response needs 1–3,800 characters in both languages.",
  menu_invalid_product_button_label: "Every product in-chat button needs a label of 1–64 characters in both languages.",
  menu_invalid_product_button_key: "A product in-chat button has an invalid or duplicate product key.",
  menu_too_many_product_buttons: "The product keyboard can contain up to 50 configured products.",
  menu_too_many_buttons: "The menu can contain up to 50 buttons.",
  menu_too_many_screen_buttons: "A screen can contain up to 20 buttons.",
};

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return errorLabels[message] || message.replaceAll("_", " ");
}

async function menuRequest(method: "PUT" | "POST", body: Record<string, unknown>) {
  const response = await fetch("/api/menu", {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json() as { ok?: boolean; error?: string; row?: Record<string, unknown> };
  if (!response.ok || !payload.ok) throw new Error(payload.error || "Menu request failed.");
  return payload.row || {};
}

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function keyboardRows(buttons: MenuButton[]) {
  const rows: MenuButton[][] = [];
  let pending: MenuButton[] = [];
  const flush = () => {
    if (pending.length) rows.push(pending);
    pending = [];
  };
  for (const button of buttons.filter((item) => item.enabled)) {
    if (button.width === "full") {
      flush();
      rows.push([button]);
    } else {
      pending.push(button);
      if (pending.length === 2) flush();
    }
  }
  flush();
  return rows;
}

function productInlinePreviewRows(menu: MenuDocument, catalog: MenuStudioState["productCatalog"], language: "en" | "bn") {
  const productMap = new Map(catalog.map((product) => [product.product_key, product]));
  const rows: MenuActionPreview["keyboard"] = [];
  for (const item of menu.product_buttons.items) {
    const product = productMap.get(item.product_key);
    if (!product || !item.enabled) continue;
    const base = language === "bn" ? item.label_bn : item.label_en;
    const stock = item.show_stock ? language === "bn" ? ` (${product.stock} স্টক)` : ` (${product.stock} in stock)` : "";
    rows.push([{ label: `${base}${stock}`.slice(0, 64), kind: "callback", value: `product:${item.product_key}` }]);
    if (rows.length >= 30) break;
  }
  if (menu.product_buttons.refresh.enabled) rows.push([{
    label: language === "bn" ? menu.product_buttons.refresh.label_bn : menu.product_buttons.refresh.label_en,
    kind: "callback",
    value: "products:refresh",
  }]);
  return rows;
}

function versionDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

export function MenuStudio({ initial }: { initial: MenuStudioState }) {
  const [menu, setMenu] = useState(initial.menu);
  const [selectedScreenId, setSelectedScreenId] = useState("main");
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(initial.menu.screens[0]?.buttons[0]?.id || null);
  const [previewScreenId, setPreviewScreenId] = useState("main");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [preview, setPreview] = useState<MenuActionPreview>({
    template_key: "main_menu",
    text: initial.menu.responses.main_menu?.text_en || "Use the menu buttons below.",
    variables: {},
    keyboard: [],
    keyboard_type: "none",
    screen_id: "main",
    warning: null,
  });
  const [previewLoading, setPreviewLoading] = useState(false);
  const [lastPreviewRequest, setLastPreviewRequest] = useState<PreviewRequest>({ action: "main_menu" });
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(initial.draftRevision);
  const [publishedRevision, setPublishedRevision] = useState(initial.publishedRevision);
  const [activeVersionId, setActiveVersionId] = useState(initial.activeVersionId);
  const [versions, setVersions] = useState(initial.versions);
  const [past, setPast] = useState<MenuDocument[]>([]);
  const [future, setFuture] = useState<MenuDocument[]>([]);
  const [draggedButtonId, setDraggedButtonId] = useState<string | null>(null);
  const [selectedInlineProductKey, setSelectedInlineProductKey] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("build");
  const revisionRef = useRef(initial.draftRevision);
  const lastSavedRef = useRef(initial.draftUpdatedAt ? JSON.stringify(initial.menu) : "");
  const saveChainRef = useRef<Promise<number>>(Promise.resolve(initial.draftRevision));

  const selectedScreen = menu.screens.find((screen) => screen.id === selectedScreenId) || menu.screens[0];
  const selectedButton = selectedScreen?.buttons.find((button) => button.id === selectedButtonId) || null;
  const previewScreen = menu.screens.find((screen) => screen.id === previewScreenId) || menu.screens[0];
  const activeResponseKey = preview.template_key;
  const activeResponse = activeResponseKey ? menu.responses[activeResponseKey] : null;
  const activeResponseMeta = activeResponseKey
    ? initial.responseCatalog.find((item) => item.key === activeResponseKey) || null
    : null;
  const totalButtons = menu.screens.reduce((total, screen) => total + screen.buttons.length, 0);
  const selectedProductButton = selectedInlineProductKey && selectedInlineProductKey !== "__refresh__"
    ? menu.product_buttons.items.find((item) => item.product_key === selectedInlineProductKey) || null
    : null;
  const selectedProductCatalog = selectedProductButton
    ? initial.productCatalog.find((item) => item.product_key === selectedProductButton.product_key) || null
    : null;
  const showProductButtonEditor = lastPreviewRequest.action === "products";
  const hasUnpublishedChanges = revision !== publishedRevision || JSON.stringify(menu) !== lastSavedRef.current;

  const renderedPreviewText = useMemo(() => {
    if (!activeResponse) return preview.text;
    let text = language === "bn" ? activeResponse.text_bn : activeResponse.text_en;
    for (const [name, value] of Object.entries(preview.variables || {})) {
      text = text.replaceAll(`{{${name}}}`, String(value ?? ""));
    }
    return text;
  }, [activeResponse, language, preview.text, preview.variables]);

  const displayedInlineKeyboard = useMemo(() => preview.template_key === "products"
    ? productInlinePreviewRows(menu, initial.productCatalog, language)
    : preview.keyboard, [initial.productCatalog, language, menu, preview.keyboard, preview.template_key]);

  const applyMenu = useCallback((next: MenuDocument) => {
    setMenu((current) => {
      setPast((items) => [...items.slice(-39), current]);
      return next;
    });
    setFuture([]);
    setNotice("");
    setError("");
  }, []);

  const persistMenu = useCallback((document: MenuDocument) => {
    const serialized = JSON.stringify(document);
    if (serialized === lastSavedRef.current) return Promise.resolve(revisionRef.current);
    const operation = saveChainRef.current.then(async () => {
      setStatus("saving");
      const row = await menuRequest("PUT", { menu: document, expectedRevision: revisionRef.current });
      const nextRevision = Number(row.revision || revisionRef.current + 1);
      revisionRef.current = nextRevision;
      lastSavedRef.current = serialized;
      setRevision(nextRevision);
      setStatus("saved");
      setError("");
      return nextRevision;
    });
    saveChainRef.current = operation.catch((reason) => {
      setStatus("error");
      setError(friendlyError(reason));
      return revisionRef.current;
    });
    return operation;
  }, []);

  useEffect(() => {
    const serialized = JSON.stringify(menu);
    if (serialized === lastSavedRef.current) return;
    const timer = window.setTimeout(() => { void persistMenu(menu); }, 800);
    return () => window.clearTimeout(timer);
  }, [menu, persistMenu]);

  const updateScreen = (changes: Partial<MenuScreen>) => {
    applyMenu({ ...menu, screens: menu.screens.map((screen) => screen.id === selectedScreen.id ? { ...screen, ...changes } : screen) });
  };

  const updateButton = (changes: Partial<MenuButton>) => {
    if (!selectedButton) return;
    updateScreen({ buttons: selectedScreen.buttons.map((button) => button.id === selectedButton.id ? { ...button, ...changes } : button) });
  };

  const updateResponse = (changes: Partial<MenuResponse>) => {
    if (!activeResponseKey || !activeResponse) return;
    applyMenu({
      ...menu,
      responses: {
        ...menu.responses,
        [activeResponseKey]: { ...activeResponse, ...changes },
      },
    });
  };

  const updateProductButton = (productKey: string, changes: Partial<ProductButton>) => {
    applyMenu({
      ...menu,
      product_buttons: {
        ...menu.product_buttons,
        items: menu.product_buttons.items.map((item) => item.product_key === productKey ? { ...item, ...changes } : item),
      },
    });
  };

  const updateProductRefresh = (changes: Partial<MenuDocument["product_buttons"]["refresh"]>) => {
    applyMenu({
      ...menu,
      product_buttons: {
        ...menu.product_buttons,
        refresh: { ...menu.product_buttons.refresh, ...changes },
      },
    });
  };

  const moveProductButton = (productKey: string, direction: -1 | 1) => {
    const from = menu.product_buttons.items.findIndex((item) => item.product_key === productKey);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= menu.product_buttons.items.length) return;
    const items = [...menu.product_buttons.items];
    [items[from], items[to]] = [items[to], items[from]];
    applyMenu({ ...menu, product_buttons: { ...menu.product_buttons, items } });
  };

  const openProductButtonEditor = (productKey?: string) => {
    setSelectedInlineProductKey(productKey || menu.product_buttons.items[0]?.product_key || "__refresh__");
    setMobileTab("edit");
  };

  const addScreen = () => {
    if (menu.screens.length >= 12) return setError("You can create up to 12 menu screens.");
    const number = menu.screens.length + 1;
    const screen: MenuScreen = {
      id: makeId("screen"),
      title_en: `Menu ${number}`,
      title_bn: `মেনু ${number}`,
      buttons: [],
    };
    applyMenu({ ...menu, screens: [...menu.screens, screen] });
    setSelectedScreenId(screen.id);
    setPreviewScreenId(screen.id);
    setSelectedButtonId(null);
  };

  const removeScreen = () => {
    if (selectedScreen.id === "main") return setError("The main menu cannot be deleted.");
    const referenced = menu.screens.some((screen) => screen.buttons.some((button) => button.action === "screen" && button.value === selectedScreen.id));
    if (referenced) return setError("Move or edit buttons that open this screen before deleting it.");
    if (!window.confirm(`Delete “${selectedScreen.title_en}”?`)) return;
    applyMenu({ ...menu, screens: menu.screens.filter((screen) => screen.id !== selectedScreen.id) });
    setSelectedScreenId("main");
    setPreviewScreenId("main");
    setSelectedButtonId(null);
  };

  const addButton = () => {
    if (totalButtons >= 50 || selectedScreen.buttons.length >= 20) return setError("This menu has reached its button limit.");
    let number = totalButtons + 1;
    while (menu.screens.some((screen) => screen.buttons.some((button) => button.label_en === `New button ${number}`))) number += 1;
    const button: MenuButton = {
      id: makeId("button"),
      label_en: `New button ${number}`,
      label_bn: `নতুন বাটন ${number}`,
      action: "message",
      value: "Write the response for this button.",
      width: "half",
      enabled: true,
    };
    updateScreen({ buttons: [...selectedScreen.buttons, button] });
    setSelectedButtonId(button.id);
    setMobileTab("edit");
  };

  const duplicateButton = () => {
    if (!selectedButton || totalButtons >= 50 || selectedScreen.buttons.length >= 20) return;
    const copy = {
      ...selectedButton,
      id: makeId("button"),
      label_en: `${selectedButton.label_en} copy`.slice(0, 64),
      label_bn: `${selectedButton.label_bn} কপি`.slice(0, 64),
    };
    updateScreen({ buttons: [...selectedScreen.buttons, copy] });
    setSelectedButtonId(copy.id);
  };

  const deleteButton = () => {
    if (!selectedButton || !window.confirm(`Delete “${selectedButton.label_en}”?`)) return;
    updateScreen({ buttons: selectedScreen.buttons.filter((button) => button.id !== selectedButton.id) });
    setSelectedButtonId(null);
  };

  const moveButton = (direction: -1 | 1) => {
    if (!selectedButton) return;
    const from = selectedScreen.buttons.findIndex((button) => button.id === selectedButton.id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= selectedScreen.buttons.length) return;
    const buttons = [...selectedScreen.buttons];
    [buttons[from], buttons[to]] = [buttons[to], buttons[from]];
    updateScreen({ buttons });
  };

  const dropButton = (targetId: string) => {
    if (!draggedButtonId || draggedButtonId === targetId) return;
    const buttons = [...selectedScreen.buttons];
    const from = buttons.findIndex((button) => button.id === draggedButtonId);
    const to = buttons.findIndex((button) => button.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = buttons.splice(from, 1);
    buttons.splice(to, 0, moved);
    updateScreen({ buttons });
    setDraggedButtonId(null);
  };

  const undo = () => {
    const previous = past.at(-1);
    if (!previous) return;
    setFuture((items) => [menu, ...items].slice(0, 40));
    setPast((items) => items.slice(0, -1));
    setMenu(previous);
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setPast((items) => [...items.slice(-39), menu]);
    setFuture((items) => items.slice(1));
    setMenu(next);
  };

  const publishMenu = async () => {
    try {
      setNotice("Publishing…");
      const savedRevision = await persistMenu(menu);
      const row = await menuRequest("POST", { action: "publish", expectedRevision: savedRevision, note: "Published from visual menu studio" });
      const version = row as unknown as MenuVersion;
      setActiveVersionId(String(row.id));
      setPublishedRevision(savedRevision);
      setVersions((items) => [version, ...items.filter((item) => item.id !== version.id)].slice(0, 20));
      setNotice("Published. New bot conversations now use this menu.");
      setError("");
    } catch (reason) {
      setNotice("");
      setError(friendlyError(reason));
    }
  };

  const testMenu = async () => {
    try {
      setNotice("Sending test to Telegram…");
      await menuRequest("POST", {
        action: "test",
        menu,
        language,
        screenId: previewScreen.id,
        buttonAction: lastPreviewRequest.action,
        buttonValue: lastPreviewRequest.value || "",
        callbackData: lastPreviewRequest.callbackData || "",
      });
      setNotice("The response currently visible in the phone was sent privately to the admin Telegram account.");
      setError("");
    } catch (reason) {
      setNotice("");
      setError(friendlyError(reason));
    }
  };

  const rollback = async (version: MenuVersion) => {
    if (!window.confirm(`Restore revision ${version.revision} and make it live?`)) return;
    try {
      setNotice("Restoring version…");
      const row = await menuRequest("POST", { action: "rollback", versionId: version.id });
      const restored = JSON.parse(String(row.menu_json)) as MenuDocument;
      const nextRevision = Number(row.revision);
      setMenu(restored);
      setPast([]);
      setFuture([]);
      revisionRef.current = nextRevision;
      lastSavedRef.current = JSON.stringify(restored);
      setRevision(nextRevision);
      setPublishedRevision(nextRevision);
      setActiveVersionId(version.id);
      setSelectedScreenId("main");
      setPreviewScreenId("main");
      setSelectedButtonId(restored.screens[0]?.buttons[0]?.id || null);
      setNotice(`Revision ${version.revision} is live again.`);
      setError("");
    } catch (reason) {
      setNotice("");
      setError(friendlyError(reason));
    }
  };

  const previewRows = useMemo(() => keyboardRows(previewScreen.buttons), [previewScreen]);

  const resolvePreview = async (request: PreviewRequest, requestedLanguage = language) => {
    setPreviewLoading(true);
    setLastPreviewRequest(request);
    setError("");
    try {
      const row = await menuRequest("POST", {
        action: "preview",
        menu,
        language: requestedLanguage,
        buttonAction: request.action,
        buttonValue: request.value || "",
        callbackData: request.callbackData || "",
      });
      const next = row as unknown as MenuActionPreview;
      setPreview(next);
      if (next.screen_id) setPreviewScreenId(next.screen_id);
    } catch (reason) {
      setError(friendlyError(reason));
    } finally {
      setPreviewLoading(false);
    }
  };

  const clickPreviewButton = (button: MenuButton) => {
    setSelectedScreenId(previewScreen.id);
    setSelectedButtonId(button.id);
    setSelectedInlineProductKey(null);
    void resolvePreview({ action: button.action, value: button.value });
  };

  const clickInlinePreviewButton = (kind: string, value: string) => {
    if (kind !== "callback") return;
    if (value.startsWith("product:")) openProductButtonEditor(value.slice("product:".length));
    if (value === "products:refresh") openProductButtonEditor("__refresh__");
    void resolvePreview({ ...lastPreviewRequest, callbackData: value });
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "bn" : "en";
    setLanguage(next);
    void resolvePreview(lastPreviewRequest, next);
  };

  return <div className="menu-studio-shell">
    <section className="studio-commandbar">
      <div className="studio-state">
        <span className={`studio-dot ${hasUnpublishedChanges ? "draft" : "live"}`} />
        <div><strong>{hasUnpublishedChanges ? "Draft changes" : "Live menu"}</strong><small>{status === "saving" ? "Autosaving…" : status === "error" ? "Save failed" : `Revision ${revision}`}</small></div>
      </div>
      <div className="studio-actions">
        <button onClick={undo} disabled={!past.length} title="Undo"><Undo2 size={16} /></button>
        <button onClick={redo} disabled={!future.length} title="Redo"><Redo2 size={16} /></button>
        <button className="studio-test" onClick={() => void testMenu()}><Send size={16} /> Test in Telegram</button>
        <button className="studio-publish" onClick={() => void publishMenu()}><Rocket size={16} /> Publish</button>
      </div>
    </section>

    {error && <div className="notice danger studio-notice"><span>!</span><div><strong>Menu needs attention</strong><p>{error}</p></div></div>}
    {notice && <div className="notice success studio-notice"><Check size={18} /><div><strong>{notice}</strong></div></div>}

    <div className="studio-mobile-tabs" role="tablist">
      {(["build", "preview", "edit"] as MobileTab[]).map((tab) => <button className={mobileTab === tab ? "active" : ""} key={tab} onClick={() => setMobileTab(tab)}>{tab}</button>)}
    </div>

    <section className="menu-studio-grid" data-mobile-tab={mobileTab}>
      <aside className="studio-panel studio-builder">
        <div className="studio-panel-head"><div><span>Structure</span><h2>Menu screens</h2></div><button onClick={addScreen} title="Add screen"><Plus size={17} /></button></div>
        <div className="screen-list">
          {menu.screens.map((screen) => <button className={screen.id === selectedScreen.id ? "active" : ""} key={screen.id} onClick={() => { setSelectedScreenId(screen.id); setSelectedButtonId(screen.buttons[0]?.id || null); }}>
            <MonitorSmartphone size={16} /><span><strong>{screen.title_en}</strong><small>{screen.buttons.length} buttons</small></span><ChevronRight size={15} />
          </button>)}
        </div>
        <div className="screen-settings">
          <label>Screen title — English<input value={selectedScreen.title_en} maxLength={500} onChange={(event) => updateScreen({ title_en: event.target.value })} /></label>
          <label>Screen title — বাংলা<input value={selectedScreen.title_bn} maxLength={500} onChange={(event) => updateScreen({ title_bn: event.target.value })} /></label>
          {selectedScreen.id !== "main" && <button className="studio-text-danger" onClick={removeScreen}><Trash2 size={14} /> Delete this screen</button>}
        </div>
        <div className="studio-panel-head button-heading"><div><span>Layout</span><h2>Buttons</h2></div><button onClick={addButton} title="Add button"><Plus size={17} /></button></div>
        <div className="studio-button-list">
          {selectedScreen.buttons.map((button, index) => <button
            className={`${button.id === selectedButton?.id ? "active" : ""} ${button.enabled ? "" : "disabled"}`}
            draggable key={button.id}
            onDragStart={() => setDraggedButtonId(button.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropButton(button.id)}
            onClick={() => { setSelectedButtonId(button.id); setMobileTab("edit"); }}>
            <GripVertical size={15} /><span><strong>{button.label_en}</strong><small>{button.action} · {button.width}</small></span><em>{index + 1}</em>
          </button>)}
          {!selectedScreen.buttons.length && <div className="studio-empty">No buttons on this screen yet.</div>}
        </div>
      </aside>

      <section className="studio-panel studio-preview">
        <div className="studio-panel-head"><div><span>Interactive bot</span><h2>Live Telegram flow</h2></div><button className="language-toggle" onClick={toggleLanguage}><Languages size={15} /> {language === "en" ? "English" : "বাংলা"}</button></div>
        <div className="telegram-phone">
          <div className="telegram-top"><span className="telegram-avatar">T</span><div><strong>ToolzAI Bot</strong><small>bot</small></div><i /></div>
          <div className="telegram-chat">
            <div className="telegram-bubble">{language === "bn" ? previewScreen.title_bn : previewScreen.title_en}<time>now</time></div>
            <div className="telegram-response-stack">
              <div className="telegram-bubble outcome">{previewLoading ? <span className="preview-loading"><Loader2 size={14} /> Loading real bot content…</span> : renderedPreviewText}<time>now</time></div>
              {!previewLoading && preview.keyboard_type === "inline" && displayedInlineKeyboard.length > 0 && <div className="telegram-inline-keyboard">
                {displayedInlineKeyboard.map((row, index) => <div className="telegram-inline-row" key={index}>{row.map((button, buttonIndex) => <button
                  className={button.kind === "disabled" ? "disabled" : ""}
                  key={`${button.value}-${buttonIndex}`}
                  onClick={() => clickInlinePreviewButton(button.kind, button.value)}
                  title={button.kind === "url" ? button.value : undefined}
                >{button.label}</button>)}</div>)}
              </div>}
              {preview.warning && <div className="preview-warning">{preview.warning}</div>}
            </div>
          </div>
          <div className="telegram-keyboard">
            {previewRows.map((row, index) => <div className="telegram-keyboard-row" key={index}>{row.map((button) => <button key={button.id} onClick={() => clickPreviewButton(button)}>{language === "bn" ? button.label_bn : button.label_en}</button>)}</div>)}
            {previewScreen.id !== "main" && <div className="telegram-keyboard-row"><button onClick={() => setPreviewScreenId("main")}>↩ Main menu</button></div>}
          </div>
        </div>
        <div className="studio-help-row"><p className="studio-help"><Eye size={14} /> Live content and keyboards are loaded safely. Purchases and payments are never executed here.</p>{showProductButtonEditor
          ? <button onClick={() => openProductButtonEditor()}>Edit in-chat buttons</button>
          : activeResponse && <button onClick={() => setMobileTab("edit")}>Edit this response</button>}</div>
      </section>

      <aside className="studio-panel studio-inspector">
        <div className="studio-panel-head"><div><span>Inspector</span><h2>{selectedInlineProductKey ? "Edit in-chat button" : activeResponse ? "Edit live response" : selectedButton ? "Edit button" : "Select a button"}</h2></div>{status === "saving" ? <Save size={16} className="spin" /> : <Check size={16} />}</div>
        {showProductButtonEditor && <section className="inline-button-inspector">
          <div className="response-heading"><div><span>Product keyboard</span><strong>In-chat buttons</strong></div><span className="response-live-badge">Versioned</span></div>
          <p>Edit the circled Telegram buttons here. Product actions stay safely connected to their original product.</p>
          <label className="toggle-field inline-auto-toggle"><input type="checkbox" checked={menu.product_buttons.show_new_products} onChange={(event) => applyMenu({
            ...menu,
            product_buttons: { ...menu.product_buttons, show_new_products: event.target.checked },
          })} /><span>Automatically show new provider products</span></label>
          <div className="inline-button-list">
            {menu.product_buttons.items.map((item, index) => {
              const catalog = initial.productCatalog.find((product) => product.product_key === item.product_key);
              return <button className={`${selectedInlineProductKey === item.product_key ? "active" : ""} ${item.enabled ? "" : "disabled"}`} key={item.product_key} onClick={() => openProductButtonEditor(item.product_key)}>
                <PackageOpen size={14} /><span><strong>{language === "bn" ? item.label_bn : item.label_en}</strong><small>{catalog?.stock ?? "—"} in stock · {item.show_stock ? "stock shown" : "stock hidden"}</small></span><em>{index + 1}</em>
              </button>;
            })}
            <button className={`${selectedInlineProductKey === "__refresh__" ? "active" : ""} ${menu.product_buttons.refresh.enabled ? "" : "disabled"}`} onClick={() => openProductButtonEditor("__refresh__")}>
              <RotateCcw size={14} /><span><strong>{language === "bn" ? menu.product_buttons.refresh.label_bn : menu.product_buttons.refresh.label_en}</strong><small>Refresh product stock</small></span>
            </button>
          </div>
          {selectedInlineProductKey === "__refresh__" && <div className="inline-button-fields">
            <div className="inspector-section-title"><span>Refresh action</span><strong>Full stock button</strong></div>
            <label>English label<input value={menu.product_buttons.refresh.label_en} maxLength={64} onChange={(event) => updateProductRefresh({ label_en: event.target.value })} /></label>
            <label>বাংলা label<input value={menu.product_buttons.refresh.label_bn} maxLength={64} onChange={(event) => updateProductRefresh({ label_bn: event.target.value })} /></label>
            <label className="toggle-field"><input type="checkbox" checked={menu.product_buttons.refresh.enabled} onChange={(event) => updateProductRefresh({ enabled: event.target.checked })} /><span>Visible</span></label>
          </div>}
          {selectedProductButton && <div className="inline-button-fields">
            <div className="inspector-section-title"><span>Product action</span><strong>{selectedProductCatalog?.name || selectedProductButton.product_key}</strong></div>
            <label>English label<input value={selectedProductButton.label_en} maxLength={64} onChange={(event) => updateProductButton(selectedProductButton.product_key, { label_en: event.target.value })} /></label>
            <label>বাংলা label<input value={selectedProductButton.label_bn} maxLength={64} onChange={(event) => updateProductButton(selectedProductButton.product_key, { label_bn: event.target.value })} /></label>
            <div className="inspector-row inline-toggle-row"><label className="toggle-field"><input type="checkbox" checked={selectedProductButton.show_stock} onChange={(event) => updateProductButton(selectedProductButton.product_key, { show_stock: event.target.checked })} /><span>Show live stock</span></label><label className="toggle-field"><input type="checkbox" checked={selectedProductButton.enabled} onChange={(event) => updateProductButton(selectedProductButton.product_key, { enabled: event.target.checked })} /><span>Visible</span></label></div>
            <div className="button-tools"><button onClick={() => moveProductButton(selectedProductButton.product_key, -1)}><ArrowUp size={14} /> Up</button><button onClick={() => moveProductButton(selectedProductButton.product_key, 1)}><ArrowDown size={14} /> Down</button><button onClick={() => updateProductButton(selectedProductButton.product_key, {
              label_en: selectedProductCatalog?.name || selectedProductButton.product_key,
              label_bn: selectedProductCatalog?.name || selectedProductButton.product_key,
              enabled: true,
              show_stock: true,
            })}><RotateCcw size={14} /> Reset label</button></div>
          </div>}
        </section>}
        {activeResponse && <section className="response-inspector">
          <div className="response-heading"><div><span>Current content</span><strong>{activeResponseMeta?.label || activeResponseKey}</strong></div><span className="response-live-badge">Versioned</span></div>
          <p>What users receive after clicking this step. The bot adds an attractive heading automatically. Optional formatting: **bold**, __italic__, `code`, and ~~strike~~.</p>
          <label>English response<textarea rows={8} maxLength={3800} value={activeResponse.text_en} onChange={(event) => updateResponse({ text_en: event.target.value })} /></label>
          <label>বাংলা response<textarea rows={8} maxLength={3800} value={activeResponse.text_bn} onChange={(event) => updateResponse({ text_bn: event.target.value })} /></label>
          {activeResponseMeta && activeResponseMeta.variables.length > 0 && <div className="response-variables"><span>Keep these live values where needed</span><div>{activeResponseMeta.variables.map((variable) => <button key={variable} onClick={() => updateResponse(language === "bn"
            ? { text_bn: `${activeResponse.text_bn} {{${variable}}}` }
            : { text_en: `${activeResponse.text_en} {{${variable}}}` }
          )}>{`{{${variable}}}`}</button>)}</div></div>}
        </section>}
        {selectedButton ? <div className="button-inspector">
          <div className="inspector-section-title"><span>Button</span><strong>{selectedButton.label_en}</strong></div>
          <label>English label<input value={selectedButton.label_en} maxLength={64} onChange={(event) => updateButton({ label_en: event.target.value })} /></label>
          <label>বাংলা label<input value={selectedButton.label_bn} maxLength={64} onChange={(event) => updateButton({ label_bn: event.target.value })} /></label>
          <label>Action<select value={selectedButton.action} onChange={(event) => updateButton({ action: event.target.value as MenuButton["action"], value: "" })}>{menuActionOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
          {selectedButton.action === "screen" && <label>Target menu<select value={selectedButton.value} onChange={(event) => updateButton({ value: event.target.value })}><option value="">Choose a screen</option>{menu.screens.filter((screen) => screen.id !== selectedScreen.id).map((screen) => <option value={screen.id} key={screen.id}>{screen.title_en}</option>)}</select></label>}
          {selectedButton.action === "message" && <label>Bot response<textarea rows={7} maxLength={2000} value={selectedButton.value} onChange={(event) => updateButton({ value: event.target.value })} /></label>}
          {selectedButton.action === "url" && <label>Secure URL<input type="url" placeholder="https://" value={selectedButton.value} onChange={(event) => updateButton({ value: event.target.value })} /></label>}
          <div className="inspector-row"><label>Width<select value={selectedButton.width} onChange={(event) => updateButton({ width: event.target.value as "half" | "full" })}><option value="half">Half row</option><option value="full">Full row</option></select></label><label className="toggle-field"><input type="checkbox" checked={selectedButton.enabled} onChange={(event) => updateButton({ enabled: event.target.checked })} /><span>Visible</span></label></div>
          <div className="button-tools"><button onClick={() => moveButton(-1)}><ArrowUp size={14} /> Up</button><button onClick={() => moveButton(1)}><ArrowDown size={14} /> Down</button><button onClick={duplicateButton}><Copy size={14} /> Duplicate</button><button className="danger" onClick={deleteButton}><Trash2 size={14} /> Delete</button></div>
        </div> : <div className="studio-empty large">Choose a button from the structure panel or create a new one.</div>}

        <div className="version-panel">
          <div className="studio-panel-head"><div><span>Safety</span><h2>Version history</h2></div><RotateCcw size={16} /></div>
          <div className="version-list">{versions.map((version) => <article key={version.id} className={version.id === activeVersionId ? "active" : ""}><div><strong>Revision {version.revision}</strong><small>{versionDate(version.created_at)} · {version.note || "Published menu"}</small></div>{version.id === activeVersionId ? <span>Live</span> : <button onClick={() => void rollback(version)}>Restore</button>}</article>)}</div>
          {!versions.length && <div className="studio-empty">Publish once to create the first restorable version.</div>}
        </div>
      </aside>
    </section>
  </div>;
}
