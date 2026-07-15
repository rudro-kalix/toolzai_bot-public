export const menuActionOptions = [
  { value: "products", label: "Show products" },
  { value: "proxy", label: "Show proxy notice" },
  { value: "balance", label: "Show balance" },
  { value: "history", label: "Show order history" },
  { value: "refer", label: "Show referral details" },
  { value: "support", label: "Show support" },
  { value: "message", label: "Send a message" },
  { value: "url", label: "Open a secure link" },
  { value: "screen", label: "Open another menu" },
  { value: "main_menu", label: "Return to main menu" },
] as const;

export type MenuAction = (typeof menuActionOptions)[number]["value"];
export type MenuButton = {
  id: string;
  label_en: string;
  label_bn: string;
  action: MenuAction;
  value: string;
  width: "half" | "full";
  enabled: boolean;
};

export type MenuScreen = {
  id: string;
  title_en: string;
  title_bn: string;
  buttons: MenuButton[];
};

export type MenuResponse = {
  text_en: string;
  text_bn: string;
};

export type MenuResponseCatalogItem = {
  key: string;
  label: string;
  variables: string[];
};

export type ProductButton = {
  product_key: string;
  label_en: string;
  label_bn: string;
  enabled: boolean;
  show_stock: boolean;
};

export type ProductButtons = {
  show_new_products: boolean;
  items: ProductButton[];
  refresh: {
    label_en: string;
    label_bn: string;
    enabled: boolean;
  };
};

export type ProductCatalogItem = {
  product_key: string;
  name: string;
  stock: string;
};

export type MenuDocument = {
  schemaVersion: 3;
  screens: MenuScreen[];
  responses: Record<string, MenuResponse>;
  product_buttons: ProductButtons;
};

export type MenuVersion = {
  id: string;
  revision: number;
  note: string;
  created_at: string;
};

export type MenuStudioState = {
  menu: MenuDocument;
  draftRevision: number;
  draftUpdatedAt: string | null;
  activeVersionId: string | null;
  publishedRevision: number;
  publishedAt: string | null;
  versions: MenuVersion[];
  responseCatalog: MenuResponseCatalogItem[];
  productCatalog: ProductCatalogItem[];
};

export type MenuStudioRow = {
  draft_json: string;
  draft_revision: number;
  draft_updated_at: string | null;
  active_version_id: string | null;
  published_revision: number;
  published_at: string | null;
  versions_json: string;
  response_catalog_json: string;
  product_catalog_json: string;
};

export function parseMenuStudioRow(row: MenuStudioRow): MenuStudioState {
  return {
    menu: JSON.parse(row.draft_json) as MenuDocument,
    draftRevision: Number(row.draft_revision || 0),
    draftUpdatedAt: row.draft_updated_at,
    activeVersionId: row.active_version_id,
    publishedRevision: Number(row.published_revision || 0),
    publishedAt: row.published_at,
    versions: JSON.parse(row.versions_json || "[]") as MenuVersion[],
    responseCatalog: JSON.parse(row.response_catalog_json || "[]") as MenuResponseCatalogItem[],
    productCatalog: JSON.parse(row.product_catalog_json || "[]") as ProductCatalogItem[],
  };
}

export type PreviewButton = {
  label: string;
  kind: "callback" | "reply" | "url" | "disabled";
  value: string;
};

export type MenuActionPreview = {
  template_key: string | null;
  text: string;
  variables: Record<string, string | number>;
  keyboard: PreviewButton[][];
  keyboard_type: "inline" | "reply" | "none";
  screen_id: string | null;
  warning: string | null;
};
