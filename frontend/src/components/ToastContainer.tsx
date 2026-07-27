import { useState, useEffect } from "react";
import { onToast } from "../lib/toast";

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    const unsub = onToast((msg) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    });
    return () => { unsub(); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: "#E31E24", color: "#fff", padding: "12px 20px",
          borderRadius: 8, fontSize: 14, maxWidth: 360, wordBreak: "break-word",
          boxShadow: "0 4px 12px rgba(0,0,0,.2)",
        }}>{t.msg}</div>
      ))}
    </div>
  );
}
