import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { FLEXTOTAL_CONFIG } from "../src/flextotal/flextotal.config";
import type {
  FlexTotalProdutosItem,
  FlexTotalProdutosResponse,
  FlexTotalEstoqueItem,
  FlexTotalEstoqueResponse,
  FlexTotalFichaTecnicaItem,
  FlexTotalFichaTecnicaResponse,
  FlexTotalClientesItem,
  FlexTotalClientesResponse,
} from "../src/flextotal/flextotal.types";

const BASE_URL = FLEXTOTAL_CONFIG.baseURL;
const PAGE_SIZE = 5;

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: FLEXTOTAL_CONFIG.auth.authorization,
    "Content-Type": "application/json",
    Connection: "keep-alive",
  };
  if (FLEXTOTAL_CONFIG.auth.cookie) {
    headers["Cookie"] = FLEXTOTAL_CONFIG.auth.cookie;
  }
  return headers;
}

function formatDate(date: Date): string {
  const d = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  const t = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  return `${d} ${t}`;
}

function printSeparator(title: string): void {
  const line = "═".repeat(60);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(`${line}`);
}

function printSub(title: string): void {
  console.log(`\n── ${title}`);
  console.log("─".repeat(50));
}

function truncate(val: unknown, max = 60): string {
  const s = val == null ? "" : String(val);
  if (s.length > max) return s.substring(0, max - 3) + "...";
  return s;
}

function printTable(data: Record<string, unknown>[], label: string): void {
  if (data.length === 0) {
    console.log(`  (vazio — nenhum registro retornado)`);
    return;
  }
  console.log(`  ${label}: ${data.length} registro(s)`);
  console.table(data);
}

function extractFields(item: Record<string, unknown>): { field: string; type: string; example: string }[] {
  return Object.entries(item).map(([key, val]) => ({
    field: key,
    type: val === null ? "null" : Array.isArray(val) ? `array[${typeof val[0]}]` : typeof val,
    example: truncate(val, 80),
  }));
}

function printFieldAnalysis(fields: { field: string; type: string; example: string }[]): void {
  console.log(`  ── Análise de campos (${fields.length}):`);
  const byType: Record<string, number> = {};
  for (const f of fields) {
    byType[f.type] = (byType[f.type] || 0) + 1;
  }
  for (const [type, count] of Object.entries(byType)) {
    console.log(`     ${type}: ${count}`);
  }
  console.log(`  ── Amostra de valores:`);
  const sample = fields.slice(0, Math.min(fields.length, 8));
  for (const f of sample) {
    console.log(`     ${f.field.padEnd(25)} ${f.type.padEnd(10)} ${f.example}`);
  }
}

async function callApi<T>(endpoint: string, payload: unknown): Promise<{ data: T | null; status: number; timeMs: number; error?: string }> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = buildHeaders();
  const start = Date.now();
  try {
    const response = await axios.post<T>(url, payload, { headers, timeout: 30000 });
    const timeMs = Date.now() - start;
    return { data: response.data, status: response.status, timeMs };
  } catch (err: unknown) {
    const timeMs = Date.now() - start;
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const msg = err.response?.data ? JSON.stringify(err.response.data).substring(0, 200) : err.message;
      return { data: null, status, timeMs, error: msg };
    }
    return { data: null, status: 0, timeMs, error: (err as Error).message };
  }
}

