import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ADMINS = [
  {
    uid: "NcTtOuP9o6gPXDzHvsCHlG42AIm1",
    email: "matheusvictorfernandesromeu4@gmail.com",
    nome: "Matheus Victor",
    papel: "admin",
  },
  {
    uid: "uUIBiyMZyxNRN7irqO3aRdXqGqi1",
    email: "gestor.renatorosa@gmail.com",
    nome: "Renato Rosa",
    papel: "admin",
  },
];

const PROJECT_ID = "dentalimperador-d2529";

function getApp() {
  const saPath = join(__dirname, "service-account.json");
  if (existsSync(saPath)) {
    const serviceAccount = JSON.parse(readFileSync(saPath, "utf-8"));
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || PROJECT_ID,
    });
  }
  return initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
  });
}

const app = getApp();
const db = getFirestore(app);

async function seed() {
  for (const user of ADMINS) {
    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();

    if (snap.exists) {
      console.log(`⏭  ${user.email} — já existe, pulando`);
      continue;
    }

    await ref.set({
      uid: user.uid,
      email: user.email,
      nome: user.nome,
      papel: user.papel,
      criado_em: new Date(),
      ativo: true,
    });

    console.log(`✅ ${user.email} — documento criado como ${user.papel}`);
  }

  console.log("\n🎉 Seed concluído!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
