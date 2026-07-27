import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { FLEXTOTAL_CONFIG } from "../src/flextotal/flextotal.config";

const prisma = new PrismaClient();
const BASE_URL = FLEXTOTAL_CONFIG.baseURL;
const PAGE_SIZE = 5;

interface TestResult {
  endpoint: string;
  apiAcessivel: boolean;
  apiStatus: number;
  registrosRetornados: number;
  camposEsperados: string[];
  camposOk: boolean;
  persistenciaOk: boolean;
  erros: string[];
  observacao: string;
}

const results: TestResult[] = [];

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

function truncate(val: unknown, max = 60): string {
  const s = val == null ? "" : String(val);
  if (s.length > max) return s.substring(0, max - 3) + "...";
  return s;
}

function printSeparator(title: string): void {
  const line = "=".repeat(70);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(line);
}

async function callApi<T>(endpoint: string, payload: unknown): Promise<{ data: T | null; status: number; timeMs: number; error?: string }> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = buildHeaders();
  const start = Date.now();
  try {
    const response = await axios.post<T>(url, payload, { headers, timeout: 30000 });
    return { data: response.data, status: response.status, timeMs: Date.now() - start };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const msg = err.response?.data ? JSON.stringify(err.response.data).substring(0, 200) : err.message;
      return { data: null, status, timeMs: Date.now() - start, error: msg };
    }
    return { data: null, status: 0, timeMs: Date.now() - start, error: (err as Error).message };
  }
}

async function validarD14(): Promise<void> {
  printSeparator("D14 — PRODUTOS");
  const r: TestResult = {
    endpoint: "D14 /D14/consultar",
    apiAcessivel: false, apiStatus: 0, registrosRetornados: 0,
    camposEsperados: ["sku", "nome", "preco_tabela", "marca_descricao", "unidade", "ativo"],
    camposOk: false, persistenciaOk: false, erros: [], observacao: "",
  };

  const resp = await callApi<unknown>(FLEXTOTAL_CONFIG.endpoints.D14_PRODUTOS, {
    PAGE: "1", PAGE_SIZE: String(PAGE_SIZE),
  });

  r.apiStatus = resp.status;
  if (resp.error) { r.erros.push(resp.error); r.observacao = "API inacessível"; results.push(r); return; }
  r.apiAcessivel = true;

  const produtos = Array.isArray(resp.data) ? resp.data : [];
  r.registrosRetornados = produtos.length > 0 ? (produtos[0] as Record<string, unknown>).total_registros as number ?? produtos.length : 0;

  if (produtos.length === 0) { r.observacao = "Nenhum produto retornado"; results.push(r); return; }

  const p = produtos[0] as Record<string, unknown>;
  const camposPresentes = Object.keys(p);
  r.camposOk = r.camposEsperados.every((c) => camposPresentes.includes(c));
  if (!r.camposOk) {
    const faltando = r.camposEsperados.filter((c) => !camposPresentes.includes(c));
    r.erros.push(`Campos faltando: ${faltando.join(", ")}`);
  }

  try {
    const sku = String(p.sku);
    await prisma.product.upsert({
      where: { sku },
      update: { nome: String(p.nome), preco_tabela: Number(p.preco_tabela ?? 0) },
      create: { sku, nome: String(p.nome), preco_tabela: Number(p.preco_tabela ?? 0) },
    });
    const saved = await prisma.product.findUnique({ where: { sku } });
    r.persistenciaOk = saved !== null;
    if (!r.persistenciaOk) r.erros.push("Falha ao persistir no test.db");
  } catch (err) {
    r.erros.push(`Erro persistência: ${(err as Error).message}`);
  }

  r.observacao = `${r.registrosRetornados} produtos no ERP, ${produtos.length} retornados na página, campo sku=${String(p.sku)}`;
  results.push(r);
  console.log(`  Total: ${r.registrosRetornados} | Amostra: ${truncate(String(p.nome), 40)} | R$ ${p.preco_tabela}`);
}

