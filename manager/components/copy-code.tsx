"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_500);
    } catch {
      setCopied(false);
    }
  }

  return <span className="copy-code"><code>{value}</code><button type="button" onClick={copy} aria-label={`Copy transaction ID ${value}`}>{copied ? <Check size={13} /> : <Copy size={13} />}<span>{copied ? "Copied" : "Copy"}</span></button></span>;
}
