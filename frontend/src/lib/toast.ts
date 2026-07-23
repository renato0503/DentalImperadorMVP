const listeners: Set<(msg: string) => void> = new Set();

export function onToast(cb: (msg: string) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function showToast(message: string) {
  listeners.forEach((cb) => cb(message));
}
