import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
      <div
        className="w-full max-w-md rounded-xl border border-white/10 bg-[#101012] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="font-instrument text-xl text-white">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-white/65">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] text-white/75 transition hover:bg-white/[0.07] hover:text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              destructive
                ? "rounded-md border border-rose-400/30 bg-rose-400/15 px-3 py-1.5 text-[13px] font-medium text-rose-200 transition hover:bg-rose-400/25"
                : "rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[13px] font-medium text-black transition hover:bg-white"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
