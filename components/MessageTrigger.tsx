"use client";

import Link from "next/link";
import { useMessageForm } from "./MessageWidget";

/**
 * A link to /contact that opens the message form instead, when it can.
 *
 * Deliberately still an anchor with a real href rather than a button. The
 * contact page is the thing this is actually promising, and it works with no
 * JavaScript, on a middle click, and out of a right-click menu. The form is an
 * enhancement on top of that promise, not a replacement for it — so the click
 * is only intercepted once there is a form to open.
 *
 * The modifier check keeps that honest: cmd/ctrl/shift-click and middle click
 * are asking for a new tab, and a tab that opened a dialog in the page you were
 * already on would be a broken link.
 */
export function MessageTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { openForm } = useMessageForm();

  return (
    <Link
      href="/contact"
      className={className}
      aria-haspopup="dialog"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        openForm(e.currentTarget);
      }}
    >
      {children}
    </Link>
  );
}
