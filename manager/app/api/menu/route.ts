import { isAuthenticated } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

function response(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

async function authorized(request: Request) {
  return sameOrigin(request) && await isAuthenticated();
}

export async function PUT(request: Request) {
  if (!(await authorized(request))) return response({ ok: false, error: "unauthorized" }, 401);
  try {
    const body = await request.json() as { menu?: unknown; expectedRevision?: number };
    const result = await managerD1<Record<string, unknown>>("saveMenuDraft", {
      menu: body.menu,
      expectedRevision: Number(body.expectedRevision || 0),
    });
    return response({ ok: true, row: result.rows[0] || null });
  } catch (error) {
    return response({ ok: false, error: error instanceof Error ? error.message : "Save failed." }, 400);
  }
}

export async function POST(request: Request) {
  if (!(await authorized(request))) return response({ ok: false, error: "unauthorized" }, 401);
  try {
    const body = await request.json() as {
      action?: string;
      menu?: unknown;
      expectedRevision?: number;
      versionId?: string;
      language?: string;
      screenId?: string;
      note?: string;
      buttonAction?: string;
      buttonValue?: string;
      callbackData?: string;
    };
    let operation = "";
    let input: Record<string, unknown> = {};
    if (body.action === "publish") {
      operation = "publishMenuDraft";
      input = { expectedRevision: Number(body.expectedRevision || 0), note: String(body.note || "") };
    } else if (body.action === "rollback") {
      operation = "rollbackMenuVersion";
      input = { versionId: String(body.versionId || "") };
    } else if (body.action === "test") {
      operation = "testMenuDraft";
      input = {
        menu: body.menu,
        language: body.language,
        screenId: body.screenId,
        action: body.buttonAction,
        value: body.buttonValue,
        callbackData: body.callbackData,
      };
    } else if (body.action === "preview") {
      operation = "previewMenuAction";
      input = {
        menu: body.menu,
        language: body.language,
        action: body.buttonAction,
        value: body.buttonValue,
        callbackData: body.callbackData,
      };
    } else {
      return response({ ok: false, error: "Unknown menu action." }, 400);
    }
    const result = await managerD1<Record<string, unknown>>(operation, input);
    return response({ ok: true, row: result.rows[0] || null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Menu action failed.";
    return response({ ok: false, error: message }, message.includes("stale_menu_draft") ? 409 : 400);
  }
}
