export const FLEXTOTAL_CONFIG = {
  baseURL: (process.env.FLEXTOTAL_BASE_URL ?? "https://portal.dentalimperador.com.br:9090/flextotal/ws/integracao").replace(/\/$/, ""),
  auth: {
    authorization: process.env.FLEXTOTAL_AUTH_HEADER ?? "Flexmobile_API QUlPOjA0QUVDMzAyNTc4RjdGQjdDRkJFNDIwMTYxQjhDRDg4",
    cookie: process.env.FLEXTOTAL_COOKIE ?? "",
  },
  defaultPageSize: 100,
  maxPageSize: 500,
  endpoints: {
    D14_PRODUTOS: "/D14/consultar",
    D15_ESTOQUE: "/D15/consultar",
    D16_FICHA_TECNICA: "/D16/consultar",
    D17_CLIENTES: "/D17/consultar",
  },
  sync: {
    enabled: process.env.FLEXTOTAL_SYNC_ENABLED === "true",
    intervalMs: parseInt(process.env.FLEXTOTAL_SYNC_INTERVAL ?? "1800000", 10),
    retryAttempts: 3,
    retryDelayMs: 5000,
  },
};
