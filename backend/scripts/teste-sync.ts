import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const BASE = "http://localhost:3001/api/v1";

async function call(method: string, path: string, body?: unknown): Promise<void> {
  const url = `${BASE}${path}`;
  console.log(`\n${method} ${url}...`);
  try {
    const start = Date.now();
    const res = await axios({ method, url, data: body, timeout: 120000 });
    const elapsed = Date.now() - start;
    console.log(`Status ${res.status} | ${elapsed}ms`);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(`ERRO: ${err.message}`);
      if (err.response?.data) console.log(JSON.stringify(err.response.data).substring(0, 300));
    } else {
      console.log(`ERRO: ${(err as Error).message}`);
    }
  }
}

async function main() {
  console.log("=== TESTE DE SYNC FLEXTOTAL ===");

  await call("POST", "/flextotal/sync/stock");
  await call("GET", "/flextotal/tech-sheet/43024");
  await call("POST", "/flextotal/sync/clients");

  console.log("\n=== TESTE CONCLUÍDO ===");
}

main().catch(console.error);
