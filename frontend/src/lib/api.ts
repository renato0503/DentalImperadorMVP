const BASE = import.meta.env.VITE_API_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY || "demo-key-2026";

export const API_BASE = BASE;

function addKey(init?: RequestInit): RequestInit {
  return { ...init, headers: { ...init?.headers, "x-api-key": API_KEY } as Record<string, string> };
}

if (BASE) {
  const orig = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
    if (typeof url === "string" && url.startsWith("/api/")) {
      return typeof input === "string"
        ? orig(BASE + url, addKey(init))
        : orig(BASE + url, addKey({ ...(input as Request).clone().headers, ...init }));
    }
    return orig(input, init);
  };
}