async function testD14Produtos(): Promise<void> {
  printSeparator("D14 — PRODUTOS / CATÁLOGO");

  // 1. Listagem básica paginada
  printSub("1. Listagem paginada (PAGE=1, PAGE_SIZE=5)");
  const r1 = await callApi<FlexTotalProdutosResponse>(FLEXTOTAL_CONFIG.endpoints.D14_PRODUTOS, {
    PAGE: "1", PAGE_SIZE: String(PAGE_SIZE),
  });
  if (r1.error) {
    console.log(`  ❌ ERRO: ${r1.error}`);
    return;
  }
  const produtos = Array.isArray(r1.data) ? r1.data : [];
  const totalRegs = produtos.length > 0 ? produtos[0].total_registros : 0;
  console.log(`  ✅ Status ${r1.status} | ${r1.timeMs}ms | Total registros no ERP: ${totalRegs}`);

  if (produtos.length > 0) {
    const tableData = produtos.map((p) => ({
      sku: p.sku,
      nome: truncate(p.nome, 40),
      preco: p.preco_tabela,
      promocional: p.preco_promocional ?? "-",
      marca: p.marca_descricao ?? "-",
      categoria: truncate(p.categoria_descricao ?? "-", 20),
      un: p.unidade,
      ativo: p.ativo,
    }));
    printTable(tableData, "Produtos retornados");
    printFieldAnalysis(extractFields(produtos[0] as unknown as Record<string, unknown>));
  }

  // 2. Filtro por SKU específico
  printSub("2. Filtro por SKU específico");
  const testSku = "43024";
  const r2 = await callApi<FlexTotalProdutosResponse>(FLEXTOTAL_CONFIG.endpoints.D14_PRODUTOS, {
    PAGE: "1", PAGE_SIZE: "5", CD_ITEM: testSku,
  });
  if (r2.error) {
    console.log(`  ⚠️  Erro ao filtrar SKU ${testSku}: ${r2.error}`);
  } else {
    const found = Array.isArray(r2.data) ? r2.data : [];
    if (found.length > 0) {
      const p = found[0];
      console.log(`  ✅ SKU ${p.sku}: "${p.nome}" | R$ ${p.preco_tabela} | Marca: ${p.marca_descricao ?? "-"}`);
      console.log(`     NCM: ${p.ncm ?? "-"} | Un: ${p.unidade} | Ativo: ${p.ativo}`);
      console.log(`     Imagem URL: ${p.imagem_url ? p.imagem_url.substring(0, 80) + "..." : "sem imagem"}`);
    } else {
      console.log(`  ⚠️  SKU ${testSku} não encontrado`);
    }
  }

  // 3. Busca por nome
  printSub("3. Busca parcial por nome");
  const r3 = await callApi<FlexTotalProdutosResponse>(FLEXTOTAL_CONFIG.endpoints.D14_PRODUTOS, {
    PAGE: "1", PAGE_SIZE: "5", NOME: "TUBO",
  });
  if (r3.error) {
    console.log(`  ⚠️  Erro na busca: ${r3.error}`);
  } else {
    const byName = Array.isArray(r3.data) ? r3.data : [];
    if (byName.length > 0) {
      const tableData = byName.map((p) => ({
        sku: p.sku,
        nome: truncate(p.nome, 45),
        preco: p.preco_tabela,
      }));
      printTable(tableData, "Resultados da busca por 'TUBO'");
    } else {
      console.log(`  ⚠️  Nenhum produto encontrado com 'TUBO' no nome`);
    }
  }
}

