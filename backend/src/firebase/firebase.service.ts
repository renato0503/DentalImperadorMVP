import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import * as admin from "firebase-admin";
import type { Auth, UserRecord, DecodedIdToken } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private _auth: Auth | null = null;
  private _firestore: Firestore | null = null;
  private _initialized = false;

  get initialized(): boolean {
    return this._initialized;
  }

  get auth(): Auth | null {
    return this._auth;
  }

  get firestore(): Firestore | null {
    return this._firestore;
  }

  onModuleInit() {
    this.logger.log("Iniciando Firebase Admin...");

    try {
      const saPath = join(process.cwd(), "firebase-service-account.json");

      if (existsSync(saPath)) {
        const serviceAccount = JSON.parse(readFileSync(saPath, "utf-8"));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.logger.log("Firebase Admin inicializado via service-account.json");
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        this.logger.log("Firebase Admin inicializado via GOOGLE_APPLICATION_CREDENTIALS");
      } else {
        try {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: "dentalimperador-d2529",
          });
          this.logger.log("Firebase Admin inicializado via Application Default Credentials");
        } catch {
          admin.initializeApp({ projectId: "dentalimperador-d2529" });
          this.logger.warn(
            "Firebase Admin: sem credenciais (modo emulador)."
          );
        }
      }

      this._auth = admin.auth();
      this._firestore = admin.firestore();
      this._initialized = true;
      this.logger.log("Firebase Admin inicializado com sucesso");
    } catch (error) {
      this.logger.error("Falha ao inicializar Firebase Admin", error);
    }
  }

  async verifyToken(token: string): Promise<DecodedIdToken | null> {
    if (!this._auth || !this._initialized) return null;
    try {
      return await this._auth.verifyIdToken(token);
    } catch {
      return null;
    }
  }

  async getUserByUid(uid: string): Promise<UserRecord | null> {
    if (!this._auth || !this._initialized) return null;
    try {
      return await this._auth.getUser(uid);
    } catch {
      return null;
    }
  }
}