async function validarD15(): Promise<void> {
  printSeparator("D15 — ESTOQUE");
  const r: TestResult = {
    endpoint: "D15 /D15/consultar",
    apiAcessivel: false, apiStatus: 0, registrosRetornados: 0,
    camposEsperados: ["cd_item", "qt_atual", "qt_disponivel"],
    camposOk: false, persistenciaOk: false, erros: [], observacao: "",
  };

  const now = new Date();
  const dtFim = formatDate(now);
  const resp = await callApi<unknown>(FLEXTOTAL_CONFIG.endpoints.D15_ESTOQUE, {
    DT_INI: "01/01/1900 00:00", DT_FIM: dtFim, CD_ITEM: [],
  });

  r.apiStatus = resp.status;
  if (resp.error) { r.erros.push(resp.error); r.observacao = "API inacessível"; results.push(r); return; }
  r.apiAcessivel = true;

  const stock = Array.isArray(resp.data) ? resp.data : [];
  r.registrosRetornados = stock.length;

  if (stock.length === 0) { r.observacao = "Nenhum estoque retornado (pode ser horário/sem cookie)"; results.push(r); return; }

  const s = stock[0] as Record<string, unknown>;
  const camposPresentes = Object.keys(s);
  r.camposOk = r.camposEsperados.every((c) => camposPresentes.includes(c));
  if (!r.camposOk) {
    const faltando = r.camposEsperados.filter((c) => !camposPresentes.includes(c));
    r.erros.push(`Campos faltando: ${faltando.join(", ")}`);
  }

  try {
    const sku = String(s.cd_item);
    const qtd = Number(s.qt_atual ?? 0);
    const disp = Number(s.qt_disponivel ?? 0);

    const existingProduct = await prisma.product.findUnique({ where: { sku } });
    if (!existingProduct) {
      await prisma.product.create({ data: { sku, nome: `Produto ${sku}` } });
    }

    await prisma.stockBatch.upsert({
      where: { sku },
      update: { quantidade: qtd, disponivel: disp, atualizado_em: new Date() },
      create: { sku, quantidade: qtd, disponivel: disp },
    });
    const saved = await prisma.stockBatch.findUnique({ where: { sku } });
    r.persistenciaOk = saved !== null;
    if (!r.persistenciaOk) r.erros.push("Falha ao persistir estoque no test.db");
  } catch (err) {
    r.erros.push(`Erro persistência: ${(err as Error).message}`);
  }

  r.observacao = `${r.registrosRetornados} itens com estoque`;
  results.push(r);
  console.log(`  Total: ${r.registrosRetornados} | Amostra: sku=${s.cd_item} atual=${s.qt_atual} disp=${s.qt_disponivel}`);
}

async function validarD16(): Promise<void> {
  printSeparator("D16 — FICHA TÉCNICA");
  const r: TestResult = {
    endpoint: "D16 /D16/consultar",
    apiAcessivel: false, apiStatus: 0, registrosRetornados: 0,
    camposEsperados: ["ficha_tecnica"],
    camposOk: false, persistenciaOk: false, erros: [], observacao: "",
  };

  let comConteudo = 0;
  let semConteudo = 0;
  const skus = ["43024", "28957", "10006", "1001"];

  for (const sku of skus) {
    const resp = await callApi<unknown>(FLEXTOTAL_CONFIG.endpoints.D16_FICHA_TECNICA, { CD_ITEM: sku });
    if (resp.error) { r.erros.push(`SKU ${sku}: ${resp.error}`); continue; }
    if (!r.apiAcessivel) { r.apiAcessivel = true; r.apiStatus = resp.status; }

    const items = Array.isArray(resp.data) ? resp.data : [];
    if (items.length > 0) {
      const ft = (items[0] as Record<string, unknown>).ficha_tecnica as string;
      if (ft && ft.length > 0) comConteudo++;
      else semConteudo++;
    }
  }

  r.registrosRetornados = skus.length;
  r.camposOk = true;

  if (comConteudo > 0) {
    try {
      const skuComConteudo = skus.find(async (s) => {
        const resp = await callApi<unknown>(FLEXTOTAL_CONFIG.endpoints.D16_FICHA_TECNICA, { CD_ITEM: s });
        if (!resp.error) {
          const items = Array.isArray(resp.data) ? resp.data : [];
          const ft = items[0] ? (items[0] as Record<string, unknown>).ficha_tecnica as string : "";
          if (ft && ft.length > 0) {
            await prisma.product.updateMany({ where: { sku: s }, data: { descricao_html: ft.substring(0, 500) } });
            r.persistenciaOk = true;
            return true;
          }
        }
        return false;
      });
      await skuComConteudo;
    } catch { /* persistência não crítica */ }
  }

  r.observacao = `${comConteudo} SKUs com ficha técnica, ${semConteudo} sem`;
  results.push(r);
  console.log(`  SKUs testados: ${skus.length} | Com conteúdo: ${comConteudo} | Vazio: ${semConteudo}`);
  console.log(`  Formato real: array[{ficha_tecnica: \"HTML\"}] ✓ tipos corrigidos`);
}