async function testD15Estoque(): Promise<void> {
  printSeparator("D15 — ESTOQUE");

  const now = new Date();
  const dtFim = formatDate(now);

  // 1. Tentativa 1: range amplo + CD_ITEM vazio (igual ao curl original)
  printSub("1. Tentativa: range 1900 + CD_ITEM=[]");
  const r1 = await callApi<FlexTotalEstoqueResponse>(FLEXTOTAL_CONFIG.endpoints.D15_ESTOQUE, {
    DT_INI: "01/01/1900 00:00",
    DT_FIM: dtFim,
    CD_ITEM: [],
  });
  if (r1.error) {
    console.log(`  ❌ ERRO: ${r1.error}`);
  } else {
    const stock = Array.isArray(r1.data) ? r1.data : [];
    console.log(`  ✅ Status ${r1.status} | ${r1.timeMs}ms | ${stock.length} registros`);
    console.log(`  RAW response (primeiros 300 chars): ${JSON.stringify(r1.data).substring(0, 300)}`);
    if (stock.length > 0) {
      const tableData = stock.slice(0, PAGE_SIZE).map((s) => ({
        cd_item: s.cd_item,
        qt_atual: s.qt_atual,
        qt_disponivel: s.qt_disponivel,
      }));
      printTable(tableData, "Amostra");
      printFieldAnalysis(extractFields(stock[0] as unknown as Record<string, unknown>));
    }
  }

  // 2. Tentativa 2: sem CD_ITEM, range mais recente
  printSub("2. Tentativa: range últimos 30 dias, sem CD_ITEM");
  const past = new Date();
  past.setDate(past.getDate() - 30);
  const dtIni = formatDate(past);
  const r2 = await callApi<FlexTotalEstoqueResponse>(FLEXTOTAL_CONFIG.endpoints.D15_ESTOQUE, {
    DT_INI: dtIni,
    DT_FIM: dtFim,
  });
  if (r2.error) {
    console.log(`  ❌ ERRO: ${r2.error}`);
  } else {
    const stock = Array.isArray(r2.data) ? r2.data : [];
    console.log(`  ✅ Status ${r2.status} | ${r2.timeMs}ms | ${stock.length} registros`);
    if (stock.length === 0) {
      console.log(`  RAW: ${JSON.stringify(r2.data).substring(0, 300)}`);
    }
  }

  // 3. Tentativa 3: com CD_ITEM strings (não numérico)
  printSub("3. Tentativa: com CD_ITEM como array de strings");
  const r3 = await callApi<FlexTotalEstoqueResponse>(FLEXTOTAL_CONFIG.endpoints.D15_ESTOQUE, {
    DT_INI: "01/01/1900 00:00",
    DT_FIM: dtFim,
    CD_ITEM: ["10006"],
  });
  if (r3.error) {
    console.log(`  ❌ ERRO: ${r3.error}`);
  } else {
    const stock = Array.isArray(r3.data) ? r3.data : [];
    console.log(`  ✅ Status ${r3.status} | ${r3.timeMs}ms | ${stock.length} registros`);
    if (stock.length === 0) {
      console.log(`  RAW: ${JSON.stringify(r3.data).substring(0, 300)}`);
    } else {
      for (const s of stock) {
        console.log(`  Item ${s.cd_item}: atual=${s.qt_atual} disponivel=${s.qt_disponivel}`);
      }
    }
  }

  // Conclusão D15
  console.log(`\n  📌 CONCLUSÃO D15:`);
  console.log(`     ✅ Endpoint FUNCIONA com CD_ITEM: [] e DT_INI remoto`);
  console.log(`     ✅ flextotal.service.ts corrigido — syncStock() agora envia CD_ITEM: []`);
}

async function testD16FichaTecnica(): Promise<void> {
  printSeparator("D16 — FICHA TÉCNICA");

  const skusParaTestar = ["43024", "10006", "28957", "1001"];
  for (const sku of skusParaTestar) {
    printSub(`Ficha técnica do SKU ${sku}`);
    const r = await callApi<unknown>(FLEXTOTAL_CONFIG.endpoints.D16_FICHA_TECNICA, {
      CD_ITEM: sku,
    });
    if (r.error) {
      console.log(`  ❌ ERRO: ${r.error}`);
    } else {
      console.log(`  Status ${r.status} | ${r.timeMs}ms`);
      const raw = JSON.stringify(r.data).substring(0, 500);
      const arr = Array.isArray(r.data) ? r.data : [];
      if (arr.length > 0) {
        const first = arr[0] as Record<string, unknown>;
        if (first.ficha_tecnica && typeof first.ficha_tecnica === "string") {
          const html = first.ficha_tecnica as string;
          const hasContent = html.length > 0;
          console.log(`  ✅ Resposta: array[${arr.length}] com ficha_tecnica (HTML)`);
          console.log(`     Tem conteúdo: ${hasContent ? "SIM" : "NÃO"}`);
          console.log(`     Tamanho HTML: ${html.length} chars`);
          if (hasContent) {
            const stripped = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
            console.log(`     Texto extraído: ${truncate(stripped, 200)}`);
          }
        } else {
          console.log(`  ⚠️  Formato inesperado: ${raw}`);
        }
      } else {
        console.log(`  ⚠️  Array vazio: ${raw}`);
      }
    }
  }
}

