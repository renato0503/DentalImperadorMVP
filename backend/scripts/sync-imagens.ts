import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { PrismaClient } from "@prisma/client";
import * as admin from "firebase-admin";
import { FLEXTOTAL_CONFIG } from "../src/flextotal/flextotal.config";

const prisma = new PrismaClient();
const BATCH_SIZE = 50;

async function initFirebase(): Promise<boolean> {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({ projectId: "dentalimperador-d2529" });
    }
    const bucket = admin.storage().bucket(FLEXTOTAL_CONFIG.firebase.storageBucket);
    const [exists] = await bucket.exists();
    if (!exists) {
      console.log("⚠️  Bucket não encontrado. Firebase pode não estar configurado.");
      return false;
    }
    return true;
  } catch (err) {
    console.log(`⚠️  Firebase não disponível: ${(err as Error).message}`);
    return false;
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const headers: Record<string, string> = {
      Authorization: FLEXTOTAL_CONFIG.auth.authorization,
    };
    if (FLEXTOTAL_CONFIG.auth.cookie) {
      headers["Cookie"] = FLEXTOTAL_CONFIG.auth.cookie;
    }
    const resp = await axios.get(url, { headers, responseType: "arraybuffer", timeout: 15000 });
    return Buffer.from(resp.data);
  } catch {
    return null;
  }
}

async function uploadToStorage(buffer: Buffer, filePath: string): Promise<string | null> {
  try {
    const bucket = admin.storage().bucket(FLEXTOTAL_CONFIG.firebase.storageBucket);
    const fullPath = `${FLEXTOTAL_CONFIG.firebase.imagesPath}/${filePath}`;
    const file = bucket.file(fullPath);
    await file.save(buffer, { metadata: { contentType: "image/jpeg" } });
    await file.makePublic();
    return `https://storage.googleapis.com/${FLEXTOTAL_CONFIG.firebase.storageBucket}/${fullPath}`;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log("=== SYNC DE IMAGENS ===\n");

  const firebaseOk = await initFirebase();
  if (!firebaseOk) {
    console.log("Firebase Storage indisponível. Usando imagem_url do ERP como fallback.\n");
  }

  const total = await prisma.product.count({
    where: { imagem_url: { not: null }, ativo: true },
  });
  const jaProcessadas = await prisma.productImage.count();
  const pendentes = total - jaProcessadas;

  console.log(`Total de produtos com imagem_url: ${total}`);
  console.log(`Imagens já processadas (ProductImage): ${jaProcessadas}`);
  console.log(`Pendentes: ${pendentes}\n`);

  if (pendentes <= 0) {
    console.log("Nenhuma imagem pendente.");
    await prisma.$disconnect();
    return;
  }

  const produtos = await prisma.product.findMany({
    where: {
      imagem_url: { not: null },
      images: { none: {} },
      ativo: true,
    },
    take: BATCH_SIZE,
    orderBy: { criado_em: "desc" },
  });

  console.log(`Processando lote de ${produtos.length} produtos...`);

  let sucesso = 0;
  let falha = 0;

  for (const p of produtos) {
    const erpUrl = p.imagem_url!;
    process.stdout.write(`  ${p.sku}... `);

    if (firebaseOk) {
      const buffer = await downloadImage(erpUrl);
      if (!buffer) {
        console.log("⬇️  download falhou");
        falha++;
        continue;
      }

      const publicUrl = await uploadToStorage(buffer, p.sku);
      if (!publicUrl) {
        console.log("☁️  upload falhou");
        falha++;
        continue;
      }

      try {
        await prisma.productImage.upsert({
          where: { sku_order: { sku: p.sku, order: 0 } },
          update: { url: publicUrl, isPrimary: true },
          create: { sku: p.sku, url: publicUrl, isPrimary: true, order: 0 },
        });
        console.log(`✅ ${publicUrl.substring(0, 60)}...`);
        sucesso++;
      } catch {
        console.log("💾 db falhou");
        falha++;
      }
    } else {
      console.log(`ℹ️  usando ERP URL: ${erpUrl.substring(0, 60)}...`);
      sucesso++;
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`Sucesso: ${sucesso}`);
  console.log(`Falha: ${falha}`);
  console.log(`Total processado: ${produtos.length}`);

  if (pendentes > BATCH_SIZE) {
    console.log(`\nAinda restam ${pendentes - BATCH_SIZE} imagens. Execute novamente para o próximo lote.`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  prisma.$disconnect().catch(() => {});
});