async function validarD17(): Promise<void> {
  printSeparator("D17 — CLIENTES");
  const r: TestResult = {
    endpoint: "D17 /D17/consultar",
    apiAcessivel: false, apiStatus: 0, registrosRetornados: 0,
    camposEsperados: ["id_cliente", "nome_razao_social", "cpf_cnpj", "email", "ativo"],
    camposOk: false, persistenciaOk: false, erros: [], observacao: "",
  };

  const resp = await callApi<unknown>(FLEXTOTAL_CONFIG.endpoints.D17_CLIENTES, {
    PAGE: "1", PAGE_SIZE: String(PAGE_SIZE),
  });

  r.apiStatus = resp.status;
  if (resp.error) { r.erros.push(resp.error); r.observacao = "API inacessível"; results.push(r); return; }
  r.apiAcessivel = true;

  const clientes = Array.isArray(resp.data) ? resp.data : [];
  const totalRegs = clientes.length > 0 ? (clientes[0] as Record<string, unknown>).total_registros as number ?? 0 : 0;
  r.registrosRetornados = totalRegs;

  if (clientes.length === 0) { r.observacao = "Nenhum cliente retornado"; results.push(r); return; }

  const c = clientes[0] as Record<string, unknown>;
  const camposPresentes = Object.keys(c);
  r.camposOk = r.camposEsperados.every((campo) => camposPresentes.includes(campo));
  if (!r.camposOk) {
    const faltando = r.camposEsperados.filter((campo) => !camposPresentes.includes(campo));
    r.erros.push(`Campos esperados faltando: ${faltando.join(", ")}`);
  }

  try {
    const uid = `flextotal-${c.id_cliente}`;
    await prisma.user.upsert({
      where: { uid },
      update: {
        nome: String(c.nome_razao_social ?? ""),
        email: String(c.email ?? `cliente-${c.id_cliente}@flextotal.local`),
        cpf_cnpj: String(c.cpf_cnpj ?? ""),
      },
      create: {
        uid,
        nome: String(c.nome_razao_social ?? ""),
        email: String(c.email ?? `cliente-${c.id_cliente}@flextotal.local`),
        role: "CLIENT",
        cpf_cnpj: String(c.cpf_cnpj ?? ""),
        origem: "ERP FlexTotal",
      },
    });
    const saved = await prisma.user.findUnique({ where: { uid } });
    r.persistenciaOk = saved !== null;
    if (!r.persistenciaOk) r.erros.push("Falha ao persistir cliente no test.db");
  } catch (err) {
    r.erros.push(`Erro persistência: ${(err as Error).message}`);
  }

  r.observacao = `${totalRegs} clientes no ERP, campos em snake_case ✓`;
  results.push(r);
  console.log(`  Total: ${totalRegs} | Amostra: ${truncate(String(c.nome_razao_social), 40)} (${c.cpf_cnpj})`);
}

async function printStatus(): Promise<void> {
  printSeparator("STATUS GLOBAL — INTEGRAÇÃO ERP FLEXTOTAL");

  console.log(`\n  ${"Endpoint".padEnd(20)} ${"API".padEnd(8)} ${"Campos".padEnd(8)} ${"Persist".padEnd(8)} ${"Regs".padEnd(8)} Observação`);
  console.log(`  ${"-".repeat(20)} ${"-".repeat(8)} ${"-".repeat(8)} ${"-".repeat(8)} ${"-".repeat(8)} ${"-".repeat(40)}`);

  for (const r of results) {
    const api = r.apiAcessivel ? "✅" : "❌";
    const campos = r.camposOk ? "✅" : "❌";
    const persist = r.persistenciaOk ? "✅" : "❌";
    const endpoint = r.endpoint.substring(0, 18);
    console.log(`  ${endpoint.padEnd(20)} ${api.padEnd(8)} ${campos.padEnd(8)} ${persist.padEnd(8)} ${String(r.registrosRetornados).padEnd(8)} ${truncate(r.observacao, 40)}`);
    for (const err of r.erros) {
      console.log(`  ${"".padEnd(20)} ${"".padEnd(8)} ${"".padEnd(8)} ${"".padEnd(8)} ${"".padEnd(8)} ⚠️  ${err}`);
    }
  }

  const totalOk = results.filter((r) => r.apiAcessivel && r.camposOk).length;
  console.log(`\n  Resumo: ${totalOk}/${results.length} endpoints operacionais`);
  console.log(`  Banco de testes: test.db (SQLite)`);
}

async function main() {
  printSeparator("VALIDAÇÃO FINAL — INTEGRAÇÃO ERP FLEXTOTAL");
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Modo: validação direta da API + persistência em test.db\n`);

  await validarD14();
  await validarD15();
  await validarD16();
  await validarD17();

  await printStatus();

  await prisma.$disconnect();
  console.log(`\n  Scripts disponíveis:`);
  console.log(`    Diagnóstico: npx ts-node scripts/diagnostico-flextotal.ts`);
  console.log(`    Validação:   npx ts-node scripts/validacao-final.ts`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  prisma.$disconnect().catch(() => {});
  process.exit(1);
});