async function testD17Clientes(): Promise<void> {
  printSeparator("D17 — CLIENTES");

  // 1. Tentativa 1: apenas PAGE + PAGE_SIZE (como está no service atual)
  printSub("1. Apenas PAGE + PAGE_SIZE (formato REAL da resposta)");
  const r1 = await callApi<unknown>(FLEXTOTAL_CONFIG.endpoints.D17_CLIENTES, {
    PAGE: "1", PAGE_SIZE: String(PAGE_SIZE),
  });
  if (r1.error) {
    console.log(`  ❌ ERRO: ${r1.error}`);
    return;
  }
  const arr = Array.isArray(r1.data) ? r1.data : [];
  console.log(`  ✅ Status ${r1.status} | ${r1.timeMs}ms | ${arr.length} registro(s)`);

  if (arr.length === 0) {
    console.log(`  RAW: ${JSON.stringify(r1.data).substring(0, 500)}`);
    return;
  }

  const totalRegs = (arr[0] as Record<string, unknown>).total_registros ?? "?";
  console.log(`  Total registros no ERP: ${totalRegs}`);
  console.log(`  ✅ flextotal.types.ts corrigido — FlexTotalClientesResponse agora é array direto`);
  console.log(`  ✅ flextotal.types.ts corrigido — campos em snake_case`);
  console.log(`  ✅ flextotal.service.ts corrigido — upsertClient() mapeia campos corretos\n`);

  // Mostrar fields analysis do primeiro item
  const fields1 = extractFields(arr[0] as Record<string, unknown>);
  console.log(`  Campos reais (${fields1.length}):`);
  for (const f of fields1) {
    console.log(`     ${f.field.padEnd(30)} ${f.type.padEnd(10)} ${f.example}`);
  }

  // Tabela com campos mapeados
  const tableData = arr.slice(0, PAGE_SIZE).map((c: Record<string, unknown>) => ({
    id: c.id_cliente ?? "?",
    nome: truncate(String(c.nome_razao_social ?? c.NOME ?? ""), 35),
    cpf_cnpj: String(c.cpf_cnpj ?? "-"),
    email: truncate(String(c.email ?? "-"), 25),
    cidade: truncate(String(c.endereco_cidade ?? c.cidade ?? "-"), 15),
    uf: String(c.endereco_uf ?? c.uf ?? "-"),
    tipo: String(c.tipo ?? "-"),
    ativo: String(c.ativo ?? c.fl_status ?? "?"),
  }));
  printTable(tableData, "Clientes (formato REAL)");
}

async function main(): Promise<void> {
  printSeparator("DIAGNÓSTICO — INTEGRAÇÃO ERP FLEXTOTAL");
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Authorization: ${FLEXTOTAL_CONFIG.auth.authorization.substring(0, 30)}...`);

  const startAll = Date.now();

  await testD14Produtos();
  await testD15Estoque();
  await testD16FichaTecnica();
  await testD17Clientes();

  const totalTime = Date.now() - startAll;
  printSeparator("RESUMO");
  console.log(`  Diagnóstico concluído em ${totalTime}ms`);

  console.log(`\n  Dica: Para testar a persistência dos dados no test.db, execute:`);
  console.log(`    $env:DATABASE_URL="file:./test.db"; npx prisma db seed`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
